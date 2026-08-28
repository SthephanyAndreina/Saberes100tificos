-- ============================================================================
-- Migración: categorías de estudio para la sección "Recursos"
-- ----------------------------------------------------------------------------
-- Ejecuta este archivo en Supabase → SQL Editor si YA tienes la base de datos
-- creada y solo quieres añadir el sistema de categorías de Recursos sin volver
-- a correr todo schema.sql. Es seguro ejecutarlo varias veces.
-- ============================================================================

create extension if not exists pgcrypto;

-- 1) Tabla de categorías de estudio (matemáticas, física, química…).
create table if not exists public.resource_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique not null,
  color      text default '#00838F',
  sort_order int  default 0,
  created_at timestamptz not null default now()
);

-- 2) Relación de cada recurso con una categoría (opcional).
alter table public.resources
  add column if not exists category_id uuid references public.resource_categories(id) on delete set null;

-- 3) RLS: lectura pública, escritura solo para administradores.
alter table public.resource_categories enable row level security;

drop policy if exists "resource_categories read" on public.resource_categories;
create policy "resource_categories read" on public.resource_categories
  for select using (true);

drop policy if exists "resource_categories admin write" on public.resource_categories;
create policy "resource_categories admin write" on public.resource_categories
  for all using (public.is_admin()) with check (public.is_admin());

-- 4) Categorías de ejemplo (puedes editarlas o borrarlas desde el panel).
insert into public.resource_categories (name, slug, color, sort_order) values
  ('Matemáticas', 'matematicas', '#00838F', 1),
  ('Física',      'fisica',      '#9C27B0', 2),
  ('Química',     'quimica',     '#FCA210', 3)
on conflict (slug) do nothing;
