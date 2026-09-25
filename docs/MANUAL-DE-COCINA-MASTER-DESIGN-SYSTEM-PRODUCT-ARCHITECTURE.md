# MANUAL DE COCINA — MASTER DESIGN SYSTEM & PRODUCT ARCHITECTURE

**Versión:** 0.1 — ESTUDIO ABIERTO  
**Fecha:** 2026-09-25  
**Estado:** NO CERRADO / NO APROBADO  
**Dominio:** manualdecocina.com  
**Repositorio:** manualdecocina/Recetas

> Este documento es la referencia de trabajo de la Fase 1. No autoriza todavía la implementación del diseño definitivo. Las decisiones de producto, marca y arquitectura que requieran aprobación permanecen abiertas hasta su correspondiente DECISIÓN D-xxx.

---

## 1. Regla de trabajo

Orden obligatorio:

**investigar → auditar → analizar → proponer → comparar → decidir → documentar → cerrar → implementar**

Durante esta fase no se modifica la interfaz definitiva, no se inventan categorías por intuición y no se cambia una URL histórica sin decisión documentada.

---

## 2. Estado actual auditado

### 2.1 Aplicación

El repositorio actual utiliza:

- Next.js 14 / App Router
- TypeScript
- Supabase
- seis idiomas configurados: ES, DE, JA, IT, FR, EN
- rutas públicas con soporte de URLs históricas
- JSON-LD de Recipe y BreadcrumbList
- sitemap / robots / canonical / hreflang
- panel administrativo con RLS y funciones de escritura en Supabase

### 2.2 Inventario actual de Supabase

Lectura realizada sobre el proyecto Supabase activo el 2026-09-25:

| Idioma | Recipes | Publicadas |
|---|---:|---:|
| ES | 209 | 134 |
| DE | 4 | 0 |
| EN | 1 | 0 |
| FR | 3 | 0 |
| IT | 6 | 0 |
| JA | 6 | 0 |
| **Total** | **229** | **134** |

Además:

- ContentPages: 74 total / 69 publicadas.
- Las 134 recetas españolas publicadas tienen imagen.
- 118/134 recetas españolas publicadas no tienen categoría.
- 110/134 no tienen prep/cook completos.
- 110/134 no tienen servings.

**Conclusión:** la taxonomía actual no puede considerarse una taxonomía editorial válida. El campo `category` es demasiado incompleto y heterogéneo para convertirse directamente en la navegación definitiva.

### 2.3 Estado visual actual

La interfaz existente es deliberadamente provisional:

- Home: título + una receta destacada + cuadrícula de recetas.
- Listado: título + cuadrícula + paginación.
- RecipeDocument: título, excerpt, contenido editorial, imagen, ingredientes y pasos.
- CSS actual: estilo editorial genérico basado en Georgia, fondo claro, tarjetas redondeadas y acento marrón.

El propio código marca identidad visual y tipografía como TODO de diseño.

**Conclusión:** no se considera diseño de producto. Se conserva como infraestructura/prototipo funcional mientras la Fase 1 permanezca abierta.

### 2.4 Problemas de producto detectados

1. No existe todavía una arquitectura de navegación completa.
2. No existe una taxonomía editorial normalizada.
3. La búsqueda y el filtrado todavía no forman una experiencia de descubrimiento.
4. La home no expresa todavía una propuesta de valor ni un sistema de descubrimiento.
5. La receta todavía no está optimizada como herramienta para cocinar.
6. No existe Design System.
7. No existe identidad de marca aprobada.
8. No existe dirección fotográfica aprobada.
9. No existe modelo definitivo de relación Recipe / Collection / Guide / ContentPage / Ingredient / Technique.
10. La arquitectura SEO histórica está avanzada, pero debe permanecer subordinada al URL Master y no al revés.

---

## 3. Patrimonio SEO y URLs

El proyecto ya contiene un trabajo de recuperación histórica que debe considerarse una restricción de producto/arquitectura.

El URL Master registra:

- 1.000 URLs principales de Search Console.
- 10.403 clics y 528.274 impresiones en el periodo 2025-05-23 → 2026-09-21.
- URLs multilingües históricas con tráfico relevante.
- evidencia de relación entre URLs multilingües y recetas fuente mediante TranslatePress.
- regla explícita: una URL histórica con valor no se cambia automáticamente solo porque la nueva arquitectura prefiera otra estructura.

**Principio de diseño:** la nueva IA debe poder crecer sin destruir el patrimonio histórico.

No se considera aprobada ninguna migración masiva de URL durante esta fase.

---

# 4. Investigación UX / benchmark

## 4.1 Patrones observados

### BBC Good Food

El catálogo combina:

- recetas;
- colecciones;
- guías;
- filtros;
- navegación por categorías;
- inspiración estacional;
- contenidos editoriales.

