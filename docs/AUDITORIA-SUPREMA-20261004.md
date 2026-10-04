# Auditoría Suprema — Manual de Cocina — 2026-10-04

## Alcance

Auditoría integral de la reconstrucción de Manual de Cocina antes de continuar con una producción masiva de recetas. Se revisaron:

- Search Console exportado por el propietario (2025-06-04 a 2026-09-29).
- Repositorio GitHub `manualdecocina/Recetas`, ramas, CI, rutas, schemas y componentes.
- Base Supabase real: recetas, traducciones, contenido legado, taxonomías y relaciones.
- Renderizado público de `preview.manualdecocina.com`.
- Estado actual de `manualdecocina.com` todavía servido por WordPress.
- Guías vigentes de Google Search Central y Google AdSense.
- Estudios/auditorías previas ya guardados en `docs/`.

Este documento es el mapa de decisión. No autoriza borrados masivos ni cambios destructivos sin mapa de URLs y validación previa.

---

# 1. Veredicto ejecutivo

La arquitectura nueva es claramente superior al WordPress legado y debe seguir adelante, pero **todavía no conviene hacer el cambio definitivo a producción ni acelerar la creación masiva de recetas**.

Antes hay que cerrar varios bloqueadores técnicos/editoriales que pueden afectar directamente la recuperación orgánica:

1. CI debe quedar verde.
2. Hay 69 `content_pages` publicadas del legado; 48 se solapan con rutas de recetas aún no reconstruidas.
3. Hay contenido sanitario/YMYL heredado que no debería entrar a producción sin revisión específica.
4. Las 20 recetas reconstruidas tienen 7 idiomas, pero bastantes traducciones están incompletas en `excerpt`, `summary` o `course`.
5. La herramienta “¿Qué puedo cocinar?” funciona, pero su grafo de ingredientes canónicos está incompleto.
6. Las rutas históricas/canónicas no siempre reciben los enlaces de “recetas relacionadas”.
7. Falta adoptar el estándar de portada 1:1 + 4:3 + 16:9 recomendado por Google para Recipe.
8. Falta reforzar entidad/marca con `WebSite` y `Organization` en la raíz.
9. El sistema de ratings es vulnerable a spam y puede terminar alimentando `AggregateRating`.
10. El sistema de consentimiento actual no sustituye una CMP certificada por Google para tráfico EEE/Reino Unido/Suiza si se quieren anuncios personalizados.
11. Hay ramas y componentes obsoletos que deben limpiarse después de comprobar que no contienen trabajo único.
12. La migración final debe tratarse como una migración SEO, no como un simple cambio de hosting.

El activo más valioso no es la cantidad de recetas: es la combinación de **URLs históricas + datos de Search Console + Recipe Gallery + versiones internacionales + contenido reconstruido de calidad**.

---

# 2. Lo que Search Console demuestra

Periodo analizado: 2025-06-04 a 2026-09-29.

## Totales

- 9.725 clics.
- 488.306 impresiones.
- CTR medio: 1,99 %.
- Posición media ponderada: 26,92.

## Cambio de tendencia

La caída no fue una sola caída.

### Primer deterioro: finales de enero / febrero de 2026

- Semana del 27 de enero: impresiones -29,1 %, clics -35,5 %.
- Semana del 3 de febrero: impresiones -31,5 %, clics -44 %.
- Semana del 10 de febrero: clics -64,3 %.

### Segundo deterioro: finales de junio / julio de 2026

- Semana del 23 de junio: impresiones -51,4 %, clics -78,6 %.
- Semana del 30 de junio: impresiones -48,9 % y empeoramiento de posición.
- Semana del 7 de julio: posición media cercana a 50.

La actualización de spam de Google del 24 de junio coincide temporalmente con la segunda caída. Esto es correlación, no prueba de causalidad.

## La función de búsqueda que históricamente produjo valor

Apariencia en búsqueda:

