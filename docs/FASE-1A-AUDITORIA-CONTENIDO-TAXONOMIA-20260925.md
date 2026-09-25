# MANUAL DE COCINA — FASE 1A
## Auditoría de contenido y primera propuesta de taxonomía

**Fecha:** 2026-09-25  
**Estado:** ESTUDIO / NO APROBADO  
**Base:** auditoría directa de Supabase + inventario de recetas publicado + investigación UX externa.

---

## 1. Objetivo

Determinar qué estructura de información puede soportar Manual de Cocina sin depender del campo `category` actual y sin diseñar la navegación antes de entender el contenido real.

La pregunta no es:

> “¿Qué categorías suelen tener las webs de recetas?”

La pregunta es:

> “¿Qué estructura necesita Manual de Cocina para organizar su contenido actual y crecer con contenido futuro?”

---

# 2. Hallazgo principal

El catálogo publicado en español contiene **134 recetas**, pero **118 no tienen categoría**.

Por tanto, el campo `category` actual solo describe una pequeña parte del catálogo y además contiene valores conceptualmente mezclados:

- tipo de plato: “Sopas y cremas”
- curso: “Plato principal”
- ingrediente/proteína: “Pollo”
- técnica/formato: “Empanadas”
- origen/cocina: “Comida mexicana”
- panadería: “Panadería”
- salsas: “Salsas y aderezos”

Esto demuestra que `category` no representa una sola dimensión semántica.

**Decisión operativa:** el campo actual queda fuera de la navegación definitiva hasta completar la normalización.

---

# 3. El catálogo real ya revela varias dimensiones

La colección publicada contiene ejemplos de:

### Platos / preparaciones

- Ajiaco
- Arepa
- Arroz
- Burrito
- Canelones
- Cheesecake
- Crepes
- Empanadas
- Ensaladas
- Lasaña
- Muffins
- Pancakes
- Pasta
- Pizza
- Risotto
- Sushi
- Tarta
- Torta
- Tortilla
- Wrap

### Proteínas / ingredientes protagonistas

- pollo
- cerdo
- carne de res
- pescado
- trucha
- camarones
- langostinos
- mejillones
- pulpo
- cangrejo
- huevos
- garbanzos
- lentejas
- verduras

### Cocinas / procedencias reconocibles

- colombiana
- mexicana
- peruana
- argentina
- japonesa
- india
- italiana
- española
- tailandesa
- china
- alemana
- internacional

### Técnicas o formatos

- al horno
- frito
- al ajillo
- glaseado
- relleno
- marinados/adobados
- sopas/cremas
- bebidas
- panadería
- postres

### Intenciones potenciales

- rápido
- saludable
- desayuno
- acompañamiento
- comida principal
- bebida
- postre
- ocasión especial

**Importante:** estas dimensiones se observan en el contenido, pero no significa todavía que todas deban convertirse en páginas navegables.

---

# 4. El modelo de datos ya permite más de una dimensión

La tabla `recipes` dispone actualmente de campos separados para:

- `category`
- `difficulty`
- `course`
- `cuisine`
- `prep_time_minutes`
- `cook_time_minutes`
- `total_time_minutes`
- `keywords`
- `nutrition`
- `ingredients`
- `steps`
- `gallery`
- `video_urls`
- `seo`
- `public_path`

Esto es importante.

No necesitamos convertir `category` en un campo gigantesco que intente resolver toda la clasificación.

La arquitectura correcta puede utilizar varias dimensiones independientes.

---

# 5. Propuesta conceptual de taxonomía

## Nivel A — Tipo de contenido

No es una categoría culinaria.

Define qué es la página:

- Receta
- Colección
- Guía
- Artículo
- Ingrediente
- Técnica

---

## Nivel B — Categoría culinaria

Debe responder:

> “¿Qué clase de preparación es?”

Candidatos iniciales:

1. Platos principales
2. Entrantes y aperitivos
3. Sopas y cremas
4. Ensaladas
5. Guarniciones
6. Salsas y aderezos
7. Panes y masas
8. Postres
9. Desayunos y brunch
10. Bebidas

Estos son **candidatos**, no categorías aprobadas.

---

# 6. Nivel C — Ingrediente protagonista

No debe sustituir a la categoría.

Ejemplos:

- Pollo
- Cerdo
- Res
- Pescado
- Mariscos
- Huevos
- Legumbres
- Verduras
- Arroz
- Pasta

La página o filtro de ingrediente solo debe existir cuando haya suficiente contenido y valor de navegación.

---

# 7. Nivel D — Cocina