Su búsqueda muestra filtros como autor, calorías, raciones, tiempo total, cocina, dieta y dificultad.

**Hecho observado:** una plataforma madura separa el catálogo de recetas de colecciones y contenido editorial, y utiliza atributos para refinar resultados.

**Patrón:** categoría + colección + filtro no son la misma entidad.

**Implicación para Manual de Cocina:** no convertir tiempo, dificultad, cocina o dieta en categorías principales.

### Serious Eats

El contenido mezcla recetas con piezas editoriales y colecciones temáticas.

**Hecho observado:** el descubrimiento editorial puede convivir con el catálogo de recetas sin que ambos tipos de página sean estructuralmente idénticos.

**Patrón:** la receta es una unidad de contenido; el artículo/colección es una unidad editorial diferente.

**Implicación:** Manual de Cocina debe distinguir Recipe, Collection y Content/Guide desde el modelo de información.

### Baymard — búsqueda y filtros

La investigación de Baymard sobre búsqueda muestra que la experiencia no termina en el campo de búsqueda: importan autocomplete, lógica de resultados, orientación ante consultas parciales, resultados sin coincidencias y filtros.

Su investigación de filtros también muestra que el valor no está en acumular filtros sino en priorizar atributos relevantes y hacer comprensible el efecto de las selecciones.

**Implicación:** el buscador de Manual de Cocina será una herramienta de descubrimiento, no un input decorativo.

### Google Search Central

Google documenta `Recipe` structured data para recetas y `ItemList` para páginas que agrupan recetas. También exige que los datos estructurados representen realmente el contenido de la página.

**Implicación:** la arquitectura editorial debe distinguir claramente una Recipe de una página que lista recetas y de una pieza editorial.

### WCAG 2.2

WCAG 2.2 incorpora requisitos explícitos para foco visible, entre otros criterios de accesibilidad.

**Implicación:** accesibilidad será parte del sistema de componentes desde el principio, no una corrección posterior.

---

# 5. Hipótesis de producto

Estas son hipótesis de trabajo, NO decisiones cerradas.

Manual de Cocina debe funcionar como:

**descubrir → encontrar → decidir → cocinar → volver → descubrir**

No como:

**buscar receta → abrir artículo → salir**

### Propuesta de valor en estudio

Una biblioteca culinaria editorial que permita encontrar una receta adecuada rápidamente y cocinarla con la menor fricción posible, mientras ofrece caminos de descubrimiento por ingredientes, categorías, técnicas, cocinas, ocasiones y colecciones.

---

# 6. Arquitectura de información — propuesta inicial

## 6.1 Tipos de contenido

Propuesta para validar:

1. **Recipe**
2. **Collection**
3. **Guide**
4. **Article / ContentPage**
5. **Ingredient**
6. **Technique**
7. **Category**

No todos tienen que ser navegables desde el menú principal.

## 6.2 Regla taxonómica

Separar:

### Categoría
Describe qué tipo de plato/contenido es.

### Filtro
Describe una propiedad útil para reducir resultados.

### Etiqueta
Describe una característica secundaria o contextual.

### Colección
Agrupa recetas por una intención editorial concreta.

### Ingrediente
Entidad navegable cuando exista suficiente contenido.

### Técnica
Entidad navegable cuando exista suficiente contenido.

### Cocina
Atributo/filtro y posible landing cuando el volumen lo justifique.

---

# 7. Taxonomía — estado

**NO APROBADA.**

El inventario real demuestra que todavía no es seguro fijar categorías finales.

Ejemplos de categorías actualmente existentes:

- Sopas y cremas
- Platos fuertes
- Plato principal
- Entradas y picadas
- Bebidas
- Empanadas
- Panadería
- Pollo
- Postres
- Salsas y aderezos
- Guisos y legumbres
- Ensaladas
- Guarniciones

Pero aparecen con muy pocos registros y existe mezcla de categorías por idioma.

**Regla:** no reutilizar automáticamente estos valores como navegación.

### Siguiente auditoría taxonómica

Clasificar las recetas reales por:

- tipo de plato;
- momento de consumo;
- ingrediente principal;
- técnica;
- cocina/origen;
- tiempo;
- dificultad;
- dieta;
- temporada;
- ocasión.

Después medir frecuencia y utilidad de cada atributo.

---

# 8. Navegación — opciones a comparar

## Opción A — Navegación compacta

- Recetas
- Categorías
- Colecciones
- Guías
- Buscar

**Ventaja:** simple y escalable.  
**Inconveniente:** depende más de páginas internas para descubrir categorías.  
**Impacto técnico:** bajo.  
**Impacto UX:** claro.  
**Escalabilidad:** alta.

## Opción B — Navegación por descubrimiento