- **Galería de recetas:** 8.406 clics / 262.163 impresiones / 3,21 % CTR / posición 5,14.
- Fragmento de reseña: 0 clics / 4 impresiones.
- Resultados enriquecidos de recetas: 0 clics / 1.657 impresiones.

Conclusión: **proteger elegibilidad y calidad de Recipe Gallery es una prioridad comercial**, no un detalle técnico.

## El sitio fue esencialmente móvil

- Móvil: 8.854 clics / 321.467 impresiones / 2,75 % CTR / posición 11,13.
- Escritorio: 805 / 165.105 / 0,49 % / posición 57,84.
- Tablet: 66 / 1.734 / 3,81 % / posición 10,01.

Toda decisión de diseño, anuncios y rendimiento debe ser mobile-first.

## El tráfico internacional fue decisivo

Países principales:

- Japón: 1.944 clics.
- Alemania: 1.467.
- Italia: 1.435.
- Francia: 1.100.
- Colombia: 711.
- Argentina: 629.
- Estados Unidos: 502.
- España: 333.

Por páginas/idioma, el peso histórico también es contundente:

- JA: 2.104 clics, CTR 3,74 %, posición 9,43.
- DE: 1.913 clics, CTR 3,89 %.
- IT: 1.529 clics.
- FR: 1.364 clics.
- ES/root: 2.370 clics.
- EN: 469 clics.

Conclusión: **las traducciones no son decoración**. El proyecto fue internacional de verdad y la reconstrucción debe conservar esa ventaja.

## Ganadores históricos que no se deben poner en riesgo

Ejemplos:

- DE Lechona: 1.152 clics / 8.918 impresiones / CTR 12,92 % / posición 5,04.
- JA Lechona: 792 / 7.361 / 10,76 % / 5,42.
- ES Bondiola: 676 / 14.454.
- IT Lechona: 397 / 10.213.
- FR Cazuela de frijoles: 314 / 1.558 / CTR 20,15 % / posición 3,15.
- JA Burrito: 234 / 1.676 / CTR 13,96 %.
- IT Teriyaki: 209 / 934 / CTR 22,38 %.
- ES Pie de maracuyá: 181 / 8.490.

## Oportunidades de CTR / snippet

Consultas/páginas con mucha impresión y CTR bajo:

- `lechona`: 14.551 impresiones, CTR 0,78 %, posición 12,96.
- `stroganoff crepes`: 3.686, CTR 0,05 %, posición 6,57.
- `pie de maracuya`: 4.159, CTR 1,32 %, posición 10,04.
- `crepe stroganoff`: 2.150, CTR 0,14 %, posición 6,88.
- `grimace shake zutaten`: 1.088, CTR 0,37 %, posición 5,58.
- `trucha al ajillo`: 888, CTR 0,34 %, posición 8,10.

Páginas:
- `/creep-stroganoff`: 19.021 impresiones / CTR 0,76 % / posición 6,8.
- `/batido-grimace-mcdonalds`: 16.492 / 0,22 % / 10,3.
- EN Lechona: 9.865 / 1,21 % / 14,7.
- ES Pie maracuyá: 8.490 / 2,13 % / 13,7.

Estas páginas no necesitan cambiar de URL. Necesitan mejorar snippet, intención, imagen, contenido y enlaces internos sin perder su identidad histórica.

---

# 3. Prioridad de reconstrucción basada en datos, no en intuición

Entre las páginas españolas históricas todavía no reconstruidas, Search Console muestra oportunidades reales:

- `/empanada-peruana-de-pollo`
- `/receta-envuelto-de-choclo`
- `/receta-cheesecake-de-agraz`
- `/caldo-de-huevo-changua`
- `/receta-de-pan-matza`
- `/chorizo-santarosano`
- `/sudado-de-carne`
- `/receta-helado-casero`
- `/receta-trucha-al-ajillo-con-limon`
- `/cangrejo-al-limon`
- `/pollo-alfredo-a-la-florentina`
- `/receta-de-salpicon-de-frutas`
- `/mochis-el-postre-japones`

