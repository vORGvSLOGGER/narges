-- نرجس — إعدادات الموقع المركزية + القسائم (يتحكم بها الأدمن من اللوحة)

create table if not exists public.settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
alter table public.settings enable row level security;
drop policy if exists "settings_read" on public.settings;
create policy "settings_read" on public.settings for select using (true);
drop policy if exists "settings_write" on public.settings;
create policy "settings_write" on public.settings for all
  using (public.has_role(array['admin']))
  with check (public.has_role(array['admin']));

create table if not exists public.coupons (
  id           uuid primary key default gen_random_uuid(),
  code         text unique not null,
  type         text not null default 'percent' check (type in ('percent','fixed')),
  value        numeric(10,2) not null,
  min_subtotal numeric(10,2) default 0,
  max_uses     int,
  used_count   int default 0,
  expires_at   timestamptz,
  active       boolean default true,
  created_at   timestamptz default now()
);
alter table public.coupons enable row level security;
drop policy if exists "coupons_read" on public.coupons;
create policy "coupons_read" on public.coupons for select using (true);
drop policy if exists "coupons_write" on public.coupons;
create policy "coupons_write" on public.coupons for all
  using (public.has_role(array['admin','cashier']))
  with check (public.has_role(array['admin','cashier']));

-- بذور الإعدادات الافتراضية
insert into public.settings(key, value) values
 ('site',     '{"storeName":"نرجس سوبرماركت","phone":"0112345678","city":"الرياض","district":"حي الروضة"}'),
 ('delivery', '{"fee":10,"freeAt":75,"minOrder":20,"etaMinutes":40}'),
 ('loyalty',  '{"earnPerSar":1,"redeemPer100":5}'),
 ('theme',    '{"primary":"#2E7D32","accent":"#FF7A00","defaultMode":"dark"}')
on conflict (key) do nothing;
