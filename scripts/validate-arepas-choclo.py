"""Check publication completeness, language invariants, nutrition provenance and media integrity."""
import hashlib,json,pathlib,re,uuid
from PIL import Image
R=pathlib.Path(__file__).resolve().parents[1]; slug='arepas-de-choclo-con-queso'
p=json.loads((R/f'editorial/{slug}-20261009.json').read_text());rs=p['records'];es=rs[0]
assert len(rs)==7 and {r['language'] for r in rs}=={'es','de','en','fr','it','ja','pt'}
assert len({r['id'] for r in rs})==len({r['public_path'] for r in rs})==7
assert len({r['recipe_group_id'] for r in rs})==1
assert hashlib.sha256(json.dumps(es['steps'],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()==p['steps_sha256']
tax={}
for m in re.finditer(r"(?:'([^']+)'|(\w+)):\s*{([^}]+)}",(R/'src/lib/categories.ts').read_text()):tax[m.group(1)or m.group(2)]=dict(re.findall(r"(es|de|en|fr|it|ja|pt):\s*'([^']*)'",m.group(3)))
e=json.loads((R/f'editorial/{slug}-usda-20261009.json').read_text());keys={'calories','protein_g','carbs_g','fat_g','saturated_fat_g','fiber_g','sugar_g','sodium_mg'}
for r in rs:
 assert r['id']==str(uuid.uuid5(uuid.UUID(r['recipe_group_id']),r['language']))
 assert r['category']==tax['panes-y-masas'][r['language']]
 assert [(i['amount'],i['unit']) for i in r['ingredients']]==[(i['amount'],i['unit']) for i in es['ingredients']]
 assert all(isinstance(i['amount'],str) and i['name'] and i['group'] for i in r['ingredients'])
 assert len(r['steps'])==5 and all(s[k] for s in r['steps'] for k in ['title','content','image_url','image_alt'])
 assert [s['image_url'] for s in r['steps']]==[s['image_url'] for s in es['steps']]
 assert (r['prep_time_minutes'],r['cook_time_minutes'],r['total_time_minutes'],r['servings'])==(10,25,45,4)
 assert all(r[k] for k in ['title','excerpt','summary','content_html','notes','course','cuisine','difficulty'])
 assert len(r['seo']['faq'])==3 and all(f[k] for f in r['seo']['faq'] for k in ['q','a'])
 assert all(r['seo'][k] for k in ['title','description','about','image_alt','image_variants'])
 assert r['nutrition']['estimated'] and all(r['nutrition'][k] for k in ['method','note','serving_size','source'])
 for k in keys:
  total=round(sum(f['edible_grams']/100*f['per_100g'][k] for f in e['foods'])/4,1)
  assert r['nutrition'][k]==total==e['nutrition'][k]
 for f in e['foods']:
  for k,v in f['per_100g'].items():
   names={'calories':1008,'protein_g':1003,'carbs_g':1005,'fat_g':1004,'saturated_fat_g':1258,'fiber_g':1079,'sugar_g':2000,'sodium_mg':1093}
   assert next(x['amount'] for x in f['nutrient_evidence'] if x['nutrient']['id']==names[k])==v
 if r['language']!='es': assert all(a['content']!=b['content'] for a,b in zip(r['steps'],es['steps']))
m=json.loads((R/f'editorial/{slug}-imagenes.json').read_text());assert len(m['images'])==9 and len(m['originals'])==5
for x in m['images']+m['originals']:
 f=R/x['path'];assert hashlib.sha256(f.read_bytes()).hexdigest()==x['sha256'] and len(f.read_bytes())==x['bytes']
 with Image.open(f) as im:
  assert im.size==(x['width'],x['height']) and im.format==('PNG' if f.suffix=='.png' else 'WEBP');im.verify()
print('PASS: one recipe, seven languages, five phases, nine WebP, USDA math and media integrity')
