import json,hashlib,re
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'editorial/siete-mercados-20261027';bundles=[];paths=set();media=[]
for p in D.glob('*.json'):
 b=json.loads(p.read_text())
 if isinstance(b,dict) and b.get('records'):bundles.append(b)
assert len(bundles)==7
for b in bundles:
 es=json.loads((D/(b['slug']+'-es.json')).read_text());assert hashlib.sha256(json.dumps(es['steps'],ensure_ascii=False).encode()).hexdigest()==b['steps_es_sha256']
 assert {r['language'] for r in b['records']}=={'es','en','de','fr','it','ja','pt'}
 for r in b['records']:
  assert r['public_path'] not in paths;paths.add(r['public_path'])
  assert len(r['steps'])==8 and len(r['seo']['faq'])>=3
  assert len(r['ingredients'])==len(es['ingredients'])
  assert [(x['amount'],x['unit']) for x in r['ingredients']]==[(x[1],x[2]) for x in es['ingredients']]
  assert r['total_time_minutes']==es['prep']+es['cook']+es['rest']
  assert r['nutrition']['estimated'] and all(r['nutrition'][x]>0 for x in ['calories','protein_g','carbs_g','fat_g'])
  assert r['nutrition']['calories']==b['nutrition_calculation']['result']['calories']
  assert 20<=len(r['seo']['title'])<=110 and 40<=len(r['summary'])<=350
  assert all(s['title'] and len(s['content'])>20 and s['image_alt'].startswith(r['title']) for s in r['steps'])
  assert all(s['image_url'].endswith(f'/{b["slug"]}/paso-{i:02}.webp') for i,s in enumerate(r['steps'],1))
  if b['key']=='seiro':assert '75' in r['steps'][6]['content'] and '63' not in r['steps'][6]['content']
 m=json.loads((D/(b['slug']+'-images.json')).read_text());assert len(m['images'])==12;media+=m['images']
 for x in m['images']:
  p=ROOT/x['path'];data=p.read_bytes();assert data[:4]==b'RIFF' and data[8:12]==b'WEBP';assert hashlib.sha256(data).hexdigest()==x['sha256'];assert len(data)==x['bytes'];assert Image.open(p).size==(x['width'],x['height'])
 assert (ROOT/'public/recetas'/b['slug']/'portada.webp').read_bytes()==(ROOT/'public/recetas'/b['slug']/'paso-08.webp').read_bytes()
assert len(paths)==49 and len(media)==84
report=dict(recipes=7,pages=49,generated_originals=56,public_webp=84,steps_per_recipe=8,all_locales_preserve_quantities=True,spanish_source_hashes_match=True,media_hashes_match=True,cover_equals_final_step=True,physical_kitchen_test=False)
(D/'prepublication-qa.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
