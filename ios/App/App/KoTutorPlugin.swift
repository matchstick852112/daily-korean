import Foundation
import Capacitor

private final class NoRedirects: NSObject, URLSessionTaskDelegate {
    func urlSession(_ session: URLSession, task: URLSessionTask, willPerformHTTPRedirection response: HTTPURLResponse, newRequest request: URLRequest, completionHandler: @escaping (URLRequest?) -> Void) {
        completionHandler(nil)
    }
}

/// 只有个人版在 PersonalResources 里放了 korean-private.json；凭据只在原生层使用，不传给网页。
@objc(KoTutorPlugin)
public final class KoTutorPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "KoTutorPlugin"
    public let jsName = "KoTutor"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "request", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "cancel", returnType: CAPPluginReturnPromise)
    ]
    private final class Job {
        let call: CAPPluginCall
        var task: URLSessionDataTask?
        init(_ call: CAPPluginCall) { self.call = call }
    }
    private let lock = NSLock()
    private var jobs: [String: Job] = [:]
    private lazy var session: URLSession = {
        let config = URLSessionConfiguration.ephemeral
        config.timeoutIntervalForRequest = 150
        config.timeoutIntervalForResource = 180
        return URLSession(configuration: config, delegate: NoRedirects(), delegateQueue: nil)
    }()
    private func config() -> (key: String, model: String, label: String)? {
        guard let url = Bundle.main.url(forResource: "korean-private", withExtension: "json", subdirectory: "PersonalResources"),
              let data = try? Data(contentsOf: url), data.count <= 16384,
              let value = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let key = value["key"] as? String, !key.isEmpty,
              let model = value["model"] as? String, let label = value["display_name"] as? String else { return nil }
        return (key, model, label)
    }
    @objc func status(_ call: CAPPluginCall) {
        guard let c = config() else { call.resolve(["configured": false, "personal": false]); return }
        call.resolve(["configured": true, "personal": true, "model": c.model, "model_label": c.label])
    }
    @objc func request(_ call: CAPPluginCall) {
        guard let id = call.getString("requestId"), var body = call.getObject("body") else {
            call.reject("还有请求正在处理，请稍后再试。"); return
        }
        guard let c = config() else { call.reject("这个版本未开通 AI 伙伴。", "NOT_CONFIGURED"); return }
        body["model"] = c.model
        guard let bytes = try? JSONSerialization.data(withJSONObject: body),
              let endpoint = URL(string: "https://api.deepseek.com/chat/completions") else {
            call.reject("对话太长了，请重新开一次聊天。", "TOO_LARGE"); return
        }
        if bytes.count > 12_000_000 { call.reject("对话太长了，请重新开一次聊天。", "TOO_LARGE"); return }
        let job = Job(call)
        lock.lock()
        if jobs.count >= 2 { lock.unlock(); call.reject("还有请求正在处理，请稍后再试。"); return }
        if jobs[id] != nil { lock.unlock(); call.reject("这次请求已经在处理。"); return }
        jobs[id] = job
        lock.unlock()
        var req = URLRequest(url: endpoint)
        req.httpMethod = "POST"
        req.httpBody = bytes
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("Bearer " + c.key, forHTTPHeaderField: "Authorization")
        let task = session.dataTask(with: req) { [weak self] data, response, error in
            guard let self = self else { return }
            self.lock.lock(); let current = self.jobs.removeValue(forKey: id); self.lock.unlock()
            guard current != nil else { return }
            if let error = error as? URLError, error.code == .cancelled { call.reject("已停止这次请求。", "ABORTED"); return }
            guard error == nil, let http = response as? HTTPURLResponse else {
                call.reject("未能连接DeepSeek。请检查手机网络后重试。", "NETWORK_ERROR"); return
            }
            guard http.statusCode == 200 else {
                let code = http.statusCode
                let message = code == 401 ? "内置连接凭据需要更新，请重新打包个人版。" : code == 402 ? "DeepSeek账户余额不足，请补充后重试。" : code == 429 ? "DeepSeek暂时繁忙，请稍后重试。" : "DeepSeek暂未完成请求，请稍后重试。"
                call.reject(message, "HTTP_ERROR"); return
            }
            guard let data = data, data.count <= 2_000_000,
                  let value = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                call.reject("未能连接DeepSeek。请检查手机网络后重试。", "NETWORK_ERROR"); return
            }
            call.resolve(value)
        }
        lock.lock(); let active = jobs[id] != nil; job.task = task; lock.unlock()
        if active { task.resume() } else { task.cancel() }
    }
    @objc func cancel(_ call: CAPPluginCall) {
        let id = call.getString("requestId") ?? ""
        lock.lock(); let job = jobs.removeValue(forKey: id); lock.unlock()
        job?.task?.cancel()
        job?.call.reject("已停止这次请求。", "ABORTED")
        call.resolve()
    }
    deinit {
        for job in jobs.values { job.task?.cancel() }
    }
}
