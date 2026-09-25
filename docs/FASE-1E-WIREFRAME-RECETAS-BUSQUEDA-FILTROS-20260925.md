# FASE 1E — WIREFRAME: RECETAS, BÚSQUEDA, FILTROS Y RESULTADOS

**Proyecto:** Manual de Cocina  
**Ruta documental:** `docs/FASE-1E-WIREFRAME-RECETAS-BUSQUEDA-FILTROS-20260925.md`  
**Estado:** ESTUDIO / PROPUESTA FUNCIONAL — NO IMPLEMENTAR TODAVÍA  
**Fecha:** 2026-09-25

---

## 1. OBJETIVO

Definir cómo una persona descubre recetas dentro de Manual de Cocina.

Esta pantalla no debe ser simplemente un listado de tarjetas. Debe funcionar como el **motor de descubrimiento del producto**:

> intención → búsqueda → refinamiento → resultados → elección → receta

Google contempla páginas resumen/listado de recetas y datos `ItemList` para colecciones de recetas, siempre que la página realmente liste las recetas y las URLs sean únicas y coherentes. Esto refuerza la decisión de tratar el catálogo como una parte real del producto y no como un conjunto de filtros visuales.  
Fuente: Google Search Central — Recipe / ItemList structured data.

---

## 2. PRINCIPIO DE PRODUCTO

### La pregunta que debe resolver /recetas/

No:

> “¿Qué recetas tenemos?”

Sino:

> “¿Cómo encuentro algo que pueda cocinar ahora?”

La interfaz debe permitir tanto:

- exploración sin criterios;
- búsqueda por nombre;
- búsqueda por ingrediente;
- búsqueda por intención;
- combinación de filtros;
- descubrimiento desde categorías;
- descubrimiento desde cocina;
- descubrimiento desde tiempo;
- descubrimiento desde dificultad.

---

# 3. DESKTOP — WIREFRAME FUNCIONAL

```
┌──────────────────────────────────────────────────────────────┐
│ LOGO   RECETAS   CATEGORÍAS   COLECCIONES   GUÍAS   🔍      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Inicio / Recetas                                             │
│                                                              │
│ Todas las recetas                                            │
│ Encuentra qué cocinar hoy.                                   │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 🔍 ¿Qué quieres cocinar?   pollo, pasta, chocolate...  │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ Filtros                                                     │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│ │ Categoría ▼  │ │ Ingrediente▼ │ │ Cocina ▼     │          │
│ └──────────────┘ └──────────────┘ └──────────────┘          │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│ │ Tiempo ▼     │ │ Dificultad▼  │ │ Momento ▼    │          │
│ └──────────────┘ └──────────────┘ └──────────────┘          │
│                                                              │
│ [× Pollo] [× <30 min]                     Limpiar filtros    │
│                                                              │
│ 128 recetas                                                 │
│                                      Ordenar: Relevancia ▼   │
│                                                              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │   IMAGEN   │ │   IMAGEN   │ │   IMAGEN   │ │   IMAGEN   │ │
│ │            │ │            │ │            │ │            │ │
│ │ Título     │ │ Título     │ │ Título     │ │ Título     │ │
│ │ 30 min     │ │ 45 min     │ │ Fácil      │ │ 20 min     │ │
│ │ categoría  │ │ categoría  │ │ categoría  │ │ categoría  │ │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
│                                                              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │   IMAGEN   │ │   IMAGEN   │ │   IMAGEN   │ │   IMAGEN   │ │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
│                                                              │
│                     1  2  3  4  …                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

# 4. JERARQUÍA VISUAL

El orden de importancia será:

1. **Qué quiero cocinar / búsqueda**
2. **Filtros**
3. **Resultados**
4. **Contexto del resultado**
5. **Ordenación**
6. Navegación secundaria

No se debe colocar una batería de filtros por encima del buscador hasta convertir la página en un formulario.

---

# 5. BUSCADOR

## Función

Debe aceptar lenguaje natural sencillo.

Ejemplos:

- `pollo`
- `pollo rápido`
- `pasta italiana`
- `postres`
- `cena rápida`
- `chocolate`
- `sopa`

La primera versión debe poder interpretar términos que correspondan a dimensiones conocidas del catálogo.

### Evolución prevista

**V1**
- título
- slug
- keywords existentes
- categoría normalizada
- cocina normalizada
- ingredientes cuando estén normalizados

**V2**
- sinónimos
- corrección ortográfica
- intención
- equivalencias semánticas
- combinación de criterios

No se implementará búsqueda semántica avanzada hasta que la taxonomía y los datos estén normalizados.

---

# 6. AUTOCOMPLETADO

Al escribir:

`pollo`

el buscador podrá mostrar:

**Recetas**
- Pollo al horno
- Pollo al ajillo
- Pollo con...

**Categorías**
- Platos principales

**Ingredientes**
- Pollo

**Cocinas**
- ...

La finalidad es ayudar al usuario a convertir una consulta ambigua en una ruta de descubrimiento clara.

---

# 7. CONSULTAS QUE COINCIDEN CON UNA CATEGORÍA

Si alguien escribe exactamente:

> `postres`

no debería recibir solamente una lista genérica de resultados de texto.

Debe poder aparecer una entrada clara:

> **Postres**  
> Explorar todas las recetas de postres →

y debajo los resultados.

Esto permite que una intención de navegación se convierta en una navegación real.

---

# 8. FILTROS

## Filtros primarios

### Categoría
Ejemplos candidatos:

- Platos principales
- Entrantes y aperitivos
- Sopas y cremas
- Ensaladas
- Guarniciones
- Salsas y aderezos
- Panes y masas
- Postres
- Desayunos y brunch
- Bebidas

**Nota:** esta lista continúa EN ESTUDIO hasta cerrar la taxonomía.

### Ingrediente
Ejemplos:

- pollo
- cerdo
- carne de res
- pescado
- mariscos
- huevos
- arroz
- pasta
- patata
- verduras
- legumbres

No se publicará esta lista como definitiva hasta normalizar los ingredientes.

### Cocina

Ejemplos observados en el contenido actual:

- colombiana
- mexicana
- peruana
- argentina
- italiana
- japonesa
- española
- india
- china
- tailandesa
- alemana
- internacional

También requiere normalización antes de convertirse en taxonomía pública definitiva.

---

# 9. FILTROS SECUNDARIOS

- Tiempo
- Dificultad
- Momento / ocasión
- Técnica
- Dieta, cuando exista información fiable
- Curso/plato, cuando esté normalizado

Los filtros no deben aparecer todos abiertos simultáneamente.

La interfaz debe priorizar los criterios más utilizados y permitir descubrir el resto.

---

# 10. FILTRO DE TIEMPO

Propuesta inicial:

- Hasta 15 min
- Hasta 30 min
- Hasta 45 min
- Hasta 60 min
- Más de 60 min

Pero el dato actual está incompleto: gran parte de las recetas publicadas no tiene tiempo total.

Por tanto:

**NO inventar tiempos.**

Una receta sin dato no debe aparecer como “30 min” por inferencia visual.

Primero normalización de datos.

---

# 11. FILTRO DE DIFICULTAD

Propuesta:

- Fácil
- Media
- Difícil

Actualmente existen variantes inconsistentes en los datos (`Fácil`, `facil`, `F'acil`, `Media`, `Medio`, etc.).

