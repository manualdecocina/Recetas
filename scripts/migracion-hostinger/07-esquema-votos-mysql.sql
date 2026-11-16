-- Manual de Cocina · Esquema para conservar valoraciones existentes (NO son los votos)
-- Procedencia: Supabase private.recipe_rating_votes, inspeccionada 2026-11-16
-- Inventario original: 23 votos; consulta real al origen el 16/11/2026: 24 votos.
-- El recuento sigue cambiando: conservar TODOS los registros al momento del corte.
-- Nunca incluir voter_hash ni datos individuales de votantes en GitHub.
-- Solo preparado para la nueva MySQL; NO ejecutado sobre Hostinger.
-- Prohibido borrar votos originales o reiniciar contadores.
SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS `recipe_rating_votes` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `recipe_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `voter_hash` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL,
  `created_at` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_recipe_voter_hash` (`recipe_id`,`voter_hash`),
  KEY `idx_rating_recipe` (`recipe_id`),
  CONSTRAINT `chk_rating_between_1_and_5` CHECK (`rating` BETWEEN 1 AND 5),
  CONSTRAINT `fk_rating_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
      ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- No utilizar un recuento fijo: cotejar total_votos y recetas_votadas con
-- Supabase inmediatamente antes del corte. La consulta de 16/11/2026 dio 24 votos.
-- IMPORTANTE: esta instrucción no agrega los datos; requieren importación cifrada o archivo privado.
SELECT COUNT(*) AS total_votos, COUNT(DISTINCT recipe_id) AS recetas_votadas
FROM `recipe_rating_votes`;
