# دليفري كفر حكيم — نسخة مستقلة (Standalone) v1

تطبيق توصيل في كفر حكيم وكرداسة وأبو رواش (مركز كرداسة، الجيزة) — أربع خدمات
في تطبيق واحد، مبني على قاعدة ind toktok v53:

1. **مشوار توكتوك** 🛺 — زي ind toktok بالظبط
2. **مشوار موتوسيكل** 🏍️ — نقل ركاب بالموتوسيكل
3. **دليفري** 📦 — كابتن موتوسيكل يجيب أي حاجة من أي محل/صيدلية/شخص
4. **مطاعم** 🍽️ — منيو وأسعار جوه التطبيق، والتوصيل بموتوسيكل

- **اسم التطبيق:** دليفري كفر حكيم
- **اسم الحزمة (Package name):** `com.delivery.kafrhakim`
- **التقنية:** Vite + React + TypeScript (عربي RTL) + Firebase + Capacitor
- **الدفع:** كاش عند الاستلام (v1 — مفيش دفع أونلاين)
- **العمولة:** 5% على المشاوير والدليفري، 10% على طلبات المطاعم (من سعر الأكل)

---

## 1) صلاح ينشئ مشروع Firebase جديد — خطوة بخطوة

> ⚠️ لا تلمس مشروع **«تاجر جمله»** القديم ولا مشروع **ind-toktok** — الاتنين شغالين.
> اعمل مشروع جديد منفصل.

1. افتح https://console.firebase.google.com بنفس حساب جوجل بتاعك.
2. دوس **Add project** (أضف مشروع)، وسمّيه `delivery-kafr-hakim`، وكمل الخطوات
   (ممكن تلغي Google Analytics — مش ضروري).
3. من القايمة الشمال فعّل الحاجتين دول بس:
   - **Firestore Database** — Create database (وضع الإنتاج، المنطقة الافتراضية).
   - **Authentication** — Get started — فعّل **Phone**.
4. من **Project settings > Your apps > Web app (</>)** انسخ الـ config
   والصقه في `src/firebaseConfig.ts` بدل القيم النائبة `PASTE_...`.
5. من **Project settings > Your apps > Android app** سجّل التطبيق بالباكدج
   `com.delivery.kafrhakim`، ونزّل `google-services.json` وحطه في `android/app/`
   (الملف القديم بتاع ind-toktok اتمسح من المشروع ده).
6. قواعد Firestore: ملف `firestore.rules.DRAFT` مسودة غير مختبرة — تتراجع قبل النشر.

## 2) صلاح ينشئ ريبو GitHub جديد

1. على https://github.com/new — اسم الريبو `delivery-kafr-hakim` — عام (Public).
2. ارفع كل ملفات مجلد `delivery-kafr-hakim-app` — ما عدا `node_modules`.
3. الـ workflow `.github/workflows/build-apk.yml` يبني APK تلقائياً مع كل push
   على `main` — اسم الـ artifact `delivery-kafr-hakim-apk`.
4. لينك الـ APK الثابت بعد أول إصدار:
   `https://raw.githubusercontent.com/salahmahmood987-oss/delivery-kafr-hakim/main/delivery-kafr-hakim-latest.apk`
   (لازم يتسمى الملف كده في الريبو — شوف `version.json`).

## 3) OTP Worker جديد (textbee SMS)

الـ Worker لازم يكون واحد جديد منفصل: `delivery-kafr-hakim-otp-worker`
(مش worker بتاع ind toktok) — بنفس نظام textbee من موبايل صلاح
(الخط الأورانج لازم يكون فيه رصيد). بعد النشر حط رابطه في `.env.production`:
`VITE_OTP_WORKER_URL=https://delivery-kafr-hakim-otp-worker.salahmahmood987.workers.dev`
— لو فاضي، التطبيق يرجع لمسار Firebase Phone Auth.

## 4) البناء محلياً والتحقق

```bash
cd delivery-kafr-hakim-app
npm ci
npx tsc -b --force   # لازم يخرج 0 — لا تستخدم tsc --noEmit إطلاقاً
npm run build        # لازم يخرج 0
```

البناء المحلي للـ APK بـ Gradle بيفشل في بيئة التطوير دي (Java loopback
محظور) — الـ APK بيتبني عبر GitHub Actions زي ind toktok بالظبط.

## 5) بوابة ما قبل الإطلاق

الخدمة بتبدأ مقفولة للركاب — الأدمن يجمع الكباتن والمطاعم الأول من لوحة
الإدارة، وبعدين يدوس «شغّل الخدمة للركاب». العميل قبل الإطلاق يشوف
«لسه ما اشتغلناش» ويسجّل رقمه في قايمة الانتظار. العلم في Firestore:
مستند `settings/launch` — `{ launched, driversTarget }`.

## 6) اللي لسه ناقص بعد v1

- مشروع Firebase جديد + ريبو GitHub جديد + OTP Worker جديد (الخطوات فوق).
- شعار (أيقونة) خاص بدليفري كفر حكيم — حالياً أيقونة ind toktok.
- اختبار حي على موبايلين: عميل + كابتن (توكتوك وموتوسيكل) + صاحب مطعم.
- مفاتيح TURN منفصلة للمكالمات الصوتية — حالياً بتتشارك كوتا ind toktok
  المجانية (500MB/شهر) من نفس حساب Metered.