Antes de publicar este filtro:

**normalizar valores.**

---

# 12. FILTROS ACTIVOS

Cuando el usuario seleccione:

> Pollo + Hasta 30 min + Mexicana

la interfaz mostrará:

```
[× Pollo] [× Hasta 30 min] [× Mexicana]

                    Limpiar filtros
```

Cada filtro debe poder eliminarse individualmente.

---

# 13. RESULTADOS

Cada tarjeta debe comunicar únicamente información útil.

### Tarjeta propuesta

```
┌──────────────────────────┐
│                          │
│          IMAGEN          │
│                          │
├──────────────────────────┤
│ Pollo al ajillo          │
│                          │
│ 30 min · Fácil           │
│ Platos principales       │
└──────────────────────────┘
```

No llenar las tarjetas con:

- párrafos;
- 8 etiquetas;
- datos nutricionales completos;
- texto SEO;
- iconos decorativos sin función.

La tarjeta debe permitir decidir rápidamente si abrir la receta.

---

# 14. ORDENACIÓN

Opciones iniciales:

- Relevancia
- Más recientes

Posibles opciones futuras:

- Tiempo
- Dificultad
- Popularidad

No se implementará una métrica de popularidad hasta disponer de datos reales que la justifiquen.

---

# 15. PAGINACIÓN

La propuesta inicial es:

**paginación real del catálogo.**

Razones:

- URLs controlables;
- menor carga inicial;
- escalabilidad;
- mejor control del rastreo;
- experiencia predecible.

No se utilizará un “infinite scroll” como único mecanismo de navegación.

Podrá evaluarse posteriormente una variante de carga progresiva, pero nunca a costa de perder navegación clara.

---

# 16. NO HAY RESULTADOS

Ejemplo:

> **No encontramos recetas para “pollo + 5 minutos + japonesa”.**

En lugar de una pantalla muerta:

### Prueba esto

- Quitar un filtro
- Buscar solo “pollo”
- Ver recetas rápidas
- Explorar cocina japonesa
- Ver todas las recetas

El estado vacío debe ayudar a continuar descubriendo.

---

# 17. MOBILE

En móvil no se debe intentar comprimir todos los filtros de escritorio.

Propuesta:

