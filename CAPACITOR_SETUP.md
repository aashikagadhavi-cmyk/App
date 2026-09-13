# Capacitor Setup Guide - APK Build Instructions

## 📱 आपका React App अब Android APK में बदल सकता है!

### Prerequisites:
- Node.js और npm installed हो
- Java Development Kit (JDK 11+) installed हो
- Android Studio installed हो (या सिर्फ Android SDK)
- ANDROID_HOME environment variable set हो

---

## 🚀 APK बनाने के Steps:

### Step 1: Dependencies Install करें
```bash
npm install
```

### Step 2: App Build करें
```bash
npm run build
```

### Step 3: Android Platform Add करें (पहली बार)
```bash
npx cap add android
```

### Step 4: Capacitor Sync करें
```bash
npx cap sync android
```

### Step 5: APK Build करें
```bash
npx cap build android
```

या manual build के लिए:
```bash
cd android
./gradlew assembleRelease
cd ..
```

---

## 📂 APK Location:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔧 Complete Commands (एक बार में):
```bash
npm install && npm run build && npx cap add android && npx cap sync android && npx cap build android
```

---

## 🐛 Troubleshooting:

### Gradle/Java errors:
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
npx cap build android
```

### Node modules issue:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
npx cap sync android
npx cap build android
```

### Android SDK not found:
Set ANDROID_HOME environment variable:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---

## 📦 Files Added/Modified:
- `package.json` - Capacitor dependencies added
- `capacitor.config.ts` - Capacitor configuration
- `.gitignore` - Updated to exclude android/ directory

---

**अब आप APK बना सकते हैं! 🎉**
