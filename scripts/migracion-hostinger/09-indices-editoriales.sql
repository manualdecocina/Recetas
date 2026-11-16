-- Manual de Cocina / índices anti-duplicado para edición MySQL.
-- SOLO PREPARADO: NO ejecutar todavía en Hostinger hasta QA sobre copia real.
-- Requiere MySQL 8, InnoDB y que no haya duplicados en datos actuales.
-- Datos originales Supabase 16/11/2026: cero duplicados group+lang, lang+slug y public_path.
-- No elimina filas, pero ALTER TABLE puede bloquear escrituras mientras crea índices.
-- Ejecutar UNA SOLA VEZ, después de la prueba MySQL 8 aislada.

ALTER TABLE `u357006512_mdc_migracion`.`recipes`
  ADD UNIQUE KEY `uq_recipes_group_language` (`recipe_group_id`,`language`);

-- Digest SHA-256 compara exactamente Unicode (sin collation case/accent-insensitive).
-- Las recetas actuales tienen slug máximo de 76 caracteres y rutas máximas de 82.
ALTER TABLE `u357006512_mdc_migracion`.`recipes`
  ADD COLUMN `slug_identity` BINARY(32)
    GENERATED ALWAYS AS (UNHEX(SHA2(CONCAT(`language`, '#', `slug`), 256))) STORED,
  ADD UNIQUE KEY `uq_recipes_slug_identity` (`slug_identity`);

ALTER TABLE `u357006512_mdc_migracion`.`recipes`
  ADD COLUMN `public_path_identity` BINARY(32)
    GENERATED ALWAYS AS (UNHEX(SHA2(`public_path`, 256))) STORED,
  ADD UNIQUE KEY `uq_recipes_public_path_identity` (`public_path_identity`);