```
┌─────────────────────────────┐
│ ←  Manual de Cocina    ☰   │
├─────────────────────────────┤
│                             │
│ Recetas                     │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🔍 ¿Qué quieres cocinar?│ │
│ └─────────────────────────┘ │
│                             │
│ [Filtros] [Ordenar]         │
│                             │
│ [× Pollo] [× <30 min]       │
│                             │
│ 24 recetas                  │
│                             │
│ ┌─────────────────────────┐ │
│ │         IMAGEN          │ │
│ │                         │ │
│ │ Pollo al ajillo         │ │
│ │ 25 min · Fácil          │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │         IMAGEN          │ │
│ │                         │ │
│ │ Pollo al horno          │ │
│ │ 40 min · Fácil          │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Panel de filtros móvil

Al pulsar **Filtros**:

```
┌─────────────────────────────┐
│ Filtros                ✕    │
├─────────────────────────────┤
│ Categoría               ›   │
│ Ingrediente             ›   │
│ Cocina                   ›   │
│ Tiempo                   ›   │
│ Dificultad               ›   │
│ Momento                  ›   │
├─────────────────────────────┤
│                             │
│        Limpiar              │
│                             │
│      Ver 24 recetas         │
└─────────────────────────────┘
```

El usuario debe saber cuántos resultados producirá la selección antes de aplicarla cuando técnicamente sea posible.

---

# 18. SEO DE LAS PÁGINAS DE RESULTADOS

No todas las combinaciones de filtros serán páginas indexables.

### Indexables potenciales

- categorías estables;
- ingredientes con suficiente contenido;
- cocinas con suficiente contenido;
- colecciones editoriales;
- páginas resumen reales.

### No indexar automáticamente

```
/recetas?categoria=pollo&tiempo=30&dificultad=facil...
```

La combinación puede ser útil para el usuario sin convertirse automáticamente en una URL SEO.

Esto evita generar miles de páginas casi duplicadas o pobres.

---

# 19. RELACIÓN CON GOOGLE

Las páginas resumen de recetas son especialmente importantes porque Google documenta `ItemList` para listas de recetas y exige que los elementos correspondan a URLs reales y únicas del mismo dominio.

Por tanto, las páginas de:

- categorías;
- colecciones;
- determinadas páginas de ingredientes;
- determinadas páginas de cocina;

deben ser **páginas reales del producto**, no simples estados visuales producidos por JavaScript.

Fuente: Google Search Central, datos estructurados de Recipe e ItemList.

---

# 20. REGLA DE ORO

### Filtros ≠ páginas SEO.

Un filtro existe para ayudar al usuario.

Una página indexable existe porque tiene:

- intención clara;
- contenido suficiente;
- URL estable;
- valor independiente;
- enlaces internos;
- contenido visible;
- relación semántica con el catálogo.

---

# 21. ESTADO DEL DISEÑO

### APROBADO COMO DIRECCIÓN

- /recetas/ será el centro del catálogo.
- búsqueda y filtros forman un único sistema;
- categorías son una dimensión estable;
- ingredientes y cocinas son dimensiones independientes;
- filtros activos serán visibles;
- móvil tendrá panel de filtros;
- no se generarán automáticamente miles de URLs indexables;
- la tarjeta será simple y orientada a decisión;
- el estado sin resultados será accionable;
- el catálogo será preparado para `ItemList` cuando corresponda.

### PENDIENTE

- taxonomía definitiva;
- valores definitivos de cada filtro;
- algoritmo de relevancia;
- sinónimos;
- búsqueda semántica;
- diseño visual;
- componentes finales;
- comportamiento exacto de autocomplete;
- paginación definitiva;
- estrategia final de URLs;
- normalización de datos en Supabase.

---

# 22. DECISIÓN

**D-012 — /recetas/ se define como producto de descubrimiento, no como simple grid de recetas.**

Estado: **PROPUESTA PARA CIERRE**

---

# 23. SIGUIENTE BLOQUE

El siguiente wireframe será:

**FASE 1E — PÁGINA DE RECETA**

Aquí definiremos la experiencia completa de cocinar:

1. breadcrumb;
2. título;
3. imagen;
4. resumen;
5. tiempo;
6. dificultad;
7. porciones;
8. ingredientes;
9. cantidades ajustables;
10. pasos;
11. notas;
12. consejos;
13. vídeo cuando exista;
14. navegación relacionada;
15. recetas similares;
16. datos estructurados;
17. experiencia móvil;
18. modo de cocina.

Después de cerrar esa experiencia, pasaremos al estudio específico de:

**MARCA → LOGO → FAVICON → COLOR → TIPOGRAFÍA → ICONOGRAFÍA → DIRECCIÓN ARTÍSTICA.**

---

## FUENTES EXTERNAS CONSULTADAS

- Google Search Central — Recipe structured data.
- Google Search Central — Carousel / ItemList structured data.
- Love2Feed — ejemplo actual de motor de descubrimiento de recetas por ingrediente, cocina y tiempo.

Estas fuentes sirven como referencia externa; las decisiones de Manual de Cocina siguen siendo decisiones de producto propias y permanecen marcadas como propuesta hasta su aprobación.
