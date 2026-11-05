package com.family.korean1a;

import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONObject;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

/** The personal build alone supplies this asset; no credential is sent to JS. */
@CapacitorPlugin(name = "KoTutor")
public class KoTutorPlugin extends Plugin {
    private final ExecutorService pool = Executors.newFixedThreadPool(2);
    private final ConcurrentHashMap<String, Job> jobs = new ConcurrentHashMap<>();
    private static class Job { PluginCall call; final AtomicBoolean finished = new AtomicBoolean(); volatile boolean cancelled; volatile HttpURLConnection connection; volatile Future<?> future; }
    private static void fail(Job job, String message, String code) { if (job.finished.compareAndSet(false, true)) job.call.reject(message, code); }
    private JSONObject config() throws Exception {
        try (InputStream in = getContext().getAssets().open("korean-private.json")) {
            return new JSONObject(read(in, 16384));
        }
    }
    private static String read(InputStream in, int limit) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream(); byte[] buffer = new byte[16384]; int n;
        while ((n = in.read(buffer)) != -1) { if (out.size() + n > limit) throw new IOException("Response too large"); out.write(buffer, 0, n); }
        return out.toString(StandardCharsets.UTF_8.name());
    }
    @PluginMethod public void status(PluginCall call) {
        JSObject result = new JSObject();
        try { JSONObject c = config(); result.put("configured", !c.optString("key").isEmpty()); result.put("model", c.getString("model")); result.put("model_label", c.getString("display_name")); result.put("personal", true); }
        catch (Exception e) { result.put("configured", false); result.put("personal", false); }
        call.resolve(result);
    }
    @PluginMethod public void request(PluginCall call) {
        String id = call.getString("requestId"); JSObject body = call.getObject("body");
        if (id == null || body == null || jobs.size() >= 2) { call.reject("还有请求正在处理，请稍后再试。"); return; }
        Job job = new Job(); job.call = call; if (jobs.putIfAbsent(id, job) != null) { call.reject("这次请求已经在处理。"); return; }
        job.future = pool.submit(() -> {
            try {
                if (job.cancelled) throw new InterruptedException();
                JSONObject c = config(); JSONObject data = new JSONObject(body.toString());
                data.put("model", c.getString("model"));
                byte[] bytes = data.toString().getBytes(StandardCharsets.UTF_8);
                if (bytes.length > 12000000) { fail(job, "对话太长了，请重新开一次聊天。", "TOO_LARGE"); return; }
                HttpURLConnection conn = (HttpURLConnection) new URL("https://api.deepseek.com/chat/completions").openConnection();
                job.connection = conn; conn.setInstanceFollowRedirects(false); conn.setConnectTimeout(30000); conn.setReadTimeout(150000);
                conn.setRequestMethod("POST"); conn.setDoOutput(true); conn.setFixedLengthStreamingMode(bytes.length);
                conn.setRequestProperty("Content-Type", "application/json"); conn.setRequestProperty("Authorization", "Bearer " + c.getString("key"));
                if (job.cancelled) throw new InterruptedException();
                try (OutputStream out = conn.getOutputStream()) { out.write(bytes); }
                int code = conn.getResponseCode();
                if (job.cancelled) throw new InterruptedException();
                if (code != 200) {
                    fail(job, code == 401 ? "内置连接凭据需要更新，请重新打包个人版。" : code == 402 ? "DeepSeek账户余额不足，请补充后重试。" : code == 429 ? "DeepSeek暂时繁忙，请稍后重试。" : "DeepSeek暂未完成请求，请稍后重试。", "HTTP_ERROR"); return;
                }
                String response; try (InputStream in = conn.getInputStream()) { response = read(in, 2000000); }
                if (job.cancelled) throw new InterruptedException();
                if (job.finished.compareAndSet(false, true)) call.resolve(new JSObject(response));
            } catch (Exception e) {
                if (job.cancelled || e instanceof InterruptedException) fail(job, "已停止这次请求。", "ABORTED");
                else fail(job, "未能连接DeepSeek。请检查手机网络后重试。", "NETWORK_ERROR");
            } finally { if (job.connection != null) job.connection.disconnect(); jobs.remove(id); }
        });
    }
    @PluginMethod public void cancel(PluginCall call) {
        Job job = jobs.remove(call.getString("requestId", ""));
        if (job != null) { job.cancelled = true; fail(job, "已停止这次请求。", "ABORTED"); if (job.connection != null) job.connection.disconnect(); if (job.future != null) job.future.cancel(true); }
        call.resolve();
    }
    @Override protected void handleOnDestroy() {
        for (Job j : jobs.values()) { j.cancelled = true; if (j.connection != null) j.connection.disconnect(); if (j.future != null) j.future.cancel(true); }
        pool.shutdownNow(); super.handleOnDestroy();
    }
}
