-- TechPods Mtr - Supabase schema
-- Ejecutar en el SQL Editor de Supabase.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('administrador', 'cliente');
  end if;

  if not exists (select 1 from pg_type where typname = 'product_state') then
    create type public.product_state as enum ('activo', 'inactivo', 'agotado');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role public.app_role not null default 'cliente',
  created_at timestamptz not null default now()
);

create table if not exists public.categorias (
  id bigserial primary key,
  nombre text not null unique,
  orden int not null default 0,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.categorias (nombre, orden)
values
  ('Celulares', 1),
  ('Auriculares', 2),
  ('Smartwatch', 3),
  ('Tablets', 4),
  ('Parlantes', 5),
  ('Cargadores', 6),
  ('Accesorios', 7)
on conflict (nombre) do nothing;

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  marca text not null,
  modelo text not null,
  categoria text not null references public.categorias(nombre) on update cascade,
  descripcion text not null,
  almacenamiento text,
  ram text,
  color text,
  porcentaje_bateria int check (porcentaje_bateria is null or porcentaje_bateria between 0 and 100),
  precio numeric(12, 2) not null check (precio >= 0),
  precio_anterior numeric(12, 2) check (precio_anterior is null or precio_anterior >= precio),
  stock int not null default 0 check (stock >= 0),
  destacado boolean not null default false,
  imagen text,
  estado public.product_state not null default 'activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promociones (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  nombre text not null,
  descuento_porcentaje numeric(5, 2) check (descuento_porcentaje is null or descuento_porcentaje between 0 and 100),
  precio_promocional numeric(12, 2) check (precio_promocional is null or precio_promocional >= 0),
  inicia_en timestamptz,
  termina_en timestamptz,
  activa boolean not null default true,
  created_at timestamptz not null default now(),
  constraint promocion_valor_check check (descuento_porcentaje is not null or precio_promocional is not null)
);

create index if not exists productos_categoria_idx on public.productos (categoria);
create index if not exists productos_estado_idx on public.productos (estado);
create index if not exists productos_destacado_idx on public.productos (destacado);
create index if not exists productos_created_at_idx on public.productos (created_at desc);
create index if not exists productos_busqueda_idx on public.productos using gin (
  to_tsvector('spanish', coalesce(nombre, '') || ' ' || coalesce(marca, '') || ' ' || coalesce(modelo, '') || ' ' || coalesce(categoria, ''))
);
create index if not exists promociones_producto_idx on public.promociones (producto_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists productos_set_updated_at on public.productos;
create trigger productos_set_updated_at
before update on public.productos
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, coalesce(new.email, ''), 'cliente')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role = 'administrador'
  );
$$;

create or replace view public.catalogo_productos as
select
  id,
  nombre,
  marca,
  modelo,
  categoria,
  descripcion,
  almacenamiento,
  ram,
  color,
  porcentaje_bateria,
  precio,
  precio_anterior,
  destacado,
  imagen,
  estado,
  created_at
from public.productos
where estado = 'activo';

alter table public.profiles enable row level security;
alter table public.categorias enable row level security;
alter table public.productos enable row level security;
alter table public.promociones enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
on public.profiles
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "categorias_public_select" on public.categorias;
create policy "categorias_public_select"
on public.categorias
for select
to anon, authenticated
using (activa = true);

drop policy if exists "categorias_admin_all" on public.categorias;
create policy "categorias_admin_all"
on public.categorias
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "productos_admin_all" on public.productos;
create policy "productos_admin_all"
on public.productos
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "promociones_admin_all" on public.promociones;
create policy "promociones_admin_all"
on public.promociones
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "promociones_public_select" on public.promociones;
create policy "promociones_public_select"
on public.promociones
for select
to anon, authenticated
using (
  activa = true
  and (inicia_en is null or inicia_en <= now())
  and (termina_en is null or termina_en >= now())
);

revoke all on table public.productos from anon;
revoke all on table public.productos from authenticated;
grant select on public.catalogo_productos to anon, authenticated;
grant select on public.categorias to anon, authenticated;
grant select, insert, update, delete on public.productos to authenticated;
grant select, insert, update, delete on public.promociones to authenticated;
grant select on public.profiles to authenticated;
grant update on public.profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'productos',
  'productos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "productos_storage_public_read" on storage.objects;
create policy "productos_storage_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'productos');

drop policy if exists "productos_storage_admin_insert" on storage.objects;
create policy "productos_storage_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'productos' and public.is_admin(auth.uid()));

drop policy if exists "productos_storage_admin_update" on storage.objects;
create policy "productos_storage_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'productos' and public.is_admin(auth.uid()))
with check (bucket_id = 'productos' and public.is_admin(auth.uid()));

drop policy if exists "productos_storage_admin_delete" on storage.objects;
create policy "productos_storage_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'productos' and public.is_admin(auth.uid()));

