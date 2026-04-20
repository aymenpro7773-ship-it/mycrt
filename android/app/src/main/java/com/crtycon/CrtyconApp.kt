package com.crtycon

import android.app.Application
import androidx.room.Room

class CrtyconApp : Application() {
    companion object {
        lateinit var database: AppDatabase
            private set
    }

    override fun onCreate() {
        super.onCreate()
        database = Room.databaseBuilder(
            applicationContext,
            AppDatabase::class.java,
            "crtycon-db"
        )
        .fallbackToDestructiveMigration()
        .allowMainThreadQueries()
        .build()
    }
}
