# FASE 1D — SITEMAP Y NAVEGACIÓN
Fecha: 2026-09-25
Estado: PROPUESTA ESTRUCTURAL — NO CERRADO

## 1. Principio

La navegación pública debe ser simple; el catálogo interno puede ser multidimensional.

Propuesta candidata:
**Editorial + categorías + catálogo facetado.**

## 2. Sitemap candidato

/
├── recetas/
│   ├── [receta]/
├── categorias/
│   ├── platos-principales/
│   ├── entrantes-y-aperitivos/
│   ├── sopas-y-cremas/
│   ├── ensaladas/
│   ├── guarniciones/
│   ├── salsas-y-aderezos/
│   ├── panes-y-masas/
│   ├── desayunos-y-brunch/
│   ├── postres/
│   └── bebidas/
├── ingredientes/
│   └── [ingrediente]/
├── cocinas/
│   └── [cocina]/
├── colecciones/
│   └── [coleccion]/
├── guias/
│   └── [guia]/
└── buscar/

Las listas de categorías, ingredientes y cocinas son candidatas y deben aprobarse después de validar volumen, contenido y URLs.

## 3. Home

La home no será un simple listado de recetas.

Orden candidato:
1. Header + identidad.
2. Hero editorial.
3. Buscador principal.
4. Acceso rápido a categorías.
5. Selección de recetas.
6. Colecciones.
7. Descubrimiento por ingrediente.
8. Descubrimiento por cocina.
9. Guías.
10. Últimas recetas.
11. Footer editorial.

La home debe responder en pocos segundos:
- qué es Manual de Cocina;
- qué puedo cocinar;
- cómo puedo encontrarlo;
- por qué debería explorar más.

## 4. Header desktop

Estructura candidata:

[LOGO] [Recetas] [Categorías] [Colecciones] [Guías] [Buscar]

No se recomienda poner Ingredientes y Cocinas como elementos principales del header inicialmente; pueden vivir dentro de Recetas/Categorías y tener landing pages indexables cuando exista contenido suficiente.

## 5. Header móvil

Prioridad:
- logo;
- buscar;
- menú.

El menú desplegado contendrá:
- Recetas
- Categorías
- Ingredientes
- Cocinas
- Colecciones
- Guías
- Sobre Manual de Cocina (si se crea)

No se debe convertir el menú móvil en una lista interminable.

## 6. /recetas/

Debe ser el centro del catálogo.

Componentes:
- H1: Recetas
- descripción corta
- búsqueda
- controles de ordenación
- filtros
- resultados
- paginación/carga progresiva
- estados sin resultados
- enlaces a descubrimientos relacionados

Filtros candidatos:
### Primarios
Categoría / Ingrediente / Cocina

### Secundarios
Tiempo / Dificultad / Momento / Técnica

No todos los filtros tienen que estar visibles simultáneamente.

## 7. /categorias/[slug]/

Página de descubrimiento.

Debe incluir:
- breadcrumb
- H1
- descripción editorial
- imagen/hero
- filtros secundarios
- grid de recetas
- enlaces relacionados
- colecciones relacionadas si existen

Debe ser una página real, no únicamente una consulta client-side.

## 8. /ingredientes/[slug]/

Landing opcional.

Ejemplo conceptual:
 /ingredientes/pollo/

Contenido:
- descripción
- recetas relacionadas
- categorías relacionadas
- cocinas relacionadas
- colecciones relacionadas

No crear automáticamente miles de páginas. Solo publicar/indexar entidades con contenido suficiente y valor real.

## 9. /cocinas/[slug]/

Misma lógica.

Ejemplo:
 /cocinas/colombiana/

Contenido:
- introducción
- recetas
- categorías relacionadas
- ingredientes frecuentes
- colecciones

La normalización de cuisine es requisito previo.

## 10. /colecciones/[slug]/

Página editorial de descubrimiento.

Debe poder explicar por qué existe la colección y después mostrar recetas.

Ejemplos conceptuales:
- Cenas rápidas
- Recetas colombianas
- Postres sin horno

No crear colecciones por combinación automática de filtros sin contenido editorial suficiente.

## 11. /guias/[slug]/

Contenido editorial.

Ejemplos conceptuales:
- Cómo cocinar arroz
- Técnicas de cocina
- Guía de masas

Las guías pueden enlazar a recetas y categorías.