`/sopa-saludable-para-enfermos` también tiene señal histórica fuerte, pero es YMYL/salud y no debe acelerarse sin revisión médica/editorial específica.

El bloque editorial actual ya contiene varias oportunidades fuertes (Cangrejo, Cheesecake de agraz, Chorizo Santarosano), por lo que se puede conservar el flujo por bloques pero **ordenando dentro de ellos con Search Console cuando sea posible**.

---

# 4. Estado real de las recetas reconstruidas

Hay 20 grupos completos con 7 idiomas, es decir 140 filas publicadas.

Fortalezas:
- todas las versiones publicadas tienen título;
- ingredientes;
- pasos;
- portada;
- nutrición;
- SEO title/description;
- public_path;
- keywords;
- categoría;
- cocina;
- dificultad;
- alt en fotos de pasos;
- nutrición numéricamente coherente entre traducciones;
- no se encontraron títulos SEO duplicados;
- no se encontraron meta descriptions duplicadas.

Problema: **“7 idiomas publicados” no significa “7 idiomas editorialmente completos”.**

### Faltantes detectados

Ejemplos:

- Ajiaco: summary faltante en de/en/fr/ja/pt.
- Arepa con todo: summary faltante en los seis idiomas no ES.
- Arroz pilaf: excerpt + summary faltantes en todos los no ES.
- Barquitos de berenjena: excerpt + summary faltantes en todos los no ES.
- Batido de frutas con crema: excerpt + summary faltantes en todos los no ES.
- Grimace: summary faltante en todos los no ES.
- Batido energizante: summary faltante en todos los no ES.
- Bowl quinoa: summary faltante en todos los no ES.
- Buddha Bowl: summary faltante en todos los no ES.
- Camarones: summary faltante en todos los no ES.
- Bondiola, Burrito, Cazuela, Pie maracuyá, Teriyaki y otros tienen `course` incompleto en traducciones.
- Stroganoff, Rollo de carne y Salsa de ajo tienen `course` incompleto incluso en ES.

### Acción

Antes de crear decenas de recetas nuevas:
- completar estos campos;
- elevar el publication gate para impedir volver a publicar una traducción incompleta;
- validar el grupo completo, no solo la fila ES.

---

# 5. SEO técnico y schema

## Lo que ya está bien

Las recetas actuales generan:

- `Recipe`.
- `BreadcrumbList`.
- `NutritionInformation`.
- `AggregateRating` solo cuando hay votos reales.
- `VideoObject` cuando existe metadato de vídeo.
- instrucciones como `HowToStep`.
- imágenes de pasos.
- autor `Person`.
- publisher `Organization`.
- canonical histórico basado en `public_path`.
- hreflang entre traducciones.

La decisión de retirar `FAQPage` como estrategia de rich result y mantener FAQ visible editorialmente es correcta para 2026.

## Portadas Recipe

Google recomienda múltiples imágenes de alta resolución con proporciones:

- 1:1
- 4:3
- 16:9

Se debe adoptar como estándar de todas las recetas:

```
public/recetas/<id-estable>/
  portada.webp
  portada-1x1.webp
  portada-4x3.webp
  portada-16x9.webp
  paso-01.webp
  ...
```

El JSON-LD `Recipe.image` debe listar las tres variantes.

## Entidad del sitio

No se encontró un `WebSite` JSON-LD global en la raíz ni una entidad `Organization` suficientemente desarrollada en la home.

Antes del lanzamiento:
- `WebSite` en `https://manualdecocina.com/` con `name`, `url` y `alternateName` si aplica.
- `Organization` con nombre, URL y logo rastreable.
- conectar de forma consistente autor, sitio y organización.
- añadir `sameAs` solo para perfiles reales/verificados, nunca inventados.

## Fechas

No modificar `datePublished` únicamente para parecer “nuevo”.
Para recetas históricas reconstruidas:
- conservar publicación histórica cuando proceda;
- usar `dateModified` real;
- si se desea mostrar “recientemente actualizada”, basarse en `updated_at`.

