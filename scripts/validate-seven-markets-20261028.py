"""Validate the assembled publication payload, not implementation details."""
import json,re,hashlib
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'editorial/siete-mercados-20261028'
bundles=[b for p in D.glob('*.json') if isinstance(b:=json.loads(p.read_text()),dict) and b.get('records')]
assert len(bundles)==7;paths=set();media={};sources=set()
for b in bundles:
 assert len(b['records'])==7 and set(r['language'] for r in b['records'])=={'es','en','de','fr','it','ja','pt'}
 base=b['records'][0];assert base['language']=='es'
 for r in b['records']:
  assert r['public_path'] not in paths;paths.add(r['public_path'])
  assert len(r['steps'])==8 and len(r['seo']['faq'])==3
  assert len(r['ingredients'])==len(base['ingredients'])
  assert [(a['amount'],a['unit']) for a in r['ingredients']]==[(a['amount'],a['unit']) for a in base['ingredients']]
  assert all(r[k]==base[k] for k in ['servings','prep_time_minutes','cook_time_minutes','total_time_minutes'])
  assert all(r['nutrition'][k]==v for k,v in b['nutrition_calculation']['result'].items())
  assert len(set(s['image_url'] for s in r['steps']))==8
  assert all(s['title'] and len(s['content'])>20 and s['image_alt'] for s in r['steps'])
  assert len(re.findall(r'<a href="/',r['content_html']))==2
 for x in json.loads((D/(b['slug']+'-images.json')).read_text()):
  data=(ROOT/x['path']).read_bytes();assert len(data)==x['bytes'] and hashlib.sha256(data).hexdigest()==x['sha256']
  with Image.open(ROOT/x['path']) as im:assert im.format=='WEBP' and im.size==(x['width'],x['height'])
  media[x['path']]=x;sources.add(x['original_sha256'])
assert len(paths)==49 and len(media)==84 and len(sources)==56
uploaded=json.loads((D/'media-upload-verification.json').read_text());assert uploaded['verified']==84
report=dict(result='PASS',recipe_groups=7,localized_pages=49,unique_step_originals=56,verified_webp_files=84,translated_quantities_consistent=True,nutrition_recomputed=True,two_related_links_per_page=True,physical_kitchen_test=False)
(D/'prepublication-validation.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