- Recetas
- Por categoría
- Por ingrediente
- Por cocina
- Colecciones
- Guías

**Ventaja:** potencia el descubrimiento.  
**Inconveniente:** mayor densidad de navegación.  
**Impacto técnico:** medio.  
**Impacto UX:** alto potencial, requiere buena jerarquía.  
**Escalabilidad:** alta si se implementa como menú estructurado.

## Opción C — Navegación editorial

- Recetas
- Inspiración
- Técnicas
- Ingredientes
- Colecciones
- Buscar

**Ventaja:** construye una identidad editorial diferenciada.  
**Inconveniente:** puede ocultar categorías culinarias tradicionales.  
**Impacto técnico:** medio.  
**Impacto UX:** depende de la taxonomía final.  
**Escalabilidad:** alta.

**Estado:** abiertas. Requieren decisión de producto.

---

# 9. Home — arquitectura propuesta

La home no debe ser una simple cuadrícula.

Estructura candidata:

1. Header / navegación
2. Hero con propuesta de valor
3. Buscador principal
4. Accesos rápidos de descubrimiento
5. Selección editorial
6. Categorías principales
7. Colección destacada
8. Recetas recientes
9. Guía / técnica / ingrediente destacado
10. Módulo estacional cuando exista contenido suficiente
11. Footer

Cada módulo deberá justificar su existencia mediante una función de descubrimiento.

---

# 10. Página de categoría

Debe resolver:

- dónde estoy;
- qué contiene la categoría;
- cuántas recetas existen;
- cómo refinar;
- cómo ordenar;
- qué receta elegir.

Estructura candidata:

Breadcrumb → H1 + descripción → imagen/contexto → filtros → ordenación → resultados → paginación/carga → contenido relacionado.

Grid y lista no deben ser intercambiables por defecto: se decidirá según tarea y densidad informativa.

---

# 11. Búsqueda

La búsqueda debe soportar, como mínimo:

- título;
- ingrediente;
- categoría;
- cocina;
- atributos;
- filtros;
- consultas parciales;
- estados sin resultados;
- sugerencias;
- filtros activos;
- URL compartible.

### Principio

Una consulta como:

**pollo rápido**

no debería tratarse únicamente como texto literal si existen atributos que permiten interpretar “rápido” como una restricción de tiempo.

La lógica exacta de búsqueda queda pendiente de diseño técnico y de la taxonomía aprobada.

---

# 12. Página de receta — experiencia objetivo

La receta debe diseñarse como herramienta de cocina.

Orden conceptual candidato:

1. Breadcrumb
2. Título
3. Contexto / introducción
4. Imagen principal
5. Información rápida
6. Controles de raciones
7. Ingredientes
8. Instrucciones
9. Notas
10. Sustituciones
11. Conservación
12. Compartir / imprimir
13. Recetas relacionadas
14. Próximo descubrimiento

Funciones candidatas:

- selector de raciones;
- escalado automático de cantidades;
- modo cocina;
- mantener pantalla activa;
- navegación entre pasos;
- impresión limpia.

No todas se implementarán: primero se validará su valor.

---

# 13. Editorial

Modelo conceptual:

### Recipe
Contenido destinado a cocinar un plato concreto.

### Collection
Conjunto editorial de recetas relacionadas.

### Guide
Contenido práctico de mayor profundidad, por ejemplo una técnica o proceso.

### Article / ContentPage
Contenido editorial que no es una receta.

### Ingredient
Página centrada en un ingrediente cuando exista suficiente contenido.

### Technique
Página centrada en una técnica cuando exista suficiente contenido.

Regla: no convertir una página en Recipe únicamente porque contenga una receta dentro de su HTML.

---

# 14. Identidad de marca — todavía abierta

No se elige logo, color o tipografía en esta versión.

Se estudiarán tres direcciones de marca como máximo.

Cada dirección deberá incluir:

- concepto;
- personalidad;
- wordmark;
- símbolo;
- favicon;
- paleta;
- tipografía;
- tratamiento fotográfico;
- ejemplos de aplicación;
- ventajas;
- inconvenientes;
- impacto técnico;
- escalabilidad.

La identidad deberá funcionar en:

- favicon;
- móvil;
- desktop;
- impresión;
- redes;
- imágenes compartidas;
- UI;
- modo cocina.

---

# 15. Dirección artística

Pendiente de investigación específica.

Debe definir:

- fotografía;
- relación imagen/texto;
- proporciones;
- encuadres;
- fondos;
- tratamiento de color;
- iconografía;
- ilustración;
- textura;
- bordes;
- sombras;
- radios;
- densidad.

Principio: la comida debe ser protagonista sin perjudicar la lectura ni la tarea de cocinar.

---

# 16. Design System

Componentes a diseñar:

