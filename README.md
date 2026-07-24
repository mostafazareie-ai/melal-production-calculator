# Mellal Chem — ساخت APK کاملاً محلی (بدون آنلاین کردن سایت)

این پوشه یک پروژه واقعی React + Vite + Capacitor است. بر خلاف روش قبلی (Netlify/Cloudflare + PWABuilder)،
اینجا هیچ‌جا لازم نیست سایت رو آنلاین کنی — همه مراحل روی خود سیستم تو (ویندوز/مک/لینوکس) انجام می‌شه.

## پیش‌نیازها (فقط یک‌بار نصب می‌شن)

1. **Node.js** (نسخه ۱۸ به بالا) — از nodejs.org دانلود و نصب کن
2. **Android Studio** — از developer.android.com/studio دانلود و نصب کن
   (Android Studio خودش JDK و Android SDK لازم رو هم نصب می‌کنه)

## مراحل ساخت APK

### ۱. نصب پکیج‌ها
یک ترمینال (یا Command Prompt) توی همین پوشه باز کن و بزن:
```
npm install
```

### ۲. ساخت نسخه نهایی وب (Build)
```
npm run build
```
یک پوشه `dist` ساخته می‌شه که کاملاً مستقل و آفلاین‌ـآماده‌ست (بدون نیاز به CDN یا اینترنت برای اجرا،
به‌جز فونت که از گوگل می‌آد و اختیاریه).

### ۳. افزودن پلتفرم اندروید
```
npx cap add android
```
این دستور یک پوشه `android` با یک پروژه کامل Android Studio می‌سازه.

### ۴. کپی فایل‌های وب داخل پروژه اندروید
```
npx cap sync android
```
(هر بار که کد رو تغییر دادی و دوباره `npm run build` زدی، این دستور رو هم دوباره بزن)

### ۵. ساخت فایل APK

**روش الف — با رابط گرافیکی Android Studio (پیشنهادی):**
```
npx cap open android
```
Android Studio باز می‌شه. از منو: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
فایل نهایی اینجا ساخته می‌شه:
`android/app/build/outputs/apk/debug/app-debug.apk`

**روش ب — کاملاً از خط فرمان (بدون باز کردن Android Studio):**
```
cd android
./gradlew assembleDebug        (در ویندوز: gradlew.bat assembleDebug)
```
فایل APK همون مسیر بالا ساخته می‌شه.

### ۶. نصب روی گوشی
فایل `app-debug.apk` رو به گوشی منتقل کن و نصبش کن (شاید لازم باشه اجازه «نصب از منابع ناشناس» رو بدی).

---

## نکات مهم

- این APK یک **نسخه Debug** است — برای استفاده شخصی کاملاً کافیه. اگر بعداً خواستی توی گوگل‌پلی منتشرش کنی،
  باید یک نسخه **Release امضاشده** (Signed) بسازی که Android Studio راهنمای همون کار رو هم داخل همون منوی Build داره.
- اگه بعداً کد اپ رو (فایل `src/App.jsx`) تغییر دادی، فقط کافیه دوباره این سه دستور رو بزنی:
  ```
  npm run build
  npx cap sync android
  ```
  و دوباره از Android Studio یا `gradlew assembleDebug` بسازی.
- چون هیچ‌جا سایت رو آنلاین نمی‌کنیم، مشکل «insecure connection» / `assetlinks.json` که توی روش PWABuilder داشتیم
  اینجا اصلاً پیش نمی‌آد — چون این یک اپ native واقعیه، نه یک TWA که به یک دامنه وصل باشه.
