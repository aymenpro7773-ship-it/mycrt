package com.crtycon

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import java.util.concurrent.Executor

class MainActivity : AppCompatActivity() {
    private var webView: WebView? = null
    private val TAG = "MainActivity"
    private lateinit var executor: Executor
    private lateinit var biometricPrompt: BiometricPrompt
    private lateinit var promptInfo: BiometricPrompt.PromptInfo

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        try {
            executor = ContextCompat.getMainExecutor(this)
            setupBiometric()
            
            webView = WebView(this)
            setContentView(webView!!)
            configureWebView()
            checkPermissions()
            
            // Check if biometric is available and enabled
            if (isBiometricAvailable()) {
                biometricPrompt.authenticate(promptInfo)
            } else {
                // If no biometric hardware, enter directly
                loadMainApp()
            }
            
            // Start background service
            val serviceIntent = Intent(this, KrootService::class.java)
            try {
                ContextCompat.startForegroundService(this, serviceIntent)
            } catch (e: Exception) {
                Log.e(TAG, "Service start error", e)
            }
            
        } catch (e: Exception) {
            Log.e(TAG, "Init error", e)
            Toast.makeText(this, "فشل في فتح البرنامج: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    private fun setupBiometric() {
        biometricPrompt = BiometricPrompt(this, executor, object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                loadMainApp()
            }
            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                super.onAuthenticationError(errorCode, errString)
                Toast.makeText(applicationContext, "خطأ في البصمة: $errString", Toast.LENGTH_SHORT).show()
                if (errorCode != BiometricPrompt.ERROR_USER_CANCELED) {
                   finish()
                }
            }
            override fun onAuthenticationFailed() {
                super.onAuthenticationFailed()
                Toast.makeText(applicationContext, "فشلت المصادقة", Toast.LENGTH_SHORT).show()
            }
        })

        promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("تسجيل الدخول بالبصمة")
            .setSubtitle("استخدم بصمة الإصبع للدخول إلى كرتيكون")
            .setNegativeButtonText("إلغاء")
            .build()
    }

    private fun isBiometricAvailable(): Boolean {
        val biometricManager = BiometricManager.from(this)
        return when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)) {
            BiometricManager.BIOMETRIC_SUCCESS -> true
            else -> false
        }
    }

    private fun loadMainApp() {
        webView?.loadUrl("file:///android_asset/index.html")
    }

    private fun configureWebView() {
        webView?.apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = true
            webViewClient = WebViewClient()
            addJavascriptInterface(WebAppInterface(this@MainActivity), "Android")
        }
    }

    private fun checkPermissions() {
        val permissions = mutableListOf(Manifest.permission.RECEIVE_SMS, Manifest.permission.READ_SMS, Manifest.permission.SEND_SMS)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }
        val needed = permissions.filter { ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED }
        if (needed.isNotEmpty()) ActivityCompat.requestPermissions(this, needed.toTypedArray(), 101)
    }

    override fun onBackPressed() {
        if (webView?.canGoBack() == true) webView?.goBack() else super.onBackPressed()
    }
}
