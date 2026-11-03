-- Run only after all 12 digest-locked public media files pass verification.
-- Publishes the existing historical group; never creates another beer group.
DO $beer_publish$
DECLARE
 g constant uuid := 'bfc90e7b-1f11-47da-96c8-218b623a16e8';
 v public.recipes;
 n integer := 0;
BEGIN
 IF (SELECT count(*) FROM public.recipes WHERE recipe_group_id=g)<>7
 OR (SELECT count(DISTINCT language) FROM public.recipes WHERE recipe_group_id=g)<>7
 OR EXISTS(SELECT 1 FROM public.recipes WHERE recipe_group_id=g AND (
   editorial_status NOT IN ('ready','published') OR jsonb_array_length(steps)<>8
   OR jsonb_array_length(ingredients)<>5 OR nutrition IS NULL
   OR jsonb_array_length(seo->'faq')<>4 OR jsonb_array_length(seo->'image_variants')<>3
   OR image_url NOT LIKE 'https://eqbdtctxbpepbeickhqi.supabase.co/storage/v1/object/public/recetas/como-preparar-cerveza-artesanal/%'))
 THEN RAISE EXCEPTION 'Beer group incomplete'; END IF;
 IF EXISTS(SELECT 1 FROM public.recipe_ingredient_pending WHERE recipe_id='c3860fad-711e-4bfd-ba29-13b0e71afe3c')
 OR (SELECT count(*) FROM public.recipe_ingredients WHERE recipe_id='c3860fad-711e-4bfd-ba29-13b0e71afe3c')<>5
 THEN RAISE EXCEPTION 'Ingredient catalogue incomplete'; END IF;
 IF (SELECT count(*) FROM storage.objects WHERE bucket_id='recetas' AND name LIKE 'como-preparar-cerveza-artesanal/%')<>12
 THEN RAISE EXCEPTION 'Expected 12 uploaded media objects'; END IF;
 IF EXISTS(SELECT 1 FROM public.content_redirects WHERE source_path='/como-preparar-cerveza-artesanal'
   AND NOT (id='9966b8a9-6206-492b-955b-2c23ba5d0606' AND target_path='/es/recetas' AND status_code=302))
 THEN RAISE EXCEPTION 'Unexpected historical redirect; investigate before removing'; END IF;
 PERFORM set_config('request.jwt.claim.sub','2caf0bab-d7e8-4d52-9910-d79799c27072',true);
 IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin context missing'; END IF;
 FOR v IN SELECT * FROM public.recipes WHERE recipe_group_id=g LOOP
  PERFORM public.update_recipe(v.id,v.slug,v.title,v.excerpt,v.ingredients,v.steps,v.category,
   v.prep_time_minutes,v.cook_time_minutes,v.servings,v.image_url,true);
  UPDATE public.recipes SET editorial_status='published' WHERE id=v.id;
  n:=n+1;
 END LOOP;
 -- LegacyPublicPage resolves a published recipe before consulting fallback redirects.
 -- Keep the existing fallback record: publication itself restores the historical route.
 IF n<>7 OR (SELECT count(*) FROM public.recipes WHERE recipe_group_id=g AND published)<>7
 THEN RAISE EXCEPTION 'Publication postcondition failed'; END IF;
END $beer_publish$;
SELECT language,public_path,published,editorial_status FROM public.recipes
WHERE recipe_group_id='bfc90e7b-1f11-47da-96c8-218b623a16e8' ORDER BY language;
