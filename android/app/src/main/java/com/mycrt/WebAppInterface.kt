package com.mycrt

import android.webkit.JavascriptInterface
import org.json.JSONArray
import org.json.JSONObject
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

class WebAppInterface(private val activity: MainActivity) {
    private val db = MycrtApp.database
    private val scope = CoroutineScope(Dispatchers.Main)

    @JavascriptInterface
    fun getStats(): String = runBlocking(Dispatchers.IO) {
        val dao = db.mycrtDao()
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
                db.mycrtDao().insertCard(Card(category = category, code = codes.getString(i)))
            }
        }
    }

    @JavascriptInterface
    fun getCards(): String = runBlocking(Dispatchers.IO) {
        val cards = db.mycrtDao().getAllCards()
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
        val logs = db.mycrtDao().getAllLogs()
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
        val subs = db.mycrtDao().getAllSubscribers()
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
            db.mycrtDao().insertSubscriber(Subscriber(name = name, phoneNumber = phone, category = category, expiryDate = expiryDate))
        }
    }

    @JavascriptInterface
    fun deleteSubscriber(id: Long) {
        scope.launch(Dispatchers.IO) {
            val dao = db.mycrtDao()
            val sub = dao.getAllSubscribers().find { it.id == id }
            if (sub != null) dao.deleteSubscriber(sub)
        }
    }

    @JavascriptInterface
    fun getSettings(): String = runBlocking(Dispatchers.IO) {
        val settings = db.mycrtDao().getAllSettings()
        val obj = JSONObject()
        settings.forEach { s -> obj.put(s.key, s.value) }
        obj.toString()
    }

    @JavascriptInterface
    fun saveSetting(key: String, value: String) {
        scope.launch(Dispatchers.IO) {
            db.mycrtDao().saveSetting(Setting(key = key, value = value))
        }
    }

    @JavascriptInterface
    fun getTemplates(): String = runBlocking(Dispatchers.IO) {
        val templates = db.mycrtDao().getAllTemplates()
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
            db.mycrtDao().saveTemplate(Template(category = category, text = text))
        }
    }

    @JavascriptInterface
    fun simulateSms(number: String, body: String) {
        scope.launch(Dispatchers.Main) {
            val intent = Intent(activity, SmsReceiver::class.java).apply {
                action = "android.provider.Telephony.SMS_RECEIVED"
            }
            activity.sendBroadcast(intent)
            val intentService = Intent(activity, MycrtService::class.java).apply {
                action = "PROCESS_SMS"
                putExtra("number", number)
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
            db.mycrtDao().clearLogs()
        }
    }
}
