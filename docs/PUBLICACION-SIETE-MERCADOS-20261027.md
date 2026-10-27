# Siete recetas de siete mercados — publicación verificada

Se publicaron siete recetas distintas y sus siete idiomas: 49 páginas. La auditoría HTTP confirmó 49/49 páginas y 84/84 WebP con los hashes de sus manifiestos, ocho pasos ilustrados por receta, FAQ visible, nutrición, Recipe JSON-LD, canonical autorreferente, hreflang recíproco y ausencia de valoraciones inventadas. Todas están en el sitemap y en portada y catálogo de los siete idiomas.

La investigación y sus límites están en `OPORTUNIDADES-SIETE-MERCADOS-20261027.md`. Semrush no tenía unidades API; no se inventaron métricas de demanda o rentabilidad. No se afirma prueba física en cocina.

Se usaron los RPC editoriales existentes para crear siete grupos nuevos y publicar sus traducciones, con guardas contra colisiones y contra cambios en los borradores. Las recetas anteriores no se sobrescribieron. La temperatura de la receta japonesa se revisó frente a MHLW: 75 °C en el centro durante al menos 1 minuto.

Las fotos finales usan el formato habitual 4:3, luz natural y mesa clara. Se corrigió la continuidad de la sartén en Pizza Beans y se quitaron vasos ya montados de dos pasos tempranos del postre Spekulatius. Portada y paso 8 tienen los mismos bytes.

Las imágenes se cargaron en el bucket público existente `recetas` mediante una función temporal autenticada, limitada a 84 rutas, tamaños y SHA256 exactos y sin sobrescritura. Tras completar la carga, quedó sellada con HTTP 410 y JWT habilitado (versión 2), y se eliminó la credencial temporal. No se extrajeron credenciales del servidor.

La invalidación protegida de la aplicación y la comprobación de las 14 superficies públicas pasaron en GitHub Actions [40587516032](https://github.com/manualdecocina/Recetas/actions/runs/40587516032). La prueba de contenido, SEO y medios está en `editorial/siete-mercados-20261027/production-qa.json`. No se requiere un nuevo despliegue de la aplicación para estas fichas y medios públicos.
