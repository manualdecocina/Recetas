"""Verify approved identities, complete localizations, frozen phases and USDA math."""
import argparse,hashlib,json,re,uuid
from pathlib import Path
R=Path(__file__).resolve().parents[1];a=argparse.ArgumentParser();a.add_argument('--metadata-only',action='store_true');args=a.parse_args();base=json.loads((R/'editorial/lote05-baseline-identities-20261009.json').read_text())['rows'];routes=json.loads((R/'editorial/lote05-identidades-rutas-20261009.json').read_text())['routes'];langs={'es','de','en','fr','it','ja','pt'};ids=set();paths=set();results=[];media=[];originals=[]
tax={}
for m in re.finditer(r"(?:'([^']+)'|(\w+)):\s*{([^}]+)}",(R/'src/lib/categories.ts').read_text()):tax[m.group(1)or m.group(2)]=dict(re.findall(r"(es|de|en|fr|it|ja|pt):\s*'([^']*)'",m.group(3)))
for b in base:
 slug=b['slug'];j=json.loads((R/'editorial'/f'{slug}-20261009.json').read_text());rs=j['records'];assert len(rs)==7 and {r['language']for r in rs}==langs;es=next(r for r in rs if r['language']=='es');sha=hashlib.sha256(json.dumps(es['steps'],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest();assert sha==j['steps_sha256']and j['steps_frozen']
 for k in ['id','recipe_group_id','slug','public_path','source_url']:assert es[k]==b[k],(slug,k)
 evidence=json.loads((R/'editorial'/f'{slug}-usda-verificado-20261009.json').read_text());n=es['nutrition'];keys={'calories','protein_g','carbs_g','fat_g','saturated_fat_g','fiber_g','sugar_g','sodium_mg'};assert keys<=set(n)and n['estimated']and len(n['inputs'])==len(es['ingredients'])
 for k in keys:
  assert all(k in x['per_100g']for x in n['inputs']);calc=round(sum(x['edible_grams']/100*x['per_100g'][k]for x in n['inputs'])/es['servings'],1);assert calc==n[k],(slug,k,calc,n[k]);assert evidence['nutrition'][k]==n[k]
 for i,x in enumerate(n['inputs']):
  actual=evidence['foods'][i];assert x['fdc_id']==actual['fdc_id']and x['per_100g']==actual['per_100g'];assert x['recipe_grams']==es['ingredients'][i]['amount'];assert x['edible_grams']==actual.get('calculation_grams',actual.get('grams'))
 if slug=='receta-de-pollo-frito-sureno':assert n['inputs'][-1]['recipe_grams']==1000 and n['inputs'][-1]['edible_grams']==40 and '40' in n['method']
 for r in rs:
  lang=r['language'];route=next(x for x in routes if x['recipe_group_id']==b['recipe_group_id']and x['language']==lang)
  for k in ['recipe_group_id','language','slug','public_path','source_url']:assert r[k]==route[k]
  assert r['id']not in ids and r['public_path']not in paths;ids.add(r['id']);paths.add(r['public_path'])
  if lang!='es':assert r['id']==str(uuid.uuid5(uuid.UUID(b['recipe_group_id']),lang))
  assert r['category']==tax[r['category_slug']][lang]and len(r['seo']['faq'])==3
  assert [(x['amount'],x['unit'])for x in r['ingredients']]==[(x['amount'],x['unit'])for x in es['ingredients']]
  assert len(r['steps'])==len(es['steps'])and [x['image_url']for x in r['steps']]==[x['image_url']for x in es['steps']]
  assert all(r[k]==es[k]for k in ['prep_time_minutes','cook_time_minutes','total_time_minutes','servings','category_slug','image_url'])and r['total_time_minutes']>=r['prep_time_minutes']+r['cook_time_minutes']
  assert all(r[k]for k in ['title','excerpt','summary','notes','content_html','course','cuisine','difficulty']);assert all(x[k]for x in r['steps']for k in ['title','content','image_alt']);assert all(x['name']and x['group']for x in r['ingredients']);assert all(x[k]for x in r['seo']['faq']for k in ['q','a']);assert all(r['seo'][k]for k in ['title','description','about','image_alt','image_variants']);assert all(r['nutrition'][k]==n[k]for k in keys);assert r['nutrition']['inputs']==n['inputs']and r['nutrition']['method']and r['nutrition']['note']and r['nutrition']['source_url']=='https://fdc.nal.usda.gov/'
  if lang!='es':assert all(x['content']!=y['content']for x,y in zip(r['steps'],es['steps']))
 if not args.metadata_only:
  from PIL import Image
  m=json.loads((R/'editorial'/f'{slug}-imagenes.json').read_text());assert m['steps_sha256']==sha and len(m['originals'])==len(es['steps'])and len(m['images'])==len(es['steps'])+4
  assert {x['asset']for x in m['images']}=={'portada.webp','portada-1x1.webp','portada-4x3.webp','portada-16x9.webp',*(f'paso-{i:02d}.webp'for i in range(1,len(es['steps'])+1))}
  for x in m['images']+m['originals']:
   f=R/x['path'];raw=f.read_bytes();assert len(raw)==x['bytes']and hashlib.sha256(raw).hexdigest()==x['sha256'];assert x['visual_qa']=='PASS'
   with Image.open(f)as im:assert im.size==(x['width'],x['height'])and im.format==('PNG'if f.suffix=='.png'else'WEBP');im.verify()
  assert all(set(x['alt_by_language'])==langs for x in m['assets']);media.extend(m['images']);originals.extend(m['originals'])
 results.append({'slug':slug,'languages':7,'steps':len(es['steps']),'ingredients':len(es['ingredients']),'nutrition':'PASS_ALL8_WEIGHTED_USDA_NUTRIENTS'})
assert len(ids)==len(paths)==35
if not args.metadata_only:assert len(media)==56 and len(originals)==36
report={'status':'PASS_METADATA_ONLY'if args.metadata_only else'PASS','groups':5,'language_records':35,'webp':len(media),'originals':len(originals),'records':results,'checks':['preserved5ESidentities and35approvedroutes','frozen Spanish phase hashes','seven complete language records; no copied Spanish steps','closed taxonomy and localized SEO FAQ alt','same amounts units phases times nutrition and media','all8nutrients from actual USDA food profiles','40g frying oil hypothesis checked','all original and derived media hashes dimensions decoding and visualQA'if not args.metadata_only else'media verification pending']};(R/'lote05-prepublication-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report))
