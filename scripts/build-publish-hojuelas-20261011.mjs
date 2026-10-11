import fs from 'node:fs'

const source = 'editorial/hojuelas-colombianas-20261011.json'
const target = 'scripts/publish-hojuelas-colombianas-20261011.sql'
const doc = JSON.parse(fs.readFileSync(source,'utf8'))
const publishedAt = '2026-10-11T05:30:00+00:00'
const records = doc.records.map((record) => ({
  ...record,
  source_post_id:null,
  published:true,
  published_at:publishedAt,
  ready_at:publishedAt,
  editorial_status:'published',
  rating_count:0,
  rating_sum:0
}))
const g = doc.recipe_group_id
const sql = `-- Hojuelas colombianas: publicación transaccional en siete idiomas.
-- Ejecutar una sola vez DESPUÉS de comprobar por HTTP 200 y hash exacto los 12 WebP desplegados.
DO $hojuelas$
DECLARE
 j constant jsonb := $records$${JSON.stringify(records)}$records$::jsonb;
 g constant uuid := '${g}';
 n int;
BEGIN
 IF jsonb_array_length(j)<>7
   OR (SELECT count(DISTINCT x->>'language') FROM jsonb_array_elements(j) x)<>7
   OR (SELECT count(DISTINCT x->>'public_path') FROM jsonb_array_elements(j) x)<>7
   OR EXISTS(SELECT 1 FROM jsonb_array_elements(j) x WHERE jsonb_array_length(x->'steps')<>8)
   OR EXISTS(SELECT 1 FROM jsonb_array_elements(j) x WHERE jsonb_array_length(x->'seo'->'faq')<>5)
 THEN RAISE EXCEPTION 'Invalid Hojuelas 7-language payload'; END IF;

 IF EXISTS(SELECT 1 FROM public.recipes WHERE recipe_group_id=g) THEN
   IF (SELECT count(*) FROM public.recipes WHERE recipe_group_id=g)=7
      AND (SELECT count(*) FROM public.recipes WHERE recipe_group_id=g AND published)=7 THEN
     RAISE NOTICE 'Hojuelas group already published 7/7; no mutation';
     RETURN;
   END IF;
   RAISE EXCEPTION 'Hojuelas group exists in divergent state';
 END IF;

 IF EXISTS(
   SELECT 1 FROM public.recipes r
   JOIN jsonb_array_elements(j) x
     ON (r.language=x->>'language' AND r.slug=x->>'slug')
     OR r.public_path=x->>'public_path'
 ) THEN RAISE EXCEPTION 'Recipe slug or public_path collision'; END IF;

 IF EXISTS(
   SELECT 1 FROM public.content_pages p
   JOIN jsonb_array_elements(j) x ON p.public_path=x->>'public_path'
 ) THEN RAISE EXCEPTION 'content_pages public_path collision'; END IF;

 IF EXISTS(
   SELECT 1 FROM public.content_redirects r
   JOIN jsonb_array_elements(j) x ON r.source_path=x->>'public_path'
 ) THEN RAISE EXCEPTION 'content_redirects source_path collision'; END IF;

 INSERT INTO public.recipes (
   id,recipe_group_id,language,slug,title,excerpt,ingredients,steps,category,
   prep_time_minutes,cook_time_minutes,servings,image_url,published,published_at,
   content_html,summary,notes,difficulty,course,cuisine,total_time_minutes,keywords,
   nutrition,gallery,video_urls,seo,source_post_id,source_url,public_path,
   editorial_status,ready_at,rating_count,rating_sum
 )
 SELECT id,recipe_group_id,language,slug,title,excerpt,ingredients,steps,category,
   prep_time_minutes,cook_time_minutes,servings,image_url,published,published_at,
   content_html,summary,notes,difficulty,course,cuisine,total_time_minutes,keywords,
   nutrition,gallery,video_urls,seo,source_post_id,source_url,public_path,
   editorial_status,ready_at,rating_count,rating_sum
 FROM jsonb_populate_recordset(NULL::public.recipes,j);
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>7 THEN RAISE EXCEPTION 'Expected 7 inserts, got %',n; END IF;
 IF (SELECT count(*) FROM public.recipes WHERE recipe_group_id=g AND published)<>7
 THEN RAISE EXCEPTION 'Postcondition failed: group not published 7/7'; END IF;
END $hojuelas$;
`
fs.writeFileSync(target,sql)