Ejemplos observables en el catálogo:

- Colombiana
- Mexicana
- Peruana
- Argentina
- Italiana
- Española
- Japonesa
- India
- Tailandesa
- China
- Alemana

La cocina debería ser inicialmente **atributo/filtro**.

Podrá convertirse en landing cuando el volumen y la calidad editorial lo justifiquen.

---

# 8. Nivel E — Tiempo

No debería convertirse en categoría.

Candidatos:

- Hasta 15 min
- Hasta 30 min
- Hasta 45 min
- 45–60 min
- Más de 60 min

Pero la clasificación final debe salir de los valores reales y de una definición consistente de `total_time_minutes`.

---

# 9. Nivel F — Dificultad

Candidatos:

- Fácil
- Intermedia
- Avanzada

Solo se utilizará si los valores se normalizan y tienen significado editorial claro.

---

# 10. Nivel G — Curso / momento

Aquí hay que evitar mezclar conceptos.

`course` puede servir para:

- Desayuno
- Entrante
- Principal
- Guarnición
- Postre
- Bebida

Mientras que “ocasión” puede ser:

- Navidad
- Fin de semana
- Cena rápida
- Reunión
- Celebración

Son dimensiones diferentes.

---

# 11. Nivel H — Etiquetas

Las etiquetas pueden cubrir conceptos secundarios:

- vegetariano
- saludable
- económico
- familiar
- picante
- sin horno
- meal prep
- temporada

Pero no deben convertirse en un cajón donde se almacene cualquier cosa.

---

# 12. Primera propuesta de navegación

Con los datos actuales, la arquitectura que mejor encaja como **hipótesis** es:

## Navegación principal

**Recetas · Categorías · Colecciones · Guías · Buscar**

Y dentro de Recetas:

- Todas
- Por categoría
- Por ingrediente
- Por cocina
- Por tiempo
- Por dificultad

Esto mantiene el header limpio y permite crecer sin introducir diez elementos de primer nivel.

---

# 13. Por qué no recomiendo todavía “Por ingrediente” como elemento principal

El catálogo sí contiene muchos ingredientes protagonistas.

Pero la cantidad no basta.

Para convertir una dimensión en navegación principal necesitamos:

1. suficiente volumen;
2. consistencia;
3. nombres normalizados;
4. páginas útiles;
5. posibilidad de crecimiento;
6. valor para descubrir recetas.

La existencia de “pollo” en algunas recetas no significa automáticamente que “Pollo” merezca una sección principal.

---

# 14. Búsqueda: descubrimiento semántico

La investigación de Baymard muestra que una búsqueda robusta debe contemplar distintos tipos de consultas, atributos, autocomplete, resultados y estados sin resultados. citeturn0search0turn0search1

Para Manual de Cocina esto se traduce en una hipótesis concreta:

### “pollo”

Debe devolver recetas relacionadas.

### “pollo rápido”

Debería poder combinar:

- ingrediente = pollo
- tiempo = rápido

### “postre chocolate”

Debería poder combinar:

- categoría = postres
- ingrediente = chocolate

### “comida mexicana”

Debería poder interpretar:

- cocina = mexicana

No se implementará todavía esta lógica.

Primero debemos normalizar los datos que permitirán hacerla.

---

# 15. Filtros: regla de diseño

La investigación de Baymard sobre listados y filtrado muestra que la navegación funciona como un sistema compuesto de listado + filtros + ordenación, y que los filtros aplicados deben ser visibles y comprensibles. citeturn0search2turn0search5

Para Manual de Cocina, los filtros candidatos son:

### Primarios

- Categoría
- Ingrediente
- Cocina
- Tiempo

### Secundarios

- Dificultad
- Curso
- Dieta
- Ocasión
- Técnica

No significa que todos aparezcan siempre.

El sistema deberá mostrar únicamente filtros relevantes para el contexto.

---

# 16. Recipe como unidad de producto

La receta no debería parecer un artículo de blog genérico.

Debe responder rápidamente:

- ¿Qué voy a cocinar?
- ¿Cómo queda?
- ¿Cuánto tarda?
- ¿Para cuántas personas?
- ¿Qué necesito?
- ¿Cómo lo hago?
- ¿Qué puedo sustituir?
- ¿Qué hago después?

Google confirma que Recipe structured data puede comunicar a Search información como tiempos, imagen, nutrición y otros datos de receta. citeturn0search3

Por tanto, los datos estructurados y la experiencia de usuario deben derivarse del mismo modelo de Recipe.

---

# 17. Nuevo principio de arquitectura

No vamos a construir:

