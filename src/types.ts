export interface LatLng {
  lat: number
  lng: number
  label: string
}

export type Role = 'passenger' | 'driver' | 'wallet' | 'admin' | 'trips' | 'profile' | 'myRequests' | 'support' | 'restaurant'

/** نوع مركبة الكابتن — توكتوك أو موتوسيكل */
export type VehicleType = 'tuk-tuk' | 'motorcycle'

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  'tuk-tuk': 'توكتوك 🛺',
  motorcycle: 'موتوسيكل 🏍️',
}

/** نوع الخدمة — الأربع خدمات في دليفري كفر حكيم */
export type ServiceKind = 'ride_tuktuk' | 'ride_motorcycle' | 'delivery' | 'restaurant'

export const SERVICE_LABELS: Record<ServiceKind, string> = {
  ride_tuktuk: 'مشوار توكتوك 🛺',
  ride_motorcycle: 'مشوار موتوسيكل 🏍️',
  delivery: 'دليفري 📦',
  restaurant: 'طلب مطعم 🍽️',
}

/** كابتن الموتوسيكل يقدر يقبل أنهو خدمات؟ التوكتوك مشاوير ركاب بس. */
export function vehicleCanServe(vehicle: VehicleType, service: ServiceKind): boolean {
  if (vehicle === 'tuk-tuk') return service === 'ride_tuktuk'
  // الموتوسيكل: مشاوير ركاب + دليفري + توصيل طلبات مطاعم
  return service === 'ride_motorcycle' || service === 'delivery' || service === 'restaurant'
}

export interface PassengerProfile {
  name: string
  phone: string
  /** كود عميل ثابت لنفس رقم الموبايل، مثل C-1002 */
  code: string
  phoneVerified: boolean
  /** صورة شخصية (Data URL مضغوطة) تظهر للكابتن */
  photoUrl: string | null
  ratingAvg: number
  ratingCount: number
  /** تاريخ التسجيل (أول دخول موثق) — 0 لو مش معروف (مسجل قبل v30) */
  createdAt: number
}

export interface DriverProfile {
  name: string
  phone: string
  /** كود سواق مثل D-1001 */
  code: string
  plate: string
  color: string
  model: string
  /** نوع المركبة: توكتوك أو موتوسيكل — الكابتن بيظهر بس لطلبات نوعه */
  vehicleType: VehicleType
  online: boolean
  sharingLocation: boolean
  ratingAvg: number
  ratingCount: number
  /** تاريخ التسجيل (أول دخول موثق) — 0 لو مش معروف (مسجل قبل v30) */
  createdAt: number
  /** مديونية السواق الحالية (عمولات 5% غير مسددة) — متزامنة عبر مستند السواق في Firestore */
  debt: number
  /** إجمالي ما سدده السواق — متزامن عبر مستند السواق في Firestore */
  totalPaid: number
  /** رصيد السواق في المحفظة — لو سدّد أكتر من مديونيته الزيادة بتتحفظ هنا، وعمولات الرحلات الجاية بتتخصم منها الأول قبل ما تتسجل مديونية */
  balance: number
  /** صورة البطاقة: Data URL مضغوطة (JPEG) مخزنة داخل مستند Firestore — بدون Storage */
  idCardUrl: string | null
  /** صورة شخصية (Data URL مضغوطة) تظهر للعميل — غير صورة البطاقة */
  photoUrl: string | null
  idCardStatus: 'none' | 'pending' | 'approved' | 'rejected'
  currentLat: number | null
  currentLng: number | null
}

export type RideStatus =
  | 'searching'
  | 'matched'
  | 'driver_arrived'
  | 'on_trip'
  | 'completed'
  | 'cancelled'

export interface Offer {
  id: string
  rideId: string
  driverCode: string
  driverName: string
  driverPhone: string
  driverRating: number
  driverPhotoUrl: string | null
  /** موقع الكابتن لحظة إرسال العرض — عشان العميل يشوف المسافة ويرتب بالأقرب */
  driverLat: number | null
  driverLng: number | null
  price: number
  etaMinutes: number
  plate: string
  color: string
  model: string
  /** نوع مركبة الكابتن اللي بعت العرض */
  vehicleType: VehicleType
}

