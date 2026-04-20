package com.crtycon
import androidx.room.*

@Dao
interface KrootDao {
    @Query("SELECT * FROM cards WHERE category = :category AND isUsed = 0 LIMIT 1")
    suspend fun getAvailableCard(category: Int): Card?
    @Update
    suspend fun updateCard(card: Card)
    @Insert
    suspend fun insertCard(card: Card)
    @Query("SELECT COUNT(*) FROM cards WHERE category = :category AND isUsed = 0")
    suspend fun getInventoryCount(category: Int): Int
    @Insert
    suspend fun insertLog(log: OperationLog)
    @Query("SELECT * FROM logs ORDER BY timestamp DESC")
    suspend fun getAllLogs(): List<OperationLog>
    @Query("SELECT * FROM settings WHERE `key` = :key")
    suspend fun getSetting(key: String): Setting?
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveSetting(setting: Setting)
    @Query("SELECT * FROM templates")
    suspend fun getAllTemplates(): List<Template>
    @Query("SELECT * FROM templates WHERE category = :category")
    suspend fun getTemplate(category: Int): Template?
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveTemplate(template: Template)

    @Insert
    suspend fun insertSubscriber(subscriber: Subscriber)
    @Query("SELECT * FROM subscribers")
    suspend fun getAllSubscribers(): List<Subscriber>
    @Delete
    suspend fun deleteSubscriber(subscriber: Subscriber)
    
    @Query("SELECT * FROM settings")
    suspend fun getAllSettings(): List<Setting>
    @Query("DELETE FROM logs")
    suspend fun clearLogs()
    
    @Query("SELECT * FROM cards ORDER BY id DESC LIMIT 100")
    suspend fun getAllCards(): List<Card>
}

@Database(entities = [Card::class, OperationLog::class, Setting::class, Template::class, Subscriber::class], version = 2)
abstract class AppDatabase : RoomDatabase() {
    abstract fun krootDao(): KrootDao
}