---

# 6. Enlazado interno: una fuga importante

Existe una diferencia entre rutas:

- la ruta moderna `/[lang]/receta/[slug]` calcula recetas relacionadas;
- muchas URLs canónicas/históricas pasan por `legacy-route.tsx` o `[lang]/[...rest]`;
- esas rutas entregan `RecipeDocument` sin `relatedRecipes`.

Resultado: **muchas de las URLs que Google ya conoce no reciben el bloque de enlaces internos relacionados**, aunque la versión moderna sí.

Acción P0/P1:
- extraer `getRelatedRecipes(recipe)` a un helper común;
- usarlo en todas las rutas que renderizan una receta;
- hacer selección determinística;
- mejorar relevancia usando categoría + ingredientes canónicos + cocina;
- asegurar que cada receta importante reciba enlaces desde home/listados/categorías/ingredientes/relacionadas.

## Enlaces externos

No añadir enlaces externos “porque Google los quiere”.
Sí añadirlos cuando apoyen una afirmación concreta:
- seguridad alimentaria;
- nutrición;
- origen cultural verificable;
- recomendaciones oficiales.

Usar fuentes primarias/autoridad y anchors descriptivos.
Enlaces patrocinados/afiliados: `rel="sponsored"`.

---

# 7. “¿Qué puedo cocinar?” — causa principal de la inconsistencia

La herramienta carga correctamente en la prueba pública actual y tiene `WebApplication` schema. El problema estructural más claro está en los datos.

De las 20 recetas ES publicadas:
- 18 tienen alguna relación en `recipe_ingredients`.
- 2 tienen **cero** relaciones:
  - Buddha Bowl.
  - Lechona.

Y muchas están mapeadas solo parcialmente:

- Arepa: 12 ingredientes / 1 relación.
- Arroz pilaf: 9 / 1.
- Batido crema: 10 / 1.
- Ajiaco: 14 / 2.
- Grimace: 8 / 2.
- Batido energizante: 9 / 2.
- Pie maracuyá: 8 / 2.
- Quinoa bowl: 19 / 3.
- Burrito: 14 / 3.
- Camarones: 8 / 3.
- Teriyaki: 11 / 3.
- Canelones: 12 / 6.
- Stroganoff: 17 / 11.

La herramienta calcula coincidencias exclusivamente sobre esas relaciones. Por eso puede parecer que “a veces sirve y a veces no”: la lógica trabaja con un grafo incompleto.

## Acción

- completar canonicalización de ingredientes en las 20 recetas;
- al crear nuevas recetas, canonicalización obligatoria antes de publicar;
- no ofrecer como opción un ingrediente que no esté enlazado a ninguna receta pública;
- añadir estado de error real si falla carga de datos;
- mantener la herramienta server-first y la interacción client-side;
- cuando el inventario sea grande, preparar índice precomputado/cacheado.

Durante esta auditoría se corrigió además un bug: la herramienta forzaba `index,follow` en preview aunque el sitio global fuese noindex. Ahora respeta `NEXT_PUBLIC_ALLOW_INDEXING`.

---

# 8. El mayor riesgo del lanzamiento: content_pages legado

Estado actual:

- 69 `content_pages` marcadas como publicadas.
- 48 comparten `public_path` con una receta existente todavía no publicada.
- 69/69 tienen excerpt vacío.
- 1 tiene body vacío.
- aproximadamente 12 tienen temática sanitaria/YMYL.

Si se activa indexación en producción, el sitemap actual incluiría estas páginas.

Esto contradice la nueva política editorial de no reutilizar ciegamente contenido viejo de WordPress.

## Clasificación obligatoria antes del cutover

Cada una de las 69 debe ir a una de cinco cajas:

1. **Institucional/legal:** conservar/reemplazar por las nuevas páginas institucionales.
2. **Receta histórica con valor:** reconstruir como `recipes`, mantener URL.
3. **Guía editorial útil:** reescribir/revisar.
4. **Salud/YMYL:** revisión experta o mantener fuera del índice.
5. **Obsoleta/thin/sin valor:** retirar o redirigir solo si existe un destino verdaderamente equivalente.