export interface Ride {
  /** رقم الطلب مثل #1001 */
  orderNo: string
  passengerCode: string
  passengerName: string
  passengerPhone: string
  passengerRating: number
  pickup: LatLng
  destination: LatLng
  fare: number
  /** نوع الخدمة: مشوار توكتوك / مشوار موتوسيكل / دليفري / مطعم */
  serviceKind: ServiceKind
  /** نوع المركبة المطلوبة للطلب ده */
  vehicleType: VehicleType
  /** وصف الطلب في الدليفري — "هاتلي إيه" (من أي محل/صيدلية/شخص) */
  deliveryNote: string | null
  /** اسم المطعم + معرّفه في طلبات المطاعم (null في غيرها) */
  restaurantId: string | null
  restaurantName: string | null
  status: RideStatus
  driverCode: string | null
  driverName: string | null
  /** رقم تليفون الكابتن — يظهر للعميل بعد قبول العرض */
  driverPhone: string | null
  driverLat: number | null
  driverLng: number | null
  driverLocAt: number | null
  offers: Offer[]
  createdAt: number
  /** وقت قبول الطلب (وقت ما الراكب اختار عرض الكابتن) */
  acceptedAt: number | null
  /** وقت وصول الكابتن للعميل */
  arrivedAt: number | null
  /** وقت نهاية الرحلة */
  completedAt: number | null
  /** وقت الإلغاء (v49 — عشان الملغاة تتحسب في فترة الإلغاء مش فترة الطلب) */
  cancelledAt: number | null
  /** سبب الإلغاء (لو اتلغت) */
  cancelReason: string | null
  /** مين اللي لغى: السواق أو العميل */
  cancelledBy: 'driver' | 'passenger' | null
  /** صورة العميل — تظهر للكابتن */
  passengerPhotoUrl: string | null
  /** صورة الكابتن — تظهر للعميل */
  driverPhotoUrl: string | null
  /** تقييم الراكب للكابتن بعد الرحلة */
  passengerRatingForDriver: number | null
  /** تقييم الكابتن للراكب بعد الرحلة */
  driverRatingForPassenger: number | null
}

/** تصنيف المطعم — للفلترة عند العميل (v2) */
export type RestaurantCategory = 'ful' | 'grill' | 'pizza' | 'pharmacy' | 'other'

export const RESTAURANT_CATEGORY_LABELS: Record<RestaurantCategory, string> = {
  ful: 'فول وطعمية 🧆',
  grill: 'مشويات وكبدة 🥩',
  pizza: 'بيتزا وفطائر 🍕',
  pharmacy: 'صيدلية وماركت 💊',
  other: 'أخرى',
}

/** مطعم متعاقد معاه — المنيو أصنافه، والتوصيل بكباتن موتوسيكل.
 *  الدفع كاش عند الاستلام في v1 — مفيش دفع أونلاين. */
export interface Restaurant {
  id: string
  name: string
  /** تصنيف المطعم — للفلترة عند العميل */
  category: RestaurantCategory
  /** رقم تليفون صاحب المطعم — هو اللي بيدير المنيو والطلبات */
  ownerPhone: string
  /** وصف مختصر + العنوان (كفر حكيم / كرداسة / أبو رواش) */
  description: string
  address: string
  /** صورة المطعم (Data URL مضغوطة) — اختياري */
  photoUrl: string | null
  /** الأدمن لازم يوافق على المطعم قبل ما يظهر للعملاء */
  approved: boolean
  /** نسبة التطبيق من كل طلب — افتراضي 10%، الأدمن يقدر يغيّرها لكل مطعم */
  commissionRate: number
  createdAt: number
}

/** صنف واحد في منيو مطعم */
export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  price: number
  description: string
  /** صورة الصنف (Data URL مضغوطة) — اختياري */
  photoUrl: string | null
  available: boolean
}

/** حالة طلب المطعم: جديد → المطعم أكّده → بيتجهز → جاهز للتوصيل →
 *  الكابتن استلمه → اتوصل → ملغي */
export type RestaurantOrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'delivered'
  | 'cancelled'

export const RESTAURANT_ORDER_LABELS: Record<RestaurantOrderStatus, string> = {
  new: 'طلب جديد',
  confirmed: 'المطعم أكّد الطلب',
  preparing: 'بيتجهز 👨‍🍳',
  ready: 'جاهز للتوصيل',
  picked_up: 'الكابتن استلمه 🏍️',
  delivered: 'اتوصل ✅',
  cancelled: 'ملغي',
}

/** طلب أكل من مطعم — بيتوصل بكابتن موتوسيكل، والدفع كاش عند الاستلام */
export interface RestaurantOrder {
  id: string
  restaurantId: string
  restaurantName: string
  customerName: string
  customerPhone: string
  /** الأصناف: اسم + سعر الوحدة + كمية */
  items: { menuItemId: string; name: string; price: number; qty: number }[]
  /** إجمالي سعر الأكل (من غير التوصيل) */
  foodTotal: number
  /** أجرة التوصيل (بيحددها العميل زي سعر المشوار) */
  deliveryFee: number
  /** عمولة التطبيق من سعر الأكل (10% افتراضي — من المطعم مش من العميل) */
  commission: number
  /** عنوان التوصيل */
  address: string
  addressLat: number | null
  addressLng: number | null
  /** ملاحظات العميل للمطعم */
  note: string | null
  status: RestaurantOrderStatus
  /** كابتن الموتوسيكل اللي هيوصل الطلب */
  driverCode: string | null
  driverName: string | null
  driverPhone: string | null
  createdAt: number
}

/** عميل من برّه النطاق (كفر حكيم/كرداسة/أبو رواش) ساب رقمه عشان نبلغه لما نفتح عنده */
export interface WaitlistEntry {
  id: string
  phone: string
  name: string
  code: string
  pickupLabel: string
  destLabel: string
  createdAt: number
}

