import { supabase, isSupabaseConfigured } from './supabase';
import { useSettingsStore } from '../store/useSettingsStore';
import { categories as mockCategories } from '../data/categories';
import {
  products as mockProducts,
  getFeatured as mockGetFeatured,
  getOffers as mockGetOffers,
  getByCategory as mockGetByCategory,
  getById as mockGetById,
  searchProducts as mockSearch,
} from '../data/products';
import { brands as mockBrands } from '../data/brands';

// ---- محوّلات snake_case (القاعدة) → camelCase (الواجهة) ----
function mapProduct(row) {
  return {
    id: row.id,
    nameAr: row.name_ar,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : Number(row.price),
    categoryId: row.category_id,
    subcategoryId: row.subcategory_id,
    unit: row.unit,
    inStock: row.in_stock,
    stockQty: row.stock_qty,
    isOffer: row.is_offer,
    isFeatured: row.is_featured,
    rating: row.rating != null ? Number(row.rating) : 0,
    reviewCount: row.review_count ?? 0,
    image: row.image,
    brandId: row.brand_id ?? row.brandId ?? null,
  };
}

function mapCategory(row) {
  return {
    id: row.id,
    nameAr: row.name_ar,
    icon: row.icon,
    color: row.color,
    iconBg: row.icon_bg,
    productCount: row.product_count ?? 0,
    subcategories: row.subcategories || [],
  };
}

// ============ الأقسام ============
export async function fetchCategories() {
  if (!isSupabaseConfigured) return mockCategories;
  const { data, error } = await supabase
    .from('categories')
    .select('*, subcategories(id, name_ar)')
    .order('sort_order', { ascending: true });
  if (error) {
    console.warn('[api] fetchCategories fallback:', error.message);
    return mockCategories;
  }
  return data.map((c) => mapCategory({
    ...c,
    subcategories: (c.subcategories || []).map((s) => ({ id: s.id, nameAr: s.name_ar })),
  }));
}

// ============ المنتجات ============
export async function fetchProducts() {
  if (!isSupabaseConfigured) return mockProducts;
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.warn('[api] fetchProducts fallback:', error.message);
    return mockProducts;
  }
  return data.map(mapProduct);
}

export async function fetchFeatured() {
  if (!isSupabaseConfigured) return mockGetFeatured();
  const { data, error } = await supabase.from('products').select('*').eq('is_featured', true);
  if (error) {
    console.warn('[api] fetchFeatured fallback:', error.message);
    return mockGetFeatured();
  }
  return data.map(mapProduct);
}

export async function fetchOffers() {
  if (!isSupabaseConfigured) return mockGetOffers();
  const { data, error } = await supabase.from('products').select('*').eq('is_offer', true);
  if (error) {
    console.warn('[api] fetchOffers fallback:', error.message);
    return mockGetOffers();
  }
  return data.map(mapProduct);
}

export async function fetchByCategory(categoryId) {
  if (!isSupabaseConfigured) return mockGetByCategory(categoryId);
  const { data, error } = await supabase.from('products').select('*').eq('category_id', categoryId);
  if (error) {
    console.warn('[api] fetchByCategory fallback:', error.message);
    return mockGetByCategory(categoryId);
  }
  return data.map(mapProduct);
}

export async function fetchProductById(id) {
  if (!isSupabaseConfigured) return mockGetById(id);
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  if (error || !data) {
    if (error) console.warn('[api] fetchProductById fallback:', error.message);
    return mockGetById(id);
  }
  return mapProduct(data);
}

export async function searchProducts(query) {
  if (!isSupabaseConfigured) return mockSearch(query);
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name_ar', `%${query}%`);
  if (error) {
    console.warn('[api] searchProducts fallback:', error.message);
    return mockSearch(query);
  }
  return data.map(mapProduct);
}

// ============ الطلبات ============
// orderData: { customerName, customerPhone, address, items:[{productId,nameAr,qty,unitPrice}],
//              subtotal, deliveryFee, discount, total, paymentMethod, notes }
export async function createOrder(orderData, customerId) {
  if (!isSupabaseConfigured) {
    // وضع المحاكاة: نُرجع طلباً وهمياً بدون حفظ فعلي
    return { id: `ORD-LOCAL-${Date.now()}`, ...orderData, simulated: true };
  }

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_id: customerId,
      status: 'pending',
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      address: orderData.address || null,
      subtotal: orderData.subtotal,
      delivery_fee: orderData.deliveryFee ?? 10,
      discount: orderData.discount ?? 0,
      total: orderData.total,
      payment_method: orderData.paymentMethod ?? 'cash',
      payment_status: 'pending',
      notes: orderData.notes ?? '',
      estimated_delivery_at: new Date(Date.now() + (useSettingsStore.getState().settings.delivery.etaMinutes || 40) * 60000).toISOString(),
    })
    .select()
    .single();

  if (orderErr) throw orderErr;

  const items = (orderData.items || []).map((it) => ({
    order_id: order.id,
    product_id: it.productId,
    name_ar: it.nameAr,
    qty: it.qty,
    unit_price: it.unitPrice,
    total_price: it.unitPrice * it.qty,
  }));

  if (items.length) {
    const { error: itemsErr } = await supabase.from('order_items').insert(items);
    if (itemsErr) throw itemsErr;
  }

  return mapOrder({ ...order, order_items: items });
}

