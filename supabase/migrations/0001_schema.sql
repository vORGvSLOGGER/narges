-- نرجس سوبرماركت — المخطط الأساسي
-- شغّل هذا الملف أولاً في Supabase → SQL Editor

-- ============ الأقسام ============
create table if not exists public.categories (
  id           text primary key,
  name_ar      text not null,
  icon         text,
  color        text,
  icon_bg      text,
  product_count int default 0,
  sort_order   int default 0
);

create table if not exists public.subcategories (
  id          text primary key,
  category_id text not null references public.categories(id) on delete cascade,
  name_ar     text not null
);

-- ============ المنتجات ============
create table if not exists public.products (
  id             text primary key,
  name_ar        text not null,
  price          numeric(10,2) not null,
  original_price numeric(10,2),
  category_id    text references public.categories(id) on delete set null,
  subcategory_id text,
  unit           text,
  in_stock       boolean default true,
  stock_qty      int default 0,
  is_offer       boolean default false,
  is_featured    boolean default false,
  rating         numeric(2,1) default 0,
  review_count   int default 0,
  image          text,
  created_at     timestamptz default now()
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_featured on public.products(is_featured) where is_featured;
create index if not exists idx_products_offer on public.products(is_offer) where is_offer;

-- ============ ملفات المستخدمين (أدوار) ============
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  role       text not null default 'customer'
             check (role in ('customer','cashier','delivery','admin')),
  created_at timestamptz default now()
);

-- إنشاء profile تلقائياً عند تسجيل مستخدم جديد
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ الطلبات ============
create table if not exists public.orders (
  id                   uuid primary key default gen_random_uuid(),
  customer_id          uuid references public.profiles(id) on delete set null,
  status               text not null default 'pending'
                       check (status in ('pending','confirmed','preparing','ready','picked_up','delivered','cancelled')),
  customer_name        text,
  customer_phone       text,
  address              jsonb,
  subtotal             numeric(10,2) not null default 0,
  delivery_fee         numeric(10,2) not null default 10,
  discount             numeric(10,2) not null default 0,
  total                numeric(10,2) not null default 0,
  payment_method       text default 'cash',
  payment_status       text default 'pending',
  driver_id            uuid references public.profiles(id) on delete set null,
  notes                text default '',
  created_at           timestamptz default now(),
  estimated_delivery_at timestamptz,
  delivered_at         timestamptz
);

create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_status on public.orders(status);

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  text references public.products(id) on delete set null,
  name_ar     text,
  qty         int not null default 1,
  unit_price  numeric(10,2) not null default 0,
  total_price numeric(10,2) not null default 0
);

create index if not exists idx_order_items_order on public.order_items(order_id);
