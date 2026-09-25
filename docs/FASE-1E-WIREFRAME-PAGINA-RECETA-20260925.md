# FASE 1E — WIREFRAME: PÁGINA DE RECETA Y EXPERIENCIA DE COCINAR

**Proyecto:** Manual de Cocina  
**Ruta documental:** `docs/FASE-1E-WIREFRAME-PAGINA-RECETA-20260925.md`  
**Estado:** ESTUDIO / PROPUESTA FUNCIONAL — NO IMPLEMENTAR TODAVÍA  
**Fecha:** 2026-09-25

---

## 1. OBJETIVO

Definir la receta como **herramienta de cocina**, no como artículo de blog.

La página debe resolver tres momentos:

1. **Antes de cocinar:** decidir si la receta sirve.
2. **Durante la preparación:** ejecutar los pasos con la menor fricción posible.
3. **Después:** descubrir qué cocinar a continuación.

La estructura de datos existente ya contempla ingredientes, pasos, tiempos, porciones, imágenes, galería, vídeo, nutrición, categoría, cocina, dificultad y SEO. La interfaz debe aprovechar esos campos sin mostrar datos que todavía no estén suficientemente completos o normalizados.

---

# 2. PRINCIPIO CENTRAL

La receta debe poder leerse de arriba abajo como una página normal, pero también debe poder utilizarse como una **herramienta práctica mientras se cocina**.

No se diseñará inicialmente como una aplicación independiente.

La primera versión debe ser:

**rápida + clara + legible + táctil + imprimible + compartible + indexable.**

---

# 3. DESKTOP — WIREFRAME

```
┌────────────────────────────────────────────────────────────────────┐
│ LOGO   RECETAS   CATEGORÍAS   COLECCIONES   GUÍAS        🔍       │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ Inicio / Recetas / Platos principales                              │
│                                                                    │
│ ┌──────────────────────────────┐  ┌─────────────────────────────┐ │
│ │                              │  │ Pollo al ajillo              │ │
│ │                              │  │                              │ │
│ │          IMAGEN              │  │ Una receta...                │ │
│ │                              │  │                              │ │
│ │                              │  │ ⏱ 35 min  ·  Fácil          │ │
│ │                              │  │ 🍽 4 porciones               │ │
│ └──────────────────────────────┘  │ Cocina: ...                  │ │
│                                   │ Categoría: ...               │ │
│                                   │                              │ │
│                                   │ [Guardar] [Compartir]        │ │
│                                   │ [▶ Modo cocina]              │ │
│                                   └─────────────────────────────┘ │
│                                                                    │
│ INGREDIENTES                                  PREPARACIÓN         │
│                                                                    │
│ Porciones:  [−]  4  [+]                      Paso 1               │
│                                                                    │
│ ☐ 500 g pollo                                 Preparar...          │
│ ☐ 2 dientes ajo                               ...                  │
│ ☐ 1 cda aceite                                [IMAGEN opcional]    │
│                                                                    │
│ ...                                            Paso 2               │
│                                              ...                   │
│                                                                    │
│                                              Paso 3               │
│                                              ...                   │
│                                                                    │
│ CONSEJOS / NOTAS                                                   │
│                                                                    │
│ VÍDEO (si existe)                                                  │
│                                                                    │
│ RECETAS RELACIONADAS                                               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

# 4. CABECERA DE RECETA

Orden:

1. Breadcrumb.
2. Título.
3. Descripción/resumen.
4. Imagen principal.
5. Información rápida.
6. Acciones.

### Información rápida candidata

- tiempo total;
- preparación;
- cocción;
- dificultad;
- porciones;
- cocina;
- categoría.

**Regla:** si un dato no existe o no está suficientemente validado, no se inventa.

El estado actual de la base de datos demuestra que tiempos, porciones y categorías tienen huecos importantes. Por eso la interfaz debe soportar campos opcionales sin crear falsos datos.

---

# 5. IMAGEN PRINCIPAL

La fotografía debe ser protagonista, pero no debe impedir el acceso inmediato al título y a la información práctica.

Google recomienda para `Recipe` imágenes rastreables y de alta resolución, y señala como formatos útiles 16:9, 4:3 y 1:1. Esto debe considerarse en el sistema de medios, no únicamente en CSS.  
Fuente: Google Search Central — Recipe structured data.

---

# 6. ACCIONES

Acciones candidatas:

### Guardar
Guardar la receta para recuperarla posteriormente.

### Compartir
Compartir la URL de la receta.

### Modo cocina
Abrir la interfaz enfocada exclusivamente en ejecutar la receta.

Estas acciones deben tener una jerarquía clara.

No convertir la cabecera en una barra de 12 botones.

---

# 7. AJUSTE DE PORCIONES

Si la receta dispone de cantidades estructuradas:

```
Porciones

[ − ]  4  [ + ]

