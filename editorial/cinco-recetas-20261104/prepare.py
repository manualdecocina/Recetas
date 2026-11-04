import json,hashlib,sys
from pathlib import Path
from PIL import Image,ImageOps
D=Path(__file__).resolve().parent;ROOT=D.parents[1];key=sys.argv[1]
doc=json.loads((D/(key+'.json')).read_text())
paths=json.loads((D/(key+'-generated.json')).read_text());out=ROOT/'public/recetas'/key;out.mkdir(parents=True,exist_ok=True)
manifest=[]
for n in range(1,9):
    src=Path(paths[str(n)]);im=Image.open(src).convert('RGB')
    im=ImageOps.fit(im,(1600,1200),method=Image.Resampling.LANCZOS)
    im.save(out/f'paso-{n:02}.webp','WEBP',quality=84,method=5)
    if n==8:
        im.save(out/'portada.webp','WEBP',quality=84,method=5)
        for aspect,size in [('1x1',(1200,1200)),('4x3',(1600,1200)),('16x9',(1600,900))]:
            ImageOps.fit(im,size,method=Image.Resampling.LANCZOS).save(out/f'portada-{aspect}.webp','WEBP',quality=84,method=5)
for p in sorted(out.glob('*.webp')):
    assert p.stat().st_size>1024,(p,'Empty image')
    manifest.append(dict(path=str(p.relative_to(ROOT)),url=doc['records'][0]['image_url'].rsplit('/',1)[0]+'/'+p.name,bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),size=Image.open(p).size))
(D/(key+'-media.json')).write_text(json.dumps(dict(images=manifest,visual_review='Eight individual generated frames reviewed in sequence; coherent ingredients, utensils, action and final serving.'),ensure_ascii=False,indent=2)+'\n')
payload=json.dumps(doc['records'],ensure_ascii=False);foods=json.dumps(doc['newfoods'],ensure_ascii=False)
aliases=[dict(slug=s,alias=ing['name']) for ing,s in zip(doc['records'][0]['ingredients'],doc['canonical'])]
sql="""DO $stage$
DECLARE payload jsonb := $payload$PAYLOAD$payload$::jsonb;
foods jsonb := $foods$FOODS$foods$::jsonb;
aliases jsonb := $aliases$ALIASES$aliases$::jsonb;
x jsonb; a jsonb; v public.recipes; made public.recipes; source_id uuid; group_id uuid;
BEGIN
PERFORM set_config('request.jwt.claim.sub','2caf0bab-d7e8-4d52-9910-d79799c27072',true);
IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin context missing'; END IF;
IF jsonb_array_length(payload)<>7 THEN RAISE EXCEPTION 'Need seven languages'; END IF;
IF EXISTS(SELECT 1 FROM public.recipes r JOIN jsonb_array_elements(payload) e ON r.public_path=e->>'public_path' OR (r.language=e->>'language' AND r.slug=e->>'slug')) THEN RAISE EXCEPTION 'Recipe URL already exists'; END IF;
IF EXISTS(SELECT 1 FROM public.content_pages p JOIN jsonb_array_elements(payload) e ON p.public_path=e->>'public_path') OR EXISTS(SELECT 1 FROM public.content_redirects r JOIN jsonb_array_elements(payload) e ON r.source_path=e->>'public_path') THEN RAISE EXCEPTION 'Route collision'; END IF;
FOR a IN SELECT value FROM jsonb_array_elements(foods) LOOP
 IF EXISTS(SELECT 1 FROM public.ingredients WHERE lower(name)=lower(a->>'name') AND slug<>a->>'slug' AND status='canonical') THEN RAISE EXCEPTION 'Canonical name collision'; END IF;
 INSERT INTO public.ingredients(slug,name,normalized_name,description,status,searchable,indexable)
 SELECT a->>'slug',a->>'name',lower(a->>'name'),a->>'description','canonical',true,false WHERE NOT EXISTS(SELECT 1 FROM public.ingredients WHERE slug=a->>'slug');
END LOOP;
FOR a IN SELECT value FROM jsonb_array_elements(aliases) LOOP
 IF NOT EXISTS(SELECT 1 FROM public.ingredients WHERE slug=a->>'slug' AND status='canonical') THEN RAISE EXCEPTION 'Missing canonical ingredient %',a; END IF;
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
END $stage$;
SELECT id,recipe_group_id,language,slug,published,editorial_status FROM public.recipes WHERE public_path IN (PATHS) ORDER BY language;
""".replace('PAYLOAD',payload).replace('FOODS',foods).replace('ALIASES',json.dumps(aliases,ensure_ascii=False)).replace('INGREDIENT_COUNT',str(len(doc['canonical']))).replace('PATHS',','.join("'"+r['public_path'].replace("'","''")+"'" for r in doc['records']))
(D/(key+'-stage.sql')).write_text(sql)
print(key,len(manifest),'WebP',sum(m['bytes'] for m in manifest),'bytes; SQL ready')
