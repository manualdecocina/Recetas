# FASE 1C — MODELOS DE ARQUITECTURA A/B/C
Fecha: 2026-09-25
Estado: COMPARACIÓN — NO CERRADO

## Objetivo

Definir tres arquitecturas completas para Manual de Cocina antes de elegir una.

Base:
- 134 recetas ES publicadas.
- El catálogo actual tiene múltiples dimensiones.
- category, course, cuisine, difficulty y tiempos requieren normalización.
- El sitio debe poder crecer sin rehacerse.

## MODELO A — CATEGORÍAS TRADICIONALES

### Concepto
La navegación parte de grandes categorías culinarias estables. Los filtros ayudan a refinar.

### Navegación desktop
Logo | Recetas | Categorías | Colecciones | Guías | Buscar

### Categorías candidatas
- Platos principales
- Entrantes y aperitivos
- Sopas y cremas
- Ensaladas
- Guarniciones
- Salsas y aderezos
- Panes y masas
- Desayunos y brunch
- Postres
- Bebidas

### Home
1. Hero de marca + buscador.
2. Categorías principales.
3. Recetas destacadas.
4. Descubre por ingrediente.
5. Colecciones.
6. Guías.
7. Últimas recetas.

### Página de categoría
Breadcrumbs → H1 → introducción → filtros secundarios → grid de recetas → paginación/carga progresiva → enlaces a categorías relacionadas.

### Filtros
Ingrediente, cocina, tiempo, dificultad, momento, técnica.

### URLs
/recetas/
/categorias/platos-principales/
/categorias/postres/
/recetas/nombre-receta/

### Ventajas
- Muy comprensible.
- Fácil de explicar.
- Buen punto de partida con catálogo pequeño.
- Escala razonablemente si las categorías se mantienen estables.

### Riesgos
- Puede quedarse corta cuando crezca el catálogo.
- El usuario puede pensar que todo debe pertenecer a una sola categoría.
- Menos flexible para búsquedas por intención.

---

## MODELO B — CATÁLOGO FACETADO

### Concepto
La página de recetas funciona como un catálogo navegable. Las dimensiones se combinan.

### Navegación
Logo | Recetas | Ingredientes | Cocinas | Colecciones | Guías | Buscar

### Home
1. Hero + buscador principal.
2. Explorar por categoría.
3. Explorar por ingrediente.
4. Explorar por cocina.
5. Explorar por tiempo.
6. Colecciones.
7. Recetas destacadas.

### Página /recetas/
H1 → buscador → filtros → resultados.

### Facetas
Primarias:
- categoría
- ingrediente
- cocina

Secundarias:
- tiempo
- dificultad
- momento
- técnica

### Ejemplos de intención
pollo → recetas con pollo
pollo rápido → pollo + tiempo
postre sin horno → postre + técnica/atributo
comida mexicana → cocina mexicana
sopa de lentejas → categoría + ingrediente

### URLs
/recetas/
/recetas?ingrediente=pollo&tiempo=rapido
/cocinas/mexicana/
/ingredientes/pollo/

Las URLs indexables de facetas deberán decidirse según volumen, intención y contenido real; no se indexará automáticamente cada combinación.

### Ventajas
- Potentísimo para descubrimiento.
- Escala muy bien.
- Representa correctamente el carácter multidimensional del catálogo.
- Excelente base para búsqueda.

### Riesgos
- Más complejo de diseñar.
- Requiere datos normalizados.
- Puede convertirse en una interfaz demasiado técnica si se expone todo a la vez.
- Necesita reglas SEO estrictas.

---

## MODELO C — EDITORIAL + CATÁLOGO

### Concepto
Manual de Cocina no se presenta únicamente como una base de recetas. Combina herramienta de cocina + publicación editorial.

### Navegación
Logo | Recetas | Categorías | Colecciones | Guías | Buscar

