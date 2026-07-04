# 🛒 نرجس سوبرماركت — narges Supermarket

تطبيق سوبرماركت سعودي احترافي متعدّد اللوحات (عميل · كاشير · مندوب · إدارة)، مبني بـ React + Vite،
بقاعدة بيانات حقيقية على Supabase، ومستضاف على Vercel، وبواجهة عربية RTL بهوية «نرجس» الخضراء.

> **الاسم:** يُكتب بالعربية **«نرجس»** وباللاتينية **`narges`** (وليس `narjis`). النطاق اللاتيني داخل
> الكود كله `narges-*`.

---

## 🤖 للذكاء الاصطناعي: ابدأ القراءة من هنا (AI Onboarding)

إذا كنت وكيل ذكاء اصطناعي دخل هذا المستودع لتكمل العمل، هذه خلاصة الحالة لتتابع بدون ضياع سياق:

| العنصر | القيمة |
|--------|--------|
| **الفرع الرئيسي للتطوير والإنتاج** | `claude/narjis-supermarket-app-g09dtg` (لا يوجد فرع `main`؛ هذا الفرع هو فرع الإنتاج على Vercel) |
| **مجلد التطبيق** | `app/` (Vite + React) — كل أوامر npm تُشغَّل داخله |
| **الاستضافة** | Vercel فقط (مشروع `narges`, team `vorgvslogger`) — يَنشُر تلقائياً عند كل push للفرع |
| **قاعدة البيانات** | Supabase — مشروع `narges`, ref **`hwxekvwntwaymsqxnfeo`**, منطقة `ap-southeast-1` |
| **حالة القاعدة** | 6 جداول + RLS مفعّل + مزروعة (10 أقسام، 37 قسم فرعي، 92 منتج) |
| **آلية fallback** | لو متغيرات Supabase غير مضبوطة، `app/src/lib/api.js` يرجع للبيانات الوهمية تلقائياً |

**قاعدة ذهبية:** كل ميزة بيانات تمرّ عبر `app/src/lib/api.js` (تحويل snake_case↔camelCase + fallback).
لا تستورد البيانات الوهمية مباشرة في صفحات جديدة — استخدم دوال `api.js`.

