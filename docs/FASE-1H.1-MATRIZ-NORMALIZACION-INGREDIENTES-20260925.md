# FASE 1H.1 — Matriz de normalización de ingredientes

**Fecha:** 2026-09-25  
**Estado:** EN ESTUDIO — NO CERRADO

## Objetivo

Convertir el texto heterogéneo de `recipes.ingredients` en una capa canónica de ingredientes sin destruir el texto editorial original.

## Evidencia actual

La consulta sobre las 134 recetas ES publicadas confirma que el problema no es solo de sinónimos: el campo `name` mezcla ingrediente, cantidad, preparación, opcionalidad y agrupadores.

Ejemplos observados:

- `ajo`, `ajo picado`, `ajo picados`, `ajo, picados`, `ajo, picados finamente`
- `aceite de oliva`, `aceite de oliva virgen extra`, `aceite de oliva extra virgen`
- `huevo`, `huevos`, `huevos grandes`, `huevos batidos`
- `cebolla`, `cebolla picada`, `cebolla grande`, `cebolla mediana, picada finamente`
- `1 cucharadita de extracto de vainilla`
- `1/2 cucharadita de sal`
- `hielo (opcional)`
- `para el glaseado`, `para el pollo`, `para el relleno`, `para la masa`, `para la salsa`

También aparecen valores que no deben convertirse en ingredientes:

- `[]`
- textos que describen una sección del preparado
- cantidades embebidas en el nombre
- instrucciones de preparación embebidas en el nombre

## Regla de normalización

No intentaremos limpiar todo con una expresión regular.

Cada entrada se clasificará primero:

1. **Ingrediente canónico de alta confianza**
2. **Variante/alias de ingrediente**
3. **Preparación del ingrediente**
4. **Cantidad/unidad embebida**
5. **Nota/opcionalidad**
6. **Agrupador editorial**
7. **Ruido / dato inválido**
8. **Caso ambiguo que requiere revisión**

## Primeros candidatos de alta confianza

Estos grupos son suficientemente claros para iniciar una primera migración manual/semiautomática:

| Canónico | Variantes observadas |
|---|---|
| ajo | ajo picado, ajo picados, ajo, picados, ajo, picados finamente |
| aceite de oliva | aceite de oliva virgen extra, aceite de oliva extra virgen |
| sal | sal al gusto, sal gruesa, sal y pimienta* |
| azúcar | azúcar granulada, azúcar moreno* |
| huevo | huevo, huevos, huevos grandes, huevos batidos |
| cebolla | cebolla picada, cebolla grande, cebolla mediana, cebolla blanca picada* |
| mantequilla | mantequilla derretida, mantequilla sin sal |
| comino | comino molido, comino en polvo, comino al gusto |
| pimienta | pimienta negra, pimienta negra molida, pimienta al gusto, pimienta negra al gusto |
| extracto de vainilla | esencia de vainilla, variantes con cantidad embebida |
| jengibre | jengibre fresco rallado, variantes con cantidad embebida |

* No todas las equivalencias deben aceptarse automáticamente. Por ejemplo, azúcar moreno y azúcar blanco deben seguir siendo ingredientes distintos; cebolla blanca puede necesitar una entidad propia si el catálogo lo justifica.

## Casos que NO se normalizan automáticamente

- `caldo de pollo o vegetales`: contiene alternativa.
- `mantequilla o aceite de oliva`: contiene alternativa.
- `miel o sirope de agave`: contiene alternativa.
- `queso rallado`: tipo no determinado.
- `pimiento`: variedad no determinada.
- `pimentón` frente a `pimentón dulce`.
- `paprika` frente a `pimentón`.
- `crema de leche`: nomenclatura regional.
- nombres con cantidad y unidad embebidas cuando no exista aún un parser fiable.

Estos casos deben pasar por una cola de revisión.

## Decisión técnica

La capa canónica se mantiene separada del JSON original.

Flujo:

`recipes.ingredients` → clasificación → canonical ingredient + alias + recipe_ingredients

No se sobrescribe `recipes.ingredients`.

## Próximo bloque

1. Crear un primer conjunto pequeño de ingredientes canónicos de alta confianza.
2. Crear aliases solamente cuando la equivalencia sea segura.
3. Poblar `recipe_ingredients` solo para esos casos.
4. Medir cobertura.
5. Revisar los ambiguos.
6. Después construir el catálogo/página de ingredientes.

## Decisiones

- **D-051:** la normalización será por confianza, no por coincidencia textual ciega.
- **D-052:** cantidad, unidad, preparación y nota no forman parte del nombre canónico.
- **D-053:** las alternativas no se fusionan automáticamente.
- **D-054:** el JSON original de ingredientes permanece intacto durante toda la migración.
- **D-055:** no se indexará una página de ingrediente hasta comprobar que existe suficiente contenido útil.

## Evidencia UX externa

La investigación actual sobre búsqueda y filtrado destaca que las búsquedas con atributos combinados deben poder interpretarse como refinamientos transparentes y controlables, y que la búsqueda móvil y los filtros requieren atención específica. Esto respalda que los ingredientes funcionen como una dimensión estructurada del catálogo y no únicamente como texto libre. citeturn0search6turn0search0
