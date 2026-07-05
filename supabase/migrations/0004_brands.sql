-- نرجس — الشركات/العلامات التجارية + ربط المنتجات بها

create table if not exists public.brands (
  id           text primary key,
  name_ar      text not null,
  name_en      text,
  logo         text,
  founded_year int,
  country      text,
  blurb        text,
  tint         text
);
alter table public.brands enable row level security;
drop policy if exists "brands_read" on public.brands;
create policy "brands_read" on public.brands for select using (true);
drop policy if exists "brands_write" on public.brands;
create policy "brands_write" on public.brands for all
  using (public.has_role(array['admin','cashier']))
  with check (public.has_role(array['admin','cashier']));

alter table public.products add column if not exists brand_id text references public.brands(id) on delete set null;
create index if not exists idx_products_brand on public.products(brand_id);

-- العلامات
insert into public.brands (id, name_ar, name_en, logo, founded_year, country, blurb, tint) values ('almarai', 'المراعي', 'Almarai', '🐄', 1977, 'السعودية 🇸🇦', 'أكبر شركة ألبان متكاملة في العالم — بدأت بمزرعة واحدة في الخرج!', '#E3F2FD') on conflict (id) do update set name_ar=excluded.name_ar, logo=excluded.logo, founded_year=excluded.founded_year, country=excluded.country, blurb=excluded.blurb, tint=excluded.tint;
insert into public.brands (id, name_ar, name_en, logo, founded_year, country, blurb, tint) values ('nadec', 'نادك', 'NADEC', '🥛', 1981, 'السعودية 🇸🇦', 'تملك واحدة من أكبر مزارع الألبان بالشرق الأوسط في حرض.', '#E8F5E9') on conflict (id) do update set name_ar=excluded.name_ar, logo=excluded.logo, founded_year=excluded.founded_year, country=excluded.country, blurb=excluded.blurb, tint=excluded.tint;
insert into public.brands (id, name_ar, name_en, logo, founded_year, country, blurb, tint) values ('alsafi', 'الصافي دانون', 'Al Safi Danone', '🧀', 1979, 'السعودية 🇸🇦', 'دخلت موسوعة غينيس بأكبر مزرعة أبقار متكاملة في العالم.', '#FFF8E1') on conflict (id) do update set name_ar=excluded.name_ar, logo=excluded.logo, founded_year=excluded.founded_year, country=excluded.country, blurb=excluded.blurb, tint=excluded.tint;
insert into public.brands (id, name_ar, name_en, logo, founded_year, country, blurb, tint) values ('alwatania', 'دواجن الوطنية', 'Al Watania', '🐔', 1977, 'السعودية 🇸🇦', 'أكبر منتج دواجن في الشرق الأوسط — من القصيم إلى كل السعودية.', '#FBE9E7') on conflict (id) do update set name_ar=excluded.name_ar, logo=excluded.logo, founded_year=excluded.founded_year, country=excluded.country, blurb=excluded.blurb, tint=excluded.tint;
insert into public.brands (id, name_ar, name_en, logo, founded_year, country, blurb, tint) values ('halwani', 'حلواني إخوان', 'Halwani Bros', '🍯', 1952, 'السعودية 🇸🇦', 'أقدم شركة في قائمتنا — طحينة وحلاوة من جدة منذ أكثر من 70 عاماً.', '#F3E5F5') on conflict (id) do update set name_ar=excluded.name_ar, logo=excluded.logo, founded_year=excluded.founded_year, country=excluded.country, blurb=excluded.blurb, tint=excluded.tint;
insert into public.brands (id, name_ar, name_en, logo, founded_year, country, blurb, tint) values ('alalali', 'العلالي', 'Al Alali', '🥫', 1974, 'السعودية 🇸🇦', 'معلّبات في كل مطبخ سعودي — من الذرة إلى صلصة الطماطم.', '#E0F7FA') on conflict (id) do update set name_ar=excluded.name_ar, logo=excluded.logo, founded_year=excluded.founded_year, country=excluded.country, blurb=excluded.blurb, tint=excluded.tint;
insert into public.brands (id, name_ar, name_en, logo, founded_year, country, blurb, tint) values ('afia', 'العافية', 'Afia', '🌻', 1979, 'السعودية 🇸🇦', 'زيت المطبخ الأشهر في المملكة — من مجموعة صافولا.', '#FFF3E0') on conflict (id) do update set name_ar=excluded.name_ar, logo=excluded.logo, founded_year=excluded.founded_year, country=excluded.country, blurb=excluded.blurb, tint=excluded.tint;
insert into public.brands (id, name_ar, name_en, logo, founded_year, country, blurb, tint) values ('nestle', 'نستله', 'Nestlé', '☕', 1866, 'سويسرا 🇨🇭', 'أقدم شركة عالمية عندنا — عمرها أكثر من 150 سنة!', '#EFEBE9') on conflict (id) do update set name_ar=excluded.name_ar, logo=excluded.logo, founded_year=excluded.founded_year, country=excluded.country, blurb=excluded.blurb, tint=excluded.tint;
insert into public.brands (id, name_ar, name_en, logo, founded_year, country, blurb, tint) values ('pepsi', 'بيبسي', 'PepsiCo', '🥤', 1893, 'أمريكا 🇺🇸', 'وصلت السعودية في الخمسينات وصارت مشروب الكبسة الرسمي غير الرسمي.', '#E8EAF6') on conflict (id) do update set name_ar=excluded.name_ar, logo=excluded.logo, founded_year=excluded.founded_year, country=excluded.country, blurb=excluded.blurb, tint=excluded.tint;
insert into public.brands (id, name_ar, name_en, logo, founded_year, country, blurb, tint) values ('lipton', 'ليبتون', 'Lipton', '🫖', 1890, 'بريطانيا 🇬🇧', 'الشاي الأصفر الذي لا يغيب عن أي استراحة سعودية.', '#F9FBE7') on conflict (id) do update set name_ar=excluded.name_ar, logo=excluded.logo, founded_year=excluded.founded_year, country=excluded.country, blurb=excluded.blurb, tint=excluded.tint;

