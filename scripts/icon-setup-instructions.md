# App Icon Setup - Complete Instructions

## 🎯 Quick Setup (Recommended)

### Method 1: IconKitchen (Easiest - 2 minutes)

1. **Get Base Icon:**
   - Visit: https://www.flaticon.com/search?word=smart%20parking
   - Download 1024x1024 PNG parking icon
   - Save as `app-icon.png` in project root

2. **Generate All Sizes:**
   - Go to: **https://icon.kitchen/**
   - Upload `app-icon.png`
   - Select: Android + iOS + Round icons
   - Download ZIP

3. **Copy Icons:**

   **Android:**
   ```
   Copy from ZIP/android/res/ to:
   android/app/src/main/res/
   ```

   **iOS:**
   ```
   Open Xcode → Drag icons to AppIcon set
   ```

4. **Rebuild:**
   ```bash
   npx react-native run-android
   ```

---

## 📱 Required Icon Sizes

### Android
- `mipmap-mdpi/ic_launcher.png` - 48x48
- `mipmap-hdpi/ic_launcher.png` - 72x72
- `mipmap-xhdpi/ic_launcher.png` - 96x96
- `mipmap-xxhdpi/ic_launcher.png` - 144x144
- `mipmap-xxxhdpi/ic_launcher.png` - 192x192
- Plus round versions (`ic_launcher_round.png`)

### iOS
- 40x40, 60x60, 58x58, 87x87, 80x80, 120x120, 180x180, 1024x1024

---

**Best Tool:** https://icon.kitchen/ - generates all sizes automatically!

