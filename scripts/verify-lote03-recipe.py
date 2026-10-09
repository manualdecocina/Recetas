"""Check a reserved recipe package and report only completed local checks."""
import argparse, copy, hashlib, json, re, uuid
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('slug')
args = parser.parse_args()
slug = args.slug
item = json.loads((root / 'editorial' / f'{slug}-20261008.json').read_text())
manifest = json.loads((root / 'editorial' / f'{slug}-imagenes.json').read_text())
records = item['records']
langs = {'es', 'de', 'en', 'fr', 'it', 'ja', 'pt'}
assert len(records) == 7 and {r['language'] for r in records} == langs
es = next(r for r in records if r['language'] == 'es')
identity = next(r for r in json.loads((root / 'editorial/lote03-identidades-rutas-20261008.json').read_text())['recipes'] if r['slug'] == slug)
routes = {r['language']: r for r in identity['routes']}
blank = copy.deepcopy(es['steps'])
for s in blank:
    s['image_url'] = ''
candidates = {
    hashlib.sha256(json.dumps(es['steps'], ensure_ascii=False, separators=(',', ':')).encode()).hexdigest(),
    hashlib.sha256(json.dumps(blank, ensure_ascii=False, sort_keys=True).encode()).hexdigest(),
}
assert item['steps_sha256'] == manifest['steps_sha256'] and item['steps_sha256'] in candidates
nutrients = ['calories','protein_g','carbs_g','fat_g','saturated_fat_g','fiber_g','sugar_g','sodium_mg']
for k in nutrients:
    result = round(sum(a['edible_grams']/100*a['per_100g'][k] for a in es['nutrition']['inputs'])/es['servings'], 0 if k == 'sodium_mg' else 1)
    assert abs(result-es['nutrition'][k]) <= 0.100001, (slug, k, result)
assert len(manifest['images']) == len(es['steps']) + 4
assets = {}
for a in manifest['images'] + manifest['originals']:
    path = root / a['path']
    raw = path.read_bytes()
    assert len(raw) == a['bytes'] and hashlib.sha256(raw).hexdigest() == a['sha256'], path
    with Image.open(path) as im:
        assert im.format == ('WEBP' if path.suffix == '.webp' else 'PNG')
        assert im.size == (a['width'], a['height'])
        im.verify()
    assert a['visual_qa'].startswith('PASS')
    if path.suffix == '.webp':
        assert set(a['alt_by_language']) == langs
        assets[a['public_path']] = a
assert len({r['id'] for r in records}) == 7 and len({r['public_path'] for r in records}) == 7
def numbers(text):
    return {v.replace(',', '.') for v in re.findall(r'\d+(?:[.,]\d+)?', text)}
for r in records:
    lang = r['language']
    assert r['public_path'] == routes[lang]['public_path'] and r['slug'] == routes[lang]['slug']
    if lang != 'es':
        assert r['id'] == str(uuid.uuid5(uuid.UUID(es['recipe_group_id']), lang))
    assert all(r[k] == es[k] for k in ['recipe_group_id','servings','prep_time_minutes','cook_time_minutes','total_time_minutes','category_slug'])
    assert [(i['amount'],i['unit']) for i in r['ingredients']] == [(i['amount'],i['unit']) for i in es['ingredients']]
    assert all(r['nutrition'][k] == es['nutrition'][k] for k in nutrients)
    assert len(r['steps']) == len(es['steps']) and len(r['seo']['faq']) == 3
    assert r['nutrition']['estimated'] and len(r['seo']['title']) <= 65
    assert r['image_url'] in assets and all(s['image_url'] in assets for s in r['steps'])
    assert all(r[k] for k in ['title','excerpt','summary','notes','content_html'])
    for index, (step, source) in enumerate(zip(r['steps'], es['steps']), 1):
        assert step['title'] and step['content'] and step['image_alt']
        assert numbers(step['content']) == numbers(source['content']), (lang, index, numbers(source['content']) ^ numbers(step['content']))
        assert assets[step['image_url']]['alt_by_language'][lang] == step['image_alt']
report = {'recipe':slug,'checked_at':datetime.now(timezone.utc).isoformat(),'status':'PASS_EDITORIAL_MEDIA_LOCALIZATION_NOT_LIVE','languages':7,'steps':len(es['steps']),'originals':len(manifest['originals']),'webp':len(manifest['images']),'package_sha256':hashlib.sha256((root/'editorial'/f'{slug}-20261008.json').read_bytes()).hexdigest(),'steps_sha256':item['steps_sha256'],'checks':['reserved routes and UUIDv5','frozen Spanish steps','ingredient units and numeric parity','per-step numeric parity','times and nutrition parity','USDA weighted calculation','PNG/WebP format dimensions and SHA256','localized media alt and FAQ'],'publication':'PENDING_FULL15_CI_DEPLOY_DB_CACHE_LIVE_QA','kitchen_test_performed':False}
(root/'editorial'/f'{slug}-qa-20261008.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
