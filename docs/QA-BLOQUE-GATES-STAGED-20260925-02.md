# QA STAGED — BLOQUE GATES 20260925-02

Fecha: 2026-09-25
Estado: STAGED / NO PUBLICAR

## Alcance

Bloque operativo de las 24 recetas staged que tenían simultáneamente tiempos y porciones sin evidencia estructurada en Supabase. Se procesó el bloque completo sin publicar.

## Cambios cerrados en este bloque

### Evidencia de imagen recuperada

Se asignaron únicamente URLs ya existentes en `media_assets` y directamente asociadas por título/slug/activo histórico:

- `receta-de-arroz-con-leche-un-postre-reconfortante`
  - `https://manualdecocina.com/wp-content/uploads/2025/08/Arroz-con-Leche.jpg`
- `receta-clasica-de-galletas-toll-house-original-con-chispas-de-chocolate`
  - `https://manualdecocina.com/wp-content/uploads/2025/08/Galletas-Toll-House.jpg`
- `picadillo-de-carne-molida-rapido-y-facil`
  - `https://manualdecocina.com/wp-content/uploads/2025/08/Picadillo-de-Carne-Molida.jpg`
- `sopa-minestrone-casera-el-secreto-definitivo-para-un-sabor-autentico`
  - `https://manualdecocina.com/wp-content/uploads/2023/05/sopa-de-minestrone.jpg`
- `salmon-en-costra-de-hierbas-y-limon-con-esparragos-crujientes`
  - `https://manualdecocina.com/wp-content/uploads/2026/01/colocacion-salmon-esparragos-air-fryer.png`
- `sopa-saludable-para-enfermos-receta-nutritiva-y-facil-de-preparar`
  - `https://manualdecocina.com/wp-content/uploads/2025/08/Sopa-Saludable-Para-Enfermos-1.jpg`

No se asignaron imágenes por similitud visual o temática.

### Editorial

`/como-preparar-mayonesa-casera`:
- se eliminó del excerpt el claim de salud ("más fresca, saludable");
- se conservó únicamente descripción culinaria verificable;
- la receta permanece staged.

## Bloqueos reales

No se inventaron tiempos ni porciones.

Permanecen sin evidencia suficiente de imagen:
- `irresistible-salmon-en-air-fryer-con-costra-de-hierbas-y-limon`
- `la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto`

Las 24 recetas del bloque siguen sin tiempos/porciones estructurados cuando no existe evidencia suficiente en el proyecto. Esos campos permanecen `NULL`.

`la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto` mantiene además el bloqueo editorial/origen ya documentado: no presenta una entidad culinaria clara y no se convierte en receta válida por el mero hecho de existir como fila staged.

## Regla aplicada

- No publicación.
- No traducciones.
- No redirects.
- No modificación de ContentPages.
- No datos inventados.
- No reutilización de imágenes sin evidencia.
