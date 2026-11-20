import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.delivery.kafrhakim',
  appName: 'دليفري كفر حكيم',
  webDir: 'dist',
  backgroundColor: '#0B2B4B',
  android: {
    allowMixedContent: true,
  },
  server: {
    // لا يوجد خادم خارجي — التطبيق يعمل محلياً + Firebase عند ربطه
    cleartext: true,
  },
  plugins: {
    // لازم نسجّل مزود الهاتف هنا، وإلا إضافة Firebase الأصلية ترفض
    // signInWithPhoneNumber بخطأ "Phone sign-in provider is not enabled"
    FirebaseAuthentication: {
      providers: ['phone'],
    },
  },
}

export default config
