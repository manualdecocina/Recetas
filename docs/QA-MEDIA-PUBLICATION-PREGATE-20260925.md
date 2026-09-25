# QA — MEDIA / PUBLICATION PRE-GATE — 2026-09-25

## Resultado

Se ejecutó una comprobación directa sobre las 95 Recipes staged.

- Total staged: **95**
- Sin imagen: **1**
- Sin content_html: **0**
- Ingredientes vacíos: **0**
- Pasos vacíos: **0**
- El único registro con huecos críticos es `la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto`, que ya está descartado y redirigido 308 a `/es`.
- Redirects activos: **1**, exclusivamente para esa entidad descartada.

Por tanto, **no quedan bloqueadores de media/contenido dentro de las Recipes staged válidas**.

## Advisors

- Performance: **0 findings**.
- Security: 1 warning externo de Supabase Auth por protección contra contraseñas filtradas desactivada. No afecta al catálogo público, pero queda pendiente como hardening de producción.

## Gate

El catálogo staged válido queda listo en cuanto a integridad de media/contenido.

No se publica todavía. Siguen abiertos:
1. consolidación/publication batch de las 5 ContentPages→Recipe;
2. QA editorial de localizaciones no-ES;
3. revisión editorial salud/nutrición;
4. build/typecheck/tests;
5. smoke HTTP y verificación externa Hostinger.

## Incidencias

No se detectó una segunda Recipe válida sin imagen ni otra entidad staged con ingredientes/pasos/contenido vacíos.