No hacer una despublicación masiva sin mapa de URLs: todavía pueden existir enlaces y señales históricas.

---

# 9. Seguridad y base de datos

Supabase Advisors detecta:

## Seguridad

- dos tablas backup con RLS habilitado pero sin policies:
  - `recipes_backup_20260927`
  - `recipes_published_snapshot_20260927`
- `rate_recipe(uuid, integer)` es `SECURITY DEFINER` y ejecutable por anon/authenticated.
- protección de contraseñas filtradas desactivada.

## Ratings

El RPC:
- valida 1–5;
- solo actualiza recetas publicadas;
- pero es públicamente invocable;
- no tiene limitación fuerte por IP/usuario/CAPTCHA.

El frontend usa localStorage, que no impide automatización.

Riesgo: ratings manipulados podrían terminar alimentando `AggregateRating` en Recipe schema.

Acción:
- retirar ejecución directa desde anon;
- hacer voto a través de una ruta server-side protegida;
- rate limit razonable;
- mecanismo anti-repetición;
- mantener schema de rating únicamente con datos reales.

## Backups

Las tablas backup están en `public` y generan deuda de seguridad/performance.
Antes de borrarlas:
- confirmar que ya existe respaldo recuperable;
- exportar/archivar si hace falta;
- mover fuera del esquema expuesto o eliminarlas después de validar.

## Performance advisors

Dos índices figuran “unused”:
- `recipe_ingredient_pending_status_idx`
- `cuisines_indexable_idx`

No se deben borrar solo porque el linter diga “unused”: el preview no representa carga real de producción.

---

# 10. Estado editorial de datos

Hay inconsistencias entre `published` y `editorial_status`:

- 6 filas: `published=true` pero `editorial_status='archived'` — las seis traducciones no ES de Lechona.
- 115 filas: `published=false` pero `editorial_status='published'`.

La visibilidad pública depende de `published`, por lo que no es una fuga inmediata; sí es un problema serio de gobernanza y puede causar errores humanos/automatizados.

Acción:
- definir semántica única;
- migrar estados;
- añadir constraint/trigger o validación que impida combinaciones contradictorias.

---

# 11. Ramas Git y limpieza

Ramas encontradas:

- `main`
- `fix-idioma-recetas`
- `rediseno-md`
- `rediseno-md-claude`

Estado:

- `fix-idioma-recetas`: 0 commits por delante, 67 por detrás → trabajo ya absorbido; candidata a borrar.
- `rediseno-md`: 0 por delante, 70 por detrás → candidata a borrar.
- `rediseno-md-claude`: 3 por delante y 73 por detrás → divergente. Revisar los 3 commits únicos antes de borrarla.

No borrar la rama divergente a ciegas.

---

# 12. Código muerto / deuda del repositorio

El rediseño creó componentes nuevos en `src/components/md/`, pero quedaron componentes viejos en `src/components/`.

Candidatos fuertes a eliminación tras prueba de imports/build:

- `FavoriteStar.tsx`
- `RecipeCard.tsx` viejo
- `PrintRecipeButton.tsx`
- `RecipeCookingMode.tsx` viejo
- `RecipeIngredients.tsx` viejo
- `ShareRecipeButton.tsx`
- `RelatedRecipes.tsx` viejo
- `SiteHeader.tsx` viejo

También:
- revisar `migration-v2/compact2.json.gz.b64`;
- no borrar `docs/` históricos sin antes crear un índice/archivo, porque contienen decisiones valiosas.

---

# 13. CI / toolchain

El pipeline de calidad llevaba roto desde cambios recientes de sitemap/schema.

Problemas detectados:
- mocks/tests quedaron atrás del código;
- Next en `package.json` es 16.x, mientras README todavía habla de Next 14;
- no hay lockfile visible;
- CI usa `npm install`, no `npm ci`;
- CI no ejecuta lint;
- `next lint` ya no debe tratarse como estrategia futura sin revisar compatibilidad con Next 16.