- Header
- Navigation
- Search
- Buttons
- Inputs
- Selects
- Filters
- Chips
- Badges
- RecipeCard
- CategoryCard
- CollectionCard
- Breadcrumbs
- Tabs
- Modal
- Tooltip
- Alert
- Empty state
- Skeleton
- Pagination
- Footer
- Recipe metadata
- Ingredient list
- Step list
- Cooking controls

Cada componente tendrá:

- default
- hover
- focus
- active
- disabled
- loading
- error

---

# 17. Responsive

Orden de diseño:

**móvil → tablet → desktop**

La versión móvil no será un desktop reducido.

Prioridad especial:

- búsqueda;
- filtros;
- lectura de ingredientes;
- pasos;
- navegación;
- targets táctiles;
- modo cocina;
- imágenes.

---

# 18. Accesibilidad

Objetivos:

- contraste suficiente;
- foco visible;
- teclado;
- labels;
- HTML semántico;
- targets táctiles adecuados;
- texto alternativo;
- estados accesibles;
- reduced motion;
- jerarquía de encabezados.

---

# 19. SEO

La arquitectura deberá preservar:

- URLs históricas de valor;
- canonical;
- hreflang;
- breadcrumbs;
- enlaces internos;
- Recipe structured data;
- ItemList donde corresponda;
- Article structured data donde corresponda;
- sitemap;
- robots;
- control de páginas duplicadas;
- estrategia de paginación.

La arquitectura SEO existente se considera infraestructura aprovechable, no diseño definitivo.

---

# 20. Wireframes obligatorios

Se crearán en desktop y móvil:

1. Home
2. Índice de recetas
3. Categoría
4. Búsqueda
5. Resultados filtrados
6. Receta
7. Colección
8. Guía/artículo
9. Ingrediente
10. Técnica
11. About
12. 404

---

# 21. Fases siguientes

### Fase 1A — Auditoría de contenido
- clasificar las 229 Recipes;
- clasificar las 74 ContentPages;
- detectar duplicados;
- detectar entidades;
- medir frecuencia de atributos;
- mapear ingredientes;
- mapear técnicas;
- mapear cocinas;
- revisar URLs históricas.

### Fase 1B — Taxonomía
Proponer máximo 3 modelos.

### Fase 1C — Arquitectura
Definir IA, navegación y URLs.

### Fase 1D — UX
Diseñar flujos y wireframes.

### Fase 1E — Marca
Presentar máximo 3 direcciones visuales.

### Fase 1F — Design System
Cerrar tokens y componentes.

### Fase 1G — Cierre
Registrar decisiones aprobadas y generar:

**DISEÑO CERRADO — v1.0**

Solo después comienza la implementación visual definitiva.

---

# 22. Control de decisiones

Formato obligatorio:

**DECISIÓN D-001**

- Tema:
- Opciones:
- Decisión:
- Motivo:
- Fecha:
- Estado:

Una decisión marcada **APROBADA** no se modifica sin una nueva decisión.

---

# 23. Decisiones actuales

No existen todavía decisiones de marca o UX aprobadas en este documento.

### D-001 — Regla de proceso

**Tema:** Orden de trabajo.  
**Decisión:** investigación y arquitectura antes de implementación visual.  
**Motivo:** evitar construir una interfaz provisional sin producto, IA, taxonomía y sistema visual definidos.  
**Estado:** APROBADA como regla de proceso.  
**Fecha:** 2026-09-25.

### D-002 — Taxonomía

**Tema:** uso del campo category actual.  
**Decisión:** NO usarlo todavía como taxonomía definitiva.  
**Motivo:** 118/134 recetas españolas publicadas no tienen categoría y existen valores heterogéneos por idioma.  
**Estado:** APROBADA como bloqueo de implementación; taxonomía final pendiente.

---

# 24. Fuentes de investigación inicial

- Google Search Central — Recipe structured data: https://developers.google.com/search/docs/appearance/structured-data/recipe
- W3C WAI — WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/
- Baymard — Search UX: https://baymard.com/research/ecommerce-search
- Baymard — Product Lists & Filtering: https://baymard.com/research/ecommerce-product-lists
- BBC Good Food — Recipes: https://www.bbcgoodfood.com/recipes
- Serious Eats — Recipes: https://www.seriouseats.com/

---

# 25. Criterio de cierre

La fase no puede cerrarse hasta aprobar:

- estrategia;
- arquitectura;
- taxonomía;
- navegación;
- home;
- categorías;
- búsqueda;
- filtros;
- receta;
- editorial;
- logo;
- favicon;
- colores;
- tipografía;
- Design System;
- responsive;
- accesibilidad;
- SEO;
- wireframes;
- arquitectura técnica necesaria.

Cuando todo esté aprobado:

# DISEÑO CERRADO — v1.0

Y solo entonces se implementa.
