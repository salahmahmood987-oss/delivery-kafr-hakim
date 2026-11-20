// ============================================================================
//  إعدادات Firebase — دليفري كفر حكيم
//  IMPORTANT / مهم جداً:
//  1) صلاح ينشئ مشروع Firebase جديد باسم delivery-kafr-hakim في نفس حسابه
//     (console.firebase.google.com) — ولا يلمس مشروع "تاجر جمله" القديم
//     ولا مشروع ind-toktok. المشروع ده منفصل تماماً: سواقين وعملاء
//     ومطاعم وطلبات كفر حكيم وكرداسة وأبو رواش بس.
//  2) يفعّل في المشروع الجديد: Firestore Database + Authentication (Phone)
//     فقط — Storage مش مطلوب: التخزين في المشاريع الجديدة يتطلب خطة
//     Blaze (بطاقة فوترة)، وصلاح اختار عدم إضافتها دلوقتي.
//     الصور تتخزن مضغوطة Base64 داخل Firestore — انظر src/imageUpload.ts.
//  3) من Project settings > Your apps > Web app (</>) ينسخ الـ config
//     ويلصقه هنا بدل القيم النائبة PASTE_... أدناه.
//     لحد ما يعمل كده، التطبيق شغال في "الوضع التجريبي المحلي"
//     (البيانات على الجهاز، وإرسال OTP يترفض برسالة توضح إن إعداد
//     Firebase مش موجود).
//  4) في Firebase Console > Authentication > Sign-in method يفعّل Phone،
//     وفي Project settings > Your apps > Android app يسجل التطبيق
//     بالباكدج com.delivery.kafrhakim ويحط ملف google-services.json
//     الجديد في android/app/ (الملف القديم بتاع ind-toktok اتمسح).
// ============================================================================

export interface FirebaseWebConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

export const firebaseConfig: FirebaseWebConfig = {
  apiKey: 'AIzaSyDyPknOj_bl6nZ1N_oAUQcEJ5ILs_pO9ag',
  authDomain: 'delivery-kafr-hakim.firebaseapp.com',
  projectId: 'delivery-kafr-hakim',
  storageBucket: 'delivery-kafr-hakim.firebasestorage.app',
  messagingSenderId: '310023716488',
  appId: '1:310023716488:web:01c3a5dcee950ca299693d',
}

/** true — تم لصق الـ config الحقيقي لمشروع delivery-kafr-hakim في 2026-11-20. */
export const isFirebaseConfigured =
  firebaseConfig.apiKey !== 'PASTE_YOUR_API_KEY_HERE' &&
  firebaseConfig.projectId !== 'PASTE_YOUR_PROJECT_ID_HERE'

// ============================================================================
//  OTP حقيقي — Firebase Phone Auth + Worker textbee (نفس نظام ind toktok)
//  ----------------------------------------------------------------------------
//  الكود يتبعت برسالة SMS حقيقية — انظر src/otp.ts و src/otpWorker.ts.
//  الـ Worker لازم يكون واحد جديد منفصل: delivery-kafr-hakim-otp-worker
//  (مش worker بتاع ind toktok)، ويتضبط رابطه في .env بـ VITE_OTP_WORKER_URL.
//  لو الرابط مش مضبوط، التطبيق يرجع لمسار Firebase Phone Auth الحالي.
//
//  حدود لازم صلاح يعرفها:
//  • حد التطبيق: 3 أكواد في الساعة لكل رقم (src/otp.ts — قبل مناداة
//    Firebase، عشان ما نحرقش رسايل على الفاضي).
//  • حد Firebase للمشاريع الجديدة: **10 رسايل SMS في اليوم** لحد ما يضيف
//    حساب فوترة (Blaze) لمشروع delivery-kafr-hakim من الكونسول، وبعدها
//    الحد بيرتفع.
//  • ملف functions/index.js (هيكل Twilio) **مش مستخدم دلوقتي** — مرجع فقط.
// ============================================================================
export const SMS_PROVIDER_TODO =
  'Real OTP via Firebase Phone Auth (see src/otp.ts). Firebase new-project limit: 10 SMS/day until billing is added to project delivery-kafr-hakim.'