// محوّل الطلب: snake_case (القاعدة) → camelCase (الواجهة)
function mapOrder(row) {
  return {
    id: row.id,
    status: row.status,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    deliveryAddress: row.address || {},
    items: (row.order_items || []).map((it) => ({
      productId: it.product_id,
      nameAr: it.name_ar,
      qty: it.qty,
      unitPrice: Number(it.unit_price),
      totalPrice: Number(it.total_price),
    })),
    subtotal: Number(row.subtotal ?? 0),
    deliveryFee: Number(row.delivery_fee ?? 0),
    discount: Number(row.discount ?? 0),
    total: Number(row.total ?? 0),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    driverId: row.driver_id,
    notes: row.notes,
    createdAt: row.created_at,
    estimatedDeliveryAt: row.estimated_delivery_at,
    deliveredAt: row.delivered_at,
  };
}

const ORDERS_SELECT = '*, order_items(product_id, name_ar, qty, unit_price, total_price)';

// كل الطلبات (للموظفين) — يمكن التصفية بالحالة. RLS يسمح فقط للأدوار admin/cashier/delivery.
export async function fetchOrders({ status } = {}) {
  if (!isSupabaseConfigured) return null; // null = استخدم المتجر المحلي (الوهمي)
  let q = supabase.from('orders').select(ORDERS_SELECT).order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  const { data, error } = await q;
  if (error) {
    console.warn('[api] fetchOrders:', error.message);
    return null;
  }
  return data.map(mapOrder);
}

// طلب واحد بالتفاصيل
export async function fetchOrderById(id) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from('orders').select(ORDERS_SELECT).eq('id', id).maybeSingle();
  if (error || !data) {
    if (error) console.warn('[api] fetchOrderById:', error.message);
    return null;
  }
  return mapOrder(data);
}

// تحديث حالة الطلب (للموظفين)
export async function updateOrderStatus(orderId, status) {
  if (!isSupabaseConfigured) return null;
  const patch = { status };
  if (status === 'delivered') patch.delivered_at = new Date().toISOString();
  const { data, error } = await supabase.from('orders').update(patch).eq('id', orderId).select(ORDERS_SELECT).maybeSingle();
  if (error) throw error;
  return data ? mapOrder(data) : null;
}

// إسناد مندوب للطلب (للموظفين)
export async function assignDriver(orderId, driverId) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from('orders').update({ driver_id: driverId }).eq('id', orderId).select(ORDERS_SELECT).maybeSingle();
  if (error) throw error;
  return data ? mapOrder(data) : null;
}

// ============ إدارة المنتجات (admin/cashier) ============
function toProductRow(p) {
  const row = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.nameAr !== undefined) row.name_ar = p.nameAr;
  if (p.price !== undefined) row.price = p.price;
  if (p.originalPrice !== undefined) row.original_price = p.originalPrice;
  if (p.categoryId !== undefined) row.category_id = p.categoryId;
  if (p.subcategoryId !== undefined) row.subcategory_id = p.subcategoryId;
  if (p.unit !== undefined) row.unit = p.unit;
  if (p.inStock !== undefined) row.in_stock = p.inStock;
  if (p.stockQty !== undefined) row.stock_qty = p.stockQty;
  if (p.isOffer !== undefined) row.is_offer = p.isOffer;
  if (p.isFeatured !== undefined) row.is_featured = p.isFeatured;
  if (p.rating !== undefined) row.rating = p.rating;
  if (p.reviewCount !== undefined) row.review_count = p.reviewCount;
  if (p.image !== undefined) row.image = p.image;
  return row;
}

export async function createProduct(product) {
  const id = product.id || `p${Date.now().toString(36)}`;
  if (!isSupabaseConfigured) return { ...product, id, simulated: true };
  const { data, error } = await supabase.from('products').insert(toProductRow({ ...product, id })).select().single();
  if (error) throw error;
  return mapProduct(data);
}

export async function updateProduct(id, patch) {
  if (!isSupabaseConfigured) return { id, ...patch, simulated: true };
  const { data, error } = await supabase.from('products').update(toProductRow(patch)).eq('id', id).select().single();
  if (error) throw error;
  return mapProduct(data);
}

export async function deleteProduct(id) {
  if (!isSupabaseConfigured) return { id, simulated: true };
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return { id };
}