-- وسم المنتجات الحالية
update public.products set brand_id = 'almarai' where id in ('p007', 'p009', 'p011', 'p044', 'p093', 'p094', 'p095');
update public.products set brand_id = 'alwatania' where id in ('p010', 'p012', 'p014', 'p048', 'p103');
update public.products set brand_id = 'nadec' where id in ('p041', 'p056', 'p096', 'p097');
update public.products set brand_id = 'alsafi' where id in ('p045', 'p098');
update public.products set brand_id = 'nestle' where id in ('p015', 'p018');
update public.products set brand_id = 'pepsi' where id in ('p053');
update public.products set brand_id = 'lipton' where id in ('p054');
update public.products set brand_id = 'afia' where id in ('p020', 'p104');
update public.products set brand_id = 'halwani' where id in ('p099', 'p100');
update public.products set brand_id = 'alalali' where id in ('p101', 'p102');

-- منتجات الشركات الجديدة
insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image, brand_id) values ('p093', 'عصير المراعي برتقال طازج 1 لتر', 7.5, 8.5, 'beverages', 'juices', 'قطعة', true, 140, true, true, 4.7, 321, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&q=80', 'almarai') on conflict (id) do nothing;
insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image, brand_id) values ('p094', 'جبن المراعي شرائح شيدر 200جم', 11.5, 11.5, 'dairy-eggs', 'cheese', 'قطعة', true, 110, false, false, 4.6, 208, 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=300&q=80', 'almarai') on conflict (id) do nothing;
insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image, brand_id) values ('p095', 'لبن المراعي كامل الدسم 2 لتر', 8.5, 8.5, 'dairy-eggs', 'yogurt', 'قطعة', true, 160, false, true, 4.8, 402, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80', 'almarai') on conflict (id) do nothing;
insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image, brand_id) values ('p096', 'زبدة نادك الطبيعية 500جم', 24, 27, 'dairy-eggs', 'milk', 'قطعة', true, 70, true, false, 4.6, 154, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&q=80', 'nadec') on conflict (id) do nothing;
insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image, brand_id) values ('p097', 'عصير نادك تفاح 100% طبيعي 1 لتر', 6.25, 6.25, 'beverages', 'juices', 'قطعة', true, 130, false, false, 4.5, 176, 'https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=300&q=80', 'nadec') on conflict (id) do nothing;
insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image, brand_id) values ('p098', 'حليب الصافي الطازج 1.8 لتر', 8.75, 8.75, 'dairy-eggs', 'milk', 'قطعة', true, 145, false, true, 4.7, 289, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80', 'alsafi') on conflict (id) do nothing;
insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image, brand_id) values ('p099', 'طحينة حلواني إخوان 400جم', 14.5, 14.5, 'grains-staples', 'oils', 'قطعة', true, 85, false, false, 4.8, 231, 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=300&q=80', 'halwani') on conflict (id) do nothing;
insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image, brand_id) values ('p100', 'حلاوة طحينية حلواني بالفستق 450جم', 16, 19, 'snacks', 'biscuits', 'علبة', true, 95, true, true, 4.9, 340, 'https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=300&q=80', 'halwani') on conflict (id) do nothing;
insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image, brand_id) values ('p101', 'ذرة حلوة العلالي 340جم', 5.5, 5.5, 'grains-staples', 'rice', 'علبة', true, 200, false, false, 4.5, 188, 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&q=80', 'alalali') on conflict (id) do nothing;
insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image, brand_id) values ('p102', 'صلصة طماطم العلالي 135جم × 8', 12, 14, 'grains-staples', 'rice', 'عبوة', true, 150, true, false, 4.6, 264, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80', 'alalali') on conflict (id) do nothing;
insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image, brand_id) values ('p103', 'بيض الوطنية أوميغا 3 — 15 بيضة', 14, 14, 'dairy-eggs', 'eggs', 'طبق', true, 120, false, false, 4.7, 198, 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300&q=80', 'alwatania') on conflict (id) do nothing;
insert into public.products (id, name_ar, price, original_price, category_id, subcategory_id, unit, in_stock, stock_qty, is_offer, is_featured, rating, review_count, image, brand_id) values ('p104', 'زيت العافية دوار الشمس 2.9 لتر', 33, 38, 'grains-staples', 'oils', 'قطعة', true, 90, true, true, 4.7, 356, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80', 'afia') on conflict (id) do nothing;