راجع قسم [الإصدارات / سجل التغييرات](#-الإصدارات--سجل-التغييرات-changelog) لتتبّع كل ما حدث بالتفصيل،
وقسم [الحالة والمهام المعلّقة](#-الحالة-الحالية-والمهام-المعلّقة) لما تبقّى.

---

## ✨ نظرة عامة

«نرجس سوبرماركت» تطبيق توصيل بقالة على نمط Ninja / HungerStation، يضم أربع لوحات مستقلة ضمن نطاق واحد:

- **`/Customer`** — تصفّح المنتجات، السلة، الدفع، تتبّع الطلب، نظام ولاء بالنقاط.
- **`/Cashier`** — طابور الطلبات، معالجتها، وإضافة منتج بالصورة عبر الذكاء الاصطناعي (Gemini Vision).
- **`/Delivery`** — الطلبات المتاحة، خريطة حيّة (Leaflet/OpenStreetMap)، ودردشة.
- **`/Admin`** — لوحة تحكم، إدارة المنتجات (CRUD حقيقي)، الطلبات، الفروع، العروض، الشكاوى.

اللوحات المحمية (`/Cashier` `/Delivery` `/Admin`) خلف `ProtectedRoute` حسب دور المستخدم.

---

## 🧱 البنية التقنية (Tech Stack)

| الطبقة | التقنية |
|--------|---------|
| الإطار | **React 19** + **Vite 8** (SPA) |
| التوجيه | **react-router-dom 7** (مسارات PascalCase: `/Customer`, `/Cashier`, …) |
| الحالة | **Zustand 5** (cart, orders, auth, loyalty, branch) |
| التنسيق | **Tailwind CSS 3** + توكنات `narges-*` المخصّصة + خط IBM Plex Sans Arabic، RTL |
| الخرائط | **react-leaflet** + OpenStreetMap (بدون مفتاح) |
| الذكاء الاصطناعي | **Gemini Vision** (`gemini-2.0-flash`) عبر `fetch` لتحليل صور المنتجات |
| الواجهة الخلفية | **Supabase** (PostgreSQL + Auth + RLS) |
| الاستضافة | **Vercel** (مع `app/vercel.json` لإعادة التوجيه SPA) |

---

## 📁 هيكل المشروع

```
narges/
├─ README.md                  ← هذا الملف (مرجع المشروع الكامل)
├─ app/                       ← تطبيق Vite + React
│  ├─ .env.production         ← متغيرات Supabase العامة (publishable/anon — آمنة، محمية بـ RLS)
│  ├─ vercel.json             ← إعادة توجيه كل المسارات إلى /index.html (روابط BrowserRouter)
│  ├─ tailwind.config.js      ← توكنات نظام التصميم (narges-green #2E7D32, orange #FF7A00, …)
│  └─ src/
│     ├─ App.jsx              ← التوجيه + تهيئة الجلسة + ProtectedRoute
│     ├─ lib/
│     │  ├─ supabase.js       ← عميل Supabase + isSupabaseConfigured
│     │  ├─ api.js            ← طبقة الوصول: products/categories/orders + CRUD (snake↔camel + fallback)
│     │  └─ useFetch.js       ← hook تحميل async
│     ├─ store/               ← متاجر Zustand (cart, orders, auth, loyalty, branch)
│     ├─ data/                ← بيانات وهمية احتياطية (products.js = 92 منتج، categories.js، productCatalog.js)
│     ├─ components/shared/   ← ProtectedRoute, StatusBadge (الدخول للوحات عبر الحساب والدور فقط)
│     └─ panels/
│        ├─ customer/  (Home+FlashDeals, Product, Category, Cart, Tracking, Loyalty, Orders, Profile, Favorites)
│        ├─ cashier/   (OrderQueue, ProcessOrder, AddProductAI)
│        ├─ delivery/  (AvailableOrders, ActiveDelivery, LiveMap, ChatWidget)
│        ├─ admin/     (Dashboard, Products[CRUD], Orders, DriversMap, Offers, Complaints)
│        └─ auth/      (LoginPage, SignUpPage)
├─ supabase/
│  ├─ migrations/0001_schema.sql   ← الجداول + دالة/trigger handle_new_user
│  ├─ migrations/0002_rls.sql      ← سياسات RLS + دالة has_role
│  └─ seed.sql                     ← بذور (10 أقسام + 37 فرعي + 92 منتج)
└─ scraper/                  ← أداة سحب منتجات أولية من موقع مرجعي (narjis14.com) — أداة تطوير فقط
```

---

## 🗄️ الواجهة الخلفية: Supabase

**مشروع:** `narges` — ref `hwxekvwntwaymsqxnfeo`.

### الجداول (schema: public)
| الجدول | الوصف |
|--------|-------|
| `categories` | الأقسام (id نصّي، name_ar، icon، color، icon_bg، product_count، sort_order) |
| `subcategories` | الأقسام الفرعية (FK → categories) |
| `products` | المنتجات (id نصّي p001…، السعر، الأصلي، القسم، الوحدة، المخزون، is_offer، is_featured، rating، image) |
| `profiles` | ملفات المستخدمين (id → auth.users، full_name، phone، role) — الأدوار: `customer`/`cashier`/`delivery`/`admin` |
| `orders` | الطلبات (uuid، customer_id، status، address jsonb، الإجماليات، payment، driver_id) |
| `order_items` | عناصر الطلب (FK → orders on delete cascade) |

`status` للطلب: `pending → confirmed → preparing → ready → picked_up → delivered` (أو `cancelled`).

### الأمان (RLS) — 13 سياسة
- **القراءة العامة** على `categories`/`subcategories`/`products` (الكتالوج)؛ **الكتابة** لأدوار `admin`/`cashier` عبر `has_role()`.
- `profiles`: المستخدم يقرأ/يعدّل صفّه؛ الأدمن يقرأ الكل.
- `orders`/`order_items`: العميل يرى/يُنشئ طلباته؛ الموظفون يرون الكل ويحدّثون الحالة.
- دالة `handle_new_user()` (trigger على `auth.users`) تُنشئ صف `profiles` تلقائياً بدور `customer` عند التسجيل.
- تحصين: `handle_new_user` و`has_role` ممنوعتان عن استدعاء RPC العام (revoke execute).

### البذور (Seed)
مُولّدة آلياً عبر `app/scripts/gen-seed.mjs`. مطبَّقة في القاعدة: **10 أقسام، 37 قسم فرعي، 92 منتج**.

---

## 🔐 المصادقة والأدوار

- **Supabase Auth** (إيميل/كلمة مرور). `useAuthStore` يحمل `session`/`user`/`profile`/`role`.
- `App.jsx` يستدعي `initAuth()` عند الإقلاع، ويستمع لـ `onAuthStateChange`.
- `ProtectedRoute` يحمي اللوحات حسب الدور؛ لو Supabase غير مهيأ، يمرّر (وضع تطوير).
- **لإنشاء موظف:** يسجّل المستخدم عبر `/signup`، ثم يُغيَّر `profiles.role` إلى `cashier`/`delivery`/`admin`.

---

## 🔌 طبقة الوصول للبيانات (`app/src/lib/api.js`)

كل دالة تستعلم Supabase وتحوّل `snake_case`→`camelCase`، أو ترجع للبيانات الوهمية عند عدم التهيئة:

- **قراءة:** `fetchCategories`, `fetchProducts`, `fetchFeatured`, `fetchOffers`, `fetchByCategory`, `fetchProductById`, `searchProducts`
- **طلبات:** `createOrder`, `fetchOrders`, `fetchOrderById`, `updateOrderStatus`, `assignDriver`
- **منتجات (CRUD):** `createProduct`, `updateProduct`, `deleteProduct`

تحويلات الأعمدة: `name_ar↔nameAr`, `original_price↔originalPrice`, `category_id↔categoryId`, `in_stock↔inStock`,
`stock_qty↔stockQty`, `is_offer↔isOffer`, `is_featured↔isFeatured`, `review_count↔reviewCount`.

---

## 🚀 النشر: Vercel

- المشروع `narges` على Vercel ينشر **تلقائياً** عند كل push لفرع `claude/narjis-supermarket-app-g09dtg`.
- **Root Directory = `app`**, Framework = Vite.
- `app/vercel.json` يعيد توجيه كل المسارات إلى `/index.html` لدعم روابط BrowserRouter العميقة.
- `vite.config.js`: `base: '/'` (افتراضي). نشر GitHub Pages أُزيل نهائياً.

---

## ⚙️ متغيرات البيئة

| المتغير | السرّية | المكان |
|---------|---------|--------|
| `VITE_SUPABASE_URL` | عام | `app/.env.production` (مرفوع) + Vercel |
| `VITE_SUPABASE_ANON_KEY` | عام (publishable، محمي بـ RLS) | `app/.env.production` (مرفوع) + Vercel |
| `VITE_GEMINI_KEY` | **سرّي** | متغيرات Vercel فقط — **لا يُرفع في git أبداً** |

> الأمان: لا يُستخدم في الواجهة إلا مفتاح `anon`/publishable العام (محمي بـ RLS). **ممنوع** وضع `service_role`
> في كود الواجهة، أو رفع مفتاح Gemini السرّي.

---

## 💻 التشغيل محلياً

```bash
cd app
npm install
# للتشغيل ببيانات Supabase الحقيقية: تأكد من وجود app/.env.production
npm run dev        # خادم التطوير
npm run build      # بناء الإنتاج
npm run preview    # معاينة بناء الإنتاج
```

افتح `http://localhost:5173/Customer`. بدون متغيرات Supabase، يعمل التطبيق تلقائياً على البيانات الوهمية (92 منتج).

---

## 🎨 نظام التصميم (Design System)

مطبّق من تصميم Claude Design. التوكنات في `app/tailwind.config.js`:

| التوكن | القيمة | الاستخدام |
|--------|--------|-----------|
| `narges-green` | `#2E7D32` | الأساسي (أزرار، روابط، نشِط) |
| `narges-green-deep` | `#1B5E20` | بداية التدرّجات |
| `narges-light` | `#4CAF50` | لمسات ثانوية |
| `narges-orange` | `#FF7A00` | العروض والشارات |
| `narges-bg` / `surface` / `surface2` | `#F7F8FA` / `#FFFFFF` / `#F1F3F6` | الخلفيات |
| `narges-border` | `#ECEEF1` | الحدود |
| `narges-text` / `text-secondary` / `muted` | `#16191D` / `#5B6470` / `#9AA3AE` | النصوص |

عناصر مميّزة: بطاقة ولاء بتدرّج أخضر + شريط تقدّم، بطاقات عروض، مربّعات أقسام ملوّنة، بطاقات منتجات
(شارة خصم برتقالية + زر إضافة أخضر دائري)، شريط سفلي بخمس تبويبات.

---

## 📦 الإصدارات / سجل التغييرات (Changelog)

> ترقيم دلالي للمراحل (لا يطابق وسوم git؛ مرجعه commit hashes الفعلية على الفرع).
> كل إصدار يذكر الـ commits ليتتبّع أي ذكاء التغييرات بدقة.

### v0.1.0 — النموذج الأولي (`e0b75a9`, `487f14b`, `3774264`, `eb71e65`)
- هيكلة Vite + React + Tailwind + Zustand؛ أربع لوحات ببيانات وهمية ثابتة.
- ضبط `base` ونشر GitHub Pages عبر GitHub Actions (أُزيل لاحقاً في v0.8).

### v0.2.0 — منصّة إنتاجية شاملة (`375cb57`)
- إعادة هيكلة المسارات إلى **PascalCase**؛ إعادة تسمية `driver` → `delivery`.
- نظام ولاء العميل (`useLoyaltyStore` + `LoyaltyPage`).
- إضافة منتج بالصورة للكاشير (`AddProductAIPage` عبر Gemini Vision).
- خرائط حيّة للتوصيل (Leaflet) + دردشة؛ إدارة فروع + خريطة مناديب + عروض + شكاوى للأدمن.

### v0.3.0 — توسيع الكتالوج + تحسين الذكاء (`70f7264`)
- توسيع المنتجات من 30 → **92 منتج** سعودي واقعي في 10 أقسام.
- `productCatalog.js`: ماركات سعودية + نطاقات أسعار + تلميحات لتحسين دقة Gemini.

### v0.4.0 — أساس Supabase + Auth + Vercel (`5e33442`, `1fc8611`)
- عميل Supabase (`lib/supabase.js`) + طبقة `lib/api.js` مع fallback.
- migrations (schema + RLS) + `seed.sql` مُولّد آلياً.
- Supabase Auth: إعادة هيكلة `useAuthStore`، صفحات `Login`/`SignUp`، `ProtectedRoute` بالأدوار.
- `CartPage`: حفظ الطلب في Supabase عند الدفع. إعداد Vercel (`base:'/'` + `vercel.json`).

### v0.5.0 — تفعيل وتأمين الواجهة الخلفية + دورة الطلب (`8fb12b7`, `b28a2ac`, `66c22c8`, `c2645df`)
- **التحقق من القاعدة وإصلاحها:** كانت الجداول موجودة لكن **فارغة وبلا سياسات RLS** — زُرعت
  البيانات (10/37/92) وطُبّقت **13 سياسة RLS** + تحصين الدوال. فحص أمني: تحذير واحد بالتصميم فقط.
- ربط الواجهة بالقاعدة الحقيقية في الإنتاج عبر `app/.env.production` (مفاتيح عامة آمنة).
- ربط **دورة حياة الطلب** بالكامل: `fetchOrders/updateOrderStatus/assignDriver` + متجر طلبات
  يقرأ ويحدّث القاعدة؛ لوحات الكاشير/المندوب/الأدمن تعرض الطلبات الحقيقية؛ تتبّع العميل من القاعدة.
- **إدارة منتجات الأدمن**: إضافة/تعديل/حذف حقيقي عبر `createProduct/updateProduct/deleteProduct`.
- إصلاح خطأ تنقّل بطاقة المنتج (مسار بحرف صغير كان يرجّع للرئيسية).

### v0.6.0 — توحيد الاسم اللاتيني (`eafffb9`)
- إعادة تسمية `narjis` → `narges` في كامل الكود (توكنات Tailwind، مفاتيح التخزين، رمز الإحالة،
  أسماء الحِزم). الاسم العربي «نرجس» بقي. (استُثني عمداً: رابط `narjis14.com` لأنه موقع مصدر ثالث، واسم فرع git.)

### v0.7.0 — تطبيق نظام تصميم Claude Design (`e16cc30`)
- مواءمة توكنات Tailwind مع لوحة التصميم (الأخضر `#2E7D32`، البرتقالي `#FF7A00`، خلفيات/ظلال/حدود).
- إعادة تصميم الرئيسية (بطاقة ولاء + شريط تقدّم، بطاقات عروض، مربّعات أقسام)، بطاقة المنتج،
  والشريط السفلي (5 تبويبات). الشاشات تبقى مربوطة ببيانات Supabase — طبقة بصرية فقط.

### v0.8.0 — Vercel هو المستضيف الوحيد (`b80c3b8`)
- إزالة GitHub Pages workflow؛ Vercel هو مسار النشر الوحيد.

### v0.9.0 — منصة حقيقية: إزالة العرض التجريبي + ميزات نموّ + إصلاح جذري (HEAD)
**تحويل جوهري:** أُزيل شريط تبديل اللوحات التجريبي نهائياً — الوصول للوحات صار **بالحساب والدور فقط**
(تسجيل الدخول يوجّه تلقائياً: admin→/Admin, cashier→/Cashier, delivery→/Delivery)، مع زر خروج في كل لوحة،
ومدخل «لوحة الموظف» يظهر في «حسابي» لأصحاب الأدوار.

**إصلاح جذري (خطير):** كانت سلة التسوق **تُفقد عند كل تحديث صفحة** منذ البداية — السبب: getters داخل
حالة zustand تستدعي `get()` أثناء الإنشاء فتُفشِل استرجاع persist بصمت. أزيلت الـ getters وثُبّت
`createJSONStorage` صريحاً — السلة/المفضلة/الولاء تبقى الآن عبر الجلسات (مُتحقق ببراهين متصفح آلية).

**ميزات جديدة (تجذب المستخدم):**
- ⚡ **عروض تنتهي الليلة**: قسم فلاش بعدّاد تنازلي حيّ حتى منتصف الليل في الرئيسية
- 🚚 **شريط التوصيل المجاني**: توصيل مجاني للطلبات ≥ 75 ر.س مع شريط تقدّم متحرك في السلة
- 🧾 **طلباتي**: سجل الطلبات مع «اطلب مجدداً» بضغطة واحدة (يملأ السلة من طلب سابق)
- ❤️ **المفضلة**: قلب على كل بطاقة منتج + صفحة مفضلة، محفوظة محلياً
- 👤 **حسابي**: مركز الحساب (بيانات، ولاء، ثيم، دخول/خروج، مدخل لوحة الموظف)
- 🎉 **احتفال Confetti** عند تأكيد الطلب + شارة عدّاد السلة في الشريط السفلي + هياكل تحميل

**تنظيف وإصلاحات:** حذف مخلفات GitHub Pages (404.html، سكربت فك الترميز، القاعدة الشرطية في vite)،
إصلاح تبويبَي «طلباتي/حسابي» الميتين في الشريط السفلي، ضبط `estimated_delivery_at` عند إنشاء الطلب،
إيقاف استطلاع التتبّع بعد التسليم، `color-scheme` للثيم الداكن (حقول الإدخال)، حذف كود ميّت في AdminApp.

---

## 📌 الحالة الحالية والمهام المعلّقة

**الحالة:** منصة كاملة بدون أي «وضع تجريبي»: تجربة العميل على القاعدة الحقيقية (تصفّح → سلة تبقى عبر
الجلسات → دفع → حفظ في `orders` → تتبّع + confetti)، لوحات الموظفين خلف الدخول بالدور، تصميم داكن
افتراضي مع تبديل، وميزات نموّ (فلاش، توصيل مجاني، إعادة طلب، مفضلة، حسابي).

**حسابات الموظفين الجاهزة:** `admin@narges.sa` / `cashier@narges.sa` / `delivery@narges.sa`
(كلمة المرور: `narges1234`) — أدوارها مضبوطة في `profiles`.

**معلّق:**
1. **شاشات تصميم إضافية** (التتبّع، الولاء، تسجيل الدخول، لوحات الأدمن/الكاشير/المندوب) بنفس التوكنات.
2. **`VITE_GEMINI_KEY`** يُضاف كمتغيّر سرّي في Vercel لتفعيل «إضافة منتج بالصورة» في الإنتاج.
3. ترقية «طلباتي» لعرض تفاصيل الطلب كاملة، وإشعارات فورية (Supabase Realtime) لحالة الطلب.

---

## 🔒 ملاحظات أمنية

- لا تَرفع أي مفتاح سرّي (Gemini، service_role) في git. الموجود في `.env.production` هو مفتاح
  Supabase العام (publishable/anon) المصمّم للعمل في المتصفح ومحمي بـ RLS.
- لا تحذف ولا تكتب فوق ملفات `.env` بدون التأكد من محتواها.
