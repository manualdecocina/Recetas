# FASE 1E — WIREFRAME FUNCIONAL HOME
Fecha: 2026-09-25
Estado: PROPUESTA — NO CERRADO

## 1. Objetivo

Definir la estructura y jerarquía de la Home antes de aplicar identidad visual.

La Home debe permitir tres comportamientos:
1. llegar con una intención concreta y buscar;
2. navegar por categorías;
3. descubrir recetas/colecciones sin saber exactamente qué cocinar.

La investigación UX consultada considera Home y navegación elementos centrales para que los usuarios entiendan el alcance del catálogo y encuentren contenido. También señala el riesgo de sobrecargar la navegación con demasiadas opciones. [Baymard]

## 2. HOME DESKTOP — ESTRUCTURA

### Header
┌─────────────────────────────────────────────────────────────┐
│ LOGO       Recetas  Categorías  Colecciones  Guías   Buscar │
└─────────────────────────────────────────────────────────────┘

### Hero
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                  MANUAL DE COCINA                           │
│             [ propuesta de valor editorial ]               │
│                                                             │
│       ¿Qué quieres cocinar?                                │
│       [ 🔎 Buscar recetas, ingredientes, platos... ]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

El buscador es una pieza primaria, no un elemento secundario.

### Explorar categorías
┌─────────────────────────────────────────────────────────────┐
│ Explora por categoría                                      │
│                                                             │
│ [Platos principales] [Entrantes] [Sopas] [Ensaladas]       │
│ [Guarniciones]       [Salsas]    [Panes] [Desayunos]       │
│ [Postres]            [Bebidas]                             │
└─────────────────────────────────────────────────────────────┘

No se mostrarán 30 categorías. El conjunto debe ser manejable.

### Selección editorial
┌─────────────────────────────────────────────────────────────┐
│ Recetas para descubrir                                      │
│                                                             │
│ [ tarjeta ] [ tarjeta ] [ tarjeta ] [ tarjeta ]             │
└─────────────────────────────────────────────────────────────┘

La selección debe tener criterio editorial. No debe ser simplemente "las últimas cuatro".

### Explorar por ingrediente
┌─────────────────────────────────────────────────────────────┐
│ ¿Qué tienes en casa?                                       │
│                                                             │
│ Pollo | Huevos | Arroz | Papa | Tomate | Aguacate | ...   │
│                                                             │
│ Ver todos →                                                │
└─────────────────────────────────────────────────────────────┘

Los ingredientes mostrados deberán derivarse de datos normalizados y volumen real.

### Colecciones
┌─────────────────────────────────────────────────────────────┐
│ Colecciones                                                 │
│                                                             │
│ [ colección grande ] [ colección ] [ colección ]           │
└─────────────────────────────────────────────────────────────┘

Las colecciones deben tener propósito editorial, no ser filtros automáticos.

### Explorar por cocina
┌─────────────────────────────────────────────────────────────┐
│ Cocinas                                                     │
│                                                             │
│ Colombiana | Mexicana | Italiana | Peruana | Japonesa ... │
└─────────────────────────────────────────────────────────────┘

Solo cocinas normalizadas y con contenido suficiente.

### Guías
┌─────────────────────────────────────────────────────────────┐
│ Aprende a cocinar                                           │
│                                                             │
│ [ guía ] [ guía ] [ guía ]                                 │
└─────────────────────────────────────────────────────────────┘

### Últimas recetas
┌─────────────────────────────────────────────────────────────┐
│ Nuevas recetas                                              │
│ [ tarjeta ] [ tarjeta ] [ tarjeta ] [ tarjeta ]             │
└─────────────────────────────────────────────────────────────┘

### Footer
Marca | navegación | categorías | recursos | legal | contacto

## 3. ORDEN DE PRIORIDAD

La jerarquía funcional de la Home será:

1. Identidad
2. Buscar
3. Categorías
4. Descubrimiento
5. Contenido editorial
6. Últimas publicaciones
7. Footer

La Home no debe intentar enseñar todo el catálogo de golpe.

## 4. CARD DE RECETA — WIREFRAME

┌──────────────────────┐
│                      │
│      IMAGEN          │
│                      │
├──────────────────────┤
│ Nombre de receta     │
│ categoría / cocina  │
│ tiempo · dificultad  │
└──────────────────────┘

La información secundaria deberá adaptarse a los datos disponibles. No se mostrarán atributos vacíos.

## 5. HOME MOBILE

┌──────────────────────┐
│ LOGO       🔍   ☰   │
├──────────────────────┤
│                      │
│ MANUAL DE COCINA     │
│ propuesta de valor   │
│                      │
│ [ Buscar recetas ]   │
│                      │
├──────────────────────┤
│ Categorías           │
│ [card] [card]        │
│ [card] [card]        │
│ Ver todas →          │
├──────────────────────┤
│ Recetas destacadas   │
│ [ receta ]           │
│ [ receta ]           │
│ [ receta ]           │
├──────────────────────┤
│ ¿Qué tienes en casa? │
│ [Pollo] [Arroz] ...  │
├──────────────────────┤
│ Colecciones          │
│ [ colección ]        │
│ [ colección ]        │
├──────────────────────┤
│ Cocinas              │
│ [chips/lista]        │
├──────────────────────┤
│ Guías                │
│ [ guía ]             │
├──────────────────────┤
│ Nuevas recetas       │
│ [ receta ]           │
└──────────────────────┘

## 6. REGLAS MOBILE

- No depender de hover.
- Objetivos táctiles cómodos.
- Buscar debe ser fácil de alcanzar.
- No usar carruseles automáticos.
- No esconder todo el catálogo detrás de una interacción.
- Las categorías deben poder recorrerse sin una lista interminable.
- El menú móvil debe conservar acceso a todas las áreas principales.

La investigación de Baymard señala que la navegación móvil suele fallar cuando presenta demasiadas opciones o no comunica bien el alcance de las categorías. [Baymard]

## 7. QUÉ NO ESTÁ DECIDIDO

Todavía NO se decide:
- colores;
- tipografías;
- estilo fotográfico;
- iconografía;
- bordes;
- sombras;
- tamaño definitivo;
- logo;
- favicon;
- textos finales;
- orden editorial exacto de cada módulo.

## 8. REGLA DE CONTENIDO

La Home no podrá depender de contenido inexistente.

Si una sección necesita:
- colecciones;
- guías;
- ingredientes normalizados;
- cocinas normalizadas;

y todavía no existe suficiente contenido, la sección se podrá ocultar o sustituir temporalmente.

No se rellenará con bloques artificiales.

## 9. SIGUIENTE WIREFRAME

El siguiente entregable de Fase 1E será:
**LISTADO DE RECETAS + FILTROS + RESULTADOS DE BÚSQUEDA**

Debe definir:
- estructura;
- filtros;
- ordenación;
- tarjeta;
- estados;
- paginación/carga;
- búsqueda;
- móvil.