// ============ القسائم (Coupons) ============
function mapCoupon(row) {
  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: Number(row.value),
    minSubtotal: Number(row.min_subtotal ?? 0),
    maxUses: row.max_uses,
    usedCount: row.used_count ?? 0,
    expiresAt: row.expires_at,
    active: row.active,
    createdAt: row.created_at,
  };
}

export async function fetchCoupons() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) { console.warn('[api] fetchCoupons:', error.message); return []; }
  return data.map(mapCoupon);
}

export async function createCoupon(c) {
  const row = {
    code: (c.code || '').trim().toUpperCase(),
    type: c.type || 'percent',
    value: c.value,
    min_subtotal: c.minSubtotal ?? 0,
    max_uses: c.maxUses || null,
    expires_at: c.expiresAt || null,
    active: c.active !== false,
  };
  if (!isSupabaseConfigured) return { ...mapCoupon({ ...row, id: `c-${Date.now()}`, used_count: 0 }), simulated: true };
  const { data, error } = await supabase.from('coupons').insert(row).select().single();
  if (error) throw error;
  return mapCoupon(data);
}

export async function updateCoupon(id, patch) {
  const row = {};
  if (patch.code !== undefined) row.code = patch.code.trim().toUpperCase();
  if (patch.type !== undefined) row.type = patch.type;
  if (patch.value !== undefined) row.value = patch.value;
  if (patch.minSubtotal !== undefined) row.min_subtotal = patch.minSubtotal;
  if (patch.maxUses !== undefined) row.max_uses = patch.maxUses || null;
  if (patch.expiresAt !== undefined) row.expires_at = patch.expiresAt || null;
  if (patch.active !== undefined) row.active = patch.active;
  if (!isSupabaseConfigured) return { id, ...patch, simulated: true };
  const { data, error } = await supabase.from('coupons').update(row).eq('id', id).select().single();
  if (error) throw error;
  return mapCoupon(data);
}

export async function deleteCoupon(id) {
  if (!isSupabaseConfigured) return { id, simulated: true };
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) throw error;
  return { id };
}

// تحقق من قسيمة للعميل عند الدفع — يرجع مبلغ الخصم أو يرمي سبب الرفض بالعربي
export async function validateCoupon(code, subtotal) {
  const clean = (code || '').trim().toUpperCase();
  if (!clean) throw new Error('أدخل رمز القسيمة');
  if (!isSupabaseConfigured) throw new Error('القسائم غير متاحة حالياً');
  const { data, error } = await supabase.from('coupons').select('*').eq('code', clean).maybeSingle();
  if (error) throw new Error('تعذّر التحقق من القسيمة');
  if (!data) throw new Error('قسيمة غير موجودة');
  const c = mapCoupon(data);
  if (!c.active) throw new Error('هذه القسيمة موقوفة');
  if (c.expiresAt && new Date(c.expiresAt) < new Date()) throw new Error('انتهت صلاحية القسيمة');
  if (c.maxUses && c.usedCount >= c.maxUses) throw new Error('استُنفدت مرات استخدام القسيمة');
  if (subtotal < c.minSubtotal) throw new Error(`الحد الأدنى للقسيمة ${c.minSubtotal} ر.س`);
  const discount = c.type === 'percent' ? (subtotal * c.value) / 100 : c.value;
  return { ...c, discount: Math.min(discount, subtotal) };
}

// ============ الشركات / العلامات التجارية ============
function mapBrand(row, productCount = 0) {
  return {
    id: row.id,
    nameAr: row.name_ar ?? row.nameAr,
    nameEn: row.name_en ?? row.nameEn,
    logo: row.logo,
    foundedYear: row.founded_year ?? row.foundedYear,
    country: row.country,
    blurb: row.blurb,
    tint: row.tint,
    productCount,
  };
}

// كل العلامات مع عدد منتجات كل واحدة
export async function fetchBrands() {
  if (!isSupabaseConfigured) {
    return mockBrands.map((b) => mapBrand(b, mockProducts.filter((p) => p.brandId === b.id).length));
  }
  const { data, error } = await supabase.from('brands').select('*, products(count)');
  if (error) {
    console.warn('[api] fetchBrands fallback:', error.message);
    return mockBrands.map((b) => mapBrand(b, mockProducts.filter((p) => p.brandId === b.id).length));
  }
  return data.map((row) => mapBrand(row, row.products?.[0]?.count ?? 0));
}

// علامة واحدة + منتجاتها
export async function fetchBrandById(id) {
  const all = await fetchBrands();
  return all.find((b) => b.id === id) || null;
}

export async function fetchByBrand(brandId) {
  if (!isSupabaseConfigured) return mockProducts.filter((p) => p.brandId === brandId);
  const { data, error } = await supabase.from('products').select('*').eq('brand_id', brandId);
  if (error) {
    console.warn('[api] fetchByBrand fallback:', error.message);
    return mockProducts.filter((p) => p.brandId === brandId);
  }
  return data.map(mapProduct);
}
