# Contrato de preservación — base de datos y clasificación editorial

Fecha: 2026-10-04

## Regla absoluta

La estructura consolidada de `public.recipes` y la clasificación histórica/editorial ya realizadas se consideran **baseline aprobado**.

No se debe:

- rediseñar el modelo de `recipes`;
- renombrar o sustituir campos consolidados;
- reabrir decisiones previas sobre recetas descartadas por canibalización, duplicación, clonación, baja calidad o falta de valor;
- revivir contenido descartado solo porque aparezca en una auditoría rápida;
- cambiar URLs históricas o `public_path` salvo necesidad técnica demostrada;
- reemplazar contenido ya consolidado por una nueva redacción solo por preferencia editorial.

Sí se puede:

- completar campos objetivamente vacíos cuando el contrato actual exija que existan;
- corregir incoherencias técnicas verificables;
- reparar imágenes, enlaces, schema, canonical, hreflang, estados, relaciones de ingredientes o errores de publicación;
- mejorar infraestructura, SEO técnico, rendimiento, seguridad, enlazado interno y monetización sin alterar el modelo consolidado;
- continuar las recetas pendientes usando exactamente el modelo existente.

## Idiomas

Idiomas soportados actualmente:

`es`, `de`, `ja`, `it`, `fr`, `en`, `pt`.

Portugués permanece técnicamente como `pt`. No migrar a `pt-BR` sin una decisión explícita de arquitectura y análisis de impacto SEO.

En la interfaz, identificarlo como **Português (Brasil)**, coherente con la bandera brasileña. Mantener `pt` en las rutas y el modelo actual.

## Search Console

Los datos históricos de Search Console se usan para:

- priorizar;
- proteger URLs ganadoras;
- detectar oportunidades de recuperación;
- orientar enlazado y snippets.

No se usan para invalidar o rehacer la clasificación editorial histórica ya consolidada.

## Producción de las recetas pendientes

Solo los **20 grupos de recetas publicados** tienen contenido y localizaciones válidas para la web nueva. Las demás filas, páginas o traducciones heredadas no equivalen a recetas nuevas terminadas.

Para cada receta pendiente, el sitemap anterior y el URL Master aportan únicamente la URL histórica, el idioma y la decisión URL-by-URL ya aprobada (KEEP / REBUILD, MIGRATE / MERGE, REVIEW u OUT). Search Console ayuda a priorizar y proteger esas rutas. No se reutilizan ni traducen textos, ingredientes, pasos, metadatos editoriales o traducciones de TranslatePress/WordPress; los borradores heredados tampoco son una fuente de publicación. Crear contenido original que responda a la intención de búsqueda de cada URL con el contrato editorial del README, revisar la receta y sus localizaciones y publicar solo tras superar el gate.

Conservar los datos heredados hasta completar el inventario y respaldo técnico; **descartar como fuente editorial no significa borrar tablas o registros**. Antes de mover el dominio principal, verificar que ninguna `content_page` heredada se sirva o indexe como sustituto de una receta pendiente, y resolver cada URL histórica según su decisión aprobada. Comprobar HTTP, canonical, hreflang y sitemap. Un 403 es una incidencia de acceso que se diagnostica aparte; una URL aún sin contenido aprobado no se convierte en una página vacía indexable para evitarlo.

## Principio de limpieza

Antes de borrar una rama, tabla, archivo, componente, redirect o contenido:

1. comprobar que no se usa;
2. comprobar que no contiene trabajo único;
3. respaldar si corresponde;
4. verificar build/tests;
5. eliminar solo después.

Este documento prevalece como regla operativa para futuras auditorías y sesiones del proyecto.
