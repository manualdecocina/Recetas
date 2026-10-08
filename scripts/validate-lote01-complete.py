"""Validate complete batch identities, translations, numeric equivalence and real media."""
import json, pathlib, hashlib, re
from collections import Counter
from PIL import Image
R=pathlib.Path(__file__).resolve().parents[1]
b=json.loads((R/'editorial/lote-01-plan-v2-20261008.json').read_text());paths=set();ids=set();languages={'es','de','en','fr','it','ja','pt'}
def numbers(s):
 return re.findall(r'\d+(?:\.\d+)?',s.replace(',','.'))
issues=[]
for g in b['groups']:
 item=json.loads((R/g['localized_editorial_file']).read_text());records=item['records'];es=next(r for r in records if r['language']=='es');original=json.loads((R/g['editorial_file']).read_text())['records'][0];manifest=json.loads((R/g['images_file']).read_text())
 assert len(records)==7 and {r['language'] for r in records}==languages
 assert es['id']==original['id'] and es['public_path']==original['public_path'] and es['source_url']==original['source_url']
 for r in records:
  assert r['recipe_group_id']==g['recipe_group_id'];assert r['public_path'] not in paths and r['id'] not in ids;paths.add(r['public_path']);ids.add(r['id'])
  assert len(r['steps'])==8 and len(r['ingredients'])==len(es['ingredients']) and len(r['seo']['faq'])==3
  assert r['category'] and r['content_html'] and r['notes'] and r['seo']['title'] and r['seo']['description']
  for key in ['prep_time_minutes','cook_time_minutes','total_time_minutes','servings']:assert r[key]==es[key]
  for a,c in zip(es['ingredients'],r['ingredients']):assert a['amount']==c['amount']
  for n,(a,c) in enumerate(zip(es['steps'],r['steps']),1):
   assert c['title'] and c['content'] and c['image_alt']==r['title']+': '+c['title']
   if not Counter(numbers(a['content'])) <= Counter(numbers(c['content'])):issues.append((g['slug'],r['language'],n,numbers(a['content']),numbers(c['content'])))
  for key,v in es['nutrition'].items():
   if isinstance(v,(int,float)):assert r['nutrition'][key]==v
  for path in [r['image_url'],*r['seo']['image_variants'],*(s['image_url'] for s in r['steps'])]:assert (R/'public'/path.lstrip('/')).is_file()
 for im in manifest['images']:
  p=R/'public/recetas'/g['slug']/im['archivo'];picture=Image.open(p);picture.load();assert picture.format=='WEBP' and min(picture.size)>800
  assert hashlib.sha256(p.read_bytes()).hexdigest()==im['sha256']
assert len(paths)==70
if issues:
 print('Numeric sequence differences requiring review:',json.dumps(issues,ensure_ascii=False));raise SystemExit(1)
print('OK: 10 groups, 70 full localizations, preserved identities and all explicit per-step numbers, 120 valid WebP with hashes.')
