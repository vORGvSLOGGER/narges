-- نرجس سوبرماركت — سياسات الأمان (Row Level Security)
-- شغّل هذا الملف بعد 0001_schema.sql

-- دالة مساعدة: هل المستخدم الحالي له أحد الأدوار المطلوبة؟
create or replace function public.has_role(roles text[])
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = any(roles)
  );
$$;

-- ============ تفعيل RLS ============
alter table public.categories     enable row level security;
alter table public.subcategories  enable row level security;
alter table public.products       enable row level security;
alter table public.profiles       enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;

-- ============ الأقسام / المنتجات: قراءة للعموم، كتابة لـ admin/cashier ============
drop policy if exists "categories_read" on public.categories;
create policy "categories_read" on public.categories for select using (true);
drop policy if exists "categories_write" on public.categories;
create policy "categories_write" on public.categories for all
  using (public.has_role(array['admin','cashier']))
  with check (public.has_role(array['admin','cashier']));

drop policy if exists "subcategories_read" on public.subcategories;
create policy "subcategories_read" on public.subcategories for select using (true);
drop policy if exists "subcategories_write" on public.subcategories;
create policy "subcategories_write" on public.subcategories for all
  using (public.has_role(array['admin','cashier']))
  with check (public.has_role(array['admin','cashier']));

drop policy if exists "products_read" on public.products;
create policy "products_read" on public.products for select using (true);
drop policy if exists "products_write" on public.products;
create policy "products_write" on public.products for all
  using (public.has_role(array['admin','cashier']))
  with check (public.has_role(array['admin','cashier']));

-- ============ الملفات الشخصية ============
drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own" on public.profiles for select
  using (id = auth.uid() or public.has_role(array['admin']));
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ============ الطلبات ============
-- العميل يقرأ طلباته؛ الموظفون يقرؤون الكل
drop policy if exists "orders_read" on public.orders;
create policy "orders_read" on public.orders for select
  using (customer_id = auth.uid() or public.has_role(array['admin','cashier','delivery']));
-- العميل يُنشئ طلباته
drop policy if exists "orders_insert" on public.orders;
create policy "orders_insert" on public.orders for insert
  with check (customer_id = auth.uid());
-- الموظفون يحدّثون حالة الطلبات
drop policy if exists "orders_update_staff" on public.orders;
create policy "orders_update_staff" on public.orders for update
  using (public.has_role(array['admin','cashier','delivery']))
  with check (public.has_role(array['admin','cashier','delivery']));

-- ============ عناصر الطلب (تابعة لصلاحية الطلب الأب) ============
drop policy if exists "order_items_read" on public.order_items;
create policy "order_items_read" on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.customer_id = auth.uid() or public.has_role(array['admin','cashier','delivery']))
    )
  );
drop policy if exists "order_items_insert" on public.order_items;
create policy "order_items_insert" on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_id = auth.uid()
    )
  );
