package com.crtycon

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import android.telephony.SmsManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class KrootService : Service() {
    private val db by lazy { CrtyconApp.database }
    private val scope = CoroutineScope(Dispatchers.IO)
    private val CHANNEL_ID = "crtycon_service_channel"

    override fun onCreate() {
        super.onCreate()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(CHANNEL_ID, "crtycon System", NotificationManager.IMPORTANCE_LOW)
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("crtycon Automation")
            .setContentText("System active...")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .build()
        startForeground(1, notification)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == "PROCESS_SMS") {
            val number = intent.getStringExtra("number") ?: ""
            val amount = intent.getIntExtra("amount", 0)
            if (number.isNotEmpty() && amount > 0) {
                scope.launch { processRequest(number, amount) }
            }
        }
        return START_STICKY
    }

    private suspend fun processRequest(number: String, amount: Int) {
        val dao = db.krootDao()
        val card = dao.getAvailableCard(amount)
        if (card != null) {
            card.isUsed = true
            card.usedAt = System.currentTimeMillis()
            card.usedBy = number
            dao.updateCard(card)
            
            val template = dao.getTemplate(amount)?.text ?: "كود الكرت الخاص بك هو:"
            val message = "$template\n${card.code}"
            
            try {
                SmsManager.getDefault().sendTextMessage(number, null, message, null, null)
                dao.insertLog(OperationLog(timestamp = System.currentTimeMillis(), amount = amount, customerNumber = number, cardCode = card.code, status = "SUCCESS"))
            } catch (e: Exception) {
                dao.insertLog(OperationLog(timestamp = System.currentTimeMillis(), amount = amount, customerNumber = number, cardCode = card.code, status = "SMS_ERROR"))
            }
        } else {
            dao.insertLog(OperationLog(timestamp = System.currentTimeMillis(), amount = amount, customerNumber = number, cardCode = null, status = "OUT_OF_STOCK"))
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