/** إعدادات الإطلاق (v44) — مستند settings/launch في Firestore */
export interface LaunchSettings {
  /** الخدمة شغالة للركاب؟ false = لسه بنجمع سواقين */
  launched: boolean
  /** عدد السواقين المستهدف قبل الإطلاق (100 افتراضياً) */
  driversTarget: number
}

/** عميل ساب رقمه عشان نبلغه أول ما الخدمة تشتغل (v44) */
export interface LaunchWaitlistEntry {
  id: string
  phone: string
  name: string
  createdAt: number
}

export interface PaymentRequest {
  id: string
  driverCode: string
  driverName: string
  amount: number
  /** صورة التحويل: Data URL مضغوطة (JPEG) مخزنة داخل مستند Firestore — بدون Storage */
  screenshotUrl: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: number
}

export interface AdminSettings {
  walletNumber: string
  walletName: string
  /** فتحة عداد التوكتوك الافتراضية (جنيه) — الأدمن يغيّرها من لوحة الإدارة */
  tuktukBaseFare: number
  /** فتحة عداد الموتوسيكل الافتراضية (جنيه) */
  motorcycleBaseFare: number
  /** عمولة التطبيق من المشاوير والدليفري — 0.05 = 5% */
  rideCommissionRate: number
  /** عمولة المطاعم الافتراضية — 0.1 = 10% */
  restaurantCommissionRate: number
  /** أجرة توصيل المطاعم الافتراضية (جنيه) */
  deliveryFee: number
}

/** رسالة واحدة في شات الدعم (v50) — الوقت ISO عشان يترتب صح من أي جهاز */
export interface SupportMessage {
  /** customer = المستخدم نفسه (راكب/كابتن)، agent = المساعد (زعتر)، admin = صلاح */
  sender: 'customer' | 'agent' | 'admin'
  text: string
  createdAt: string
}

/** محادثة دعم واحدة لكل رقم موبايل (v50) — مستند supportChats/{phone}
 *  (phone هو رقم الجلسة E.164). نفس السكيما في Top Service — شات الدعم
 *  مشترك بين التطبيقين، والمساعد بيرد من Firestore على طول. */
export interface SupportChat {
  phone: string
  app: 'delivery-kafr-hakim'
  role: 'passenger' | 'driver'
  name: string
  messages: SupportMessage[]
  /** آخر مرة العميل/الكابتن بعت رسالة — null لو لسه مبعتش */
  lastCustomerAt: string | null
  /** آخر مرة الدعم رد — null لو لسه مفيش رد */
  lastReplyAt: string | null
  /** محتاجة تدخل صلاح بنفسه (بيعلّمها المساعد لما السؤال محتاج قراره) */
  needsAdmin: boolean
}

export const COMMISSION_RATE = 0.05 // عمولة 5% على المشاوير والدليفري
export const RESTAURANT_COMMISSION_RATE = 0.1 // عمولة 10% على طلبات المطاعم (من سعر الأكل — افتراضي، الأدمن يغيّرها لكل مطعم)
export const MAX_DEBT_EGP = 100 // حد المديونية 100 جنيه
export const OTP_MAX_PER_HOUR = 3 // حد طلبات الكود: 3 في الساعة لكل رقم
export const OTP_VALID_MINUTES = 10 // صلاحية الكود (للعرض فقط — Firebase يدير صلاحية كوده بنفسه)
export const OTP_CODE_LENGTH = 6 // كود Firebase Phone Auth: 6 أرقام يوصلوا برسالة SMS
export const FARE_MIN = 5
export const FARE_MAX = 500

// ---------------------------------------------------------------------------
//  مكالمات صوتية VoIP (v52) — صوت بس، من غير فيديو، بين الراكب والكابتن
//  أثناء الرحلة. الإشارة (offer/answer/ICE) بتتم عبر مستند واحد في
//  Firestore: calls/{orderNo} — مستند واحد لكل رحلة، بيتمسح/بينتهي
//  مع نهاية الرحلة. مفيش أرقام تليفون في المكالمة إطلاقاً.
// ---------------------------------------------------------------------------

/** حالة المكالمة: ringing = بترن عند الطرف التاني، active = شغالة،
 *  ended = انتهت، declined = الطرف التاني رفض */
export type CallStatus = 'ringing' | 'active' | 'ended' | 'declined'

/** مستند مكالمة واحدة في Firestore — calls/{orderNo} */
export interface RideCall {
  /** رقم الطلب — هو نفسه معرّف المستند */
  rideId: string
  status: CallStatus
  /** مين اللي بدأ المكالمة */
  callerRole: 'passenger' | 'driver'
  /** اسم اللي بدأ المكالمة (اسم بس — من غير رقم تليفون) */
  callerName: string
  /** عرض WebRTC من اللي بدأ المكالمة */
  offer: { type: string; sdp: string } | null
  /** رد WebRTC من الطرف التاني */
  answer: { type: string; sdp: string } | null
  /** مرشحو ICE من اللي بدأ المكالمة */
  callerCandidates: RTCIceCandidateInit[]
  /** مرشحو ICE من الطرف التاني */
  calleeCandidates: RTCIceCandidateInit[]
  updatedAt: number
}