**Categoría → recetas**

como única estructura.

Vamos a construir:

**Contenido → taxonomías → atributos → búsqueda → colecciones → relaciones**

Esto permite que una misma receta pueda pertenecer simultáneamente a:

- una categoría;
- una cocina;
- varios ingredientes;
- una colección;
- una ocasión;
- varias búsquedas;
- una técnica.

Sin duplicar la receta.

---

# 18. Tres modelos de arquitectura que debemos comparar

## MODELO A — CATEGORÍA TRADICIONAL

### Estructura

Recetas  
→ Categorías  
→ Recetas

Con filtros básicos.

### Ventajas

- muy fácil de entender;
- implementación sencilla;
- navegación clásica;
- bajo coste inicial.

### Problemas

- poco descubrimiento;
- depende demasiado de categorías;
- no representa bien la riqueza del catálogo;
- puede terminar en muchas categorías.

---

## MODELO B — CATÁLOGO FACETADO

### Estructura

Recetas  
→ resultados  
→ filtros por atributos

Categoría, ingrediente, cocina, tiempo, dificultad, etc.

### Ventajas

- flexible;
- escalable;
- excelente para búsquedas combinadas;
- no obliga a una receta a una sola clasificación.

### Problemas

- requiere datos muy limpios;
- puede ser menos editorial;
- depende mucho de la calidad del buscador.

---

## MODELO C — EDITORIAL + CATÁLOGO

### Estructura

Recetas  
Categorías  
Colecciones  
Guías  
Ingredientes  
Técnicas

con un catálogo facetado debajo.

### Ventajas

- combina SEO, descubrimiento y contenido editorial;
- permite construir marca;
- facilita colecciones;
- permite crecer a largo plazo.

### Problemas

- mayor complejidad;
- requiere un modelo de contenido más rico;
- necesita más trabajo editorial.

---

# 19. Investigación externa: conclusión provisional

La evidencia UX consultada favorece tratar búsqueda, navegación, resultados y filtrado como partes de un único sistema de descubrimiento, no como funciones aisladas. citeturn0search0turn0search2

La documentación de Google también separa conceptualmente la receta individual del listado de recetas mediante diferentes datos estructurados. citeturn0search3

**Esto refuerza la hipótesis de que Manual de Cocina no debería ser simplemente un blog de recetas con categorías.**

Pero todavía no convierte el Modelo C en una decisión aprobada.

---

# 20. Próximo trabajo obligatorio

Antes de decidir el modelo:

### Auditoría 1A.2

Normalizar el catálogo en una matriz:

| Receta | Tipo | Categoría | Ingrediente | Cocina | Curso | Técnica | Tiempo | Dificultad | Ocasión |
|---|---|---|---|---|---|---|---|---|---|

Después:

1. medir frecuencia;
2. detectar huecos;
3. detectar duplicados;
4. detectar sinónimos;
5. detectar atributos inexistentes;
6. detectar atributos demasiado pequeños;
7. calcular qué dimensiones justifican filtros;
8. calcular cuáles justifican landings;
9. construir navegación;
10. presentar los 3 modelos con evidencia del catálogo.

---

# 21. Estado actual de decisiones

### D-001 — Proceso
**APROBADA**

Investigación → arquitectura → diseño → implementación.

### D-002 — category actual
**APROBADA**

No utilizar el campo actual como taxonomía definitiva.

### D-003 — Taxonomía multidimensional
**EN ESTUDIO**

La arquitectura deberá separar categoría, ingrediente, cocina, tiempo, dificultad, curso, técnica, ocasión y etiquetas en lugar de intentar resolverlo todo mediante `category`.

### D-004 — Modelo editorial
**EN ESTUDIO**

Recipe / Collection / Guide / Article / Ingredient / Technique.

---

# 22. Criterio para pasar a Fase 1B

No se pasa a diseño visual.

Primero hay que conseguir:

**CATÁLOGO NORMALIZADO → TAXONOMÍA → IA → NAVEGACIÓN**

Cuando eso esté cerrado, entonces sí:

**WIREFRAMES → MARCA → DESIGN SYSTEM → IMPLEMENTACIÓN**

---

## Fuentes externas utilizadas en esta fase

- Baymard — E-Commerce Search UX. https://baymard.com/research/ecommerce-search
- Baymard — Product Lists & Filtering UX. https://baymard.com/research/ecommerce-product-lists
- Baymard — Search Query Types. https://baymard.com/research-articles/ecommerce-search-query-types
- Google Search Central — Recipe structured data. https://developers.google.com/search/docs/appearance/structured-data/recipe

