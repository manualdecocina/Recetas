# Manual de Cocina — v0.3 (cierre de infraestructura)

Next.js 14 (App Router) + TypeScript + Supabase. Multilingüe: es, de, ja, it, fr, en.
Esta fase cierra la infraestructura pública, el contrato SEO/routing, seguridad de base y el
modelo de recuperación de URLs históricas. El contenido editorial multilingüe se reconstruye
por etapas y se guarda como datos nuevos, no como copia ciega del WordPress antiguo.

## Puesta en marcha

1. `npm install`
2. `cp .env.example .env.local` y rellenar (Supabase → Project Settings → API).
3. `npm run dev` → http://localhost:3000 (redirige a /es).

Configurar las mismas variables en Hostinger para preview/producción.
En `preview.manualdecocina.com` dejar `NEXT_PUBLIC_ALLOW_INDEXING=false`.

## Dar de alta al primer administrador (una sola vez)

No hay registro público. En el dashboard de Supabase:

1. Authentication → Sign In / Providers → desactivar "Allow new users to sign up".
2. Authentication → Users → Add user → email + contraseña (mín. 8 caracteres).
3. SQL Editor:
   ```sql
   insert into public.admins (user_id, email)
   select id, email from auth.users where email = 'TU_EMAIL_AQUI';
   ```
Un usuario que inicia sesión pero no está en `admins` ve "Sin permisos" y no puede
leer borradores ni escribir (lo impide la RLS, no solo la interfaz).

## Reglas de datos (contrato — no romper)

- Crear plato nuevo: solo `create_recipe(...)` → la base de datos genera `recipe_group_id`.
- Crear traducción: solo `create_recipe_translation(...)`. El formulario envía el id de la
  receta ORIGEN; el servidor resuelve el grupo. El formulario nunca contiene `recipe_group_id`.
- Editar: solo `update_recipe(...)`. Idioma y grupo no se pueden cambiar (trigger en BD).
- `published_at` lo controla la base de datos:
  - se fija la primera vez que la receta se publica;
  - despublicar no lo borra;
  - republicar conserva la fecha original;
  - cualquier intento de escribirlo a mano se ignora.
- Toda entrada del formulario se valida en runtime con Zod (`src/lib/validation.ts`).
- Imágenes: solo https y dominios permitidos (Supabase + `NEXT_PUBLIC_IMAGE_HOSTS`).
- `public_path` define la URL pública/canónica. Si existe una URL histórica recuperable, esa URL se conserva.
- Las nuevas traducciones pueden introducir una URL histórica en `public_path`; si se omite, la BD genera `/idioma/receta/slug`.

## Estado de verificación v0.3

| Qué | Resultado | Dónde |
|---|---|---|
| Reglas de BD y permisos por rol | **Ejecutado: VERIFICACION_OK, 32/32** contra Supabase real | `supabase/tests/verificacion.sql` |
| Linter de seguridad de Supabase | **Actual: 1 warning de seguridad** (Leaked Password Protection); performance 0 | dashboard → Advisors |
| Lógica SEO (canonical, hreflang, x-default, robots, sitemap) | **Ejecutado: OK** con URLs públicas históricas | `npm run test:logic` |
| Sintaxis TypeScript de `src/` | **Ejecutado: sin errores de sintaxis** | — |
| `npm install` / `npm run typecheck` / `npm run build` | **Pendiente de ejecución real en Hostinger/CI**: este entorno no dispone de `node_modules` ni acceso de red | `docs/PRODUCTION-GATE-20260924.md` |
| Pruebas funcionales HTTP (middleware, login, CRUD en navegador, `<html lang>`, caché) | **NO ejecutado**: requiere la app corriendo | lista abajo |

## Cómo probar

```bash
npm install
npm run typecheck
npm run build        # /[lang] y /[lang]/receta/[slug] deben salir como ● (ISR), /[lang]/recetas como ƒ
npm run test:logic   # 14 pruebas de SEO/robots/sitemap, sin red ni base de datos
npm run start        # probar caché con start, no con dev
```

Base de datos: pegar `supabase/tests/verificacion.sql` en el SQL Editor de Supabase.
Resultado esperado: un error cuyo texto empieza por `VERIFICACION_OK` (se revierte solo).

Pruebas funcionales en navegador:

1. `/` → redirige 308 a `/es`.
2. `/admin` sin sesión → `/admin/login`.
3. Contraseña errónea → "Email o contraseña incorrectos."
4. Usuario autenticado NO admin → pantalla "Sin permisos"; no ve borradores.
5. Admin → crear borrador → no aparece en `/es` ni en `/es/recetas` ni en sitemap.
6. Publicar → aparece primera en `/es` en la primera recarga (sin esperar).
7. Despublicar → desaparece; su URL da 404.
8. Republicar → vuelve en su posición original (fecha conservada).
9. "Añadir traducción" → solo ofrece idiomas que faltan; la receta hermana muestra el
   nuevo `<link rel="alternate" hreflang>` en su código fuente.
10. Eliminar → desaparece de home, listado, sitemap y hreflang de las hermanas.
11. Ver código fuente: `/es/...` → `<html lang="es">`, `/de/...` → `lang="de"`,
    `/ja/...` → `lang="ja"`, `/admin` → `lang="es"`.
12. `/robots.txt` y `/sitemap.xml` con `NEXT_PUBLIC_ALLOW_INDEXING` en `false` y `true`.
13. `/es/recetas?page=999`, `/xx`, `/es/no/existe` → 404 real.

## Estructura

```
src/middleware.ts                 / → /es (308) y protección de /admin/*
src/app/[lang]/layout.tsx         layout raíz público: <html lang={idioma}>
src/app/admin/layout.tsx          layout raíz del panel: <html lang="es">, noindex
src/app/[lang]/[...rest]          cualquier ruta inexistente → 404 con su idioma
src/lib/supabase/public.ts        cliente público, fetch etiquetado 'recipes' (caché)
src/lib/supabase/server.ts        cliente con sesión, fetch no-store (panel)
src/lib/supabase/admin-guard.ts   requireAdmin(): sesión + tabla admins
src/lib/cache.ts                  etiqueta y respaldo de caché
src/lib/validation.ts             Zod + parseo de ingredientes/pasos
src/lib/seo.ts                    canonical / hreflang / x-default
src/app/admin/actions.ts          Server Actions (solo RPC; revalidateTag tras escribir)
src/app/sitemap.ts, robots.ts
supabase/schema.sql               baseline v0.3 válido; producción se reproduce con `supabase/migrations/`
supabase/migrations/              historial de migraciones aplicadas
supabase/tests/verificacion.sql   32 comprobaciones de BD
supabase/proposals/               borradores NO aplicados (importación histórica)
docs/cache.md                     invalidación de caché por evento
docs/importacion-historica.md     diseño de importación con fecha original
tests/logic/                      pruebas de lógica SEO/sitemap
```

## Pendiente de decisión (no implementado a propósito)

- Modelo de categorías (hoy `text` libre por idioma) y normalización de JSONB.
- Detección anti-canibalización (similitud de títulos/ingredientes) al crear.
- Subida de imágenes a Supabase Storage desde el panel (hoy se pega una URL).
- Implementar la importación histórica (diseño listo en `docs/importacion-historica.md`).
- Ruta de revalidación protegida para cambios hechos fuera del panel.
- Redirecciones 301 solo para cambios reales de URL; las URLs históricas recuperadas se sirven directamente mediante `public_path`.
- El estado operativo de publicación está en `docs/PRODUCTION-GATE-20260924.md`.
- Sitemap dividido (`generateSitemaps`) al acercarse a 50.000 URLs.
