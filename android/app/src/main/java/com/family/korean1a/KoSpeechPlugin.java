package com.family.korean1a;

import android.Manifest;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/** 韩语朗读（系统 TTS）和韩语语音识别（系统 SpeechRecognizer）。 */
@CapacitorPlugin(name = "KoSpeech", permissions = { @Permission(alias = "microphone", strings = { Manifest.permission.RECORD_AUDIO }) })
public class KoSpeechPlugin extends Plugin {
    private TextToSpeech tts;
    private boolean ready = false, initialized = false;
    private final List<PluginCall> waiting = new ArrayList<>();
    private final ConcurrentHashMap<String, PluginCall> pending = new ConcurrentHashMap<>();
    private SpeechRecognizer recognizer;
    private PluginCall listening;

    @Override public void load() {
        getActivity().runOnUiThread(() -> tts = new TextToSpeech(getContext(), status -> {
            initialized = true;
            if (status == TextToSpeech.SUCCESS) {
                ready = tts.setLanguage(Locale.KOREAN) >= 0;
                tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String id) {}
                    @Override public void onDone(String id) { PluginCall c = pending.remove(id); if (c != null) c.resolve(); }
                    @Override public void onStop(String id, boolean interrupted) { resolveCancelled(pending.remove(id)); }
                    @Override public void onError(String id) { PluginCall c = pending.remove(id); if (c != null) c.reject("韩语语音没能播放。"); }
                });
            }
            for (PluginCall c : new ArrayList<>(waiting)) speakReady(c);
            waiting.clear();
        }));
    }

    private static void resolveCancelled(PluginCall c) { if (c == null) return; JSObject r = new JSObject(); r.put("cancelled", true); c.resolve(r); }

    @PluginMethod public void speak(PluginCall call) { getActivity().runOnUiThread(() -> { if (!initialized) waiting.add(call); else speakReady(call); }); }

    private void speakReady(PluginCall call) {
        String text = call.getString("text", "").trim();
        if (!ready) { call.reject("手机还没有韩语语音。请在设置里打开「听不到韩语？」安装韩语语音包。"); return; }
        if (text.isEmpty() || text.length() > 400) { call.reject("这段太长了，没法朗读。"); return; }
        for (PluginCall c : pending.values()) resolveCancelled(c);
        pending.clear();
        tts.stop();
        Double rate = call.getDouble("rate", 0.9);
        tts.setSpeechRate(rate.floatValue());
        String id = UUID.randomUUID().toString();
        pending.put(id, call);
        if (tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, id) == TextToSpeech.ERROR) { pending.remove(id); call.reject("韩语语音没能播放。"); }
    }

    @PluginMethod public void stop(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (tts != null) tts.stop();
            for (PluginCall c : pending.values()) resolveCancelled(c);
            pending.clear();
            call.resolve();
        });
    }

    @PluginMethod public void openSettings(PluginCall call) {
        try { Intent i = new Intent("com.android.settings.TTS_SETTINGS"); i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); getContext().startActivity(i); call.resolve(); }
        catch (ActivityNotFoundException e) { call.reject("没能打开系统语音设置。"); }
    }

    @PluginMethod public void listen(PluginCall call) {
        if (getPermissionState("microphone") != PermissionState.GRANTED) { requestPermissionForAlias("microphone", call, "micResult"); return; }
        startListening(call);
    }

    @PermissionCallback private void micResult(PluginCall call) {
        if (getPermissionState("microphone") == PermissionState.GRANTED) startListening(call);
        else call.reject("没有拿到麦克风权限，可以直接打字。");
    }

    private void startListening(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (!SpeechRecognizer.isRecognitionAvailable(getContext())) { call.reject("这台手机没有可用的语音识别，可以直接打字。"); return; }
            if (listening != null) resolveCancelled(listening);
            if (recognizer != null) recognizer.destroy();
            listening = call;
            recognizer = SpeechRecognizer.createSpeechRecognizer(getContext());
            recognizer.setRecognitionListener(new RecognitionListener() {
                @Override public void onReadyForSpeech(Bundle b) {}
                @Override public void onBeginningOfSpeech() {}
                @Override public void onRmsChanged(float v) {}
                @Override public void onBufferReceived(byte[] b) {}
                @Override public void onEndOfSpeech() {}
                @Override public void onEvent(int t, Bundle b) {}
                @Override public void onPartialResults(Bundle b) {
                    String t = first(b);
                    if (t != null) { JSObject e = new JSObject(); e.put("text", t); notifyListeners("partial", e); }
                }
                @Override public void onResults(Bundle b) {
                    PluginCall c = listening; listening = null;
                    if (c == null) return;
                    JSObject r = new JSObject(); r.put("text", first(b) == null ? "" : first(b)); c.resolve(r);
                }
                @Override public void onError(int error) {
                    PluginCall c = listening; listening = null;
                    if (c == null) return;
                    if (error == SpeechRecognizer.ERROR_NO_MATCH || error == SpeechRecognizer.ERROR_SPEECH_TIMEOUT) { JSObject r = new JSObject(); r.put("text", ""); c.resolve(r); }
                    else if (error == SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS) c.reject("没有拿到麦克风权限，可以直接打字。");
                    else if (error == SpeechRecognizer.ERROR_NETWORK || error == SpeechRecognizer.ERROR_NETWORK_TIMEOUT || error == SpeechRecognizer.ERROR_SERVER) c.reject("语音识别要联网，检查网络后再试。");
                    else c.reject("语音识别没成功，可以直接打字。");
                }
            });
            Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, call.getString("lang", "ko-KR"));
            i.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
            recognizer.startListening(i);
        });
    }

    private static String first(Bundle b) {
        ArrayList<String> list = b == null ? null : b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        return list == null || list.isEmpty() ? null : list.get(0);
    }

    @PluginMethod public void stopListening(PluginCall call) {
        getActivity().runOnUiThread(() -> { if (recognizer != null) recognizer.stopListening(); call.resolve(); });
    }

    @Override protected void handleOnDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); }
        if (recognizer != null) recognizer.destroy();
        for (PluginCall c : pending.values()) resolveCancelled(c);
        pending.clear();
        super.handleOnDestroy();
    }
}
