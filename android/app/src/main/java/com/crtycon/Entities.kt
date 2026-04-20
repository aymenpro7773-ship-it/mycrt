package com.crtycon
import androidx.room.*

@Entity(tableName = "cards")
data class Card(@PrimaryKey(autoGenerate = true) val id: Long = 0, val category: Int, val code: String, var isUsed: Boolean = false, var usedAt: Long? = null, var usedBy: String? = null)

@Entity(tableName = "logs")
data class OperationLog(@PrimaryKey(autoGenerate = true) val id: Long = 0, val timestamp: Long, val amount: Int, val customerNumber: String, val cardCode: String?, val status: String)

@Entity(tableName = "settings")
data class Setting(@PrimaryKey val key: String, var value: String)

@Entity(tableName = "templates")
data class Template(@PrimaryKey val category: Int, var text: String)

@Entity(tableName = "subscribers")
data class Subscriber(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val phoneNumber: String,
    val category: Int,
    val expiryDate: Long,
    var status: String = "ACTIVE"
)
