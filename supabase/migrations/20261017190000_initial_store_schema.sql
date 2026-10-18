-- Vinicôa: first production schema.
-- Public visitors can read published catalog content. All writes go through a
-- trusted server (or a future verified Edge Function), never directly from anon.

create extension if not exists pgcrypto with schema extensions;

create type public.app_role as enum ('customer', 'admin');
create type public.review_status as enum ('pending', 'published', 'rejected');
create type public.order_status as enum (
  'pending_payment', 'paid', 'payment_failed', 'cancelled', 'refunded', 'fulfilled'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text not null unique,
  name text not null,
  color text,
  range text,
  year text,
  volume text,
  price numeric(10, 2) not null check (price >= 0),
  badge text,
  image_url text,
  grapes text,
  description text not null default '',
  characteristics jsonb not null default '{}'::jsonb,
  pairing text,
  awards text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  vendus_product_id text unique,
  vendus_payment_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.featured_products (
  product_id uuid primary key references public.products (id) on delete cascade,
  position integer not null unique check (position >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) <= 320),
  phone text check (phone is null or char_length(phone) <= 40),
  subject text not null check (char_length(subject) <= 80),
  message text not null check (char_length(message) between 1 and 5000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed', 'spam')),
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default extensions.gen_random_uuid(),
  display_name text not null check (char_length(display_name) between 1 and 120),
  product_id uuid references public.products (id) on delete set null,
  rating smallint not null check (rating between 1 and 5),
  title text not null check (char_length(title) between 1 and 80),
  body text not null check (char_length(body) between 20 and 1000),
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- Keep review email addresses separate from the public review content.
create table public.review_submitters (
  review_id uuid primary key references public.reviews (id) on delete cascade,
  email text not null check (char_length(email) <= 320),
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text not null check (char_length(email) <= 320),
  customer_name text not null check (char_length(customer_name) between 1 and 160),
  phone text not null check (char_length(phone) <= 40),
  shipping_address text not null,
  postal_code text not null check (char_length(postal_code) <= 24),
  city text not null check (char_length(city) <= 120),
  tax_id text check (tax_id is null or char_length(tax_id) <= 32),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  shipping_cost numeric(10, 2) not null default 0 check (shipping_cost >= 0),
  total numeric(10, 2) not null check (total >= 0),
  currency char(3) not null default 'EUR',
  status public.order_status not null default 'pending_payment',
  payment_provider text,
  payment_reference text,
  payment_url text,
  vendus_document_id text,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  product_reference text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  line_total numeric(10, 2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create index products_active_idx on public.products (is_active, name);
create index featured_products_active_position_idx on public.featured_products (is_active, position);
create index reviews_publication_idx on public.reviews (status, created_at desc);
create index contact_messages_status_date_idx on public.contact_messages (status, created_at desc);
create index orders_status_date_idx on public.orders (status, created_at desc);
create index orders_user_id_idx on public.orders (user_id, created_at desc);
create index order_items_order_id_idx on public.order_items (order_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Safe for RLS checks: it reveals only the current caller's admin flag.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'::public.app_role
  );
$$;
revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.featured_products enable row level security;
alter table public.contact_messages enable row level security;
alter table public.reviews enable row level security;
alter table public.review_submitters enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Explicit least-privilege grants: no public direct writes, including forms.
revoke all on public.profiles, public.products, public.featured_products,
  public.contact_messages, public.reviews, public.orders, public.order_items
  from anon, authenticated;
revoke all on public.review_submitters from anon, authenticated;

grant select on public.products, public.featured_products, public.reviews to anon, authenticated;
grant select on public.profiles, public.contact_messages, public.orders, public.order_items to authenticated;
grant update on public.profiles to authenticated;
grant select on public.review_submitters to authenticated;
grant insert, update, delete on public.products, public.featured_products to authenticated;
grant update on public.contact_messages, public.reviews, public.orders to authenticated;

-- Public catalog and only explicitly published content.
create policy "Anyone can read active products"
  on public.products for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "Admins manage products"
  on public.products for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Anyone can read active featured products"
  on public.featured_products for select to anon, authenticated
  using (is_active or (select public.is_admin()));
create policy "Admins manage featured products"
  on public.featured_products for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Anyone can read published reviews"
  on public.reviews for select to anon, authenticated
  using (status = 'published' or (select public.is_admin()));
create policy "Admins moderate reviews"
  on public.reviews for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can read private review submitter details"
  on public.review_submitters for select to authenticated
  using ((select public.is_admin()));

create policy "Users can read own profile and admins can read all"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));
create policy "Admins manage profiles"
  on public.profiles for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins manage contact messages"
  on public.contact_messages for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage orders"
  on public.orders for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage order items"
  on public.order_items for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- service_role is used only by trusted server-side handlers and bypasses RLS.
grant all on public.profiles, public.products, public.featured_products,
  public.contact_messages, public.reviews, public.review_submitters, public.orders, public.order_items to service_role;

