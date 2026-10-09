"""Validate frozen originals, actual nutrient bases and seven-language batch03 data."""
import argparse,copy,hashlib,json,re,uuid
from pathlib import Path
A=argparse.ArgumentParser();A.add_argument('--metadata-only',action='store_true');args=A.parse_args();R=Path(__file__).resolve().parents[1]
plan=json.loads((R/'editorial/lote-03-plan-20261008.json').read_text());identity=json.loads((R/'editorial/lote03-identidades-rutas-20261008.json').read_text());langs={'es','de','en','fr','it','ja','pt'};paths=set();ids=set();rows=[]
tax={}
for m in re.finditer(r"(?:'([^']+)'|(\w+)):\s*{([^}]+)}",(R/'src/lib/categories.ts').read_text()):tax[m.group(1)or m.group(2)]=dict(re.findall(r"(es|de|en|fr|it|ja|pt):\s*'([^']*)'",m.group(3)))
media={a['path']:a for a in plan['media']};assert len(plan['groups'])==15 and len(media)==174
for g in plan['groups']:
 f=R/g['editorial_file'];p=json.loads(f.read_text());m=json.loads((R/g['images_file']).read_text());rs=p['records'];assert len(rs)==7 and {r['language']for r in rs}==langs,g['slug'];es=next(r for r in rs if r['language']=='es');routes={a['language']:a for a in next(a for a in identity['recipes']if a['slug']==g['slug'])['routes']}
 assert hashlib.sha256(f.read_bytes()).hexdigest()==g['package_sha256'],(g['slug'],'package changed')
 for k in ['id','recipe_group_id','slug','public_path','source_url']:assert es[k]==g['expected_before'][k],(g['slug'],k)
 blank=copy.deepcopy(es['steps'])
 for s in blank:s['image_url']=''
 hashes=[hashlib.sha256(json.dumps(es['steps'],ensure_ascii=False,separators=(',',':')).encode()).hexdigest(),hashlib.sha256(json.dumps(blank,ensure_ascii=False,sort_keys=True).encode()).hexdigest()]
 assert p['steps_sha256']==m['steps_sha256']==g['steps_sha256'] and p['steps_sha256']in hashes,(g['slug'],'frozen steps')
 n=es['nutrition'];assert n['estimated'] is True and n['inputs'] and n['method'] and n['note'];nutkeys=set(n)&{'calories','protein_g','carbs_g','fat_g','saturated_fat_g','fiber_g','sugar_g','sodium_mg','alcohol_g'}
 proxy=g['slug']=='como-preparar-queso'
 if proxy:assert len(n['inputs'])==1 and n['inputs'][0]['fdc_id']==172224 and n['inputs'][0]['edible_grams']==50 and n['inputs'][0]['basis']=='finished_food_proxy_per_50g_not_raw_input_retention' and 'fiber_g'not in n
 for k in nutkeys:
  assert all(k in a['per_100g']for a in n['inputs']),(g['slug'],'missing nutrient source',k)
  decimals=0 if k=='sodium_mg' and float(n[k]).is_integer() else 1
  result=round(sum(a['edible_grams']/100*a['per_100g'][k]for a in n['inputs'])/(1 if proxy else es['servings']),decimals)
  assert abs(result-n[k])<=0.100001,(g['slug'],'nutrition',k,result,n[k])
 for r in rs:
  lang=r['language'];assert r['id']not in ids and r['public_path']not in paths;ids.add(r['id']);paths.add(r['public_path']);assert r['recipe_group_id']==g['recipe_group_id'];assert r['slug']==routes[lang]['slug'] and r['public_path']==routes[lang]['public_path']
  if lang!='es':assert r['id']in {str(uuid.uuid5(uuid.UUID(g['recipe_group_id']),lang)),str(uuid.uuid5(uuid.NAMESPACE_URL,'manualdecocina:'+g['recipe_group_id']+':'+lang))},(g['slug'],'deterministic UUID')
  assert r['category']==tax[r['category_slug']][lang],(g['slug'],lang,'category')
  count_units={'unidad','unidades','Blätter','leaves','feuilles','foglie','枚','folhas','Stück','eggs','egg','unités','unité','unità','個','unidade'}
  def unit(u):return 'count'if u in count_units else u
  assert [(a['amount'],unit(a['unit']))for a in r['ingredients']]==[(a['amount'],unit(a['unit']))for a in es['ingredients']],(g['slug'],lang,'amount/unit')
  assert len(r['steps'])==len(es['steps']) and all(r[k]==es[k]for k in ['servings','prep_time_minutes','cook_time_minutes','total_time_minutes','category_slug'])
  assert r['total_time_minutes']>=r['prep_time_minutes']+r['cook_time_minutes']
  assert all(r[k]for k in ['title','excerpt','summary','notes','content_html']) and len(r['seo']['faq'])==3 and all(a['q']and a['a']for a in r['seo']['faq'])
  assert all(r['seo'][k]for k in ['title','description','image_alt']) and all(a['name']and a['group']for a in r['ingredients'])
  assert set(r['nutrition'])&{'calories','protein_g','carbs_g','fat_g','saturated_fat_g','fiber_g','sugar_g','sodium_mg','alcohol_g'}==nutkeys and all(r['nutrition'][k]==n[k]for k in nutkeys)
  assert [a['image_url']for a in r['steps']]==[a['image_url']for a in es['steps']] and r['image_url']==es['image_url'] and r['seo']['image_variants']==es['seo']['image_variants']
  assert all(a in media for a in [r['image_url'],*r['seo']['image_variants'],*(s['image_url']for s in r['steps'])]),(g['slug'],'image reference')
  assert all(s['title']and s['content']and s['image_alt']for s in r['steps'])
 rows.append({'slug':g['slug'],'languages':7,'steps':len(es['steps']),'nutrients':sorted(nutkeys),'nutrition_basis':'finished50g_proxy'if proxy else'weighted_batch_divided_by_servings','package_sha256':g['package_sha256']})
if not args.metadata_only:
 from PIL import Image
 for g in plan['groups']:
  m=json.loads((R/g['images_file']).read_text());assert m['originals'] and m['images']
  for a in m['originals']+m['images']:
   f=R/a['path'];raw=f.read_bytes();assert len(raw)==a['bytes']and len(raw)>0 and hashlib.sha256(raw).hexdigest()==a['sha256'],str(f)
   with Image.open(f)as im:assert im.format==('PNG'if f.suffix=='.png'else'WEBP')and im.size==(a['width'],a['height']);im.verify()
   assert str(a['visual_qa']).startswith('PASS'),(g['slug'],'visual QA')
assert len(paths)==len(ids)==105
report={'status':'PASS_METADATA_ONLY'if args.metadata_only else'PASS','groups':15,'language_records':105,'webp':174,'originals':127,'records':rows,'checks':['unique approved105routes and deterministic UUIDs','preserved ES identity','frozen ES/package hashes','closed multilingual taxonomy','grouped ingredients and shared amounts/units','shared times phases media and nutrition','USDA actual weighted bases and omitted missing data','queso finished50g proxy, not milk retention','localized SEO FAQ alt required fields']+([]if args.metadata_only else['301PNG/WebP exact bytes SHA256 dimensions decode and prior visual QA'])}
(R/'lote03-prepublication-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k!='records'}))
