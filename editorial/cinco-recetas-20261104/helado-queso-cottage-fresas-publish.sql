DO $publish$
DECLARE g uuid; source_id uuid; v public.recipes;
BEGIN
SELECT recipe_group_id,id INTO STRICT g,source_id FROM public.recipes WHERE language='es' AND slug='helado-queso-cottage-fresas';
IF (SELECT count(*) FROM public.recipes WHERE recipe_group_id=g)<>7 OR (SELECT count(distinct language) FROM public.recipes WHERE recipe_group_id=g)<>7 THEN RAISE EXCEPTION 'Incomplete group'; END IF;
IF EXISTS(SELECT 1 FROM public.recipes WHERE recipe_group_id=g AND (editorial_status NOT IN ('ready','published') OR jsonb_array_length(steps)<>8 OR jsonb_array_length(ingredients)<>5 OR nutrition IS NULL OR jsonb_array_length(seo->'faq')<2 OR jsonb_array_length(seo->'image_variants')<>3 OR content_html IS NULL OR notes IS NULL)) THEN RAISE EXCEPTION 'Incomplete content'; END IF;
IF EXISTS(SELECT 1 FROM public.recipe_ingredient_pending WHERE recipe_id=source_id) OR (SELECT count(*) FROM public.recipe_ingredients WHERE recipe_id=source_id)<>5 THEN RAISE EXCEPTION 'Unresolved ingredients'; END IF;
PERFORM set_config('request.jwt.claim.sub','2caf0bab-d7e8-4d52-9910-d79799c27072',true);
IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin context missing'; END IF;
FOR v IN SELECT * FROM public.recipes WHERE recipe_group_id=g LOOP
 PERFORM public.update_recipe(v.id,v.slug,v.title,v.excerpt,v.ingredients,v.steps,v.category,v.prep_time_minutes,v.cook_time_minutes,v.servings,v.image_url,true);
 UPDATE public.recipes SET editorial_status='published' WHERE id=v.id;
END LOOP;
IF (SELECT count(*) FROM public.recipes WHERE recipe_group_id=g AND published)<>7 THEN RAISE EXCEPTION 'Publish failed'; END IF;
END $publish$;
SELECT id,recipe_group_id,language,public_path,published,published_at FROM public.recipes WHERE recipe_group_id=(SELECT recipe_group_id FROM public.recipes WHERE language='es' AND slug='helado-queso-cottage-fresas') ORDER BY language;
