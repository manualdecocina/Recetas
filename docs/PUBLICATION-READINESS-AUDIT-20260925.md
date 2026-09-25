# PUBLICATION READINESS AUDIT — 2026-09-25

## Estado técnico

Auditoría ejecutada sobre la base publicada después de las correcciones SEO/routing.

| Control | Resultado |
|---|---:|
| Recetas publicadas | 132 |
| Recetas publicadas con huecos críticos | 0 |
| public_path duplicado en recetas publicadas | 0 |
| public_path duplicado en ContentPages publicadas | 0 |
| Solapamiento Recipe/ContentPage publicado | 0 |
| Idioma duplicado dentro del mismo recipe_group_id | 0 |

## Schema

Las páginas Recipe generan Recipe JSON-LD y BreadcrumbList. Google documenta Recipe como el marcado específico para recetas y recomienda HowToStep para las instrucciones; BreadcrumbList requiere una secuencia ordenada de ListItem. La validación final debe hacerse con Rich Results Test y URL Inspection sobre páginas desplegadas.

## Supabase

La auditoría de advisors no detectó avisos de rendimiento.

Existe un aviso de seguridad de Supabase Auth: Leaked Password Protection está desactivada. No afecta al renderizado público ni a la arquitectura SEO, pero queda pendiente de configuración en Auth.

Referencia: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

## Regla de publicación

No publicar una reconstrucción hasta que:
1. la URL final esté cerrada;
2. el modelo sea Recipe cuando corresponda;
3. exista contenido editorial completo;
4. exista imagen válida;
5. ingredientes y pasos estén completos;
6. canonical/hreflang estén alineados;
7. sitemap y datos estructurados correspondan a la URL final.

## Siguiente bloque

Consolidar los ContentPages que representan recetas reales, empezando por los P0/P1 ya clasificados, sin crear URLs paralelas.


## Actualización — Bloque 50 — 2026-09-25

Se completó una auditoría integral de la segunda ola ContentPage→Recipe. Se detectaron 48 ContentPages publicadas con Recipe ES homónima staged. Las 48 Recipes tienen imagen, contenido, ingredientes, pasos y metadata básica completa. Ninguna fue publicada ni se retiró su ContentPage: la secuencia sigue siendo publicar Recipe → verificar → retirar ContentPage. El siguiente punto operativo es el Publication Gate de routing/SEO, no más descubrimiento de candidatos.

QA: docs/QA-BLOQUE-CONTENTPAGE-RECIPE-20260925-50.md.


## Actualización — Bloque 52 — 2026-09-25

Auditoría directa de las 95 Recipes staged: 95/95 tienen `public_path`; 0 tienen `public_path` duplicado dentro del conjunto staged; 2 no tienen imagen; 24 tienen metadata incompleta (prep/total/servings), sin evidencia suficiente para completar por inferencia; 75 son ES; 1 tiene SEO description vacía (`la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto`). No se hicieron cambios de datos ni publicaciones. El Publication Gate queda verificado a nivel de integridad de routing staged, pero la publicación sigue condicionada por los gates editoriales globales y por la verificación externa de build/deploy.

QA: `docs/QA-BLOQUE-PUBLICATION-GATE-20260925-52.md`.
