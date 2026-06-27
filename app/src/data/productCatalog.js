export const SAUDI_BRANDS = {
  dairy: ['ألمراعي', 'نادك', 'الوطية', 'سدير', 'بيورا', 'حليب الطائف', 'شبرا'],
  beverages: ['البيت', 'تروبيكانا', 'ألمراعي', 'نستله', 'كوكاكولا', 'بيبسي', 'سفن أب', 'ميرندا', 'ريد بول', 'ماونتن ديو'],
  cleaning: ['تايد', 'فيري', 'جلنار', 'دومكس', 'مودي', 'وايت وايت', 'أريال', 'باورفول', 'فلورا'],
  snacks: ['ليز', 'بالسوم', 'عروس', 'كيتكات', 'سنيكرز', 'تويكس', 'دوريتوس', 'برينغلز', 'شيبسي'],
  grains: ['أبو بنت', 'بسمتي الذهب', 'شاليمار', 'قوس قزح', 'ألمراعي', 'الغزالة', 'كنز'],
  personal_care: ['هيد أند شولدرز', 'بانتين', 'كليرول', 'دوف', 'نيفيا', 'كولجيت', 'أورال-بي', 'لوكس'],
  meat: ['نادك', 'صدر الدجاج الذهبي', 'بيروتي', 'الوطنية'],
  bakery: ['لولو', 'القرن', 'شهية', 'أبو عوف'],
};

export const PRICE_RANGES = {
  'fruits-veg':     { min: 2,  max: 30,  typical: 8,  unit: 'كيلو' },
  'dairy-eggs':     { min: 3,  max: 40,  typical: 12, unit: 'قطعة' },
  'meat-poultry':   { min: 25, max: 90,  typical: 45, unit: 'كيلو' },
  'beverages':      { min: 1,  max: 50,  typical: 8,  unit: 'قطعة' },
  'grains-staples': { min: 4,  max: 60,  typical: 20, unit: 'كيس' },
  'cleaning':       { min: 8,  max: 70,  typical: 25, unit: 'قطعة' },
  'personal-care':  { min: 5,  max: 90,  typical: 30, unit: 'قطعة' },
  'snacks':         { min: 3,  max: 40,  typical: 10, unit: 'قطعة' },
  'frozen':         { min: 10, max: 60,  typical: 25, unit: 'كيس' },
  'bakery':         { min: 2,  max: 25,  typical: 8,  unit: 'قطعة' },
};