Acción:
- conseguir CI verde;
- crear/commitear lockfile;
- fijar estrategia de versiones;
- modernizar ESLint;
- añadir checks para:
  - enlaces internos rotos;
  - Recipe schema;
  - publicación incompleta;
  - sitemap/canonical/hreflang;
  - assets faltantes;
  - imports/dead code.

---

# 14. Ads / AdSense sin destruir la experiencia

Ya existe:
- `ads.txt` válido del publisher.
- loader de AdSense.
- slots visuales previstos.
- ubicaciones prudentes: después de ingredientes y después de notas.

Pero los slots actuales son placeholders; todavía no hay unidades reales.

## Cumplimiento

Para tráfico de EEE/Reino Unido/Suiza, anuncios personalizados requieren una **CMP certificada por Google integrada con IAB TCF**. El banner casero en localStorage no debe considerarse sustituto de esa CMP.

Antes de activar monetización:
- configurar Google Privacy & Messaging o CMP certificada;
- TCF vigente;
- consentimiento compatible;
- reservar altura de anuncios para evitar CLS;
- async loading;
- no poner anuncios antes de que el usuario vea contenido útil;
- no saturar pasos/ingredientes.

## Diseño de monetización inicial recomendado

Móvil, por receta:
1. sin anuncio encima del título/portada;
2. un anuncio después del bloque de ingredientes;
3. uno después de notas/sobre receta, solo en recetas largas;
4. opcional sticky/anchor de Google únicamente si la experiencia y políticas lo toleran, después de medir.

No empezar con más.

El dinero rápido, si llega, vendrá más de recuperar tráfico que de aumentar densidad de anuncios.

---

# 15. Marca, E-E-A-T y transparencia

Google insiste en Who / How / Why.

El sitio ya tiene:
- byline Néstor Bastidas;
- página “Quiénes somos”;
- política editorial.

Debe reforzarse:

## Who
- autor real;
- biografía auténtica;
- experiencia real con el proyecto;
- sin inventar títulos profesionales.

## How
Crear una sección pública clara de metodología:
- cómo se reconstruyen recetas;
- cómo se verifican cantidades/pasos;
- cómo se calculan estimaciones nutricionales;
- cómo se hacen traducciones;
- cómo se producen/seleccionan imágenes;
- cómo se usa IA como asistencia cuando aplique;
- revisión humana final;
- política de correcciones.

## Why
El foco debe ser ayudar a cocinar, no “fabricar páginas para SEO”.

Esta transparencia es especialmente importante porque el proyecto usa automatización/IA en redacción, traducciones e imágenes.

---

# 16. Migración WordPress → Next: cómo debería verla Google

Objetivo: que Google perciba **continuidad de entidad y URLs**, con una mejora real del contenido.

## Antes del cutover

- mapa 1:1 de URLs actuales → nuevas;
- mantener exactamente las URLs ganadoras siempre que sea posible;
- canonical autoconsistente;
- hreflang bidireccional;
- imágenes rastreables;
- sitemap limpio;
- noindex solo en preview;
- CI verde;
- contenido legado clasificado;
- comprobar 404/redirects.

## En el cutover

- misma propiedad/dominio;
- servir nuevas páginas en las URLs históricas;
- 301/308 solo cuando la URL realmente cambia;
- sitemap nuevo;
- robots permitido;
- Search Console: enviar sitemap y revisar inspecciones.

## Después

- conservar redirects al menos 1 año;
- monitor diario durante las primeras 2 semanas;
- luego semanal:
  - indexación;
  - Recipe rich results / Recipe Gallery;
  - CTR;
  - impresiones;
  - CWV;
  - errores 404;
  - páginas excluidas;
  - hreflang;
  - países/idiomas.

No hacer simultáneamente cambios masivos innecesarios de URL, contenido, estructura y dominio.

---

# 17. Plan de recuperación orgánica y monetización