500 g pollo
2 dientes ajo
1 cda aceite
```

Al cambiar:

`4 → 6`

las cantidades podrán recalcularse.

### Condición

No hacer cálculo automático sobre texto libre que pueda producir resultados incorrectos.

Primero necesitamos que el modelo de ingredientes distinga:

- cantidad;
- unidad;
- ingrediente;
- preparación/notas.

Por tanto:

**el escalado de cantidades queda como capacidad prevista del producto, pero requiere normalización del modelo de ingredientes antes de implementarse.**

---

# 8. INGREDIENTES

Los ingredientes deben poder escanearse rápidamente.

Propuesta:

```
INGREDIENTES

Para 4 porciones

☐ 500 g de pollo
☐ 2 dientes de ajo
☐ 1 cebolla
☐ 2 cucharadas de aceite
☐ sal
☐ pimienta
```

Las casillas son una función de producto, no decoración.

Permiten marcar ingredientes preparados/adquiridos.

No debemos obligar a utilizarlas si la receta aún no dispone de ingredientes suficientemente estructurados.

---

# 9. PREPARACIÓN

Los pasos deben estar claramente separados.

```
PREPARACIÓN

01
Prepara el pollo...
    
02
Calienta la sartén...

03
Añade el ajo...

04
Cocina durante...
```

Google recomienda representar las instrucciones de recetas con `HowToStep` cuando corresponda y permite enlazar directamente a pasos individuales mediante URL. Esto encaja con una arquitectura donde cada paso tiene identidad propia.  
Fuente: Google Search Central.

---

# 10. PASOS CON IMAGEN

Cuando exista una imagen real del paso:

```
01 — Preparar

Texto del paso...

┌───────────────────────────┐
│       FOTO DEL PASO       │
└───────────────────────────┘
```

No debemos fabricar imágenes de pasos inexistentes.

El sistema debe mostrar imágenes solamente cuando estén asociadas al paso.

---

# 11. MODO COCINA

Esta es una de las funcionalidades que puede convertir Manual de Cocina en una herramienta.

Al pulsar:

**[ MODO COCINA ]**

la interfaz cambia de contexto.

### Objetivo

Eliminar elementos que distraen.

```
┌─────────────────────────────┐
│ ← Salir          3 / 8      │
├─────────────────────────────┤
│                             │
│ PREPARAR EL POLLO           │
│                             │
│ Corta el pollo en...        │
│                             │
│       [ FOTO ]              │
│                             │
│                             │
│                             │
│ [ ← Anterior ] [ Siguiente →]│
└─────────────────────────────┘
```

Características candidatas:

- texto grande;
- contraste alto;
- botones grandes;
- navegación anterior/siguiente;
- progreso;
- pantalla mantenida activa cuando sea técnicamente posible;
- temporizadores asociados a pasos en una fase posterior.

**No se implementará todavía. Primero se define el modelo de interacción.**

---

# 12. TEMPORIZADORES

Futuro:

```
Cocinar durante 20 minutos

[ Iniciar temporizador ]
```

El temporizador debe estar vinculado a un paso concreto.

No convertir la receta en una aplicación de cronómetros independientes.

Esta capacidad queda **FASE FUTURA**.

---

# 13. NOTAS Y CONSEJOS

Separar:

### Notas de la receta
Información editorial relevante.

### Consejos
Recomendaciones prácticas.

### Sustituciones
Solo cuando exista información fiable y editorialmente aprobada.

No mezclar todo en un bloque final de texto.

---

# 14. VÍDEO

Si existe vídeo:

- mostrarlo en una posición relevante;
- mantener la receta completa disponible sin obligar a ver el vídeo;
- evitar que el vídeo sustituya las instrucciones escritas.

Google contempla `VideoObject` dentro del marcado de una receta cuando existe un vídeo que muestra cómo prepararla.  
Fuente: Google Search Central.

---

# 15. NUTRICIÓN

Si existen datos nutricionales fiables:

```
Información nutricional

Por porción
Calorías
Proteínas
Grasas
Carbohidratos
...
```

Pero:

**no mostrar datos nutricionales inventados o calculados sin una base fiable.**

Google indica que si se declara información de calorías por porción mediante `nutrition.calories`, debe existir también `recipeYield`.  
Fuente: Google Search Central.

---

# 16. RECETAS RELACIONADAS

Al final:

> **También puedes cocinar**

Tarjetas relacionadas.

La relación puede basarse posteriormente en:

- categoría;
- ingrediente protagonista;
- cocina;
- técnica;
- ocasión;
- similitud de contenido.

No utilizar simplemente “últimas recetas” como sustituto de un sistema de relación.

---

# 17. NAVEGACIÓN SEMÁNTICA

La receta debe enlazar naturalmente con:

- categoría;
- cocina;
- ingredientes;
- colecciones;
- otras recetas relacionadas.

Ejemplo:

```
Receta
 │
 ├── Platos principales
 │
 ├── Cocina colombiana
 │
 ├── Pollo
 │
 ├── Recetas rápidas
 │
 └── Recetas relacionadas
