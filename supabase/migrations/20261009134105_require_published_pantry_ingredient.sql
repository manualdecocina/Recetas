-- Published Spanish source recipes must be usable by the pantry tool.
-- D-087 remains: unresolved positions may stay pending if a usable canonical link exists.
-- Deferred checks permit normal delete/rebuild synchronization inside a transaction.
CREATE OR REPLACE FUNCTION private.guard_published_pantry_ingredient()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  affected uuid[];
  recipe_id uuid;
BEGIN
  IF TG_TABLE_NAME = 'recipes' THEN
    affected := ARRAY[NEW.id];
  ELSIF TG_OP = 'DELETE' THEN
    affected := ARRAY[OLD.recipe_id];
  ELSE
    affected := ARRAY[OLD.recipe_id, NEW.recipe_id];
  END IF;
  FOREACH recipe_id IN ARRAY affected LOOP
    IF EXISTS(SELECT 1 FROM public.recipes r WHERE r.id=recipe_id AND r.language='es' AND r.published)
      AND NOT EXISTS(
        SELECT 1 FROM public.recipe_ingredients ri
        JOIN public.ingredients i ON i.id=ri.ingredient_id
        WHERE ri.recipe_id=recipe_id AND i.status='canonical' AND i.searchable
      )
    THEN
      RAISE EXCEPTION 'La receta publicada necesita al menos un ingrediente canónico buscable para aparecer en la herramienta.'
        USING ERRCODE='23514', CONSTRAINT='recipes_require_pantry_ingredient',
              HINT='Asocia los ingredientes al catálogo antes de publicar; las posiciones ambiguas pueden quedar pendientes.';
    END IF;
  END LOOP;
  RETURN NULL;
END
$function$;
REVOKE ALL ON FUNCTION private.guard_published_pantry_ingredient() FROM PUBLIC, anon, authenticated;
CREATE CONSTRAINT TRIGGER recipes_require_pantry_ingredient
AFTER INSERT OR UPDATE OF published, language, ingredients ON public.recipes
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
WHEN (NEW.language='es' AND NEW.published)
EXECUTE FUNCTION private.guard_published_pantry_ingredient();
CREATE CONSTRAINT TRIGGER recipe_ingredients_preserve_pantry_ingredient
AFTER DELETE OR UPDATE ON public.recipe_ingredients
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION private.guard_published_pantry_ingredient();
