# URL MASTER — consolidación de decisiones P0–P4 — 2026-09-24

## Propósito

Este documento consolida las decisiones de control alcanzadas hasta ahora. Es una **matriz operativa provisional**, no una autorización para ejecutar cambios de producción.

La fuente final de verdad sigue siendo el URL Master por URL individual. Este documento agrupa por entidad para evitar duplicaciones de criterio.

## Regla de decisión

- KEEP / REBUILD: conservar la URL histórica como candidata principal y reconstruir contenido nuevo.
- MIGRATE: cambiar de URL solo si existe una razón editorial/técnica real y un destino definitivo.
- MERGE: consolidar varias representaciones de la misma entidad.
- REVIEW: decisión pendiente por salud, tipo editorial, relevancia o equivalencia.
- OUT: fuera del catálogo nuevo.
- P3/P4: prioridad de catálogo, no decisión automática de borrado.

## P0 — entidades históricas prioritarias

| ID | Entidad | Decisión provisional | Nota |
|---|---|---|---|
| E001 | Lechona colombiana | KEEP / REBUILD | 6 URLs históricas; consolidar NEW_SEED y ContentPage en una sola entidad |
| E002 | Casuela de frijoles colombianos | KEEP / REBUILD | DE/FR/IT históricos; ES Recipe existente |
| E003 | Burrito mexicano | KEEP / REBUILD | JA histórico; ES Recipe existente |
| E004 | Pollo teriyaki con verduras al wok | KEEP / REBUILD | IT histórico; ES Recipe existente |
| E005 | Jugo anticancerígeno | REVIEW | no heredar claims terapéuticos |
| E006 | Porra Antequerana | KEEP / REBUILD | FR/IT históricos fuertes |
| E007 | Pandebono casero | KEEP / REBUILD | JA histórico |
| E008 | Pan Matzá casero | KEEP / REBUILD | DE/JA históricos |
| E009 | Pie de limón | KEEP / REBUILD | JA histórico |
| E010 | Batido Grimace | REVIEW | demanda histórica, pero relevancia editorial actual pendiente |
| E011 | Horchata casera | KEEP / REBUILD | JA histórico; revisar posible URL ES equivalente |
| E012 | Pollo Alfredo a la Florentina | KEEP CANDIDATE / MODEL REVIEW | ES actual es ContentPage; debe ser Recipe si se conserva como receta |
| E013 | Pulpo a la Gallega | KEEP CANDIDATE / REVIEW | DE histórico; posición histórica más débil |
| E014 | Ajiaco colombiano | KEEP / REBUILD | IT histórico; ES Recipe existente |
| E015 | Empanada peruana de pollo | KEEP / REBUILD | ES/IT; consolidar ContentPage + NEW_SEED |

## P0/P1 — entidades españolas de alto valor

| ID | Entidad | URL principal | Decisión |
|---|---|---|---|
| E101 | Bondiola de cerdo | /receta-bondiola-de-cerdo/ | KEEP / REBUILD |
| E102 | Pie de maracuyá | /receta-de-pie-de-maracuya/ | KEEP / REBUILD |
| E103 | Salsa de ajo | /receta-de-salsa-de-ajo/ | KEEP / REBUILD |
| E104 | Stroganoff | /creep-stroganoff/ | KEEP / REBUILD + validar intención |
| E105 | Rollo de carne | /receta-de-rollo-de-carne/ | KEEP / REBUILD |
| E106 | Sopa saludable para enfermos | /sopa-saludable-para-enfermos/ | REVIEW |

## P2 — primera tanda cerrada

KEEP / REBUILD:
- /barquitos-de-berenjenas-al-horno/
- /zanahorias-glaseadas/
- /receta-de-chop-suey/
- /receta-de-muffins-de-chocolate/
- /receta-empanadas-argentinas/
- /cheesecake-de-oreo-sin-horno/
- /receta-de-salpicon-de-frutas/
- /receta-de-salchichas-alemanas/
- /lumpias-de-verduras/
- /receta-jugo-arcoiris/

MODEL REVIEW:
- /receta-ensalada-caprese/

REVIEW:
- /receta-de-aborrajado/ → KEEP / REBUILD — MODEL Recipe
- /receta-de-horchata/ → KEEP / REBUILD — MODEL Recipe
- /receta-de-lasana-de-pollo-con-champinones/ → KEEP / REBUILD — MODEL Recipe

## P3

Las URLs P3 quedan como **CATALOG CANDIDATE**, no como borrado:

