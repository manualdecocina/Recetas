# FASE 1J.1 — WIREFRAME PÁGINA DE INGREDIENTE
**Fecha:** 2026-09-25  
**Estado:** PROPUESTA — NO CERRADO

## Objetivo

La página de ingrediente no será una ficha enciclopédica ni una copia de una categoría. Será una **puerta de descubrimiento culinario**.

La pregunta que debe responder inmediatamente es:

> ¿Qué puedo cocinar con este ingrediente?

## Desktop

```
HEADER
────────────────────────────────────────

Breadcrumb
Inicio / Ingredientes / Ajo

                 AJO
       breve descripción, si existe

────────────────────────────────────────
RECETAS CON AJO

[ receta ]   [ receta ]   [ receta ]
[ receta ]   [ receta ]   [ receta ]

              Ver más recetas
────────────────────────────────────────

CÓMO SE USA
Texto editorial solo si existe
contenido real.

────────────────────────────────────────

TAMBIÉN PUEDES COCINAR CON

[ ingrediente ] [ ingrediente ] [ ingrediente ]

────────────────────────────────────────
FOOTER
```

## Mobile

```
HEADER

Breadcrumb

AJO
Descripción

RECETAS CON AJO

[ tarjeta ]
[ tarjeta ]
[ tarjeta ]

Ver más

CÓMO SE USA
contenido opcional

TAMBIÉN PUEDES COCINAR CON
[ ... ]

FOOTER
```

## Jerarquía

### Nivel 1 — Descubrimiento
Nombre + contexto + recetas.

### Nivel 2 — Conocimiento
Uso culinario únicamente cuando exista contenido editorial.

### Nivel 3 — Exploración
Ingredientes relacionados.

No se añadirá contenido artificial para completar el tercer nivel.

## Recetas

Las tarjetas serán las mismas `RecipeCard` del sistema.

No se crea una tarjeta especial para ingredientes.

Orden inicial:
1. relevancia por relación canónica;
2. posteriormente se podrá incorporar recencia;
3. nunca ordenar arbitrariamente.

## Imagen

La imagen del ingrediente es opcional.

Si no existe una imagen propia y adecuada, la página **no mostrará un hueco artificial**.

No se reutilizará automáticamente una foto de una receta como si fuera una fotografía del ingrediente.

## Descripción

Campo `ingredients.description`.

Si está vacío:
- no se inventa texto;
- no se muestra un párrafo genérico;
- la página pasa directamente al bloque de recetas.

## Contenido editorial futuro

Podrá incorporar:
- descripción culinaria;
- usos;
- conservación;
- sustituciones;
- técnicas relacionadas.

Pero cada bloque tendrá que tener contenido real y revisión editorial.

## Enlaces

Desde una receta:

`Ajo` → `/ingredientes/ajo`

solo cuando:
- ingrediente canonical;
- `indexable=true`;
- página publicada.

Antes de eso el nombre sigue siendo texto.

## Estado no indexable

La URL puede existir para desarrollo y QA, pero metadata debe indicar `noindex` mientras el ingrediente no esté aprobado para indexación.

No se añade al sitemap hasta que sea indexable.

## Estado sin recetas

Si un ingrediente se queda temporalmente sin recetas públicas:
- no mostrar una página indexable;
- responder como no encontrada/no publicada según el estado de publicación.

## Structured data

Las recetas de la página pueden representarse mediante `ItemList` porque la página es una colección/listado de recetas. Google documenta `ItemList` para páginas resumen de recetas. citeturn0search0

No se añadirá `Recipe` como tipo principal de la página de ingrediente.

## Publicidad futura

Esta página también tendrá **zonas publicitarias reservadas conceptualmente**, pero no se implementarán todavía.

Cuando llegue la fase de monetización, el espacio se incorporará sin modificar la jerarquía editorial principal.

## Decisiones

**D-101:** la página de ingrediente prioriza recetas sobre contenido enciclopédico.

**D-102:** `RecipeCard` es el componente común.

**D-103:** imagen y contenido editorial son opcionales; no se rellenan artificialmente.

**D-104:** un ingrediente no indexable no se enlaza públicamente desde las recetas.

**D-105:** un ingrediente no indexable no entra en sitemap.

**D-106:** `ItemList` podrá representar la colección de recetas.

**D-107:** publicidad se reservará como restricción futura, no como implementación actual.

## Pendiente

- diseño visual definitivo;
- criterio final de indexación;
- texto de metadata;
- implementación;
- sitemap;
- enlazado desde receta;
- QA.
