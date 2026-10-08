"""Validate the15 frozen batch02 sources and media, without changing editorial data."""
import argparse,copy,hashlib,json,re,uuid
from pathlib import Path
P=argparse.ArgumentParser();P.add_argument('--metadata-only',action='store_true');args=P.parse_args()
R=Path(__file__).resolve().parents[1]
plan=json.loads((R/'editorial/lote-02-plan-20261008.json').read_text())
langs={'es','de','en','fr','it','ja','pt'};paths=set();ids=set();issues=[];rows=[]
tax={}
for match in re.finditer(r"(?:'([^']+)'|(\w+)):\s*{([^}]+)}",(R/'src/lib/categories.ts').read_text()):
 tax[match.group(1) or match.group(2)]=dict(re.findall(r"(es|de|en|fr|it|ja|pt):\s*'([^']*)'",match.group(3)))
media={x['path']:x for x in plan['media']}
assert len(plan['groups'])==15 and len(media)==172
for g in plan['groups']:
 p=json.loads((R/g['editorial_file']).read_text());m=json.loads((R/g['images_file']).read_text())
 rs=p['records'];assert len(rs)==7 and {r['language'] for r in rs}==langs,g['slug']
 es=next(r for r in rs if r['language']=='es')
 for k in ['id','recipe_group_id','slug','public_path','source_url']:assert es[k]==g['expected_before'][k],(g['slug'],k)
 blank=copy.deepcopy(es['steps'])
 for s in blank:s['image_url']=''
 candidates=[hashlib.sha256(json.dumps(es['steps'],ensure_ascii=False,separators=(',',':')).encode()).hexdigest(),hashlib.sha256(json.dumps(blank,ensure_ascii=False,sort_keys=True).encode()).hexdigest()]
 assert p['steps_sha256']==m['steps_sha256'] and p['steps_sha256'] in candidates,(g['slug'],'frozen_steps')
 n=es['nutrition'];assert n['estimated'] is True and n['inputs'] and n['method'] and n['note']
 for k in ['calories','protein_g','carbs_g','fat_g','saturated_fat_g','fiber_g','sugar_g','sodium_mg']:
  calc=round(sum(a['edible_grams']/100*a['per_100g'][k] for a in n['inputs'])/es['servings'],0 if k=='sodium_mg' else 1)
  assert abs(calc-n[k])<=0.100001,(g['slug'],'nutrition',k,calc,n[k])
 for r in rs:
  assert r['id'] not in ids and r['public_path'] not in paths;ids.add(r['id']);paths.add(r['public_path'])
  assert r['recipe_group_id']==g['recipe_group_id']
  if r['language']!='es':assert r['id']==str(uuid.uuid5(uuid.UUID(g['recipe_group_id']),r['language'])),(g['slug'],'UUID')
  assert r['category']==tax[r['category_slug']][r['language']],(g['slug'],r['category'])
  assert len(r['ingredients'])==len(es['ingredients']) and len(r['steps'])==len(es['steps'])
  assert [i['amount'] for i in r['ingredients']]==[i['amount'] for i in es['ingredients']]
  assert all(r[k]==es[k] for k in ['servings','prep_time_minutes','cook_time_minutes','total_time_minutes','category_slug'])
  assert r['total_time_minutes']>=r['prep_time_minutes']+r['cook_time_minutes']
  assert r['notes'] and r['summary'] and r['content_html'] and r['excerpt']
  assert len(r['seo']['faq'])==3 and all(f['q'] and f['a'] for f in r['seo']['faq'])
  assert r['seo']['title'] and r['seo']['description'] and r['seo']['image_alt']
  for k,v in n.items():
   if isinstance(v,(int,float)):assert r['nutrition'][k]==v,(g['slug'],r['language'],k)
  assert [s['image_url'] for s in r['steps']]==[s['image_url'] for s in es['steps']]
  assert r['image_url']==es['image_url'] and r['seo']['image_variants']==es['seo']['image_variants']
  used=[r['image_url'],*r['seo']['image_variants'],*(s['image_url'] for s in r['steps'])]
  assert all(x in media for x in used),(g['slug'],'media references')
  assert all(s['title'] and s['content'] and s['image_alt'] for s in r['steps'])
 rows.append({'slug':g['slug'],'languages':7,'steps':len(es['steps']),'package_sha256':hashlib.sha256((R/g['editorial_file']).read_bytes()).hexdigest()})
if not args.metadata_only:
 from PIL import Image
 for path,a in media.items():
  f=R/'public'/path.lstrip('/');assert f.is_file(),path
  assert hashlib.sha256(f.read_bytes()).hexdigest()==a['sha256'],path
  with Image.open(f) as im:
   assert im.format=='WEBP' and im.size==(a['width'],a['height']),(path,im.size);im.verify()
 for g in plan['groups']:
  manifest=json.loads((R/g['images_file']).read_text())
  originals=list((R/'public/recetas'/g['slug']/'originales').glob('*.png'))
  assert originals,(g['slug'],'missing originals')
  declared=manifest.get('originals',manifest.get('original_assets',[]))
  assert declared,(g['slug'],'missing original metadata')
  expected={a.get('path') or a['repository_path']:a for a in declared}
  assert set(expected)=={str(f.relative_to(R)) for f in originals},(g['slug'],'original inventory')
  for f in originals:
   a=expected[str(f.relative_to(R))]
   assert hashlib.sha256(f.read_bytes()).hexdigest()==a['sha256'],str(f)
   with Image.open(f) as im:
    assert im.format=='PNG'
    if 'width' in a:assert im.size==(a['width'],a['height'])
    im.verify()
  sources={a.get('source_original_sha256') for a in manifest.get('images',[]) if a.get('source_original_sha256')}
  assert sources<={a['sha256'] for a in declared},(g['slug'],'source original hashes')
assert len(paths)==105
report={'status':'PASS_METADATA_ONLY' if args.metadata_only else 'PASS','groups':15,'language_records':105,'webp':172,'records':rows,'checks':['frozenEShash','identity and routes','UUIDv5','closed taxonomy','ingredient/time/nutrition parity','USDA weighted calculation','localized required fields','all media references']+([] if args.metadata_only else ['172WebP decode and SHA256','originalPNG decode'])}
(R/'lote02-prepublication-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='records'}))
