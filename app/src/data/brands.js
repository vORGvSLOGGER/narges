// الشركات/العلامات التجارية — تُعرض في صفحة «الشركات» ويرتبط بها المنتج عبر brandId
export const brands = [
  { id: 'almarai',   nameAr: 'المراعي',        nameEn: 'Almarai',        logo: '🐄', foundedYear: 1977, country: 'السعودية 🇸🇦', tint: '#E3F2FD', blurb: 'أكبر شركة ألبان متكاملة في العالم — بدأت بمزرعة واحدة في الخرج!' },
  { id: 'nadec',     nameAr: 'نادك',            nameEn: 'NADEC',          logo: '🥛', foundedYear: 1981, country: 'السعودية 🇸🇦', tint: '#E8F5E9', blurb: 'تملك واحدة من أكبر مزارع الألبان بالشرق الأوسط في حرض.' },
  { id: 'alsafi',    nameAr: 'الصافي دانون',    nameEn: 'Al Safi Danone', logo: '🧀', foundedYear: 1979, country: 'السعودية 🇸🇦', tint: '#FFF8E1', blurb: 'دخلت موسوعة غينيس بأكبر مزرعة أبقار متكاملة في العالم.' },
  { id: 'alwatania', nameAr: 'دواجن الوطنية',   nameEn: 'Al Watania',     logo: '🐔', foundedYear: 1977, country: 'السعودية 🇸🇦', tint: '#FBE9E7', blurb: 'أكبر منتج دواجن في الشرق الأوسط — من القصيم إلى كل السعودية.' },
  { id: 'halwani',   nameAr: 'حلواني إخوان',    nameEn: 'Halwani Bros',   logo: '🍯', foundedYear: 1952, country: 'السعودية 🇸🇦', tint: '#F3E5F5', blurb: 'أقدم شركة في قائمتنا — طحينة وحلاوة من جدة منذ أكثر من 70 عاماً.' },
  { id: 'alalali',   nameAr: 'العلالي',         nameEn: 'Al Alali',       logo: '🥫', foundedYear: 1974, country: 'السعودية 🇸🇦', tint: '#E0F7FA', blurb: 'معلّبات في كل مطبخ سعودي — من الذرة إلى صلصة الطماطم.' },
  { id: 'afia',      nameAr: 'العافية',         nameEn: 'Afia',           logo: '🌻', foundedYear: 1979, country: 'السعودية 🇸🇦', tint: '#FFF3E0', blurb: 'زيت المطبخ الأشهر في المملكة — من مجموعة صافولا.' },
  { id: 'nestle',    nameAr: 'نستله',           nameEn: 'Nestlé',         logo: '☕', foundedYear: 1866, country: 'سويسرا 🇨🇭',  tint: '#EFEBE9', blurb: 'أقدم شركة عالمية عندنا — عمرها أكثر من 150 سنة!' },
  { id: 'pepsi',     nameAr: 'بيبسي',           nameEn: 'PepsiCo',        logo: '🥤', foundedYear: 1893, country: 'أمريكا 🇺🇸',  tint: '#E8EAF6', blurb: 'وصلت السعودية في الخمسينات وصارت مشروب الكبسة الرسمي غير الرسمي.' },
  { id: 'lipton',    nameAr: 'ليبتون',          nameEn: 'Lipton',         logo: '🫖', foundedYear: 1890, country: 'بريطانيا 🇬🇧', tint: '#F9FBE7', blurb: 'الشاي الأصفر الذي لا يغيب عن أي استراحة سعودية.' },
];

export const getBrandById = (id) => brands.find((b) => b.id === id);
