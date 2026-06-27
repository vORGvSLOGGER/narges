export const products = [
  // === فواكه وخضروات ===
  { id: 'p001', nameAr: 'تفاح أحمر فاخر', price: 12.5, originalPrice: 15, categoryId: 'fruits-veg', subcategoryId: 'fruits', unit: 'كيلو', inStock: true, stockQty: 80, isOffer: true, isFeatured: true, rating: 4.8, reviewCount: 234, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&q=80' },
  { id: 'p002', nameAr: 'موز أكوادور', price: 5.5, originalPrice: 5.5, categoryId: 'fruits-veg', subcategoryId: 'fruits', unit: 'كيلو', inStock: true, stockQty: 120, isOffer: false, isFeatured: true, rating: 4.6, reviewCount: 189, image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&q=80' },
  { id: 'p003', nameAr: 'طماطم طازجة', price: 4.0, originalPrice: 4.0, categoryId: 'fruits-veg', subcategoryId: 'vegetables', unit: 'كيلو', inStock: true, stockQty: 60, isOffer: false, isFeatured: false, rating: 4.5, reviewCount: 145, image: 'https://images.unsplash.com/photo-1546470427-0d9571a7f3f4?w=300&q=80' },
  { id: 'p004', nameAr: 'خيار أخضر', price: 3.5, originalPrice: 3.5, categoryId: 'fruits-veg', subcategoryId: 'vegetables', unit: 'كيلو', inStock: true, stockQty: 90, isOffer: false, isFeatured: false, rating: 4.3, reviewCount: 98, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&q=80' },
  { id: 'p005', nameAr: 'فراولة طازجة', price: 18.0, originalPrice: 22, categoryId: 'fruits-veg', subcategoryId: 'fruits', unit: 'علبة 500جم', inStock: true, stockQty: 40, isOffer: true, isFeatured: true, rating: 4.9, reviewCount: 312, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80' },
  { id: 'p006', nameAr: 'بصل أبيض', price: 2.5, originalPrice: 2.5, categoryId: 'fruits-veg', subcategoryId: 'vegetables', unit: 'كيلو', inStock: true, stockQty: 150, isOffer: false, isFeatured: false, rating: 4.2, reviewCount: 67, image: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=300&q=80' },

  // === ألبان وبيض ===
  { id: 'p007', nameAr: 'حليب ألمراعي كامل الدسم 2 لتر', price: 9.5, originalPrice: 9.5, categoryId: 'dairy-eggs', subcategoryId: 'milk', unit: 'قطعة', inStock: true, stockQty: 200, isOffer: false, isFeatured: true, rating: 4.7, reviewCount: 458, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80' },
  { id: 'p008', nameAr: 'جبن شيدر بلوك 400جم', price: 24.0, originalPrice: 28, categoryId: 'dairy-eggs', subcategoryId: 'cheese', unit: 'قطعة', inStock: true, stockQty: 75, isOffer: true, isFeatured: true, rating: 4.6, reviewCount: 201, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&q=80' },
  { id: 'p009', nameAr: 'زبادي طبيعي ألمراعي 170جم', price: 3.25, originalPrice: 3.25, categoryId: 'dairy-eggs', subcategoryId: 'yogurt', unit: 'قطعة', inStock: true, stockQty: 300, isOffer: false, isFeatured: false, rating: 4.5, reviewCount: 178, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80' },
  { id: 'p010', nameAr: 'بيض عربي رومي 30 بيضة', price: 22.0, originalPrice: 22.0, categoryId: 'dairy-eggs', subcategoryId: 'eggs', unit: 'كرتون', inStock: true, stockQty: 85, isOffer: false, isFeatured: true, rating: 4.8, reviewCount: 345, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&q=80' },
  { id: 'p011', nameAr: 'كريمة طبخ ألمراعي 200مل', price: 6.5, originalPrice: 7.5, categoryId: 'dairy-eggs', subcategoryId: 'milk', unit: 'قطعة', inStock: true, stockQty: 120, isOffer: true, isFeatured: false, rating: 4.4, reviewCount: 134, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80' },

  // === لحوم ودواجن ===
  { id: 'p012', nameAr: 'دجاج طازج كامل', price: 32.0, originalPrice: 38, categoryId: 'meat-poultry', subcategoryId: 'chicken', unit: 'كيلو', inStock: true, stockQty: 50, isOffer: true, isFeatured: true, rating: 4.7, reviewCount: 267, image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&q=80' },
  { id: 'p013', nameAr: 'لحم بقري مفروم طازج', price: 55.0, originalPrice: 55.0, categoryId: 'meat-poultry', subcategoryId: 'beef', unit: 'كيلو', inStock: true, stockQty: 35, isOffer: false, isFeatured: false, rating: 4.6, reviewCount: 189, image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=300&q=80' },
  { id: 'p014', nameAr: 'صدر دجاج طازج', price: 38.0, originalPrice: 45, categoryId: 'meat-poultry', subcategoryId: 'chicken', unit: 'كيلو', inStock: true, stockQty: 45, isOffer: true, isFeatured: true, rating: 4.8, reviewCount: 412, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&q=80' },

  // === مشروبات ===
  { id: 'p015', nameAr: 'مياه نستله 1.5 لتر', price: 1.5, originalPrice: 1.5, categoryId: 'beverages', subcategoryId: 'water', unit: 'قطعة', inStock: true, stockQty: 500, isOffer: false, isFeatured: false, rating: 4.5, reviewCount: 523, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&q=80' },
  { id: 'p016', nameAr: 'عصير البيت برتقال 1 لتر', price: 8.5, originalPrice: 10, categoryId: 'beverages', subcategoryId: 'juices', unit: 'قطعة', inStock: true, stockQty: 150, isOffer: true, isFeatured: true, rating: 4.6, reviewCount: 298, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&q=80' },
  { id: 'p017', nameAr: 'كوكاكولا 330مل', price: 3.0, originalPrice: 3.0, categoryId: 'beverages', subcategoryId: 'soft-drinks', unit: 'قطعة', inStock: true, stockQty: 400, isOffer: false, isFeatured: false, rating: 4.4, reviewCount: 678, image: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=300&q=80' },
  { id: 'p018', nameAr: 'نسكافيه كلاسيك 200جم', price: 32.0, originalPrice: 38, categoryId: 'beverages', subcategoryId: 'hot-drinks', unit: 'قطعة', inStock: true, stockQty: 80, isOffer: true, isFeatured: true, rating: 4.7, reviewCount: 445, image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&q=80' },

  // === حبوب ومواد أساسية ===
  { id: 'p019', nameAr: 'أرز مصري بسمتي 5 كيلو', price: 38.0, originalPrice: 45, categoryId: 'grains-staples', subcategoryId: 'rice', unit: 'كيس', inStock: true, stockQty: 90, isOffer: true, isFeatured: true, rating: 4.8, reviewCount: 567, image: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9aed2?w=300&q=80' },
  { id: 'p020', nameAr: 'زيت عباد الشمس الصافي 1.8 لتر', price: 22.5, originalPrice: 22.5, categoryId: 'grains-staples', subcategoryId: 'oils', unit: 'قطعة', inStock: true, stockQty: 120, isOffer: false, isFeatured: false, rating: 4.5, reviewCount: 234, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80' },
  { id: 'p021', nameAr: 'سكر أبيض 2 كيلو', price: 12.0, originalPrice: 12.0, categoryId: 'grains-staples', subcategoryId: 'sugar-salt', unit: 'كيس', inStock: true, stockQty: 200, isOffer: false, isFeatured: false, rating: 4.4, reviewCount: 178, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80' },
  { id: 'p022', nameAr: 'معكرونة بارون سباغيتي 450جم', price: 4.5, originalPrice: 5.5, categoryId: 'grains-staples', subcategoryId: 'pasta', unit: 'قطعة', inStock: true, stockQty: 300, isOffer: true, isFeatured: false, rating: 4.3, reviewCount: 145, image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=300&q=80' },

  // === منظفات ===
  { id: 'p023', nameAr: 'صابون غسيل الأطباق فيري 750مل', price: 14.5, originalPrice: 17, categoryId: 'cleaning', subcategoryId: 'dish-wash', unit: 'قطعة', inStock: true, stockQty: 180, isOffer: true, isFeatured: false, rating: 4.7, reviewCount: 389, image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&q=80' },
  { id: 'p024', nameAr: 'مسحوق غسيل تايد 2.5 كيلو', price: 42.0, originalPrice: 48, categoryId: 'cleaning', subcategoryId: 'laundry', unit: 'علبة', inStock: true, stockQty: 95, isOffer: true, isFeatured: true, rating: 4.8, reviewCount: 478, image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=300&q=80' },

  // === وجبات خفيفة ===
  { id: 'p025', nameAr: 'شيبس ليز أصلي 167جم', price: 8.5, originalPrice: 8.5, categoryId: 'snacks', subcategoryId: 'chips', unit: 'قطعة', inStock: true, stockQty: 250, isOffer: false, isFeatured: true, rating: 4.6, reviewCount: 523, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&q=80' },
  { id: 'p026', nameAr: 'شوكولاتة كيت كات 4 أصابع', price: 5.0, originalPrice: 5.0, categoryId: 'snacks', subcategoryId: 'chocolate', unit: 'قطعة', inStock: true, stockQty: 400, isOffer: false, isFeatured: false, rating: 4.7, reviewCount: 712, image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&q=80' },
  { id: 'p027', nameAr: 'مكسرات مشكلة 300جم', price: 28.0, originalPrice: 35, categoryId: 'snacks', subcategoryId: 'nuts', unit: 'علبة', inStock: true, stockQty: 65, isOffer: true, isFeatured: true, rating: 4.8, reviewCount: 267, image: 'https://images.unsplash.com/photo-1599599810694-57fc48b0a2f6?w=300&q=80' },
  { id: 'p028', nameAr: 'بسكويت أوريو 137جم', price: 7.5, originalPrice: 7.5, categoryId: 'snacks', subcategoryId: 'biscuits', unit: 'قطعة', inStock: true, stockQty: 320, isOffer: false, isFeatured: false, rating: 4.6, reviewCount: 445, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&q=80' },

  // === مجمدات ===
  { id: 'p029', nameAr: 'بازيلاء مجمدة 900جم', price: 11.5, originalPrice: 11.5, categoryId: 'frozen', subcategoryId: 'frozen-veg', unit: 'كيس', inStock: true, stockQty: 70, isOffer: false, isFeatured: false, rating: 4.4, reviewCount: 134, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&q=80' },
  { id: 'p030', nameAr: 'آيس كريم بن جيري فانيلا 458مل', price: 32.0, originalPrice: 38, categoryId: 'frozen', subcategoryId: 'ice-cream', unit: 'علبة', inStock: true, stockQty: 45, isOffer: true, isFeatured: true, rating: 4.9, reviewCount: 389, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=80' },
];

export const getFeatured = () => products.filter(p => p.isFeatured);
export const getOffers = () => products.filter(p => p.isOffer);
export const getByCategory = (categoryId) => products.filter(p => p.categoryId === categoryId);
export const getById = (id) => products.find(p => p.id === id);
export const searchProducts = (query) =>
  products.filter(p => p.nameAr.includes(query));