## Fase P0 — estabilidad antes de más recetas

- CI verde.
- Resolver `content_pages` legado.
- Completar 20 grupos publicados.
- Completar ingredientes canónicos/tool.
- Unificar related recipes en todas las rutas.
- Resolver ratings/security.
- Añadir WebSite/Organization.
- Definir portadas 1:1/4:3/16:9.
- CMP AdSense correcta.
- limpiar estados editoriales.

## Fase P1 — recuperación de activos históricos

Trabajar primero recetas con:
- clics históricos;
- impresiones altas;
- posición histórica buena;
- mercados internacionales fuertes.

No cambiar sus URLs.

## Fase P2 — clusters y enlaces

Ejemplos de hubs:
- cocina colombiana;
- carnes;
- arroces;
- sopas;
- postres;
- pastas;
- salsas;
- desayunos;
- bebidas;
- ingredientes.

Cada receta:
- categoría;
- ingrediente(s);
- 3–4 relacionadas;
- enlaces contextuales útiles;
- enlaces a guía/ingrediente cuando tenga sentido.

## Fase P3 — mejorar CTR

Para páginas con posición 3–12 pero CTR débil:
- títulos más competitivos sin clickbait;
- meta description;
- portada;
- coherencia con intención;
- fecha modified real;
- rich Recipe completo.

## Fase P4 — monetizar

Solo cuando tráfico y experiencia están estables:
- CMP;
- 1–2 slots/receta inicialmente;
- medir RPM, CLS, engagement;
- no sacrificar receta/UX por anuncios.

---

# 18. Métricas objetivo

No fijar promesas de ranking o ingresos.

Medir:

- páginas válidas indexadas;
- cobertura Recipe Gallery;
- impresiones y clics por idioma;
- CTR por query/página;
- posición media por cluster;
- CWV móvil;
- ingresos/RPM cuando AdSense esté activo;
- páginas con enlaces internos entrantes;
- porcentaje de recetas con:
  - 7 traducciones completas;
  - nutrición;
  - 3 portadas;
  - canonical/hreflang;
  - ingredientes canonicalizados;
  - related links;
  - schema válido.

Objetivo operativo: **100 % de cada gate antes de publicar nuevas recetas**.

---

# 19. Cambios seguros realizados durante esta auditoría

- La herramienta “¿Qué puedo cocinar?” ahora respeta el noindex global del preview.
- Se eliminó el `lastModified = new Date()` artificial del sitemap para índices/herramienta.
- Se empezaron a actualizar mocks/tests del sitemap que habían quedado desincronizados.
- No se borraron ramas.
- No se eliminaron content_pages.
- No se cambiaron URLs históricas.
- No se eliminaron backups.
- No se tocaron recetas legacy de forma destructiva.

---

# 20. Orden recomendado para la siguiente ejecución

1. Conseguir CI verde.
2. Crear matriz de las 69 content_pages con decisión URL por URL.
3. Completar los 20 grupos actuales y su canonicalización de ingredientes.
4. Corregir related recipes en rutas históricas.
5. Añadir WebSite + Organization.
6. Implementar portadas 1:1 / 4:3 / 16:9 y Recipe.image múltiple.
7. Corregir rating endpoint / advisor warnings.
8. Actualizar CMP/AdSense.
9. Limpiar ramas/código muerto con build verde.
10. Reanudar bloque de recetas, priorizado por Search Console.
11. Preparar production gate y plan de cutover.
12. Solo entonces cambiar `manualdecocina.com` al nuevo stack.

---

## Principio rector

No competir por volumen. Competir por **continuidad histórica + utilidad real + recetas completas + traducciones de calidad + excelente experiencia móvil + datos estructurados correctos + enlaces internos + transparencia editorial**.

Manual de Cocina ya demostró que podía posicionarse en múltiples mercados. La reconstrucción debe preservar esas señales y eliminar las causas técnicas/editoriales que las debilitan, sin convertir el relanzamiento en otra migración traumática.
