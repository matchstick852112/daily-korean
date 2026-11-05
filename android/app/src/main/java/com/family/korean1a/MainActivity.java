package com.family.korean1a;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle savedInstanceState) {
        // 与探索队一致：先设无标题主题再开 EdgeToEdge，系统栏内边距交给 SystemBars
        setTheme(R.style.AppTheme_NoActionBar);
        EdgeToEdge.enable(this);
        registerPlugin(KoSpeechPlugin.class);
        registerPlugin(KoTutorPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
