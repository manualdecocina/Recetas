# Supabase — auditoría de contenido recién sembrado — 2026-09-24

## Hallazgo

Las 28 filas de public.recipes que no tienen source_url aparecen con published_at del 23 de septiembre de 2026.

Esto es una señal fuerte de que son contenido/registros sembrados durante la reconstrucción actual y no una preservación documental directa del WordPress histórico.

## Tratamiento de control

Estas filas pasan a la categoría:

**NEW_SEED / contenido nuevo en reconstrucción**

No deben utilizarse como evidencia histórica para justificar una URL.

La evidencia histórica debe venir de:
- Search Console;
- WXR/WordPress;
- inventario;
- TranslatePress cuando aplique;
- redirects históricos existentes.

## Excepciones

Algunas filas NEW_SEED duplican entidades históricas o páginas importadas y deben consolidarse:

- lechona-colombiana → E001
- lechona-colombiana-receta-tradicional-paso-a-paso → E001
- empanada-peruana-de-pollo → E015
- bowl-de-carne-con-miel-picante-y-queso-cottage → consolidar con su content_page
- receta-facil-de-pasta-al-pesto-casera → consolidar con su content_page
- receta-de-souffle-de-queso-esponjoso → revisar junto con /souffle-de-queso/
- sopa-saludable-para-enfermos-receta-nutritiva-y-facil-de-preparar → revisión reforzada de salud
- receta-de-papas-al-horno-y-los-beneficios-para-la-salud → revisión reforzada de salud
- solomillo-de-pavo-glaseado-con-cafe-y-chipotle-sobre-hummus-de-edamame → consolidar con página equivalente
- sopa-minestrone-casera-el-secreto-definitivo-para-un-sabor-autentico → consolidar con página equivalente

## Regla de catálogo

NEW_SEED no significa KEEP.

Cada fila recién sembrada debe pasar el mismo filtro editorial que cualquier contenido nuevo:
- entidad real;
- intención clara;
- utilidad para Manual de Cocina;
- ausencia de duplicación;
- contenido completo y original;
- idioma correcto;
- schema acorde al tipo.

Una fila nueva que no supera ese filtro se elimina del catálogo nuevo, aunque ya exista en Supabase.

## Implicación

Esto permite separar definitivamente:

HISTÓRICO = evidencia SEO/URL

NUEVO = material de reconstrucción editorial

La tabla URL Master debe registrar ambas procedencias por separado.
