# MANUAL DE COCINA — CHECKPOINT PRE-DISEÑO — 20260925

## Objetivo
Cerrar arquitectura, contenido, taxonomía, datos, operación, seguridad y descubrimiento antes de entrar al rediseño visual definitivo.

## Cerrado
- Proceso de diseño y criterio de cierre.
- Arquitectura editorial + catálogo facetado.
- Sitemap y navegación V1.
- Wireframes de Home, catálogo/búsqueda/filtros, receta e ingrediente.
- Categorías culinarias V1: 10 categorías definidas; 133/134 recetas clasificadas y 1 excepción explícita (Cómo preparar Queso) sin forzar clasificación.
- Ingredientes: modelo canónico, aliases, relaciones por posición, pendientes y reglas de alta.
- 24 ingredientes indexables V1.
- Cocinas: modelo canónico creado; 9 relaciones de alta confianza migradas; indexabilidad todavía cerrada en 0 por falta de volumen suficiente.
- Difficulty: normalizada a Fácil/Media; 3 históricas sin dato.
- Tiempo: auditoría completada; 24 con datos completos, 110 sin total; 7 discrepancias revisadas y conservadas porque incluyen tiempo pasivo/proceso.
- Keywords: fuera de la taxonomía canónica V1.
- Course: fuera del núcleo V1 por cobertura histórica insuficiente.
- Flujo operativo de receta y validador de publicación.
- Página de ingredientes V1 implementada.
- JSON-LD de receta y breadcrumbs implementados donde corresponde.
- Sistema editorial visual preliminar y dirección de marca editorial culinaria definidos como base para la fase de diseño.

## Pendiente antes del diseño visual definitivo
1. Aplicar y probar RLS de las seis tablas nuevas de taxonomía/ingredientes. **CERRADO:** RLS activo en las 6 tablas y políticas públicas/admin aplicadas; verificación estructural completada.
2. QA técnico final de rutas, sitemap, filtros y páginas de ingrediente.
3. Cerrar la arquitectura de cuisine pública: **CERRADO V1:** no hay cocinas indexables todavía; las 7 entidades canónicas y 9 relaciones quedan como infraestructura de descubrimiento futura, sin indexación pública hasta alcanzar contenido suficiente.
4. Revisar si la excepción Cómo preparar Queso justifica en el futuro una dimensión de preparaciones/básicos; no bloquea la arquitectura actual.
5. Cerrar identidad visual final: logo/SVG maestro, símbolo/favicon, tipografía definitiva, paleta definitiva, iconografía y sistema de componentes.
6. Cerrar especificación de espacios publicitarios propios; implementación al final, no antes.
7. Ejecutar build/lint/QA de producción después de las decisiones anteriores.

## Regla de entrada a diseño
No empezar el rediseño visual definitivo hasta que los puntos 1–3 estén resueltos y documentados. Los puntos 4–6 pertenecen a la fase de diseño/producto, pero ya tienen hipótesis y no requieren volver a estudiar toda la arquitectura.

## Estado
**Arquitectura y modelo de contenido: prácticamente cerrados.**
**Diseño visual definitivo: todavía no iniciado como fase cerrada.**
**Estado actual: listo para QA técnico final y entrada en la fase de diseño visual definitivo.**
