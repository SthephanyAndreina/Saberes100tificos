# Saberes Científicos

Sitio web y **blog gestionable sin código** del Servicio Comunitario *Saberes
Científicos* de la Universidad Simón Bolívar. Hecho con **Next.js** + **Supabase**
y desplegable en **Vercel**.

## ¿Qué incluye?

- Menú con 8 secciones: Inicio, Saberes Científicos, Actividades, Divulgación,
  Recursos, Orientación Vocacional, Contáctanos y Blog.
- **Blog** con artículos por categoría (#), buscadores y editor visual **TipTap**.
- **Galerías de fotos** editables, **recursos** (guías PDF + videos), **carreras**
  con pensum y página de **contacto**.
- **Panel `/admin`** con login por correo y **recuperación de contraseña por email**,
  para crear/editar/borrar todo el contenido sin tocar código.

## Puesta en marcha

👉 Sigue la guía paso a paso en **[SETUP.md](SETUP.md)** (crear el proyecto de
Supabase, pegar el SQL, crear tu usuario admin y configurar las claves).

Una vez configurado:

```bash
npm install
npm run dev
```

- Sitio: <http://localhost:3000>
- Administración: <http://localhost:3000/admin>

## Estructura

| Carpeta | Qué contiene |
|---------|--------------|
| `app/(public)/` | Páginas públicas del sitio (las 8 secciones + blog) |
| `app/admin/` | Panel de administración (login, recuperación y CRUD) |
| `app/auth/callback/` | Maneja el enlace de recuperación de contraseña |
| `components/` | Componentes de UI (layout, blog, galería, admin) |
| `lib/` | Cliente de Supabase, consultas, tema y contenidos por defecto |
| `supabase/schema.sql` | Esquema de la base de datos (tablas, seguridad, storage) |
| `middleware.js` | Protege las rutas de `/admin` |

## Tecnologías

- **Next.js 14** (App Router)
- **Supabase**: base de datos (Postgres), autenticación y almacenamiento de archivos
- **TipTap**: editor de texto enriquecido para los artículos

> Solo necesitas tocar código para cambiar la arquitectura o el diseño. Todo el
> contenido (textos, fotos, artículos, enlaces) se administra desde `/admin`.
