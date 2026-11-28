package com.jawk.popeyefighter;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import android.os.Build;
import android.view.WindowManager;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);   // oynarken ekran kararmasın
        tamEkran();
        // Android geri tuşu: oyun içindeki geriTus() (mobil.js) karar verir; 'cik' dönerse uygulama kapanır
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (getBridge() == null || getBridge().getWebView() == null) { finish(); return; }
                getBridge().getWebView().evaluateJavascript("(function(){try{return window.geriTus?geriTus():'cik'}catch(e){return ''}})()", v -> {
                    if (v != null && v.contains("cik")) finish();
                });
            }
        });
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) tamEkran();
    }

    // Durum çubuğu ve gezinme çubuğunu gizle (oyun tam ekran)
    private void tamEkran() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {   // çentikli telefonlarda yanlarda siyah boşluk kalmasın: oyun çentiğin altına da uzanır
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        c.hide(WindowInsetsCompat.Type.systemBars());
        c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    }
}
