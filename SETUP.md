# Configuración de Saberes Científicos

Esta guía te lleva, paso a paso, a dejar el sitio funcionando con su panel de
administración. **Solo se hace una vez.** No necesitas saber programar: es
copiar, pegar y hacer clic.

> Resumen: 1) crear proyecto en Supabase · 2) pegar el SQL · 3) crear tu usuario
> admin · 4) pegar 2 claves · 5) listo.

---

## 1. Crear el proyecto en Supabase (gratis)

1. Entra a <https://supabase.com> y crea una cuenta (puedes usar tu correo de Google).
2. Haz clic en **New project**.
3. Ponle un nombre (ej. `saberes-cientificos`), elige una **contraseña de base de
   datos** (guárdala) y la región más cercana. Crea el proyecto y espera ~2 min.

## 2. Crear las tablas (pegar el SQL)

1. En el menú lateral de Supabase entra a **SQL Editor** → **New query**.
2. Abre el archivo [`supabase/schema.sql`](supabase/schema.sql) de este proyecto,
   copia **todo** su contenido y pégalo.
3. Pulsa **Run**. Debe decir *Success*. (Puedes ejecutarlo de nuevo sin problema si
   hiciera falta.)

Esto crea todas las tablas, la seguridad, los espacios para fotos/PDF y algunos
datos de ejemplo (2 categorías y un artículo de bienvenida).

## 3. Crear tu usuario administrador

1. En Supabase ve a **Authentication** → **Users** → **Add user** →
   **Create new user**.
2. Escribe **tu correo** y una **contraseña**. Marca *Auto Confirm User* (para no
   tener que confirmar por email). Crea el usuario.
3. Ahora autoriza ese usuario como administrador: vuelve a **SQL Editor** y ejecuta
   esto (cambia el correo por el tuyo):

   ```sql
   insert into public.admins (user_id, email)
   select id, email from auth.users where email = 'TU_CORREO@gmail.com'
   on conflict (user_id) do nothing;
   ```

   > Para añadir más administradores en el futuro, repite los pasos 1 y 3 con otro correo.

## 4. Conectar la web con Supabase (las 2 claves)

1. En Supabase ve a **Project Settings** (engranaje) → **API**.
2. Copia el **Project URL** y el **anon public** key.
3. En la carpeta del proyecto, copia el archivo `.env.example` y renómbralo a
   **`.env.local`**. Ábrelo y pega tus valores:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

## 5. Configurar el correo de recuperación de contraseña

Para que el botón **"¿Olvidaste tu contraseña?"** funcione:

1. En Supabase ve a **Authentication** → **URL Configuration**.
2. En **Site URL** pon la dirección de tu sitio (en pruebas: `http://localhost:3000`;
   en producción: tu dominio de Vercel, ej. `https://saberes.vercel.app`).
3. En **Redirect URLs** agrega **ambas**:
   - `http://localhost:3000/auth/callback`
   - `https://TU-DOMINIO.vercel.app/auth/callback`

> El correo de recuperación lo envía Supabase automáticamente. En el plan gratuito
> hay un límite de correos por hora, suficiente para uso normal. Si quieres tu
> propio remitente, puedes configurar un SMTP en *Authentication → Emails*.

---

## Probar en tu computadora

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>. Para administrar, entra a
<http://localhost:3000/admin> e inicia sesión con el correo y contraseña del paso 3.

## Publicar en Vercel

1. Sube el proyecto a GitHub.
2. En <https://vercel.com> importa el repositorio (detecta Next.js solo).
3. En **Settings → Environment Variables** agrega las mismas dos variables del
   `.env.local` (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. **Deploy**. Luego vuelve al paso 5 y agrega tu dominio de Vercel a las
   *Redirect URLs* de Supabase.

---

## ¿Qué puedo hacer desde /admin?

- **Artículos**: crear, editar y borrar posts con el editor visual (negritas,
  títulos, listas, enlaces, imágenes). Elegir su categoría (#) y publicarlos.
- **Categorías (#)**: crear las etiquetas del blog y decidir en qué sección salen.
- **Galerías de fotos**: subir, reordenar y borrar fotos de cada sección.
- **Recursos**: subir guías en PDF y agregar enlaces a videos.
- **Carreras**: lista de carreras con su pensum en PDF.
- **Textos y enlaces**: cambiar los textos de cualquier sección y tus redes
  (Instagram, YouTube, Telegram, correo, formulario).

Todo se refleja en la web al instante, sin tocar código.
