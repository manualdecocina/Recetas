"""Freeze a new original ES specification with verified SR Legacy source evidence."""
import hashlib, html, json, sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
spec=json.loads(Path(sys.argv[1]).read_text())
slug=spec['slug'];target=root/'editorial'/f'{slug}-20261008.json'
assert not target.exists(), 'Do not overwrite accepted work'
registry=json.loads((root/'editorial/lote03-identidades-rutas-20261008.json').read_text())
identity=next(r for r in registry['recipes'] if r['slug']==slug)
foods=json.loads(Path(sys.argv[2]).read_text())
mapping={1008:'calories',1003:'protein_g',1005:'carbs_g',1004:'fat_g',1258:'saturated_fat_g',1079:'fiber_g',2000:'sugar_g',1093:'sodium_mg'}
inputs=[];evidence=[]
for name,grams,food_id in spec['nutrition_foods']:
 food=foods[str(food_id)]
 values={mapping[n['nutrient']['id']]:n['amount'] for n in food['foodNutrients'] if n['nutrient']['id'] in mapping}
 assert set(values)==set(mapping.values()),(food_id,values)
 inputs.append({'ingredient':name,'edible_grams':grams,'fdc_id':food_id,'fdc_description':food['description'],'per_100g':values,'source_url':f'https://fdc.nal.usda.gov/food-details/{food_id}/nutrients'})
 evidence.append(food)
nutrition={k:round(sum(a['edible_grams']/100*a['per_100g'][k] for a in inputs)/spec['servings'],0 if k=='sodium_mg' else 1) for k in mapping.values()}
nutrition.update(estimated=True,source='USDA FoodData Central — SR Legacy (abril de2018)',source_url='https://fdc.nal.usda.gov/download-datasets/',inputs=inputs,serving_size=spec['serving_size'],method=spec['nutrition_method'],note=spec['nutrition_note'])
directory='public/recetas/'+slug;public='/recetas/'+slug
keys=['title','excerpt','summary','difficulty','course','cuisine','prep_time_minutes','cook_time_minutes','total_time_minutes','servings','notes','keywords','category_slug']
record={k:spec[k] for k in keys}
record.update(id=identity['id'],recipe_group_id=identity['recipe_group_id'],slug=slug,public_path=identity['public_path'],source_url=identity['source_url'],language='es',category={'platos-principales':'Platos principales','salsas-y-aderezos':'Salsas y aderezos'}[spec['category_slug']],published=False,editorial_status='ready',nutrition=nutrition,image_url=public+'/portada.webp')
record['ingredients']=[dict(zip(['name','amount','unit','group'],i)) for i in spec['ingredients']]
record['steps']=[{'title':title,'content':content,'image_url':f'{public}/paso-{n:02d}.webp','image_alt':spec['title']+': '+title} for n,(title,content) in enumerate(spec['steps'],1)]
record['gallery']=[{'url':record['image_url'],'alt':spec['cover_alt']}]
record['seo']={'title':spec['seo_title'],'description':spec['excerpt'],'image_alt':spec['cover_alt'],'image_variants':[public+'/portada-1x1.webp',public+'/portada-4x3.webp',public+'/portada-16x9.webp'],'faq':[{'q':q,'a':a} for q,a in spec['faq']]}
record['content_html']='<p>'+html.escape(record['summary'])+'</p><p>'+html.escape(record['notes'])+'</p>'
sha=hashlib.sha256(json.dumps(record['steps'],ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
sources=[dict(x,accessed='2026-10-08') for x in spec['sources']]
item={'scope':'Manual de Cocina only; lote03','state':'ES_FROZEN_IMAGES_PENDING','provenance':'Original editorial content; no legacy WordPress text or images reused. Reserved identities and approved paths preserved.','ai_owner_confirmation':'Owner authorized content and images; no kitchen test performed','category_slug':spec['category_slug'],'cover':record['image_url'],'steps_frozen':True,'steps_sha256':sha,'publication_blockers':['IMAGES_LOCALIZATIONS_FULL15_CI_DEPLOY_DB_CACHE_QA_PENDING'],'sources':sources,'records':[record]}
prefix='Photorealistic culinary editorial photograph, single landscape4:3image. Consistent soft daylight, clean pale kitchen, neutral white plates and steel equipment. No text, labels, watermark, collage, logos or ingredients not described. '
assert len(spec['image_briefs'])==len(record['steps'])
prompts=[{'asset':'portada.webp','step':len(record['steps']),'prompt':prefix+spec['image_briefs'][0]}]+[{'asset':f'paso-{n:02d}.webp','step':n,'prompt':prefix+b} for n,b in enumerate(spec['image_briefs'][1:],1)]
manifest={'slug':slug,'recipe_group_id':identity['recipe_group_id'],'date':'2026-10-08','steps_frozen':True,'steps_sha256':sha,'directory':directory,'image_source':'built-in ImageGen','prompts':prompts,'images':[],'originals':[],'state':'IMAGES_PENDING','last_step_reuses_cover':True}
nutrition_evidence={'source_url':'https://fdc.nal.usda.gov/download-datasets/','dataset_sha256':'0fe8ae486a2c8eb42cb96413f058deb51863a46c8fb8eeb4b1fb45006dd338ef','verified_date':'2026-10-08','foods':evidence,'calculation_inputs':inputs,'servings':spec['servings'],'per_serving':{k:nutrition[k] for k in mapping.values()},'retention_assumptions':spec['nutrition_note'],'missing_data_not_zero':True}
for path,data in [(target,item),(root/'editorial'/f'{slug}-imagenes.json',manifest),(root/'editorial'/f'{slug}-usda-verificado-20261008.json',nutrition_evidence)]:
 path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'slug':slug,'steps':len(record['steps']),'originals_required':len(prompts),'steps_sha256':sha,'nutrition':{k:nutrition[k] for k in mapping.values()}},ensure_ascii=False))