- /chorizo-santarosano/
- /sudado-de-carne/
- /receta-de-pan-matza/
- /receta-de-pollo-teriyaki/
- /receta-mejillones-al-ajillo/
- /caldo-de-huevo-changua/
- /receta-de-fajitas-mexicanas/
- /receta-de-galletas-de-naranja/
- /receta-de-sancocho-trifasico/
- /receta-dulce-de-leche/
- /receta-de-arroz-chino/
- /nasi-goreng-indonesia/
- /mermelada-de-higos/
- /costillas-en-mole-rojo/
- /ensalada-primavera-pollo/
- /pozole-rojo-mexicano/
- /arroz-con-leche-el-postre-casero/
- /receta-de-hamburguesa-angus/
- /receta-de-risotto-de-mar/
- /receta-de-kare-raisu-japones/
- /receta-de-wrap-de-pollo-con-vegetales/

## P4 — exclusiones ya delimitadas

### OUT del catálogo editorial

1. /licuadoras-para-cocina/
2. /mejor-batidora-de-vaso-en-2025/
3. /ollas-multiuso/
4. /productos-cocina-cafeteras/
5. /productos-de-cocina-recomendados-por-el-chef/
6. /utensilios-de-cocina/
7. /refrijeradores-de-cocina/
8. /baterias-de-cocina/

Estas páginas no se reconstruyen como catálogo de Amazon/afiliación/productos.

### OUT técnico

- /?post_type=wprm_recipe&p=12104
- /?post_type=wprm_recipe&p=12193

### REVIEW

Salud/nutrición:
- /alimentacion-durante-el-tratamiento-del-cancer/
- /consejos-esenciales-para-una-dieta-saludable/
- /importancia-de-fibra-dietetica/
- /la-importancia-de-las-proteinas-en-nuestra-dieta/
- /principios-generales-de-una-dieta-saludable-para-personas-enfermas/

Colecciones:
- /10-recetas-de-postres/
- /recetas-de-carne-molida/

Artículo:
- /el-veganismo-una-opcion-de-vida/

## Redirects

Existen 27 redirects P1 hacia rutas /es/... ya registradas en Supabase.

Los destinos son técnicamente existentes:
- 22 apuntan a Recipe;
- 5 apuntan a ContentPage.

Pero **ninguno se considera aprobado solo por existir**.

Para cada uno se aplicará:

URL histórica → entidad → URL definitiva → redirect

Si KEEP, el redirect debe revisarse/eliminarse cuando el router pueda servir la URL histórica.

Si MIGRATE/MERGE, el 301 debe apuntar directamente al destino final.

Google recomienda preparar primero el mapeo de URL y actualizar canonical, hreflang, enlaces internos y sitemap antes de activar la migración; también recomienda evitar cadenas y redirects irrelevantes. citeturn134782search0turn134782search4

## NEW_SEED

Las 28 Recipes sin source_url y con published_at del 2026-09-23 son NEW_SEED.

No constituyen evidencia histórica por sí mismas.

Duplicados ya detectados:
- lechona-colombiana
- lechona-colombiana-receta-tradicional-paso-a-paso
- empanada-peruana-de-pollo
- bowl-de-carne-con-miel-picante-y-queso-cottage
- receta-facil-de-pasta-al-pesto-casera
- receta-de-souffle-de-queso-esponjoso
- sopa-saludable-para-enfermos-receta-nutritiva-y-facil-de-preparar
- receta-de-papas-al-horno-y-los-beneficios-para-la-salud
- solomillo-de-pavo-glaseado-con-cafe-y-chipotle-sobre-hummus-de-edamame
- sopa-minestrone-casera-el-secreto-definitivo-para-un-sabor-autentico

Estos casos deben consolidarse antes de publicar.

## Gate

No se autoriza todavía:
- borrado masivo;
- creación masiva de redirects;
- creación masiva de traducciones;
- publicación final del catálogo;
- migración definitiva de Supabase.

El próximo entregable debe convertir esta matriz de entidades en **filas URL-by-URL del URL Master**, con una sola acción y una sola URL objetivo por fila.


## Estado actualizado — 2026-09-25

La sección de redirects de 27 elementos es histórica. Tras las migraciones de limpieza y normalización, el estado operativo conocido de `content_redirects` es **0 registros**.

Esto es intencional: ningún redirect heredado debe decidir por sí mismo la URL final. Las futuras redirecciones se crearán únicamente después de cerrar la fila URL-by-URL correspondiente en el URL Master.

También queda cerrado un nuevo control de datos: una Recipe marcada como publicada debe tener título, imagen, contenido editorial, ingredientes y pasos; la migración `20260925010000_guard_published_recipe_completeness.sql` bloquea publicaciones incompletas.
