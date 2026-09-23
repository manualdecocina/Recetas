# Invalidación de caché (Next.js 14 App Router)

Estado: diseñado y revisado contra la documentación de Next 14.
NO verificado en ejecución (npm/build no disponibles en el entorno donde se escribió).
Ver "Cómo verificarlo" al final.

## Mecanismo único

1. Todas las lecturas públicas de recetas usan el cliente `src/lib/supabase/public.ts`,
   cuyo `fetch` añade `next: { tags: ['recipes'], revalidate: 3600 }`.
   Esto hace la caché EXPLÍCITA y evita depender de la heurística de Next 14 para
   peticiones con cabecera `Authorization` (supabase-js siempre la envía).
2. Toda escritura del panel (crear, traducir, editar, publicar, despublicar, eliminar)
   termina en `revalidateTag('recipes')` dentro de una Server Action.
3. Respaldo: `export const revalidate = 3600` en páginas ISR y sitemap. Si una
   invalidación fallara, nada queda obsoleto más de 1 hora.

Se eligió una sola etiqueta (no una por receta) a propósito: publicar o traducir una
receta cambia a la vez la home, el listado, la propia página, el hreflang de TODAS sus
traducciones hermanas y el sitemap. Invalidar todo lo público es correcto y barato
mientras el catálogo sea de cientos/miles de recetas.

## Qué hace revalidateTag en Next 14

- Marca como obsoletas las entradas del Data Cache con esa etiqueta.
- Marca como obsoletas las entradas del Full Route Cache (páginas ISR y rutas
  estáticas como sitemap.xml) que usaron esos datos. Se regeneran en la siguiente
  petición (la primera visita tras el cambio ya recibe contenido nuevo).
- Llamado desde una Server Action, invalida también el Router Cache del navegador
  de quien la ejecuta (el administrador ve el cambio al volver a /admin o al sitio).
- No afecta a otros navegadores: su Router Cache de cliente expira solo (30 s en
  páginas dinámicas, 5 min en estáticas, valores por defecto de Next 14). Solo afecta
  a navegación interna ya abierta; una carga nueva siempre pide al servidor.

## Efecto por evento

| Evento | Home /{lang} | Listado /{lang}/recetas | Página de receta | hreflang de traducciones | sitemap.xml |
|---|---|---|---|---|---|
| Crear borrador | sin cambio visible (no es pública) | igual | no existe públicamente | sin cambio | sin cambio |
| Publicar | aparece (si es de las 13 más recientes) | aparece | pasa de 404 a 200 | las hermanas la añaden | se añade |
| Despublicar | desaparece | desaparece | pasa a 404 | las hermanas la quitan | se quita |
| Republicar | vuelve en su posición ORIGINAL (published_at conservado) | igual | 200 | se añade | se añade |
| Editar título/slug | se actualiza | se actualiza | slug nuevo 200, slug viejo 404 | se actualiza la URL | se actualiza |
| Crear traducción publicada | aparece en su idioma | aparece en su idioma | 200 | todas las hermanas la añaden | se añade con alternates |
| Eliminar | desaparece | desaparece | 404 | las hermanas la quitan | se quita |

Todas las columnas quedan cubiertas por la misma etiqueta porque todas esas lecturas
pasan por el cliente público etiquetado.

## Particularidades por ruta

- `/{lang}` y `/{lang}/receta/{slug}`: ISR (`revalidate = 3600`) + etiqueta.
- `/{lang}/recetas`: usa `searchParams` (paginación), por lo que se renderiza en cada
  petición; sus datos siguen saliendo del Data Cache etiquetado.
- `sitemap.xml`: ruta estática con `revalidate = 3600` + etiqueta.
- `robots.txt`: depende solo de variables de entorno; no necesita invalidación.
- `/admin/*`: `force-dynamic`, cliente con cookies y `fetch` con `cache: 'no-store'`
  explícito (src/lib/supabase/server.ts) → sin caché, siempre fresco.

## Limitaciones conocidas (decisión consciente)

- Cambiar un slug deja la URL vieja en 404. No hay redirección automática slug→slug
  (candidato a la tabla de redirecciones legacy, ver docs/importacion-historica.md).
- Si en el futuro se escribe en la BD fuera del panel (SQL Editor, scripts de
  importación), la web no se entera: se actualiza con el respaldo de 1 hora o
  llamando a una ruta de revalidación protegida (pendiente, no implementada).

## Cómo verificarlo (pendiente de ejecutar)

1. `npm run build`: en la salida, `/[lang]` y `/[lang]/receta/[slug]` deben aparecer
   como ● (SSG/ISR) y `/[lang]/recetas` como ƒ (dinámica).
2. `npm run start` (no `dev`: en desarrollo la caché se comporta distinto).
3. Visitar `/es` dos veces: la segunda respuesta lleva cabecera `x-nextjs-cache: HIT`.
4. En `/admin`, publicar una receta. Recargar `/es`: la primera petición ya debe traer
   la receta nueva (revalidateTag purga la entrada → MISS → datos frescos). Si aparece
   `STALE` con contenido viejo, la invalidación no funcionó: reportarlo.
   (STALE sí es normal cuando lo que expira es el respaldo de 1 hora, no una escritura.)
5. Repetir con despublicar y con crear traducción, comprobando en el código fuente de
   la receta hermana que el `<link rel="alternate" hreflang>` aparece/desaparece.
6. `curl -s localhost:3000/sitemap.xml` con `NEXT_PUBLIC_ALLOW_INDEXING=true` antes y
   después de publicar.
