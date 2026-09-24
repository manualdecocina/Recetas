# Conflicto de routing y redirects P1 — 2026-09-24

## Hallazgo

La auditoría de Supabase muestra **27 URLs españolas prioritarias** con un 301 ya registrado en `public.content_redirects`.

El patrón dominante es:

`URL histórica raíz → /es/receta/slug`

Esto entra en conflicto con la decisión de control actual de conservar una URL histórica cuando:
1. representa una entidad culinaria válida;
2. tiene evidencia histórica;
3. no necesita cambiar de URL por una razón editorial real.

## 27 redirects que requieren revisión

- /receta-bondiola-de-cerdo/ → /es/receta/receta-bondiola-de-cerdo
- /receta-de-salsa-de-ajo/ → /es/receta/receta-de-salsa-de-ajo
- /receta-mejillones-al-ajillo/ → /es/receta/receta-mejillones-al-ajillo
- /receta-envuelto-de-choclo/ → /es/receta/receta-envuelto-de-choclo
- /receta-de-rollo-de-carne/ → /es/receta/receta-de-rollo-de-carne
- /caldo-de-huevo-changua/ → /es/receta/caldo-de-huevo-changua
- /receta-de-pancakes-con-fresas-y-arandanos/ → /es/receta/receta-de-pancakes-con-fresas-y-arandanos
- /barquitos-de-berenjenas-al-horno/ → /es/receta/barquitos-de-berenjenas-al-horno
- /pollo-alfredo-a-la-florentina/ → /es/pollo-alfredo-a-la-florentina
- /cangrejo-al-limon/ → /es/receta/cangrejo-al-limon
- /receta-trucha-al-ajillo-con-limon/ → /es/receta/receta-trucha-al-ajillo-con-limon
- /receta-de-pan-matza/ → /es/receta/receta-de-pan-matza
- /receta-de-fajitas-mexicanas/ → /es/receta/receta-de-fajitas-mexicanas
- /receta-de-pollo-teriyaki/ → /es/receta/receta-de-pollo-teriyaki
- /receta-de-lechona-colombiana/ → /es/receta-de-lechona-colombiana
- /receta-cheesecake-de-agraz/ → /es/receta/receta-cheesecake-de-agraz
- /receta-helado-casero/ → /es/receta/receta-helado-casero
- /creep-stroganoff/ → /es/receta/creep-stroganoff
- /receta-de-sancocho-trifasico/ → /es/receta/receta-de-sancocho-trifasico
- /receta-de-pie-de-maracuya/ → /es/receta/receta-de-pie-de-maracuya
- /receta-de-galletas-de-naranja/ → /es/receta/receta-de-galletas-de-naranja
- /sudado-de-carne/ → /es/receta/sudado-de-carne
- /souffle-de-queso/ → /es/souffle-de-queso
- /zanahorias-glaseadas/ → /es/receta/zanahorias-glaseadas
- /lomo-de-cerdo-en-salsa-de-menta/ → /es/receta/lomo-de-cerdo-en-salsa-de-menta
- /empanada-peruana-de-pollo/ → /es/empanada-peruana-de-pollo
- /receta-ensalada-caprese/ → /es/receta/receta-ensalada-caprese

## Consecuencia arquitectónica

La aplicación actual tiene dos comportamientos distintos:

### Recipe route

`src/app/[lang]/receta/[slug]/page.tsx`

Esta ruta:
- consulta `recipes`;
- genera canonical;
- genera alternates/hreflang;
- genera JSON-LD `Recipe`.

### Generic content route

`src/app/[lang]/[...rest]/page.tsx`

Esta ruta:
- consulta `content_pages`;
- genera únicamente canonical;
- no genera JSON-LD Recipe;
- no genera hreflang;
- renderiza el contenido como página genérica.

Por tanto, si una receta histórica española se conserva en su URL raíz, **no basta con eliminar el redirect**. El router debe poder resolver esa URL hacia la entidad `Recipe` y aplicar el mismo contrato SEO/schema que una página de receta.

## Decisión de control

No cambiar redirects en producción todavía.

Primero:

1. cerrar URL Master;
2. decidir KEEP/MIGRATE por cada URL;
3. definir resolución de URLs históricas raíz;
4. adaptar routing/SEO/schema;
5. después actualizar `content_redirects`.

## Regla

La estructura de código debe adaptarse a las URLs definitivas aprobadas; el URL Master no debe deformarse para satisfacer el router actual.

Google recomienda que, una vez definido el mapeo, cada URL final tenga canonical autorreferente y que las anotaciones de idioma apunten a las nuevas URLs; también recomienda evitar redirects irrelevantes o cadenas. 
