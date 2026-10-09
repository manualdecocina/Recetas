"""Build one original recipe using the existing seven-language publication model."""
import copy, hashlib, html, json, pathlib, shutil, uuid
from PIL import Image, ImageOps
R = pathlib.Path(__file__).resolve().parents[1]
slug = 'arepas-de-choclo-con-queso'
def read(name): return json.loads((R / name).read_text())
def write(name, value): (R / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
es = read(f'editorial/{slug}-es-frozen-20261009.json')
manifest = read(f'editorial/{slug}-imagenes.json')
gid = manifest['recipe_group_id']
translations = read(f'editorial/{slug}-localizations-20261009.json')
evidence = read(f'editorial/{slug}-usda-20261009.json')
es.update(language='es', category='Panes y masas', cuisine='Colombiana', difficulty='Fácil', group='Masa', butter_group='Masa y cocción', cheese_group='Cobertura', serving_size='Una de 4 arepas con 30 g de queso', nutrition_method='Suma de gramos comestibles × nutrientes USDA por 100 g, dividida entre 4. Incluye los 20 g de mantequilla completos; rendimiento cocinado y restos en la sartén no medidos.', nutrition_note='Estimación, no análisis de laboratorio ni prueba de cocina. La harina de maíz amarilla genérica es un proxy nutricional para la harina precocida de arepas; las marcas varían. Incluye mantequilla y queso completos, sin acompañamientos.')
nutrition = {**evidence['nutrition'], 'estimated': True, 'source': 'USDA FoodData Central — SR Legacy (2018)', 'source_url': 'https://fdc.nal.usda.gov/', 'inputs': [{k: v for k, v in f.items() if k != 'nutrient_evidence'} for f in evidence['foods']]}
records = []
for lang in ['es', 'de', 'en', 'fr', 'it', 'ja', 'pt']:
    t = es if lang == 'es' else translations[lang]
    ingredients = copy.deepcopy(es['ingredients'])
    for i, ingredient in enumerate(ingredients):
        ingredient['amount'] = str(ingredient['amount'])
        ingredient['name'] = ingredient['name'] if lang == 'es' else t['ingredients'][i]
        ingredient['group'] = t['butter_group'] if i == 3 else t['cheese_group'] if i == 6 else t['group']
    steps = copy.deepcopy(es['steps'])
    if lang != 'es':
        for s, values in zip(steps, t['steps']): s.update(title=values[0], content=values[1], image_alt=values[2])
    faq = es['faq'] if lang == 'es' else [{'q': q, 'a': a} for q, a in t['faq']]
    n = copy.deepcopy(nutrition); n.update(serving_size=t['serving_size'], method=t['nutrition_method'], note=t['nutrition_note'])
    prefix = '' if lang == 'es' else '/' + lang
    record = dict(id=str(uuid.uuid5(uuid.UUID(gid), lang)), recipe_group_id=gid, language=lang, slug=t['slug'], public_path=prefix + '/' + t['slug'], source_url=None, title=t['title'], excerpt=t['excerpt'], summary=t['excerpt'], content_html='<p>' + html.escape(t['excerpt']) + '</p>', category=t['category'], category_slug='panes-y-masas', cuisine=t['cuisine'], difficulty=t['difficulty'], course=t['category'], servings=4, prep_time_minutes=10, cook_time_minutes=25, total_time_minutes=45, ingredients=ingredients, steps=steps, notes=t['notes'], keywords=[t['title']], nutrition=n, image_url=f'/recetas/{slug}/portada.webp', gallery=[{'url': f'/recetas/{slug}/portada.webp', 'alt': t['title']}], video_urls=[], published=True, editorial_status='published', seo={'title': t['title'], 'description': t['excerpt'], 'about': t['excerpt'], 'faq': faq, 'image_alt': t['title'], 'image_variants': [f'/recetas/{slug}/portada-{shape}.webp' for shape in ['1x1', '4x3', '16x9']]})
    records.append(record)
steps_hash = hashlib.sha256(json.dumps(es['steps'], ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
assert steps_hash == manifest['steps_sha256']
package = dict(scope='One new original recipe; preview.manualdecocina.com only', state='PREPARED_NOT_PUBLISHED', steps_frozen=True, steps_sha256=steps_hash, authorization='2026-10-09: Agrega una más; Nueva receta', provenance='New recipe, no legacy row, text, translation or image reused. USDA original dataset verified; flour proxy explicitly disclosed. Formula not kitchen-tested.', records=records)
write(f'editorial/{slug}-20261009.json', package)
local_paths = R / f'editorial/{slug}-generated-paths-20261009.json'
paths = read(str(local_paths.relative_to(R))) if local_paths.exists() else [str(R / x['path']) for x in manifest['originals']]
out = R / 'public' / 'recetas' / slug
(out / 'originals').mkdir(parents=True, exist_ok=True)
originals, images = [], []
def metadata(path, original=None):
    im = Image.open(path); raw = path.read_bytes()
    d = dict(asset=path.name, path=str(path.relative_to(R)), sha256=hashlib.sha256(raw).hexdigest(), bytes=len(raw), width=im.width, height=im.height, visual_qa='PASS')
    if path.suffix == '.webp': d.update(public_path='/' + str(path.relative_to(R / 'public')), original=original)
    return d
for i, source in enumerate(paths):
    asset = 'portada' if i == 4 else f'paso-{i+1:02d}'
    original = out / 'originals' / (asset + '.png')
    if pathlib.Path(source).resolve() != original.resolve(): shutil.copyfile(source, original)
    item = metadata(original); item.update(source='built-in ImageGen', phase=i+1); originals.append(item)
    im = Image.open(original).convert('RGB')
    step_path = out / f'paso-{i+1:02d}.webp'
    ImageOps.fit(im, (1200, 900), method=Image.Resampling.LANCZOS).save(step_path, 'WEBP', quality=86)
    images.append(metadata(step_path, asset + '.png'))
    if i == 4:
        for name, size in [('portada', (1280,960)), ('portada-1x1', (960,960)), ('portada-4x3', (1280,960)), ('portada-16x9', (1280,720))]:
            p=out/(name+'.webp'); ImageOps.fit(im,size,method=Image.Resampling.LANCZOS).save(p,'WEBP',quality=86); images.append(metadata(p, 'portada.png'))
manifest.update(state='ALL_IMAGES_READY', originals=originals, images=images, cover_variant_visual_qa='PASS_FOUR_WHOLE_AREPAS', assets=[{'asset':x['asset'],'alt_by_language':{r['language']:(r['seo']['image_alt'] if x['asset'].startswith('portada') else r['steps'][int(x['asset'][5:7])-1]['image_alt']) for r in records}} for x in images])
write(f'editorial/{slug}-imagenes.json', manifest)
write(f'editorial/{slug}-plan-20261009.json', {'groups':[{'recipe_group_id':gid,'slug':slug,'editorial_file':f'editorial/{slug}-20261009.json'}], 'media':[{'path':x['public_path'],'sha256':x['sha256']} for x in images]})
# Insert new identities only; any existing row or path collision aborts atomically.
j=json.dumps(records,ensure_ascii=False)
columns='id,recipe_group_id,language,slug,public_path,source_url,title,excerpt,summary,ingredients,steps,category,prep_time_minutes,cook_time_minutes,total_time_minutes,servings,image_url,content_html,notes,difficulty,course,cuisine,keywords,nutrition,gallery,seo,editorial_status,ready_at,published,published_at'
select='x.id,x.recipe_group_id,x.language,x.slug,x.public_path,x.source_url,x.title,x.excerpt,x.summary,x.ingredients,x.steps,x.category,x.prep_time_minutes,x.cook_time_minutes,x.total_time_minutes,x.servings,x.image_url,x.content_html,x.notes,x.difficulty,x.course,x.cuisine,x.keywords,x.nutrition,x.gallery,x.seo,\'published\',now(),true,now()'
sql="""-- ONE NEW RECIPE ONLY. Run after green CI and all9 deployed WebP hashes observed.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='60s';
SELECT pg_advisory_xact_lock(hashtextextended('manualdecocina:arepas-de-choclo-con-queso:20261009',0));
DO $publish$
DECLARE j constant jsonb := $records$"""+j+"""$records$; outside_hash text; n int;
BEGIN
IF (SELECT count(*) FROM public.recipes WHERE language='es' AND published)<>159 THEN RAISE EXCEPTION 'Catalog changed: reconcile baseline'; END IF;
IF EXISTS(SELECT 1 FROM public.recipes r JOIN jsonb_populate_recordset(NULL::public.recipes,j)x ON r.id=x.id OR r.recipe_group_id=x.recipe_group_id OR r.public_path=x.public_path OR (r.language=x.language AND r.slug=x.slug)) OR EXISTS(SELECT 1 FROM public.content_pages p JOIN jsonb_populate_recordset(NULL::public.recipes,j)x ON p.public_path=x.public_path OR (p.language=x.language AND p.slug=x.slug)) THEN RAISE EXCEPTION 'Identity, slug or path collision'; END IF;
SELECT md5(coalesce(string_agg(md5(to_jsonb(r)::text),'' ORDER BY r.id),'')) INTO outside_hash FROM public.recipes r;
INSERT INTO public.recipes("""+columns+") SELECT "+select+""" FROM jsonb_populate_recordset(NULL::public.recipes,j)x;
GET DIAGNOSTICS n=ROW_COUNT;
IF n<>7 OR (SELECT count(DISTINCT language) FROM public.recipes WHERE recipe_group_id='"""+gid+"""')<>7 THEN RAISE EXCEPTION 'New group is not complete7/7'; END IF;
IF (SELECT count(*) FROM public.recipes WHERE language='es' AND published)<>160 THEN RAISE EXCEPTION 'Unexpected final catalog'; END IF;
IF outside_hash IS DISTINCT FROM (SELECT md5(coalesce(string_agg(md5(to_jsonb(r)::text),'' ORDER BY r.id),'')) FROM public.recipes r WHERE recipe_group_id<>'"""+gid+"""') THEN RAISE EXCEPTION 'Unrelated recipe changed'; END IF;
END $publish$;
COMMIT;
"""
(R/f'scripts/publish-{slug}-20261009.sql').write_text(sql)
print({'records':len(records),'originals':len(originals),'webp':len(images),'steps_sha256':steps_hash})
