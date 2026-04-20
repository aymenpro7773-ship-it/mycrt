package com.crtycon

import android.webkit.JavascriptInterface
import org.json.JSONArray
import org.json.JSONObject
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

class WebAppInterface(private val activity: MainActivity) {
    private val db = CrtyconApp.database
    private val scope = CoroutineScope(Dispatchers.Main)

    @JavascriptInterface
    fun getStats(): String = runBlocking(Dispatchers.IO) {
        val dao = db.krootDao()
        val stats = JSONObject()
        val allLogs = dao.getAllLogs()
        val successLogs = allLogs.filter { it.status == "SUCCESS" }
        stats.put("total_success", successLogs.size)
        stats.put("total_revenue", successLogs.sumOf { it.amount })
        
        val inventory = JSONObject()
        listOf(100, 200, 300, 500, 1000, 2000).forEach { cat ->
            inventory.put(cat.toString(), dao.getInventoryCount(cat))
        }
        stats.put("inventory", inventory)
        stats.toString()
    }

    @JavascriptInterface
    fun addCards(category: Int, codesJson: String) {
        val codes = JSONArray(codesJson)
        scope.launch(Dispatchers.IO) {
            for (i in 0 until codes.length()) {
                db.krootDao().insertCard(Card(category = category, code = codes.getString(i)))
            }
        }
    }

    @JavascriptInterface
    fun getCards(): String = runBlocking(Dispatchers.IO) {
        val cards = db.krootDao().getAllCards()
        val arr = JSONArray()
        cards.forEach { c ->
            val obj = JSONObject()
            obj.put("id", c.id)
            obj.put("category", c.category)
            obj.put("isUsed", c.isUsed)
            // Mask code for UI safety if needed, but normally admin sees it
            obj.put("code", c.code)
            arr.put(obj)
        }
        arr.toString()
    }

    @JavascriptInterface
    fun getLogs(): String = runBlocking(Dispatchers.IO) {
        val logs = db.krootDao().getAllLogs()
        val arr = JSONArray()
        logs.forEach { log ->
            val obj = JSONObject()
            obj.put("id", log.id)
            obj.put("timestamp", log.timestamp)
            obj.put("amount", log.amount)
            obj.put("number", log.customerNumber)
            obj.put("code", log.cardCode)
            obj.put("status", log.status)
            arr.put(obj)
        }
        arr.toString()
    }

    @JavascriptInterface
    fun getSubscribers(): String = runBlocking(Dispatchers.IO) {
        val subs = db.krootDao().getAllSubscribers()
        val arr = JSONArray()
        subs.forEach { s ->
            val obj = JSONObject()
            obj.put("id", s.id)
            obj.put("name", s.name)
            obj.put("phone", s.phoneNumber)
            obj.put("category", s.category)
            obj.put("expiryDate", s.expiryDate)
            obj.put("status", s.status)
            arr.put(obj)
        }
        arr.toString()
    }

    @JavascriptInterface
    fun addSubscriber(name: String, phone: String, category: Int, expiryDate: Long) {
        scope.launch(Dispatchers.IO) {
            db.krootDao().insertSubscriber(Subscriber(name = name, phoneNumber = phone, category = category, expiryDate = expiryDate))
        }
    }

    @JavascriptInterface
    fun deleteSubscriber(id: Long) {
        scope.launch(Dispatchers.IO) {
            val dao = db.krootDao()
            val sub = dao.getAllSubscribers().find { it.id == id }
            if (sub != null) dao.deleteSubscriber(sub)
        }
    }

    @JavascriptInterface
    fun getSettings(): String = runBlocking(Dispatchers.IO) {
        val settings = db.krootDao().getAllSettings()
        val obj = JSONObject()
        settings.forEach { s -> obj.put(s.key, s.value) }
        obj.toString()
    }

    @JavascriptInterface
    fun saveSetting(key: String, value: String) {
        scope.launch(Dispatchers.IO) {
            db.krootDao().saveSetting(Setting(key = key, value = value))
        }
    }

    @JavascriptInterface
    fun getTemplates(): String = runBlocking(Dispatchers.IO) {
        val templates = db.krootDao().getAllTemplates()
        val arr = JSONArray()
        templates.forEach { t ->
            val obj = JSONObject()
            obj.put("category", t.category)
            obj.put("text", t.text)
            arr.put(obj)
        }
        arr.toString()
    }

    @JavascriptInterface
    fun saveTemplate(category: Int, text: String) {
        scope.launch(Dispatchers.IO) {
            db.krootDao().saveTemplate(Template(category = category, text = text))
        }
    }

    @JavascriptInterface
    fun simulateSms(number: String, body: String) {
        scope.launch(Dispatchers.Main) {
            val intent = Intent(activity, SmsReceiver::class.java).apply {
                action = "android.provider.Telephony.SMS_RECEIVED"
                // This is a simplified simulation for the bridge
                // In a real android env, we'd need to mock PDU data
                // But for our internal testing, I'll modify SmsReceiver to handle a custom action
            }
            activity.sendBroadcast(intent)
            // Or more directly:
            val intentService = Intent(activity, KrootService::class.java).apply {
                action = "PROCESS_SMS"
                putExtra("number", number)
                // Extract amount manually for simulation
                val regex = Regex("\\b(100|200|300|500|1000|2000)\\b")
                val amount = regex.find(body)?.value?.toInt() ?: 0
                putExtra("amount", amount)
            }
            activity.startService(intentService)
        }
    }

    @JavascriptInterface
    fun clearLogs() {
        scope.launch(Dispatchers.IO) {
            db.krootDao().clearLogs()
        }
    }
}
