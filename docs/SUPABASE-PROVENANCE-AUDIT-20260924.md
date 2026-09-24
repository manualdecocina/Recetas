# Auditoría de procedencia Supabase — recetas sin source_url — 2026-09-24

## Hallazgo

public.recipes contiene 160 filas, de las cuales 28 no tienen source_url.

public.content_pages contiene 88 filas y, en el estado auditado, todas tienen source_url.

Por tanto, las 28 recetas sin source_url no pueden asumirse automáticamente como migraciones históricas. Necesitan una decisión explícita de procedencia.

## Riesgos detectados

### Duplicados claros o casi claros

| Receta sin source_url | Evidencia relacionada | Tratamiento |
|---|---|---|
| lechona-colombiana | existe /receta-de-lechona-colombiana/ como content_page y además otro registro Recipe EN/ES en grupo propio | CONSOLIDAR en una sola entidad E001 |
| lechona-colombiana-receta-tradicional-paso-a-paso | misma temática de E001 | CONSOLIDAR / no publicar como entidad separada |
| empanada-peruana-de-pollo | existe content_page con el mismo slug/título | CONSOLIDAR en E015 |
| bowl-de-carne-con-miel-picante-y-queso-cottage | existe content_page con el mismo slug/título | CONSOLIDAR |
| receta-facil-de-pasta-al-pesto-casera | existe content_page con mismo slug/título | CONSOLIDAR |
| solomillo-de-pavo-glaseado-con-cafe-y-chipotle-sobre-hummus-de-edamame | existe content_page con el mismo título y slug abreviado | CONSOLIDAR |
| sopa-minestrone-casera-el-secreto-definitivo-para-un-sabor-autentico | existe content_page con la misma entidad editorial | CONSOLIDAR |
| sopa-saludable-para-enfermos-receta-nutritiva-y-facil-de-preparar | existe /sopa-saludable-para-enfermos/ y es además REVIEW de salud | CONSOLIDAR/REVIEW |
| receta-de-souffle-de-queso-esponjoso | existe /souffle-de-queso/ | CONSOLIDAR/REVIEW |
| receta-de-papas-al-horno-y-los-beneficios-para-la-salud | existe contenido de papas al horno y claims de salud | CONSOLIDAR/REVIEW |

### Fuera del catálogo por falta de encaje

- la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto — no presenta una entidad culinaria clara en su título; queda OUT/revisión de origen.
- No se conservará por el mero hecho de existir como Recipe en Supabase.

### Candidatas legítimas nuevas o pendientes de procedencia

El resto de las 28 puede ser contenido editorial válido, pero primero debe demostrarse si:
- procede del catálogo histórico;
- fue creado durante la reconstrucción actual;
- es parte de una colección;
- o duplica otra receta.

## Regla de control

Una fila en public.recipes no equivale a una URL histórica.

Antes de cerrar el catálogo, cada receta sin source_url debe tener:
- entidad;
- procedencia;
- intención;
- URL pública definitiva;
- estado editorial;
- decisión KEEP/MERGE/OUT.

## Implicación para Lechona

Lechona es el caso de prueba más importante:
- URL histórica ES: /receta-de-lechona-colombiana/;
- content_page ES importada con esa URL;
- Recipe ES lechona-colombiana sin source_url;
- Recipe EN colombian-lechona en el mismo recipe_group_id;
- además existe otra Recipe ES lechona-colombiana-receta-tradicional-paso-a-paso sin source_url.

No se deben publicar tres representaciones de la misma entidad. El resultado final debe ser una sola entidad E001 con sus URLs/localizaciones aprobadas.

## Gate

No crear nuevas traducciones para estos casos hasta resolver la procedencia y consolidación.

No ejecutar borrados ni redirects todavía.