export const CATALOG_HINTS = [
  // ألبان وبيض
  { nameAr: 'حليب ألمراعي كامل الدسم 2 لتر', categoryId: 'dairy-eggs', price: 9.5, unit: 'قطعة' },
  { nameAr: 'حليب ألمراعي قليل الدسم 1 لتر', categoryId: 'dairy-eggs', price: 5.5, unit: 'قطعة' },
  { nameAr: 'حليب نادك كامل 1 لتر', categoryId: 'dairy-eggs', price: 4.75, unit: 'قطعة' },
  { nameAr: 'جبن شيدر بلوك 400جم', categoryId: 'dairy-eggs', price: 24, unit: 'قطعة' },
  { nameAr: 'جبن قريش 200جم', categoryId: 'dairy-eggs', price: 8.5, unit: 'قطعة' },
  { nameAr: 'جبن مثلثات لاف 8 قطع', categoryId: 'dairy-eggs', price: 12, unit: 'علبة' },
  { nameAr: 'زبادي ألمراعي طبيعي 170جم', categoryId: 'dairy-eggs', price: 3.25, unit: 'قطعة' },
  { nameAr: 'لبن رائب ألمراعي 400مل', categoryId: 'dairy-eggs', price: 4.5, unit: 'قطعة' },
  { nameAr: 'زبدة ألمراعي 200جم', categoryId: 'dairy-eggs', price: 14.5, unit: 'قطعة' },
  { nameAr: 'قشطة ألمراعي 170جم', categoryId: 'dairy-eggs', price: 5.25, unit: 'قطعة' },
  { nameAr: 'بيض دجاج رومي 30 بيضة', categoryId: 'dairy-eggs', price: 22, unit: 'كرتون' },
  { nameAr: 'كريمة طبخ 200مل', categoryId: 'dairy-eggs', price: 6.5, unit: 'قطعة' },

  // فواكه وخضار
  { nameAr: 'تفاح أحمر فاخر', categoryId: 'fruits-veg', price: 12.5, unit: 'كيلو' },
  { nameAr: 'موز أكوادور', categoryId: 'fruits-veg', price: 5.5, unit: 'كيلو' },
  { nameAr: 'عنب أحمر', categoryId: 'fruits-veg', price: 18, unit: 'كيلو' },
  { nameAr: 'برتقال مصري', categoryId: 'fruits-veg', price: 7, unit: 'كيلو' },
  { nameAr: 'مانجو سعودي', categoryId: 'fruits-veg', price: 20, unit: 'كيلو' },
  { nameAr: 'رمان', categoryId: 'fruits-veg', price: 15, unit: 'كيلو' },
  { nameAr: 'ليمون', categoryId: 'fruits-veg', price: 8, unit: 'كيلو' },
  { nameAr: 'فراولة طازجة 500جم', categoryId: 'fruits-veg', price: 18, unit: 'علبة' },
  { nameAr: 'طماطم طازجة', categoryId: 'fruits-veg', price: 4, unit: 'كيلو' },
  { nameAr: 'خيار أخضر', categoryId: 'fruits-veg', price: 3.5, unit: 'كيلو' },
  { nameAr: 'بصل أبيض', categoryId: 'fruits-veg', price: 2.5, unit: 'كيلو' },
  { nameAr: 'بطاطس', categoryId: 'fruits-veg', price: 3, unit: 'كيلو' },
  { nameAr: 'جزر', categoryId: 'fruits-veg', price: 3.5, unit: 'كيلو' },
  { nameAr: 'كوسا خضراء', categoryId: 'fruits-veg', price: 4, unit: 'كيلو' },
  { nameAr: 'فلفل رومي أحمر', categoryId: 'fruits-veg', price: 9, unit: 'كيلو' },
  { nameAr: 'بامية طازجة', categoryId: 'fruits-veg', price: 12, unit: 'كيلو' },
  { nameAr: 'ملفوف أبيض', categoryId: 'fruits-veg', price: 5, unit: 'كيلو' },
  { nameAr: 'بروكلي', categoryId: 'fruits-veg', price: 10, unit: 'كيلو' },
  { nameAr: 'باذنجان', categoryId: 'fruits-veg', price: 5, unit: 'كيلو' },
  { nameAr: 'ثوم', categoryId: 'fruits-veg', price: 18, unit: 'كيلو' },

  // لحوم ودواجن
  { nameAr: 'دجاج طازج كامل', categoryId: 'meat-poultry', price: 32, unit: 'كيلو' },
  { nameAr: 'صدر دجاج طازج', categoryId: 'meat-poultry', price: 38, unit: 'كيلو' },
  { nameAr: 'أفخاذ دجاج طازجة', categoryId: 'meat-poultry', price: 28, unit: 'كيلو' },
  { nameAr: 'لحم بقري مفروم', categoryId: 'meat-poultry', price: 55, unit: 'كيلو' },
  { nameAr: 'لحم غنم مقطع', categoryId: 'meat-poultry', price: 75, unit: 'كيلو' },
  { nameAr: 'كبدة بقري', categoryId: 'meat-poultry', price: 35, unit: 'كيلو' },
  { nameAr: 'سمك هامور طازج', categoryId: 'meat-poultry', price: 65, unit: 'كيلو' },
  { nameAr: 'ربيان مجمد 500جم', categoryId: 'meat-poultry', price: 42, unit: 'كيس' },

  // مشروبات
  { nameAr: 'مياه نستله 1.5 لتر', categoryId: 'beverages', price: 1.5, unit: 'قطعة' },
  { nameAr: 'مياه زمزم 5 لتر', categoryId: 'beverages', price: 8.5, unit: 'قطعة' },
  { nameAr: 'عصير البيت برتقال 1 لتر', categoryId: 'beverages', price: 8.5, unit: 'قطعة' },
  { nameAr: 'عصير تروبيكانا مانجو 1 لتر', categoryId: 'beverages', price: 12, unit: 'قطعة' },
  { nameAr: 'كوكاكولا 330مل', categoryId: 'beverages', price: 3, unit: 'قطعة' },
  { nameAr: 'بيبسي 330مل', categoryId: 'beverages', price: 2.75, unit: 'قطعة' },
  { nameAr: 'ريد بول 250مل', categoryId: 'beverages', price: 8, unit: 'قطعة' },
  { nameAr: 'نسكافيه كلاسيك 200جم', categoryId: 'beverages', price: 32, unit: 'قطعة' },
  { nameAr: 'شاي ليبتون الأصفر 100 كيس', categoryId: 'beverages', price: 18, unit: 'علبة' },
  { nameAr: 'قهوة سعودية مطحونة 200جم', categoryId: 'beverages', price: 22, unit: 'قطعة' },
  { nameAr: 'لبن ألمراعي 200مل', categoryId: 'beverages', price: 3, unit: 'قطعة' },
  { nameAr: 'ماء الشرب الصحي 500مل', categoryId: 'beverages', price: 1, unit: 'قطعة' },

  // حبوب ومواد أساسية
  { nameAr: 'أرز مصري بسمتي 5 كيلو', categoryId: 'grains-staples', price: 38, unit: 'كيس' },
  { nameAr: 'أرز شاليمار 2 كيلو', categoryId: 'grains-staples', price: 18, unit: 'كيس' },
  { nameAr: 'دقيق أبو بنت 2 كيلو', categoryId: 'grains-staples', price: 10, unit: 'كيس' },
  { nameAr: 'سكر أبيض 2 كيلو', categoryId: 'grains-staples', price: 12, unit: 'كيس' },
  { nameAr: 'زيت عباد الشمس 1.8 لتر', categoryId: 'grains-staples', price: 22.5, unit: 'قطعة' },
  { nameAr: 'زيت زيتون العروسة 750مل', categoryId: 'grains-staples', price: 28, unit: 'قطعة' },
  { nameAr: 'معكرونة سباغيتي 450جم', categoryId: 'grains-staples', price: 4.5, unit: 'قطعة' },
  { nameAr: 'عدس أحمر 900جم', categoryId: 'grains-staples', price: 8, unit: 'كيس' },
  { nameAr: 'حمص جاف 500جم', categoryId: 'grains-staples', price: 7, unit: 'كيس' },
  { nameAr: 'فاصوليا بيضاء 500جم', categoryId: 'grains-staples', price: 6.5, unit: 'كيس' },
  { nameAr: 'ملح طعام 1 كيلو', categoryId: 'grains-staples', price: 2, unit: 'كيس' },
  { nameAr: 'خل أبيض 500مل', categoryId: 'grains-staples', price: 5, unit: 'قطعة' },
  { nameAr: 'صلصة طماطم هاينز 567جم', categoryId: 'grains-staples', price: 14, unit: 'قطعة' },
  { nameAr: 'معجون طماطم 135جم', categoryId: 'grains-staples', price: 3.5, unit: 'قطعة' },

  // مخبوزات
  { nameAr: 'خبز تنور عربي', categoryId: 'bakery', price: 2, unit: 'قطعة' },
  { nameAr: 'خبز فرنسي باجيت', categoryId: 'bakery', price: 5, unit: 'قطعة' },
  { nameAr: 'توست أبيض 500جم', categoryId: 'bakery', price: 6.5, unit: 'قطعة' },
  { nameAr: 'كرواسان زبدة', categoryId: 'bakery', price: 8, unit: 'قطعة' },
  { nameAr: 'كيك إسفنجي فانيلا', categoryId: 'bakery', price: 14, unit: 'قطعة' },
  { nameAr: 'بسبوسة جاهزة قطعة', categoryId: 'bakery', price: 3, unit: 'قطعة' },
  { nameAr: 'خبز برجر 6 حبات', categoryId: 'bakery', price: 8.5, unit: 'علبة' },

  // منظفات
  { nameAr: 'مسحوق غسيل تايد 2.5 كيلو', categoryId: 'cleaning', price: 42, unit: 'علبة' },
  { nameAr: 'صابون غسيل أطباق فيري 750مل', categoryId: 'cleaning', price: 14.5, unit: 'قطعة' },
  { nameAr: 'منظف حمام دومكس 750مل', categoryId: 'cleaning', price: 12, unit: 'قطعة' },
  { nameAr: 'مبيض جلنار 1 لتر', categoryId: 'cleaning', price: 8.5, unit: 'قطعة' },
  { nameAr: 'معطر هواء فبريز 300مل', categoryId: 'cleaning', price: 22, unit: 'قطعة' },
  { nameAr: 'أكياس قمامة 30 كيس', categoryId: 'cleaning', price: 7, unit: 'علبة' },
  { nameAr: 'إسفنجة غسيل مطبخ 3 حبات', categoryId: 'cleaning', price: 5, unit: 'قطعة' },
  { nameAr: 'محلول متعدد الأغراض مودي 500مل', categoryId: 'cleaning', price: 10, unit: 'قطعة' },

  // عناية شخصية
  { nameAr: 'شامبو هيد أند شولدرز 400مل', categoryId: 'personal-care', price: 28, unit: 'قطعة' },
  { nameAr: 'صابون دوف 135جم', categoryId: 'personal-care', price: 7.5, unit: 'قطعة' },
  { nameAr: 'معجون أسنان كولجيت 100مل', categoryId: 'personal-care', price: 12, unit: 'قطعة' },
  { nameAr: 'كريم نيفيا للجسم 250مل', categoryId: 'personal-care', price: 24, unit: 'قطعة' },
  { nameAr: 'مناديل ورقية 10 حبات', categoryId: 'personal-care', price: 3, unit: 'علبة' },
  { nameAr: 'مناديل مبللة 72 ورقة', categoryId: 'personal-care', price: 9, unit: 'علبة' },
  { nameAr: 'فرشاة أسنان أورال بي', categoryId: 'personal-care', price: 15, unit: 'قطعة' },
  { nameAr: 'مزيل عرق رجالي AXE', categoryId: 'personal-care', price: 22, unit: 'قطعة' },
  { nameAr: 'ورق حمام 10 لفات', categoryId: 'personal-care', price: 19, unit: 'علبة' },

  // مجمدات
  { nameAr: 'بطاطس مجمدة ماكين 2.5 كيلو', categoryId: 'frozen', price: 28, unit: 'كيس' },
  { nameAr: 'بازيلاء مجمدة 900جم', categoryId: 'frozen', price: 11.5, unit: 'كيس' },
  { nameAr: 'خضار مشكلة مجمدة 1 كيلو', categoryId: 'frozen', price: 14, unit: 'كيس' },
  { nameAr: 'سمك فيليه مجمد 500جم', categoryId: 'frozen', price: 32, unit: 'كيس' },
  { nameAr: 'نقانق دجاج 340جم', categoryId: 'frozen', price: 18, unit: 'علبة' },
  { nameAr: 'برجر لحم مجمد 4 قطع', categoryId: 'frozen', price: 35, unit: 'علبة' },
  { nameAr: 'آيس كريم بن جيري 458مل', categoryId: 'frozen', price: 32, unit: 'علبة' },
  { nameAr: 'آيس كريم بريرز كوب', categoryId: 'frozen', price: 8, unit: 'قطعة' },

  // وجبات خفيفة
  { nameAr: 'شيبس ليز أصلي 167جم', categoryId: 'snacks', price: 8.5, unit: 'قطعة' },
  { nameAr: 'دوريتوس نارانج 170جم', categoryId: 'snacks', price: 9, unit: 'قطعة' },
  { nameAr: 'برينغلز أصلي 165جم', categoryId: 'snacks', price: 14, unit: 'قطعة' },
  { nameAr: 'شوكولاتة كيت كات 4 أصابع', categoryId: 'snacks', price: 5, unit: 'قطعة' },
  { nameAr: 'شوكولاتة سنيكرز', categoryId: 'snacks', price: 4.5, unit: 'قطعة' },
  { nameAr: 'بسكويت أوريو 137جم', categoryId: 'snacks', price: 7.5, unit: 'قطعة' },
  { nameAr: 'تمر مجدول 500جم', categoryId: 'snacks', price: 35, unit: 'علبة' },
  { nameAr: 'عسل سدر طبيعي 500جم', categoryId: 'snacks', price: 65, unit: 'قطعة' },
  { nameAr: 'مربى الفراولة سمر 400جم', categoryId: 'snacks', price: 9.5, unit: 'قطعة' },
  { nameAr: 'مكسرات مشكلة 300جم', categoryId: 'snacks', price: 28, unit: 'علبة' },
  { nameAr: 'حلاوة طحينية 400جم', categoryId: 'snacks', price: 14, unit: 'قطعة' },
  { nameAr: 'طحينة 400جم', categoryId: 'snacks', price: 12, unit: 'قطعة' },
];

export function buildGeminiContext() {
  const brandsText = Object.entries(SAUDI_BRANDS)
    .map(([k, v]) => `${k}: ${v.join('، ')}`)
    .join(' | ');

  const pricesText = Object.entries(PRICE_RANGES)
    .map(([k, v]) => `${k} (${v.min}-${v.max} ر.س)`)
    .join('، ');

  const productsText = CATALOG_HINTS
    .map(p => `${p.nameAr} [${p.price} ر.س]`)
    .join('، ');

  return { brandsText, pricesText, productsText };
}
