package com.mycrt

import android.app.Application
import androidx.room.Room

class MycrtApp : Application() {
    companion object {
        lateinit var database: MycrtDatabase
            private set
    }

    override fun onCreate() {
        super.onCreate()
        database = Room.databaseBuilder(
            applicationContext,
            MycrtDatabase::class.java,
            "mycrt-db"
        )
        .fallbackToDestructiveMigration()
        .allowMainThreadQueries()
        .build()
    }
}