## 12. /buscar/

La búsqueda será un producto propio.

Debe contemplar:
- consulta;
- sugerencias;
- resultados;
- corrección/normalización de términos;
- filtros;
- estado sin resultados;
- búsquedas relacionadas.

La URL de consulta puede usar parámetros no indexables.

## 13. URL y SEO

Regla propuesta:

Las URLs indexables deben representar entidades o páginas con intención estable.

Indexables potenciales:
- recetas;
- categorías;
- ingredientes con contenido suficiente;
- cocinas con contenido suficiente;
- colecciones;
- guías.

No indexar automáticamente cada combinación de filtros.

Ejemplo:
 /recetas/?ingrediente=pollo&tiempo=rapido

puede ser una experiencia útil para el usuario sin convertirse automáticamente en una landing SEO.

## 14. Breadcrumbs

Las páginas relevantes tendrán breadcrumbs visibles.

Ejemplo:
Inicio → Recetas → Postres → Cheesecake de Oreo sin horno

La jerarquía visual y la ruta de navegación no tienen que ser idénticas a la URL. Google recomienda que el breadcrumb represente una ruta típica del usuario, no que simplemente copie la estructura de URL. También contempla BreadcrumbList como dato estructurado. citeturn0search1

## 15. Receta individual

La receta será una herramienta de cocina.

Orden candidato:

Breadcrumb
→ título
→ imagen principal
→ resumen
→ datos rápidos
→ ingredientes
→ preparación paso a paso
→ consejos/notas
→ información adicional
→ recetas relacionadas
→ navegación contextual

Datos rápidos:
- tiempo;
- dificultad;
- porciones;
- categoría;
- cocina;
- momento, cuando exista.

La estructura Recipe debe aprovechar los datos disponibles y no inventar datos ausentes. Google documenta propiedades como image, recipeInstructions, recipeYield, totalTime, recipeCategory y recipeCuisine para Recipe structured data. citeturn0search0

## 16. Arquitectura de enlaces internos

Una receta puede enlazar a:
- su categoría;
- ingrediente principal;
- cocina;
- colección;
- guías relacionadas;
- recetas relacionadas.

Una categoría puede enlazar a:
- recetas;
- ingredientes;
- cocinas;
- colecciones.

Una guía puede enlazar a:
- recetas;
- categorías;
- técnicas.

Esto crea un grafo de contenido en lugar de páginas aisladas.

## 17. Reglas de indexación

No se indexará una página simplemente porque técnicamente puede generarse.

Criterios candidatos:
1. intención de búsqueda clara;
2. contenido suficiente;
3. conjunto de recetas real;
4. URL estable;
5. utilidad para el usuario;
6. ausencia de duplicación significativa.

## 18. Arquitectura móvil

Mobile-first.

La experiencia móvil debe priorizar:
1. buscar;
2. encontrar;
3. abrir receta;
4. cocinar.

Los filtros deben ser fáciles de abrir/cerrar y no ocupar permanentemente la pantalla.

## 19. Decisiones provisionales

D-007 — La navegación principal será corta y orientada a descubrimiento.
Estado: PROPUESTA.

D-008 — /recetas/ será el centro del catálogo.
Estado: PROPUESTA.

D-009 — Las facetas podrán existir en resultados sin convertirse automáticamente en URLs indexables.
Estado: PROPUESTA.

D-010 — Ingredientes y cocinas tendrán landing pages solo cuando exista suficiente contenido/valor.
Estado: PROPUESTA.

D-011 — Las recetas tendrán breadcrumbs y datos estructurados Recipe cuando los datos disponibles lo permitan.
Estado: PROPUESTA.

## 20. Lo que NO se hace todavía

- No se crean estas rutas en Next.js.
- No se crean categorías en Supabase.
- No se migra category.
- No se rediseña la página.
- No se genera logo.
- No se genera favicon.
- No se eligen colores.
- No se escribe CSS definitivo.

Primero se cierra el modelo.

## 21. Próxima fase

FASE 1E — WIREFRAMES FUNCIONALES.

Se diseñarán, sin estilo visual:
- Home desktop/mobile;
- listado de recetas desktop/mobile;
- categoría;
- búsqueda;
- receta;
- colección;
- guía;
- menú móvil.

Objetivo: validar estructura, jerarquía y comportamiento antes de entrar en marca visual.
