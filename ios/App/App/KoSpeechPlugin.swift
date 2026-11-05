import Foundation
import AVFoundation
import Speech
import UIKit
import Capacitor

/// 韩语朗读（AVSpeechSynthesizer）和韩语语音识别（SFSpeechRecognizer），接口与安卓 KoSpeechPlugin 一致。
@objc(KoSpeechPlugin)
public final class KoSpeechPlugin: CAPPlugin, CAPBridgedPlugin, AVSpeechSynthesizerDelegate {
    public let identifier = "KoSpeechPlugin"
    public let jsName = "KoSpeech"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "speak", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openSettings", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "listen", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopListening", returnType: CAPPluginReturnPromise)
    ]

    private let synth = AVSpeechSynthesizer()
    private var speaking: [ObjectIdentifier: CAPPluginCall] = [:]

    private var recognizer: SFSpeechRecognizer?
    private var request: SFSpeechAudioBufferRecognitionRequest?
    private var task: SFSpeechRecognitionTask?
    private let engine = AVAudioEngine()
    private var listening: CAPPluginCall?
    private var lastText = ""
    private var silence: Timer?
    private var limit: Timer?

    public override func load() { synth.delegate = self }

    // MARK: 朗读

    @objc func speak(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let text = (call.getString("text") ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
            if text.isEmpty || text.count > 400 { call.reject("这段太长了，没法朗读。"); return }
            guard let voice = AVSpeechSynthesisVoice(language: "ko-KR") else {
                call.reject("手机还没有韩语语音。请在「设置 → 辅助功能 → 朗读内容 → 声音」里下载韩语。"); return
            }
            self.cancelSpeaking()
            try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
            try? AVAudioSession.sharedInstance().setActive(true)
            let u = AVSpeechUtterance(string: text)
            u.voice = voice
            // 安卓 setSpeechRate 以 1.0 为正常，iOS 正常语速是 AVSpeechUtteranceDefaultSpeechRate
            let rate = Float(call.getDouble("rate") ?? 0.9) * AVSpeechUtteranceDefaultSpeechRate
            u.rate = min(max(rate, AVSpeechUtteranceMinimumSpeechRate), AVSpeechUtteranceMaximumSpeechRate)
            self.speaking[ObjectIdentifier(u)] = call
            self.synth.speak(u)
        }
    }

    private func cancelSpeaking() {
        let calls = speaking.values
        speaking.removeAll()
        if synth.isSpeaking { synth.stopSpeaking(at: .immediate) }
        for c in calls { c.resolve(["cancelled": true]) }
    }

    public func speechSynthesizer(_ s: AVSpeechSynthesizer, didFinish u: AVSpeechUtterance) {
        speaking.removeValue(forKey: ObjectIdentifier(u))?.resolve()
    }

    public func speechSynthesizer(_ s: AVSpeechSynthesizer, didCancel u: AVSpeechUtterance) {
        speaking.removeValue(forKey: ObjectIdentifier(u))?.resolve(["cancelled": true])
    }

    @objc func stop(_ call: CAPPluginCall) {
        DispatchQueue.main.async { self.cancelSpeaking(); call.resolve() }
    }

    /// iOS 不允许直接跳到朗读设置，只能打开系统设置里本 App 的页面
    @objc func openSettings(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let url = URL(string: UIApplication.openSettingsURLString) else { call.reject("没能打开系统设置。"); return }
            UIApplication.shared.open(url) { ok in ok ? call.resolve() : call.reject("没能打开系统设置。") }
        }
    }

    // MARK: 语音识别

    @objc func listen(_ call: CAPPluginCall) {
        SFSpeechRecognizer.requestAuthorization { status in
            guard status == .authorized else {
                DispatchQueue.main.async { call.reject("没有拿到语音识别权限，可以直接打字。") }; return
            }
            AVAudioSession.sharedInstance().requestRecordPermission { granted in
                DispatchQueue.main.async {
                    if granted { self.startListening(call) } else { call.reject("没有拿到麦克风权限，可以直接打字。") }
                }
            }
        }
    }

    private func startListening(_ call: CAPPluginCall) {
        if let old = listening { listening = nil; old.resolve(["cancelled": true]) }
        teardown()
        let lang = call.getString("lang") ?? "ko-KR"
        guard let r = SFSpeechRecognizer(locale: Locale(identifier: lang)), r.isAvailable else {
            call.reject("这台手机现在用不了语音识别，可以直接打字。"); return
        }
        cancelSpeaking()
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(.record, mode: .measurement, options: [.duckOthers])
            try session.setActive(true, options: .notifyOthersOnDeactivation)
        } catch { call.reject("麦克风现在被占用了，可以直接打字。"); return }

        let req = SFSpeechAudioBufferRecognitionRequest()
        req.shouldReportPartialResults = true
        let input = engine.inputNode
        let format = input.outputFormat(forBus: 0)
        guard format.sampleRate > 0 else { restoreSession(); call.reject("没有找到可用的麦克风，可以直接打字。"); return }
        input.installTap(onBus: 0, bufferSize: 1024, format: format) { buffer, _ in req.append(buffer) }
        engine.prepare()
        do { try engine.start() } catch {
            input.removeTap(onBus: 0); restoreSession(); call.reject("麦克风没能打开，可以直接打字。"); return
        }

        recognizer = r; request = req; listening = call; lastText = ""
        task = r.recognitionTask(with: req) { [weak self] result, error in
            DispatchQueue.main.async {
                guard let self = self, self.listening === call else { return }
                if let result = result {
                    self.lastText = result.bestTranscription.formattedString
                    self.notifyListeners("partial", data: ["text": self.lastText])
                    if result.isFinal { self.finish(); return }
                    if self.engine.isRunning { self.armSilenceTimer() }
                }
                if error != nil { self.finish() }
            }
        }
        // 安卓的识别器说完会自己停；这里用静音计时模拟：2 秒没有新内容就结束，最长 30 秒
        armSilenceTimer(after: 6)
        limit = Timer.scheduledTimer(withTimeInterval: 30, repeats: false) { [weak self] _ in self?.wrapUp() }
    }

    private func armSilenceTimer(after seconds: TimeInterval = 2) {
        silence?.invalidate()
        silence = Timer.scheduledTimer(withTimeInterval: seconds, repeats: false) { [weak self] _ in
            guard let self = self else { return }
            if self.lastText.isEmpty { self.finish() } else { self.wrapUp() }
        }
    }

    /// 停止收音，等系统给最终结果；1.5 秒内没给就用已识别的内容收尾
    private func wrapUp() {
        guard listening != nil else { return }
        request?.endAudio()
        silence?.invalidate()
        silence = Timer.scheduledTimer(withTimeInterval: 1.5, repeats: false) { [weak self] _ in self?.finish() }
    }

    private func finish() {
        guard let call = listening else { return }
        listening = nil
        let text = lastText
        teardown()
        call.resolve(["text": text])
    }

    private func teardown() {
        silence?.invalidate(); silence = nil
        limit?.invalidate(); limit = nil
        if engine.isRunning { engine.stop() }
        engine.inputNode.removeTap(onBus: 0)
        request?.endAudio(); request = nil
        task?.cancel(); task = nil
        recognizer = nil
        restoreSession()
    }

    private func restoreSession() {
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
    }

    @objc func stopListening(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.wrapUp()
            call.resolve()
        }
    }

    deinit {
        silence?.invalidate(); limit?.invalidate()
        if engine.isRunning { engine.stop() }
        task?.cancel()
    }
}
