# MYCRT - Automatic SMS Networking Card Distributor

This is a completely fresh, professional implementation of the MYCRT system.

## Project Structure
- **/android**: Native Android application (Kotlin/WebView bridge).
- **/src**: Professional administrative dashboard (React + Tailwind + Lucide).
- **server.ts**: Full-stack API server (Node.js + Express + Vite).

## How to Deploy to GitHub
1. Run the following command in the terminal:
   ```bash
   git add .
   git commit -m "Initialize fresh mycrt project"
   git push origin head --force
   ```
2. Go to **Actions** tab on GitHub to see the APK building.
3. Once the build is green ✅, download the APK from the artifacts.

## System Features
- **Automatic SMS Detection**: Monitors specific numbers (like 'jaib') for payment SMS.
- **Queue Management**: Background service (MycrtService) handles the logic without freezing the UI.
- **Card Inventory**: Room Database stores and manages network cards by category (100, 200, etc).
- **Control Panel**: Modern React dashboard to manage logs, stock, and settings.
