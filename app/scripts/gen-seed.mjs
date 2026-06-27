// يولّد supabase/seed.sql من البيانات الوهمية (categories.js + products.js)
// التشغيل: node app/scripts/gen-seed.mjs  (من جذر المستودع)  أو  node scripts/gen-seed.mjs (من app/)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories } from '../src/data/categories.js';
import { products } from '../src/data/products.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../../supabase/seed.sql');

const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const n = (v) => (v === null || v === undefined ? 'null' : Number(v));
const b = (v) => (v ? 'true' : 'false');

let sql = `-- نرجس سوبرماركت — بيانات أولية (مُولّدة آلياً من gen-seed.mjs)
-- شغّل بعد 0001_schema.sql و 0002_rls.sql
-- يستخدم upsert (on conflict) فيمكن إعادة تشغيله بأمان.

`;

// الأقسام
sql += '-- ===== الأقسام =====\n';
categories.forEach((c, i) => {
  sql += `insert into public.categories (id, name_ar, icon, color, icon_bg, product_count, sort_order) values (${q(c.id)}, ${q(c.nameAr)}, ${q(c.icon)}, ${q(c.color)}, ${q(c.iconBg)}, ${n(c.productCount) || 0}, ${i}) on conflict (id) do update set name_ar=excluded.name_ar, icon=excluded.icon, color=excluded.color, icon_bg=excluded.icon_bg, product_count=excluded.product_count, sort_order=excluded.sort_order;\n`;
});

// الأقسام الفرعية
sql += '\n-- ===== الأقسام الفرعية =====\n';
categories.forEach((c) => {
  (c.subcategories || []).forEach((s) => {
    sql += `insert into public.subcategories (id, category_id, name_ar) values (${q(s.id)}, ${q(c.id)}, ${q(s.nameAr)}) on conflict (id) do update set category_id=excluded.category_id, name_ar=excluded.name_ar;\n`;
  });
});

// المنتجات
sql += '\n-- ===== المنتجات =====\n';
products.forEach((p) => {
  sql += `insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image) values (${q(p.id)}, ${q(p.nameAr)}, ${n(p.price)}, ${n(p.originalPrice)}, ${q(p.categoryId)}, ${q(p.subcategoryId)}, ${q(p.unit)}, ${b(p.inStock)}, ${n(p.stockQty) || 0}, ${b(p.isOffer)}, ${b(p.isFeatured)}, ${n(p.rating) || 0}, ${n(p.reviewCount) || 0}, ${q(p.image)}) on conflict (id) do update set name_ar=excluded.name_ar, price=excluded.price, original_price=excluded.original_price, category_id=excluded.category_id, subcategory_id=excluded.subcategory_id, unit=excluded.unit, in_stock=excluded.in_stock, stock_qty=excluded.stock_qty, is_offer=excluded.is_offer, is_featured=excluded.is_featured, rating=excluded.rating, review_count=excluded.review_count, image=excluded.image;\n`;
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, sql, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Categories: ${categories.length}, Subcategories: ${categories.reduce((a, c) => a + (c.subcategories?.length || 0), 0)}, Products: ${products.length}`);
