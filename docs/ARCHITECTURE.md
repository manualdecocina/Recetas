# ARQUITECTURA — CONTRATO DE CONTROL

**Fecha:** 2026-09-24  
**Estado:** PROPUESTA CONTROLADA — pendiente de cierre tras URL Master

## 1. Principio

Manual de Cocina será un sitio editorial multilingüe reconstruido desde cero. La arquitectura debe conservar activos SEO históricos valiosos sin quedar esclavizada a la estructura técnica antigua.

## 2. Unidad editorial

La unidad principal es una **entidad editorial**. Una entidad puede tener varias versiones lingüísticas.

Ejemplo:

`Lechona colombiana`

- ES: `/receta-de-lechona-colombiana/`
- DE: `/de/kolumbianisches-lechona-rezept/`
- JA: `/ja/コロンビアのレチョナレシピ/`
- IT: `/it/ricetta-colombiana-lechona/`
- FR: `/fr/recette-lechona-colombienne/`
- EN: `/en/colombian-lechona-recipe/`

Estas URLs pueden coexistir como versiones localizadas de una misma entidad. La estructura exacta se decide por URL Master.

## 3. Tipos de contenido

### Recipe

Receta completa con ingredientes, pasos, tiempos, rendimiento y datos editoriales reales.

### CollectionPage

Categorías, colecciones y páginas de agrupación. No deben recibir `Recipe` schema solo por contener recetas.

### Article

Contenido editorial independiente que no representa una receta estructurada.

### WebPage

Páginas institucionales o informativas generales.

### Legacy

URL histórica sin entidad válida o sin equivalencia editorial. Se resuelve mediante la decisión documentada del URL Master.

## 4. URL

No existe una regla global que obligue a todas las recetas a usar `/lang/receta/slug`.

La URL es parte del patrimonio SEO. Cuando una URL histórica de valor puede ser reconstruida correctamente, conservarla es una opción prioritaria a evaluar.

Cuando una URL debe cambiar, la relación antigua→nueva debe quedar registrada antes de desplegar el cambio.

## 5. Canonical

Cada versión lingüística indexable tendrá canonical autorreferente a su propia URL, salvo una decisión explícita documentada de consolidación.

No se debe utilizar canonical para convertir versiones lingüísticas completas en una sola página. Google distingue las versiones lingüísticas cuando el contenido principal está realmente traducido. citeturn0search0turn0search2

## 6. Hreflang

Las versiones lingüísticas de una misma entidad se enlazarán mediante `hreflang` únicamente cuando ambas URLs estén realmente publicadas y sean equivalentes editoriales.

Cada versión debe incluirse a sí misma y a las demás versiones del grupo. Las URLs deben ser absolutas. Google documenta HTML, headers o sitemap como métodos equivalentes para declarar estas variantes. citeturn0search1

No se anunciarán traducciones que todavía no existan.

## 7. x-default

No se añadirá `x-default` indiscriminadamente a cada receta. Se utilizará cuando exista una razón clara de fallback o selección de idioma. Google señala que `x-default` está especialmente pensado para páginas de selección/fallback. citeturn0search0

## 8. Sitemap

El sitemap debe contener únicamente URLs indexables y finales. Para grupos multilingües se podrá utilizar la extensión XHTML de sitemap para declarar las alternativas, manteniendo consistencia con las etiquetas HTML. citeturn0search1

## 9. Redirects

Una migración de URL exige un mapa explícito antiguo→nuevo. Las señales de canonical, sitemap y hreflang deben actualizarse a las URLs finales. Google recomienda definir el mapeo de URLs y actualizar estas señales durante una migración. citeturn0search3

No se permiten cadenas innecesarias de redirects.

## 10. Contenido multilingüe

Cada idioma tendrá contenido editorial completo y localizado. No se utilizará una traducción automática superficial como sustituto del contenido editorial final.

La relación entre idiomas representa una entidad común, pero cada versión tendrá:

- título localizado;
- introducción localizada;
- contenido editorial localizado;
- ingredientes y pasos adaptados lingüísticamente;
- metadata localizada;
- enlaces internos adecuados;
- FAQ cuando sea útil;
- schema coherente con el contenido visible.

## 11. Schema

El schema se deriva del tipo de contenido y de datos reales.

No se inventan ratings, reseñas, tiempos, vídeos, nutrición ni otros campos que no existan.

Una receta podrá utilizar `Recipe` y `BreadcrumbList`; colecciones usarán el tipo apropiado como `CollectionPage`/`ItemList`; artículos usarán `Article`; páginas generales usarán `WebPage`.

## 12. Regla de publicación

Una versión lingüística no entra en sitemap/hreflang por existir en la base de datos. Debe estar publicada, accesible, indexable y contener contenido editorial suficiente.

## 13. Gate de implementación

El Code/System chat no debe fijar definitivamente el routing hasta que Control Central cierre el URL Master.

El orden obligatorio es:

1. URL Master.
2. Arquitectura final.
3. Modelo de grupos y traducciones.
4. Canonical/hreflang.
5. Schema.
6. Sitemap/indexación.
7. Implementación.
8. QA.
9. Deploy.
10. Search Console.