### Home
1. Hero editorial + buscador.
2. Selección editorial.
3. Categorías.
4. Colecciones temáticas.
5. Recetas rápidas/fáciles u otras experiencias verificables.
6. Guías.
7. Descubrimiento por ingrediente/cocina.
8. Últimas recetas.

### Recetas
/recetas/
/recetas/nombre/

### Categorías
/categorias/postres/
/categorias/sopas-y-cremas/

### Colecciones
/colecciones/
/colecciones/cenas-rapidas/
/colecciones/comida-colombiana/

### Guías
/guias/
/guias/como-cocinar-arroz/
/guias/tecnicas-de-cocina/

### Filtros
Los mismos del catálogo facetado, pero ocultos tras una experiencia sencilla.

### Ventajas
- Permite construir una marca editorial fuerte.
- Convierte el catálogo en un sistema de contenido, no solo en un listado.
- Permite crear landing pages con intención concreta.
- Puede aprovechar las 74 content_pages existentes sin mezclar automáticamente su contenido con recetas.
- Tiene espacio para crecer hacia guías, técnicas y colecciones.

### Riesgos
- Mayor coste editorial.
- Requiere gobernanza de contenido.
- Hay que evitar páginas vacías o colecciones artificiales.

---

# COMPARACIÓN FUNCIONAL

| Área | A | B | C |
|---|---|---|---|
| Claridad inicial | Alta | Media | Alta |
| Descubrimiento | Alto | Muy alto | Muy alto |
| Búsqueda | Alta | Muy alta | Muy alta |
| Escalabilidad catálogo | Alta | Muy alta | Muy alta |
| Complejidad UX | Media | Alta | Media-alta |
| Potencial editorial | Medio | Bajo-medio | Muy alto |
| SEO de colecciones | Alto | Alto | Muy alto |
| Dependencia de datos normalizados | Media | Muy alta | Alta |
| Adecuado para marca | Alto | Medio | Muy alto |

Estas son características de diseño, no una puntuación ni una clasificación definitiva.

# OBSERVACIÓN CLAVE

Los modelos no son mutuamente excluyentes a nivel técnico.

La decisión real es qué debe dominar la experiencia:

A = categorías.
B = exploración/facetas.
C = marca editorial + catálogo.

## Arquitectura híbrida posible

Puede existir:
- navegación principal sencilla de C;
- catálogo de recetas con capacidades de B;
- categorías fuertes de A;
- colecciones y guías como contenido editorial.

Esto permitiría mantener una interfaz simple sin renunciar a un motor de descubrimiento multidimensional.

# SEO Y ESTRUCTURA DE PÁGINAS

Google documenta Recipe para páginas individuales y ItemList para páginas resumen/listados de recetas. Una página resumen de una colección debe listar las recetas correspondientes y el marcado debe corresponder al contenido visible. Por ello, categorías y colecciones no deben ser simples filtros client-side sin una página de contenido propia.

## Principio
Una página indexable debe tener:
- intención clara;
- título/H1 propio;
- contenido útil;
- conjunto de recetas real;
- URL estable;
- enlazado interno;
- datos estructurados coherentes cuando corresponda.

# DECISIÓN PENDIENTE D-006

No se cierra A, B ni C todavía.

La siguiente fase debe definir el sitemap definitivo sobre la base de una arquitectura híbrida candidata:

**Editorial + Categorías + Catálogo facetado**

Esto no constituye todavía aprobación final.

# SIGUIENTE FASE

FASE 1D:
1. Construir sitemap completo.
2. Definir menú desktop.
3. Definir navegación móvil.
4. Definir jerarquía de URLs.
5. Definir qué páginas son indexables.
6. Definir Home.
7. Definir Category Listing.
8. Definir Search Results.
9. Definir Recipe Detail.
10. Definir Collections.
11. Definir Guides.
12. Definir Breadcrumbs y enlazado interno.

Después de esto se podrá pasar a wireframes.

DISEÑO VISUAL SIGUE BLOQUEADO.
LOGO/FAVICON SIGUEN BLOQUEADOS.
IMPLEMENTACIÓN SIGUE BLOQUEADA.