```

Esto mejora simultáneamente la navegación humana y la comprensión estructural del catálogo.

---

# 18. MOBILE

La experiencia móvil es prioritaria.

Orden propuesto:

```
┌─────────────────────────────┐
│ ←                     ⋮     │
├─────────────────────────────┤
│                             │
│        IMAGEN               │
│                             │
│ Pollo al ajillo             │
│                             │
│ Una receta...               │
│                             │
│ 35 min · Fácil · 4 porciones│
│                             │
│ [Guardar] [Compartir]       │
│                             │
│ [     MODO COCINA      ]    │
│                             │
├─────────────────────────────┤
│ INGREDIENTES                │
│                             │
│ Para 4 porciones            │
│ [−] 4 [+]                   │
│                             │
│ ☐ 500 g pollo               │
│ ☐ 2 dientes ajo             │
│ ☐ ...                       │
│                             │
├─────────────────────────────┤
│ PREPARACIÓN                 │
│                             │
│ 01                          │
│ Preparar...                 │
│                             │
│ 02                          │
│ Calentar...                 │
│                             │
└─────────────────────────────┘
```

---

# 19. ACCESIBILIDAD

La receta debe funcionar sin depender exclusivamente de:

- color;
- iconos;
- hover;
- imágenes;
- gestos complejos.

Los controles deben tener:

- nombres claros;
- áreas táctiles adecuadas;
- foco visible;
- contraste suficiente;
- estructura semántica;
- navegación por teclado en escritorio.

---

# 20. SEO Y DATOS ESTRUCTURADOS

La página de receta será candidata a:

```
Recipe
 ├── name
 ├── image
 ├── description
 ├── author
 ├── datePublished
 ├── recipeCategory
 ├── recipeCuisine
 ├── keywords
 ├── recipeIngredient
 ├── recipeInstructions
 ├── recipeYield
 ├── prepTime
 ├── cookTime
 ├── totalTime
 ├── nutrition
 └── video
```

No se marcarán propiedades que no estén realmente presentes en la página.

Google indica que los datos estructurados deben representar el contenido visible y seguir sus directrices; además recomienda validar el marcado mediante Rich Results Test y comprobar cómo Google ve la URL.  
Fuente: Google Search Central.

---

# 21. URL DE CADA PASO

Cuando resulte útil:

`/recetas/pollo-al-ajillo#paso-3`

Esto permitiría:

- compartir un paso;
- enlazar directamente a una instrucción;
- mantener correspondencia con `HowToStep.url`.

Es una capacidad prevista, no una obligación para todas las recetas.

---

# 22. IMPRESIÓN

La receta debe tener una versión de impresión limpia.

Debe poder imprimirse eliminando:

- navegación;
- elementos decorativos;
- controles innecesarios;
- recomendaciones secundarias.

Mantener:

- título;
- imagen opcional;
- ingredientes;
- cantidades;
- pasos;
- notas;
- tiempos.

Esto queda como requisito funcional del producto.

---

# 23. REGLAS DE CONTENIDO

### Nunca

- inventar tiempos;
- inventar porciones;
- inventar ingredientes;
- inventar nutrición;
- inventar imágenes de pasos;
- convertir una ausencia de dato en una afirmación;
- duplicar texto únicamente para SEO.

### Sí

- mostrar claramente los datos disponibles;
- esconder elegantemente los datos ausentes;
- normalizar antes de automatizar;
- estructurar la información desde el origen.

---

# 24. ESTADO

## APROBADO COMO DIRECCIÓN

- receta como herramienta;
- jerarquía práctica;
- ingredientes + preparación como núcleo;
- modo cocina como función diferenciadora futura;
- móvil prioritario;
- acciones limitadas;
- relaciones semánticas;
- impresión;
- datos estructurados coherentes con contenido real;
- vídeo opcional;
- escalado de porciones condicionado a normalización.

## PENDIENTE

- diseño visual;
- comportamiento definitivo del modo cocina;
- modelo estructurado de ingredientes;
- sistema de guardados;
- autenticación necesaria para guardados;
- temporizadores;
- comentarios/valoraciones;
- estrategia de autoría;
- componentes visuales;
- estados exactos de carga/error.

---

# 25. DECISIÓN

**D-013 — La página de receta será diseñada como herramienta de cocina y no como artículo editorial convencional.**

Estado: **PROPUESTA PARA CIERRE**

---

# 26. SIGUIENTE FASE

Con Home + catálogo + búsqueda/filtros + receta definidos, el siguiente bloque será:

**FASE 1F — ESTUDIO DE MARCA**

Se estudiará y documentará:

1. posicionamiento de Manual de Cocina;
2. personalidad de marca;
3. territorio visual;
4. referencias visuales;
5. logo;
6. símbolo;
7. favicon;
8. paleta cromática;
9. tipografías;
10. iconografía;
11. fotografía;
12. ilustración;
13. tono editorial;
14. sistema de componentes;
15. reglas de uso;
16. variantes responsive.

**Todavía no se dibuja el logo definitivo. Primero se define qué debe representar.**

---

## FUENTES EXTERNAS

Google Search Central — Recipe structured data: https://developers.google.com/search/docs/appearance/structured-data/recipe

Las referencias de Google se utilizan aquí para requisitos técnicos y SEO. Las decisiones de producto de Manual de Cocina permanecen como propuestas hasta su aprobación.
