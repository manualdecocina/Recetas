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

La base de datos y el inventario histórico sirven para identificar y preservar las URL públicas (incluido `public_path`) y los idiomas asociados. Search Console aporta las URL afectadas y la prioridad de recuperación. Antes de publicar cada página, comprobar que su ruta resuelve correctamente y que el contenido corresponde al idioma esperado; registrar y corregir por separado los errores 403 observados.

Las 20 recetas ya publicadas son el avance editorial actual. Para las otras URL seleccionadas, crear recetas y textos **nuevos** conforme al modelo vigente y a la clasificación aprobada. El contenido antiguo o en borrador puede orientar la identificación de la URL, pero no debe traducirse ni publicarse en lote como si fuera contenido nuevo. Revisar y publicar cada idioma de forma editorial, respetando las rutas históricas.

## Principio de limpieza

Antes de borrar una rama, tabla, archivo, componente, redirect o contenido:

1. comprobar que no se usa;
2. comprobar que no contiene trabajo único;
3. respaldar si corresponde;
4. verificar build/tests;
5. eliminar solo después.

Este documento prevalece como regla operativa para futuras auditorías y sesiones del proyecto.
