import { supabase, isSupabaseConfigured } from './supabase';
import { categories as mockCategories } from '../data/categories';
import {
  products as mockProducts,
  getFeatured as mockGetFeatured,
  getOffers as mockGetOffers,
  getByCategory as mockGetByCategory,
  getById as mockGetById,
  searchProducts as mockSearch,
} from '../data/products';

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

  return order;
}
