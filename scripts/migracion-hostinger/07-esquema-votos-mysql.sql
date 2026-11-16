-- Manual de Cocina · Esquema para conservar valoraciones existentes (NO son los votos)
-- Procedencia: Supabase private.recipe_rating_votes, inspeccionada 2026-11-16
-- El origen cambia en vivo: el 16/11 ya habia 24 votos. Exportar los valores JUSTO antes del corte.\n-- Respaldo PRIVADO: jamas incluir voter_hash en GitHub.
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
  -- rating 1..5 se valida en el motor Node y durante la importacion.\n  CONSTRAINT `fk_rating_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
      ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- La comprobacion final debe coincidir con Supabase EN EL MOMENTO DEL CORTE.\n-- Al 16/11/2026 el origen tenia 24 votos sobre 23 recetas, total rating_count=30 y rating_sum=148.\n-- Estos valores no son constantes: reconsultar el origen antes de activar el nuevo motor.
-- IMPORTANTE: esta instrucción no agrega los datos; requieren importación cifrada o archivo privado.
SELECT COUNT(*) AS total_votos, COUNT(DISTINCT recipe_id) AS recetas_votadas
FROM `recipe_rating_votes`;
