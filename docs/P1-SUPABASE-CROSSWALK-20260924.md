# P1 — Cruce URL ↔ modelo Supabase — 2026-09-24

## Resultado

De las 29 URLs prioritarias españolas revisadas:

- **24** ya están modeladas en `public.recipes`.
- **5** están modeladas en `public.content_pages` aunque editorialmente son candidatas a receta.
- **27** tienen un 301 histórico registrado en `public.content_redirects`.
- **2** no tienen redirect entre las rutas revisadas: `/chorizo-santarosano/` y `/mochis-el-postre-japones/`.

## Excepciones que requieren corrección de modelo

| URL | Modelo actual | Decisión de control |
|---|---|---|
| /receta-de-lechona-colombiana/ | content_pages | MIGRAR/MODELAR como Recipe antes de cerrar E001 |
| /empanada-peruana-de-pollo/ | content_pages | MIGRAR/MODELAR como Recipe |
| /pollo-alfredo-a-la-florentina/ | content_pages | MIGRAR/MODELAR como Recipe |
| /receta-ensalada-caprese/ | content_pages | revisar contenido y, si es receta real, MIGRAR/MODELAR como Recipe |
| /souffle-de-queso/ | content_pages | revisar y, si es receta real, MIGRAR/MODELAR como Recipe |

## Por qué importa

La ruta de recetas actual (`/[lang]/receta/[slug]`) genera contrato SEO específico de receta y JSON-LD `Recipe`.

La ruta genérica de contenido (`/[lang]/[...rest]`) actualmente solo genera metadata básica y canonical; no implementa el mismo contrato de Recipe/hreflang.

Por tanto, conservar una URL histórica raíz no significa solamente quitar un 301: el router debe poder resolver esa URL hacia la entidad correcta y aplicar el schema/SEO correspondiente.

## Entidades especialmente afectadas

### E001 — Lechona colombiana

La URL ES histórica `/receta-de-lechona-colombiana/` tiene 265 clics históricos y está actualmente en `content_pages`. Esto es insuficiente para el modelo editorial final si la entidad se publica como receta.

Además, las versiones DE/JA/IT/FR/EN históricas están demostradas por TranslatePress, pero todavía no existen como registros traducidos en Supabase.

### E015 — Empanada peruana de pollo

La URL ES está actualmente en `content_pages`, mientras que existe una URL IT histórica de alto tráfico. Debe convertirse en una entidad Recipe localizada, no en dos páginas genéricas desconectadas.

### E012 — Pollo Alfredo

La URL ES está actualmente en `content_pages` y existe una URL JA histórica con tráfico. Debe resolverse como una entidad Recipe multilingüe si ambas versiones se reconstruyen.

## Regla

No crear traducciones nuevas hasta que la entidad ES esté correctamente clasificada/modelada. No ejecutar todavía los 27 cambios de redirect.

El modelo Supabase debe seguir al URL Master aprobado, no obligar al URL Master a adoptar la estructura actual del router.
