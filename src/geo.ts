/**
 * نطاق الخدمة: كفر حكيم + كرداسة + أبو رواش (مركز كرداسة، محافظة الجيزة).
 *
 * الإحداثيات الحقيقية (geocoding — 2026-11-20):
 *  • كفر حكيم: 30.08477، 31.11921
 *  • كرداسة:   30.03555، 31.11250
 *  • أبو رواش: 30.04578، 31.09466
 * المربع يغطي التلاتة بهامش ~4 كم: خط عرض 30.00–30.12، خط طول 31.05–31.16.
 * منشية القناطر برّه النطاق بقرار صلاح (2026-11-20 21:28).
 *
 * الفحص على مرحلتين (نفس فكرة ind toktok):
 *  1. مربع جغرافي سريع (من غير نت) يرفض أي نقطة بعيدة فوراً.
 *  2. تأكيد باسم المحافظة (Nominatim — مجاني) عشان القرى اللي على
 *     حدود المحافظات التانية متتعدّاش بالغلط.
 * لو التأكيد فشل (مفيش نت) بنسمح بالطلب — مينفعش عميل حقيقي يتعطل
 * عشان الشبكة وقعت لحظة الطلب.
 */

export const SERVICE_BBOX = {
  /** جنوب كرداسة */
  minLat: 30.0,
  /** شمال كفر حكيم */
  maxLat: 30.12,
  /** غرب أبو رواش */
  minLng: 31.05,
  /** شرق كفر حكيم */
  maxLng: 31.16,
}

/** مراكز النطاق — إحداثيات حقيقية للرجوع لها في الخريطة الافتراضية */
export const SERVICE_CENTERS = {
  kafrHakim: { lat: 30.08477, lng: 31.11921, label: 'كفر حكيم' },
  kerdasa: { lat: 30.03555, lng: 31.1125, label: 'كرداسة' },
  abuRawash: { lat: 30.04578, lng: 31.09466, label: 'أبو رواش' },
} as const

/** أماكن سريعة للعميل (v2) — نفس أماكن الملف التجريبي، قوائم ثابتة بدل بحث
 *  Nominatim الضعيف في القرى. الإحداثيات: سوق كرداسة ومدخل بني مجدول
 *  geocoding حقيقي (2026-11-20)؛ أماكن كفر حكيم جوّه القرية بإزاحات صغيرة
 *  (~150–800م) حوالين مركز القرية الموثق (30.08477/31.11921) — الليبل هو
 *  اللي بيشوفه الكابتن، والإحداثي جوّه النطاق في كل الأحوال. */
export const SERVICE_PLACES: { label: string; lat: number; lng: number }[] = [
  { label: 'موقف كفر حكيم الرئيسي', lat: 30.08477, lng: 31.11921 },
  { label: 'شارع المحطة', lat: 30.086, lng: 31.118 },
  { label: 'المسجد الكبير', lat: 30.0835, lng: 31.1205 },
  { label: 'مدرسة السلام الإعدادية', lat: 30.0858, lng: 31.121 },
  { label: 'أول البلد (طريق كرداسة)', lat: 30.078, lng: 31.116 },
  { label: 'مستشفى كفر حكيم', lat: 30.0825, lng: 31.1175 },
  { label: 'مدخل بني مجدول', lat: 30.05791, lng: 31.11593 },
  { label: 'سوق كرداسة الرئيسي', lat: 30.03572, lng: 31.11942 },
]

/** عنوان رسالة برّه النطاق */
export const OUT_OF_AREA_TITLE = 'لسه موصلناش للمكان ده'

/** رسالة برّه النطاق — بتظهر للعميل لما يطلب من برّه كفر حكيم وكرداسة وأبو رواش */
export const OUT_OF_AREA_MESSAGE =
  'خدمة دليفري كفر حكيم شغالة حالياً في كفر حكيم وكرداسة وأبو رواش بس. وهنوصل لمنطقتك قريب إن شاء الله، دوس «بلّغني» وهنكلمك أول ما نفتح عندك.'

export function isInServiceBBox(lat: number, lng: number): boolean {
  return (
    lat >= SERVICE_BBOX.minLat &&
    lat <= SERVICE_BBOX.maxLat &&
    lng >= SERVICE_BBOX.minLng &&
    lng <= SERVICE_BBOX.maxLng
  )
}

/** نتيجة تأكيد المحافظة: الاسم + الكود الرسمي ISO (الأدق) */
interface GovernorateInfo {
  state: string | null
  iso: string | null
}

/**
 * يجيب اسم المحافظة من الإحداثيات (Nominatim — مجاني) — null لو فشل.
 *
 * الكود الرسمي ISO3166-2 هو الأدق: الجيزة EG-GZ.
 * (درس من ind toktok v33: Nominatim بيكتب أسيوط "Asyut" وسوهاج "Suhaj"
 * بالإنجليزي — فالمطابقة بالاسم لوحده كانت بترفض كل الطلبات الصح.)
 */
async function reverseGovernorate(lat: number, lng: number): Promise<GovernorateInfo | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1&accept-language=en`
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 6000)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) return null
    const data = await res.json()
    const address = data?.address ?? {}
    return {
      state: typeof address.state === 'string' ? address.state : null,
      iso: typeof address['ISO3166-2-lvl4'] === 'string' ? address['ISO3166-2-lvl4'] : null,
    }
  } catch {
    return null
  }
}

/** الجيزة — بالكود الرسمي ISO أولاً، وبعدين بالاسم */
const SERVICE_ISOS = new Set(['EG-GZ'])
const SERVICE_STATES = [/giza|الجيزة/i]

/** النقطة دي جوّه نطاق الخدمة؟ */
export async function isInServiceArea(lat: number, lng: number): Promise<boolean> {
  if (!isInServiceBBox(lat, lng)) return false
  const info = await reverseGovernorate(lat, lng)
  if (!info) return true
  const iso = info.iso
  if (iso && SERVICE_ISOS.has(iso)) return true
  const state = info.state
  if (state && SERVICE_STATES.some((re) => re.test(state))) return true
  // لو مفيش اسم محافظة ولا كود (منطقة ناقصة البيانات) بنسمح — المربع هو الفيصل
  if (!iso && !state) return true
  return false
}
