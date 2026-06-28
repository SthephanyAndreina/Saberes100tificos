-- ============================================================================
-- Saberes Científicos — Esquema de base de datos para Supabase
-- ----------------------------------------------------------------------------
-- Cómo usar: en el panel de Supabase abre  SQL Editor → New query,
-- pega TODO este archivo y pulsa "Run". Es seguro ejecutarlo varias veces.
-- Después sigue SETUP.md para crear tu usuario administrador.
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================ TABLAS ========================================

-- Administradores: quién puede gestionar el contenido del sitio.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- Categorías (#) de los artículos del blog.
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name       text not null,
  color      text default '#00838F',
  section    text,                       -- 'divulgacion' | 'orientacion' | null
  sort_order int  default 0,
  created_at timestamptz not null default now()
);

-- Artículos del blog.
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text default '',
  content_html text default '',
  cover_url    text,
  category_id  uuid references public.categories(id) on delete set null,
  tags         text[] default '{}',
  status       text not null default 'draft',          -- 'draft' | 'published'
  author       text default 'Saberes Científicos',
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists posts_category_idx on public.posts(category_id);
create index if not exists posts_status_idx   on public.posts(status, published_at desc);

-- Galerías de fotos.
create table if not exists public.galleries (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,
  title       text not null,
  description text default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id         uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  image_url  text not null,
  caption    text default '',
  sort_order int  default 0,
  created_at timestamptz not null default now()
);
create index if not exists gallery_images_gallery_idx on public.gallery_images(gallery_id, sort_order);

-- Recursos: guías de estudio (PDF) y enlaces a videos.
create table if not exists public.resources (
  id          uuid primary key default gen_random_uuid(),
  type        text not null default 'guide_pdf',       -- 'guide_pdf' | 'video_link'
  title       text not null,
  description text default '',
  url         text not null,
  sort_order  int  default 0,
  created_at  timestamptz not null default now()
);

-- Carreras de la USB con enlace a su pensum.
create table if not exists public.carreras (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  pensum_url text,
  sort_order int  default 0,
  created_at timestamptz not null default now()
);

-- Bloques de texto editables del sitio (misión, reseña USB, etc.).
create table if not exists public.site_content (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Ajustes globales (enlaces externos). Fila única id = 1.
create table if not exists public.site_settings (
  id         int primary key default 1,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

-- ===================== FUNCIÓN DE ROL ADMIN =================================
-- security definer + search_path fijo: evita recursión de RLS al consultar admins.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ============================ RLS ===========================================
alter table public.admins        enable row level security;
alter table public.categories    enable row level security;
alter table public.posts         enable row level security;
alter table public.galleries     enable row level security;
alter table public.gallery_images enable row level security;
alter table public.resources     enable row level security;
alter table public.carreras      enable row level security;
alter table public.site_content  enable row level security;
alter table public.site_settings enable row level security;

-- admins: cada usuario puede leer su propia fila (para verificar su rol).
drop policy if exists "admins self read" on public.admins;
create policy "admins self read" on public.admins for select using (user_id = auth.uid());

-- posts: el público ve solo publicados; el admin ve y edita todo.
drop policy if exists "posts public read" on public.posts;
create policy "posts public read" on public.posts for select
  using (status = 'published' or public.is_admin());
drop policy if exists "posts admin write" on public.posts;
create policy "posts admin write" on public.posts for all
  using (public.is_admin()) with check (public.is_admin());

-- Resto de tablas: lectura pública, escritura solo admin.
do $$
declare t text;
begin
  foreach t in array array[
    'categories','galleries','gallery_images','resources',
    'carreras','site_content','site_settings'
  ] loop
    execute format('drop policy if exists "%s read" on public.%I;', t, t);
    execute format('create policy "%s read" on public.%I for select using (true);', t, t);
    execute format('drop policy if exists "%s admin write" on public.%I;', t, t);
    execute format('create policy "%s admin write" on public.%I for all using (public.is_admin()) with check (public.is_admin());', t, t);
  end loop;
end $$;

-- ============================ STORAGE =======================================
insert into storage.buckets (id, name, public) values
  ('gallery','gallery',true),
  ('covers','covers',true),
  ('documents','documents',true)
on conflict (id) do nothing;

drop policy if exists "sc public read"   on storage.objects;
drop policy if exists "sc admin insert"  on storage.objects;
drop policy if exists "sc admin update"  on storage.objects;
drop policy if exists "sc admin delete"  on storage.objects;

create policy "sc public read" on storage.objects for select
  using (bucket_id in ('gallery','covers','documents'));
create policy "sc admin insert" on storage.objects for insert
  with check (bucket_id in ('gallery','covers','documents') and public.is_admin());
create policy "sc admin update" on storage.objects for update
  using (bucket_id in ('gallery','covers','documents') and public.is_admin());
create policy "sc admin delete" on storage.objects for delete
  using (bucket_id in ('gallery','covers','documents') and public.is_admin());

-- ========================= DATOS SEMILLA ====================================
insert into public.categories (slug, name, color, section, sort_order) values
  ('ciencias',               '#Ciencias',                      '#00838F', 'divulgacion', 1),
  ('mecanismo-ingreso-usb',  '#Mecanismo de ingreso a la USB', '#9C27B0', 'orientacion', 2)
on conflict (slug) do nothing;

insert into public.galleries (key, title, description) values
  ('quienes-somos',      'Quiénes somos',                  'Nuestro equipo y actividades de servicio comunitario.'),
  ('taller-orientacion', 'Taller de orientación vocacional','Momentos de nuestros talleres.'),
  ('tour-cientifico',    'Tour científico',                'Recorridos y experiencias científicas.')
on conflict (key) do nothing;

insert into public.site_settings (id, data) values (1, jsonb_build_object(
  'instagram',          'https://www.instagram.com/saberes.cientificos',
  'youtube',            'https://youtube.com/@saberes100tificos',
  'telegram_community', 'https://t.me/+D5zP8NCGARBjM2Yx',
  'telegram_bot',       'https://t.me/SaberesCientificos_bot',
  'email',              'saberes100tificos@gmail.com',
  'google_form',        'https://docs.google.com/forms/d/e/1FAIpQLSfSK73Ai_PIkyqtZz7pV4-w2pmS0gcdkF50qZQ3BJf0fg4Kjg/viewform'
)) on conflict (id) do nothing;

-- Artículo de ejemplo para que el blog no se vea vacío (puedes borrarlo).
insert into public.posts (slug, title, excerpt, content_html, category_id, status, published_at, tags)
select
  'bienvenida-a-saberes-cientificos',
  'Bienvenida a Saberes Científicos',
  'Artículo de ejemplo. Edítalo o crea uno nuevo desde el panel /admin.',
  '<p>¡Hola! 👋 Este es un artículo de ejemplo creado automáticamente. Puedes editarlo o eliminarlo desde el panel de administración en <strong>/admin</strong>.</p><p>Usa el editor visual para escribir tus artículos de divulgación científica.</p>',
  c.id, 'published', now(), array['ejemplo']
from public.categories c where c.slug = 'ciencias'
on conflict (slug) do nothing;
