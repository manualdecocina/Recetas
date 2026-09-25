# QA LOCALIZACIONES NO-ES — CIERRE DEL BLOQUE — 2026-09-25

## Alcance

Bloque completo de **20 Recipes no-ES staged**:
- DE: 4
- EN: 1
- FR: 3
- IT: 6
- JA: 6

## Verificaciones directas

Todas las 20 cumplen:
- título no vacío;
- imagen presente;
- contenido presente;
- ingredientes presentes;
- pasos presentes;
- prep/cook/total/servings presentes;
- `public_path` presente;
- `recipe_group_id` presente.

La consulta de grupos confirma que las localizaciones están vinculadas a sus Recipes hermanas esperadas. No se detectó ninguna localización huérfana.

## QA de idioma

Se revisaron títulos, extractos, ingredientes y estructura de pasos.

- No se detectaron términos españoles evidentes en el contenido HTML de las localizaciones.
- Las 6 localizaciones JA contienen escritura japonesa en el contenido.
- DE/EN/FR/IT presentan ingredientes y títulos lingüísticamente coherentes a nivel estructural.
- No se detectó contaminación evidente de idioma ni pérdida estructural de ingredientes/pasos.

## Observaciones que NO se corrigen por inferencia

1. Algunos `total_time_minutes` son superiores a prep+cook. Se mantienen porque pueden representar reposo, enfriamiento o marinado.
2. Lechona DE/EN/FR/IT/JA usa 930 minutos totales frente a 45+210; se conserva como dato editorial existente y requiere revisión humana si se quiere normalizar.
3. Porra FR/IT usa 80 minutos con cook=0; no se modifica sin evidencia editorial.
4. Pie de limón JA usa 290 minutos totales; no se modifica automáticamente.
5. Los extractos breves de algunas localizaciones son válidos pero requieren revisión editorial de naturalidad antes de publicación.
6. La localización JA de Pandebono contiene un punto ASCII final en el extracto; no se modifica porque la corrección editorial de estilo debe hacerse como revisión de idioma, no por una regla automática aislada.

## Canonical / grupos

Las 20 localizaciones pertenecen a grupos existentes y sus URLs públicas están definidas. La lógica del sitio genera canonical/hreflang a partir de las hermanas publicadas; por tanto, la publicación debe hacerse de forma controlada y no antes del cierre editorial.

## Resultado del bloque

**TECHNICALLY READY / EDITORIAL REVIEW PENDING**

No se publica ninguna localización en este bloque porque la decisión de abrir cada idioma y la revisión de naturalidad/traducción todavía son gates editoriales.

## Siguiente paso

Cerrar el ciclo de los 5 pares ContentPage → Recipe y resolver las observaciones editoriales de las localizaciones antes de cualquier publicación por lotes.
