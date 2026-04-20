package com.crtycon

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import androidx.core.content.ContextCompat

class SmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            for (msg in messages) {
                val sender = msg.displayOriginatingAddress ?: ""
                val body = msg.displayMessageBody ?: ""
                
                if (sender.contains("jaib", true) || sender.contains("967", true)) {
                    val amount = extractAmount(body)
                    val customer = extractCustomer(body) ?: sender
                    
                    if (amount > 0) {
                        val serviceIntent = Intent(context, KrootService::class.java).apply {
                            action = "PROCESS_SMS"
                            putExtra("number", customer)
                            putExtra("amount", amount)
                        }
                        ContextCompat.startForegroundService(context, serviceIntent)
                    }
                }
            }
        }
    }

    private fun extractAmount(body: String): Int {
        val regex = Regex("\\b(100|200|300|500|1000|2000)\\b")
        return regex.find(body)?.value?.toInt() ?: 0
    }

    private fun extractCustomer(body: String): String? {
        val regex = Regex("\\b\\d{9}\\b")
        return regex.find(body)?.value
    }
}
