# FASE 1B — MATRIZ REAL DE TAXONOMÍA Y DESCUBRIMIENTO
Fecha: 2026-09-25
Estado: ESTUDIO / NO CERRADO

## 1. Base analizada

Fuente: public.recipes de Supabase, recetas en español (language='es') y publicadas=true.

Muestra: 134 recetas publicadas en español.

Este documento separa tres cosas:
- datos actualmente almacenados;
- normalizaciones necesarias;
- decisiones de producto todavía pendientes.

No se considera aprobada ninguna taxonomía final por el mero hecho de aparecer aquí.

## 2. Hallazgo principal

El campo `category` NO puede convertirse directamente en la navegación de Manual de Cocina.

Distribución actual:
- 118/134 recetas no tienen category.
- 5 tienen "Plato principal".
- 2 "Bebidas".
- 2 "Sopas y cremas".
- 2 "Platos fuertes".
- 1 "Pollo".
- 1 "Empanadas".
- 1 "Comida mexicana".
- 1 "Entradas y picadas".
- 1 "Guisos y legumbres".

Además, los valores mezclan dimensiones diferentes: tipo de plato, ingrediente, cocina/origen y otros conceptos.

Conclusión: category actual es legado/incompleto, no arquitectura.

## 3. Otras dimensiones existentes

### Cuisine
La base contiene 35 valores distintos, con problemas de normalización:
- duplicados por mayúsculas/minúsculas: Bebidas/bebidas, Carnes/carnes, Vegetariano/Vegetariana, etc.
- valores que representan tipos de contenido y no cocinas: Postres, Bebidas, Ensaladas, Sopas, Salsas.
- valores válidos de procedencia o estilo: Cocina colombiana, Cocina mexicana, Cocina peruana, Cocina japonesa, Italiana, Gallega, Cocina andaluza, etc.
- valores ambiguos o erróneos: Veterariana, De Mar/De  Mar, Pasta/Pastas.

Conclusión: cuisine también necesita normalización semántica antes de ser un filtro público.

### Course
125/134 están sin course.
Los valores existentes son escasos y heterogéneos: Plato principal, Aperitivo / plato principal, Entrante, Entrada, Aperitivo o plato principal.

Conclusión: course no está suficientemente poblado para ser navegación, pero sí puede convertirse en una dimensión editorial útil si se normaliza y completa.

### Difficulty
Distribución actual:
- Fácil: 83
- Media: 24
- Medio: 14
- fácil: 6
- null: 3
- facil: 2
- Facil: 1
- F'acil: 1

Conclusión: hay una dimensión aprovechable, pero requiere normalización a un vocabulario controlado.

### Tiempo total
Solo 24 de las 134 recetas tienen total_time_minutes informado.

Tramos actuales entre las recetas con dato:
- 0–20 min: 5
- 21–40 min: 3
- 41–60 min: 2
- 61–120 min: 9
- 121+ min: 5
- sin dato: 110

Conclusión: "rápido" puede ser una futura experiencia de descubrimiento, pero no debe prometerse como filtro fiable hasta completar/derivar los tiempos.

## 4. Lo que realmente contiene el catálogo

La muestra de títulos y metadatos demuestra que Manual de Cocina ya tiene múltiples ejes de descubrimiento:

1. Tipo de preparación/plato
   - sopas y cremas
   - ensaladas
   - pasta
   - pizza
   - empanadas
   - wraps
   - bowls
   - tortillas
   - postres
   - bebidas
   - salsas
   - panes/masas, etc.

2. Ingrediente o protagonista
   - pollo
   - cerdo
   - res
   - pescado/trucha
   - camarones/langostinos
   - mariscos
   - huevos
   - legumbres
   - verduras
   - frutas, etc.

3. Cocina/origen
   - colombiana
   - mexicana
   - peruana
   - italiana
   - japonesa
   - argentina
   - española
   - alemana
   - asiática
   - internacional/fusión, etc.

4. Momento o uso
   - desayuno
   - brunch
   - almuerzo
   - cena
   - aperitivo
   - acompañamiento
   - postre
   - bebida
   - ocasión especial.

5. Propiedades prácticas
   - fácil
   - rápido
   - saludable
   - vegetariano/vegano
   - sin horno
   - etc.

6. Técnica
   - al horno
   - frito
   - salteado
   - relleno
   - glaseado
   - fermentado
   - etc.

Estos ejes NO deben convertirse todos en categorías de primer nivel.

## 5. Taxonomía de trabajo propuesta

### Nivel estructural

**Contenido**
- Recetas
- Colecciones
- Guías
- Artículos

**Categoría culinaria**
Debe describir qué tipo de preparación es, no de dónde viene ni qué ingrediente contiene.

