# FASE 1I.1 — MODELO OPERATIVO DE ALTA DE RECETA

**Fecha:** 2026-09-25  
**Estado:** PROPUESTA OPERATIVA — BASE PARA IMPLEMENTACIÓN

## Objetivo

Convertir la checklist de publicación en un flujo de estados claro. Una receta no pasa directamente de borrador a publicada.

## Estados

1. **draft** — receta en construcción.
2. **review** — contenido completo y pendiente de revisión.
3. **ready** — revisión superada y lista para publicar.
4. **published** — publicada.
5. **archived** — retirada de publicación sin eliminar el contenido.

## Controles antes de ready

### Contenido
- título y slug;
- excerpt/descripción;
- ingredientes;
- instrucciones;
- idioma;
- imagen principal.

### Datos de receta
- categoría;
- dificultad;
- cocina cuando proceda;
- curso/momento cuando proceda;
- preparación/cocción/total cuando exista información;
- raciones cuando exista información.

### Ingredientes
- cada ingrediente se intenta resolver contra el catálogo canónico;
- los ambiguos quedan pendientes;
- se conserva el texto original;
- ninguna equivalencia se inventa.

### SEO
- URL estable;
- metadata;
- Recipe JSON-LD;
- BreadcrumbList;
- imagen accesible;
- instrucciones estructuradas cuando corresponda.

Google establece image y name como propiedades requeridas de Recipe para elegibilidad de resultados enriquecidos y recomienda validar el marcado antes de desplegarlo. También recomienda HowToStep para instrucciones estructuradas. Esto se incorpora como control de publicación, no como motivo para inventar datos. citeturn0search0turn0search2

## Regla importante sobre campos opcionales

Que un campo sea opcional para Google no significa que debamos omitirlo cuando conocemos el dato.

Si conocemos preparación, cocción, rendimiento, cocina, categoría o autoría, se conserva y se representa correctamente. Si no lo conocemos, no se inventa.

## Revisión final

Antes de publicar deben poder contestarse afirmativamente:

- ¿La receta se puede cocinar con la información disponible?
- ¿La imagen corresponde realmente al plato?
- ¿La categoría es canónica?
- ¿Los ingredientes están resueltos o marcados como pendientes?
- ¿Los tiempos y raciones son datos reales?
- ¿La URL es estable?
- ¿El marcado estructurado corresponde al contenido visible?
- ¿No hemos inventado ningún dato?
- ¿La página funciona en móvil?
- ¿La receta queda conectada al descubrimiento del sitio?

## Decisiones

**D-069:** las recetas nuevas tendrán estados editoriales explícitos.

**D-070:** ready será el punto de control previo a publicación.

**D-071:** un dato opcional técnicamente no se omite si está disponible y es fiable.

**D-072:** el marcado estructurado debe reflejar el contenido real de la página, nunca datos inventados.

**D-073:** los ingredientes pendientes no bloquean por sí solos la publicación si la receta sigue siendo válida y el pendiente queda registrado.

## Siguiente implementación

No crear todavía una interfaz administrativa grande. Primero adaptar el modelo de datos y el flujo de publicación para soportar estos estados y controles sin romper las recetas existentes.
