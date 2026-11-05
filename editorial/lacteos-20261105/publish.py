"""Create one complete seven-language group using the site's RPC contract."""
import json,sys
from pathlib import Path
D=Path(__file__).resolve().parent
key=sys.argv[1]; c=json.loads((D/f'{key}.source.json').read_text()); payload=json.loads((D/f'{key}.json').read_text())['records']
names={'yogur-natural':'Yogur natural','cuajo':'Cuajo','acido-citrico':'Ácido cítrico alimentario'}
food=[dict(slug=s,name=names[s]) for s in c['canonical'] if s in names]
aliases=[dict(slug=s,alias=i['name']) for s,i in zip(c['canonical'],payload[0]['ingredients'],strict=True)]
sql="""DO $dairy$
DECLARE payload jsonb := $payload$PAYLOAD$payload$::jsonb;
foods jsonb := $foods$FOODS$foods$::jsonb;
aliases jsonb := $aliases$ALIASES$aliases$::jsonb;
x jsonb; a jsonb; v public.recipes; made public.recipes; source_id uuid; group_id uuid;
BEGIN
PERFORM set_config('request.jwt.claim.sub','2caf0bab-d7e8-4d52-9910-d79799c27072',true);
IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin context missing'; END IF;
IF jsonb_array_length(payload)<>7 THEN RAISE EXCEPTION 'Need seven languages'; END IF;
IF EXISTS(SELECT 1 FROM public.recipes r JOIN jsonb_array_elements(payload) e ON r.public_path=e->>'public_path' OR (r.language=e->>'language' AND r.slug=e->>'slug')) THEN RAISE EXCEPTION 'Recipe already exists'; END IF;
IF EXISTS(SELECT 1 FROM public.content_pages p JOIN jsonb_array_elements(payload) e ON p.public_path=e->>'public_path') OR EXISTS(SELECT 1 FROM public.content_redirects r JOIN jsonb_array_elements(payload) e ON r.source_path=e->>'public_path') THEN RAISE EXCEPTION 'Route collision'; END IF;
FOR a IN SELECT value FROM jsonb_array_elements(foods) LOOP
 INSERT INTO public.ingredients(slug,name,normalized_name,description,status,searchable,indexable)
 SELECT a->>'slug',a->>'name',lower(a->>'name'),'Ingrediente para elaboraciones lácteas domésticas.','canonical',true,false WHERE NOT EXISTS(SELECT 1 FROM public.ingredients WHERE slug=a->>'slug');
END LOOP;
FOR a IN SELECT value FROM jsonb_array_elements(aliases) LOOP
 IF NOT EXISTS(SELECT 1 FROM public.ingredients WHERE slug=a->>'slug' AND status='canonical') THEN RAISE EXCEPTION 'Missing ingredient %',a; END IF;
 IF EXISTS(SELECT 1 FROM public.ingredient_aliases ia JOIN public.ingredients i ON i.id=ia.ingredient_id WHERE lower(trim(ia.alias))=lower(trim(a->>'alias')) AND i.slug<>a->>'slug' AND i.status='canonical') THEN RAISE EXCEPTION 'Alias collision %',a; END IF;
 INSERT INTO public.ingredient_aliases(ingredient_id,alias,normalized_alias) SELECT id,a->>'alias',lower(a->>'alias') FROM public.ingredients WHERE slug=a->>'slug' AND status='canonical' ON CONFLICT(ingredient_id,normalized_alias) DO NOTHING;
END LOOP;
FOR x IN SELECT value FROM jsonb_array_elements(payload) LOOP
 v:=jsonb_populate_record(NULL::public.recipes,x);
 IF v.language='es' THEN
  made:=public.create_recipe(v.language,v.slug,v.title,v.excerpt,v.ingredients,v.steps,v.category,v.prep_time_minutes,v.cook_time_minutes,v.servings,v.image_url,false,v.public_path);
  source_id:=made.id;group_id:=made.recipe_group_id;
 ELSE
  made:=public.create_recipe_translation(source_id,v.language,v.slug,v.title,v.excerpt,v.ingredients,v.steps,v.category,v.prep_time_minutes,v.cook_time_minutes,v.servings,v.image_url,false,v.public_path);
 END IF;
 UPDATE public.recipes SET content_html=v.content_html,summary=v.summary,notes=v.notes,difficulty=v.difficulty,course=v.course,cuisine=v.cuisine,total_time_minutes=v.total_time_minutes,keywords=v.keywords,nutrition=v.nutrition,gallery=v.gallery,video_urls=v.video_urls,seo=v.seo,editorial_status='ready',ready_at=now() WHERE id=made.id;
END LOOP;
IF (SELECT count(*) FROM public.recipes WHERE recipe_group_id=group_id)<>7 THEN RAISE EXCEPTION 'Incomplete group'; END IF;
IF (SELECT count(*) FROM public.recipe_ingredients WHERE recipe_id=source_id)<>INGREDIENT_COUNT OR EXISTS(SELECT 1 FROM public.recipe_ingredient_pending WHERE recipe_id=source_id) THEN RAISE EXCEPTION 'Unresolved ingredients'; END IF;
FOR v IN SELECT * FROM public.recipes WHERE recipe_group_id=group_id LOOP
 PERFORM public.update_recipe(v.id,v.slug,v.title,v.excerpt,v.ingredients,v.steps,v.category,v.prep_time_minutes,v.cook_time_minutes,v.servings,v.image_url,true);
 UPDATE public.recipes SET editorial_status='published' WHERE id=v.id;
END LOOP;
END $dairy$;
SELECT language,public_path,published FROM public.recipes WHERE recipe_group_id=(SELECT recipe_group_id FROM public.recipes WHERE language='es' AND slug='RECIPE_KEY') ORDER BY language;
""".replace('PAYLOAD',json.dumps(payload,ensure_ascii=False)).replace('FOODS',json.dumps(food,ensure_ascii=False)).replace('ALIASES',json.dumps(aliases,ensure_ascii=False)).replace('INGREDIENT_COUNT',str(len(c['canonical']))).replace('RECIPE_KEY',key)
(D/f'{key}.publish.sql').write_text(sql)
print(sql)
