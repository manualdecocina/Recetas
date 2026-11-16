-- Manual de Cocina: esquema de destino MySQL 8 desde information_schema Supabase (2026-11-15)
-- NO ejecutar sobre base existente con datos. NO contiene datos ni secretos.
-- Conservar idiomas es/en/de/fr/it/ja/pt y los borradores. DATETIME UTC.
-- Autenticación/admin y defaults PG requieren implementación Node propia.
SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE `admins` (
  `user_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `email` VARCHAR(320) NOT NULL,
  `created_at` DATETIME(6) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `content_pages` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `language` VARCHAR(12) NOT NULL,
  `slug` VARCHAR(1024) NOT NULL,
  `title` LONGTEXT NOT NULL,
  `excerpt` LONGTEXT NULL,
  `content_html` LONGTEXT NULL,
  `featured_image_url` LONGTEXT NULL,
  `seo` JSON NOT NULL,
  `source_post_id` INT NULL,
  `source_url` LONGTEXT NULL,
  `published` TINYINT(1) NOT NULL,
  `published_at` DATETIME(6) NULL,
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL,
  `content_group_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  `public_path` VARCHAR(1024) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `content_redirects` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `source_path` VARCHAR(1024) NOT NULL,
  `target_path` VARCHAR(1024) NOT NULL,
  `status_code` INT NOT NULL,
  `created_at` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `content_redirects_backup_20261030` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  `source_path` VARCHAR(1024) NULL,
  `target_path` VARCHAR(1024) NULL,
  `status_code` INT NULL,
  `created_at` DATETIME(6) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cuisines` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `slug` VARCHAR(1024) NOT NULL,
  `name` LONGTEXT NOT NULL,
  `description` LONGTEXT NULL,
  `searchable` TINYINT(1) NOT NULL,
  `indexable` TINYINT(1) NOT NULL,
  `status` VARCHAR(64) NOT NULL,
  `normalized_name` VARCHAR(1024) NULL,
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ingredient_aliases` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `ingredient_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `alias` VARCHAR(1024) NOT NULL,
  `normalized_alias` VARCHAR(1024) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ingredients` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `slug` VARCHAR(1024) NOT NULL,
  `name` LONGTEXT NOT NULL,
  `description` LONGTEXT NULL,
  `image_url` LONGTEXT NULL,
  `searchable` TINYINT(1) NOT NULL,
  `indexable` TINYINT(1) NOT NULL,
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL,
  `status` VARCHAR(64) NOT NULL,
  `normalized_name` VARCHAR(1024) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `media_assets` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `source_attachment_id` INT NULL,
  `source_url` LONGTEXT NULL,
  `url` LONGTEXT NULL,
  `title` LONGTEXT NULL,
  `alt_text` LONGTEXT NULL,
  `created_at` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `recipe_cuisines` (
  `recipe_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `cuisine_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `created_at` DATETIME(6) NOT NULL,
  PRIMARY KEY (`recipe_id`, `cuisine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `recipe_ingredient_pending` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `recipe_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `position` INT NOT NULL,
  `raw_name` LONGTEXT NOT NULL,
  `amount` LONGTEXT NULL,
  `unit` LONGTEXT NULL,
  `status` VARCHAR(64) NOT NULL,
  `reason` LONGTEXT NULL,
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `recipe_ingredients` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `recipe_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `ingredient_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `amount` LONGTEXT NULL,
  `unit` LONGTEXT NULL,
  `preparation` LONGTEXT NULL,
  `note` LONGTEXT NULL,
  `position` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `recipe_reviews` (
  `recipe_group_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `status` VARCHAR(64) NOT NULL,
  `comment` LONGTEXT NULL,
  `reviewed_by` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  `reviewed_at` DATETIME(6) NOT NULL,
  PRIMARY KEY (`recipe_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `recipes` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `recipe_group_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `language` VARCHAR(12) NOT NULL,
  `slug` VARCHAR(1024) NOT NULL,
  `title` LONGTEXT NOT NULL,
  `excerpt` LONGTEXT NULL,
  `ingredients` JSON NOT NULL,
  `steps` JSON NOT NULL,
  `category` LONGTEXT NULL,
  `prep_time_minutes` INT NULL,
  `cook_time_minutes` INT NULL,
  `servings` INT NULL,
  `image_url` LONGTEXT NULL,
  `published` TINYINT(1) NOT NULL,
  `published_at` DATETIME(6) NULL,
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL,
  `content_html` LONGTEXT NULL,
  `summary` LONGTEXT NULL,
  `notes` LONGTEXT NULL,
  `difficulty` LONGTEXT NULL,
  `course` LONGTEXT NULL,
  `cuisine` LONGTEXT NULL,
  `total_time_minutes` INT NULL,
  `keywords` JSON NULL,
  `nutrition` JSON NULL,
  `gallery` JSON NOT NULL,
  `video_urls` JSON NOT NULL,
  `seo` JSON NOT NULL,
  `source_post_id` INT NULL,
  `source_url` LONGTEXT NULL,
  `public_path` VARCHAR(1024) NULL,
  `editorial_status` LONGTEXT NOT NULL,
  `reviewed_at` DATETIME(6) NULL,
  `reviewed_by` LONGTEXT NULL,
  `published_by` LONGTEXT NULL,
  `ready_at` DATETIME(6) NULL,
  `rating_count` INT NOT NULL,
  `rating_sum` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices de lectura. Validar EXPLAIN y duplicados antes de insertar todos.
CREATE INDEX idx_recipes_language_published ON recipes (language, published);
CREATE INDEX idx_recipes_group ON recipes (recipe_group_id);
CREATE INDEX idx_recipes_public_path ON recipes (public_path(191));
CREATE INDEX idx_recipes_slug ON recipes (slug(191));
CREATE INDEX idx_redirect_source_path ON content_redirects (source_path(191));
CREATE INDEX idx_ingredient_recipe ON recipe_ingredients (recipe_id);
CREATE INDEX idx_alias_ingredient ON ingredient_aliases (ingredient_id);
CREATE INDEX idx_recipe_cuisines_cuisine ON recipe_cuisines (cuisine_id);
CREATE INDEX idx_pending_recipe ON recipe_ingredient_pending (recipe_id);
CREATE INDEX idx_content_pages_public_path ON content_pages (public_path(191));

-- Aplicar SOLO a la nueva base vacía de destino, nunca a una DB existente de terceros.
