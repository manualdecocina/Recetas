# FASE 1J — ESTUDIO DE DESCUBRIMIENTO POR INGREDIENTE
**Fecha:** 2026-09-25  
**Estado:** PROPUESTA — NO CERRADO

## Objetivo

Convertir la normalización de ingredientes en una herramienta real de descubrimiento, sin convertir el sitio en una enciclopedia SEO de ingredientes vacíos.

La página de ingrediente debe existir cuando aporte una ruta útil hacia recetas y contexto culinario. No se generará automáticamente una página indexable para cada registro canónico.

## Evidencia actual

Actualmente existen 44 ingredientes canónicos y todos están en estado `canonical`. Ninguno está marcado todavía como `indexable`.

La cobertura en recetas ES publicadas es desigual:

- Aceite de oliva: 44 recetas
- Sal: 42
- Ajo: 38
- Huevo: 24
- Azúcar: 19
- Pimienta negra: 17
- Cebolla: 15
- Comino: 14
- Mantequilla: 14
- Extracto de vainilla: 12
- Harina de trigo: 12
- Aceite vegetal: 11
- Agua: 11
- Leche: 10
- Orégano seco: 10
- Pimentón dulce: 8
- Vino blanco: 8
- Miel: 6
- Queso parmesano: 6
- Cilantro: 5
- Crema de leche: 5
- Jengibre: 5
- Laurel: 5
- Salsa de soja: 5

Hay además ingredientes con 2–4 recetas. No se consideran automáticamente candidatos a indexación.

## Principio de producto

**Una página de ingrediente debe ayudar a cocinar y descubrir, no existir solamente para captar una URL.**

La referencia de producto estudiada muestra que las páginas de ingrediente pueden funcionar como páginas reales de conocimiento y descubrimiento cuando tienen contenido editorial útil, no como páginas SEO vacías. citeturn0search4

## Qué debe contener una página de ingrediente

### 1. Cabecera
- nombre del ingrediente
- imagen si existe y es representativa
- descripción breve, solo si disponemos de contenido editorial fiable

### 2. Recetas
Bloque principal:
- recetas que utilizan el ingrediente
- tarjetas existentes del sistema
- orden por relevancia/recencia según disponibilidad

### 3. Uso culinario
Solo cuando tengamos contenido editorial real:
- qué es
- cómo se utiliza
- preparaciones habituales
- posibles sustituciones, si están documentadas

No se inventarán consejos culinarios para rellenar páginas.

### 4. Navegación relacionada
- categorías relacionadas
- cocina relacionada
- otros ingredientes, solamente si la relación está sustentada

## URL

Ruta propuesta:

`/[lang]/ingredientes/[slug]`

Ejemplo:

`/es/ingredientes/ajo`

La ruta debe ser estable y separada de las páginas de recetas.

## Indexación

La propiedad `ingredients.indexable` seguirá controlando si una página puede formar parte del índice público.

Propuesta inicial para candidato indexable:

1. estado `canonical`;
2. al menos 5 recetas ES publicadas relacionadas;
3. slug estable;
4. nombre canónico revisado;
5. página con contenido útil suficiente;
6. sin conflictos conocidos de normalización.

El umbral de 5 es una **regla operativa inicial**, no una ley permanente. Se revisará cuando aumente el catálogo.

## No indexar

No se crearán automáticamente páginas indexables para:

- ingredientes con cobertura insuficiente;
- registros pendientes;
- ingredientes ambiguos;
- ingredientes creados solamente por una receta;
- combinaciones accidentales;
- expresiones que contienen cantidad o preparación;
- equivalencias no verificadas.

## Enlace desde receta

Cuando una receta tenga una relación canónica inequívoca, el nombre del ingrediente podrá convertirse en enlace hacia su página **solo si el ingrediente es indexable/publicable**.

Si el ingrediente no tiene página pública, continuará mostrándose como texto normal.

Así la normalización no obliga a convertir cada ingrediente en una página.

## Relación con búsqueda

El ingrediente canónico alimentará:

- filtros de `/recetas/`;
- búsqueda por ingrediente;
- páginas públicas de ingrediente cuando corresponda;
- relaciones entre recetas.

La misma entidad debe significar lo mismo en todas esas superficies.

Esta consistencia coincide con modelos de catálogos de recetas que usan una taxonomía controlada como fuente común para búsqueda, filtros y páginas de descubrimiento. citeturn0search11

## SEO y datos estructurados

Las páginas de ingrediente no deben reutilizar artificialmente el marcado `Recipe`. El marcado de receta corresponde a páginas que describen la preparación de un plato concreto. citeturn0search0

La página de ingrediente será una página de contenido/descubrimiento independiente y deberá tener su propio modelo SEO.

Las páginas de listado de recetas sí continuarán usando `ItemList` cuando corresponda; Google documenta este patrón para páginas resumen que listan recetas. citeturn0search0

## Diseño UX propuesto

Desktop:

**Ingrediente**  
descripción / imagen  
↓  
**Recetas con este ingrediente**  
grid de recetas  
↓  
**Cómo se usa** (si existe contenido)  
↓  
**También puedes cocinar con...**

Mobile mantiene el mismo orden, sin crear bloques innecesarios.

## Decisiones

**D-095:** ingrediente canónico y página pública son conceptos distintos.

**D-096:** no todo ingrediente canónico es indexable.

**D-097:** una página de ingrediente debe aportar utilidad culinaria o de descubrimiento real.

**D-098:** el enlace desde receta solo aparece cuando existe una página pública válida.

**D-099:** `ingredients.indexable` será el control explícito de publicación/indexación.

**D-100:** la taxonomía canónica debe alimentar búsqueda, filtros y páginas de ingrediente con el mismo significado.

## Pendiente de cierre

Antes de implementar `/ingredientes/[slug]` hay que cerrar:

1. diseño definitivo de la página;
2. criterio definitivo de indexación;
3. contenido editorial mínimo;
4. orden de recetas;
5. reglas de enlazado desde receta;
6. metadata/SEO;
7. sitemap y canonical;
8. estados vacío/no indexable;
9. integración con búsqueda y filtros.
