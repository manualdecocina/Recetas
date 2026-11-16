-- Manual de Cocina · VALIDACION NO DESTRUCTIVA de copia MySQL en Hostinger
-- En phpMyAdmin seleccione SOLAMENTE u357006512_mdc_migracion.
-- No modifica datos, no abre conexiones remotas y no requiere claves.

SELECT
  (SELECT COUNT(*) FROM recipes) AS recetas,
  (SELECT COUNT(*) FROM recipes WHERE published = 1) AS recetas_publicadas,
  (SELECT COUNT(*) FROM recipes WHERE published = 0) AS borradores,
  (SELECT COUNT(*) FROM ingredients) AS ingredientes,
  (SELECT COUNT(*) FROM recipe_ingredients) AS relaciones_ingredientes,
  (SELECT COUNT(*) FROM recipe_reviews) AS revisiones,
  (SELECT COUNT(*) FROM content_redirects) AS redirecciones_activas,
  (SELECT COUNT(*) FROM content_redirects_backup_20261030) AS redirecciones_historicas;

-- Valores esperados (exportacion 16/11/2026):
-- recetas=1782, publicadas=1764, borradores=18, ingredientes=1032,
-- relaciones_ingredientes=1574, revisiones=226,
-- redirecciones_activas=242, redirecciones_historicas=100.

SELECT language, COUNT(*) AS total, SUM(published = 1) AS publicadas
FROM recipes
GROUP BY language
ORDER BY language;
-- Esperado: de/en/es/fr/it/ja/pt, 252 publicadas cada idioma;
-- es incluye 18 borradores adicionales.
