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

## Search Console

Los datos históricos de Search Console se usan para:

- priorizar;
- proteger URLs ganadoras;
- detectar oportunidades de recuperación;
- orientar enlazado y snippets.

No se usan para invalidar o rehacer la clasificación editorial histórica ya consolidada.

## Principio de limpieza

Antes de borrar una rama, tabla, archivo, componente, redirect o contenido:

1. comprobar que no se usa;
2. comprobar que no contiene trabajo único;
3. respaldar si corresponde;
4. verificar build/tests;
5. eliminar solo después.

Este documento prevalece como regla operativa para futuras auditorías y sesiones del proyecto.