Candidatas a validar:
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

Esta lista es candidata, no definitiva.

### Facetas secundarias

**Ingrediente principal**
Ej.: pollo, cerdo, res, pescado, mariscos, verduras, legumbres.

**Cocina / origen**
Ej.: colombiana, mexicana, italiana, japonesa, peruana, argentina.

**Tiempo**
Derivado de total_time_minutes cuando exista; después puede completarse editorialmente.

**Dificultad**
Vocabulario controlado: Fácil / Media / Avanzada, pendiente de decisión.

**Momento**
Desayuno, almuerzo, cena, aperitivo, acompañamiento, postre, bebida, etc.

**Técnica**
Horno, sartén, fritura, cocción lenta, fermentación, etc.

**Etiquetas**
Solo para conceptos secundarios que no justifican una faceta propia.

## 6. Regla que queda establecida para el diseño

Una cosa = una función semántica.

- Categoría = qué tipo de receta es.
- Ingrediente = con qué protagonista se prepara.
- Cocina = de qué tradición/origen es.
- Tiempo = cuánto tarda.
- Dificultad = qué complejidad tiene.
- Momento = cuándo/para qué se sirve.
- Técnica = cómo se prepara.
- Tag = descriptor secundario.

No se deben mezclar estas dimensiones dentro del mismo menú.

## 7. Implicación directa para búsqueda

La búsqueda no debe limitarse a coincidencia textual de títulos.

Ejemplos de intención que el sistema debe poder interpretar:
- "pollo"
- "pollo rápido"
- "postre sin horno"
- "comida mexicana"
- "sopa de lentejas"
- "receta fácil para desayuno"

La búsqueda puede traducir calificadores a facetas cuando exista información fiable.

Esto coincide con la investigación UX revisada: las experiencias de búsqueda maduras deben conectar consulta, resultados y filtrado, y las consultas que expresan atributos o usos se benefician de ser interpretadas como criterios de refinamiento. [Baymard]

## 8. Implicación SEO

Las páginas de colecciones/categorías deben ser páginas reales de descubrimiento, no simples filtros visuales.

Google documenta que una colección de recetas puede apoyarse en ItemList y que debe existir una página resumen que liste las recetas relacionadas. Cada receta individual puede utilizar Recipe structured data. [Google Search Central]

Por tanto, arquitectura y SEO deben diseñarse conjuntamente:
- categoría indexable cuando tenga suficiente contenido;
- colección indexable cuando tenga intención editorial;
- receta individual con datos Recipe;
- URLs estables;
- canonical claro;
- breadcrumbs;
- enlaces internos entre dimensiones.

## 9. Decisión provisional D-005

**La arquitectura de Manual de Cocina será multidimensional, pero no una navegación llena de filtros.**

La navegación principal deberá ser simple.

Las dimensiones secundarias aparecerán:
- en páginas de categoría;
- en páginas de resultados;
- en búsqueda;
- en módulos de descubrimiento;
- en la ficha de receta;
- en colecciones editoriales.

Esto permite que el catálogo sea potente sin convertir el sitio en un panel de administración.

Estado: PROPUESTA / PENDIENTE DE CIERRE.

## 10. Siguiente paso obligatorio

Antes de diseñar logo, colores o UI final, debemos cerrar la arquitectura de información.

La siguiente fase debe producir tres modelos completos y comparables:

### MODELO A — CATEGORÍAS TRADICIONALES
Menú simple + categorías fuertes + filtros secundarios.

### MODELO B — CATÁLOGO FACETADO
Descubrimiento basado en categoría + ingredientes + cocina + tiempo + dificultad.

### MODELO C — EDITORIAL + CATÁLOGO
Recetas como núcleo, complementadas por colecciones, guías y contenido editorial.

Cada modelo deberá especificar:
- menú principal;
- estructura móvil;
- mega menú si aplica;
- home;
- página de categorías;
- resultados de búsqueda;
- filtros;
- URLs;
- breadcrumbs;
- página de receta;
- colecciones;
- SEO;
- enlazado interno;
- escalabilidad internacional;
- implicaciones técnicas en Supabase.

Solo después de comparar A/B/C se cerrará la arquitectura v1.0.

## 11. Estado del proyecto

FASE 1A — Auditoría de contenido/taxonomía: COMPLETADA.
FASE 1B — Matriz de taxonomía: COMPLETADA a nivel de diagnóstico y normalización.
FASE 1C — Modelos de arquitectura A/B/C: SIGUIENTE.
Diseño visual: BLOQUEADO hasta cerrar arquitectura.
Logo/favicon: BLOQUEADO hasta cerrar estrategia de marca y dirección visual.
Implementación: BLOQUEADA hasta cerrar el diseño pactado.

