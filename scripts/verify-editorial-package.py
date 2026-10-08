"""Verify frozen instructions, numeric parity, asset integrity and route uniqueness."""
import copy
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
slug = sys.argv[1]
item = json.loads((root / f'editorial/{slug}-20261008.json').read_text())
manifest = json.loads((root / f'editorial/{slug}-imagenes.json').read_text())
records = item['records']
assert len(records) == 7 and {r['language'] for r in records} == {'es','de','en','fr','it','ja','pt'}
assert len({r['id'] for r in records}) == 7 and len({r['public_path'] for r in records}) == 7
es = records[0]
steps = copy.deepcopy(es['steps'])
for step in steps:
    step['image_url'] = ''
assert hashlib.sha256(json.dumps(steps, ensure_ascii=False, sort_keys=True).encode()).hexdigest() == item['steps_sha256']
nutrients = ['calories','protein_g','carbs_g','fat_g','saturated_fat_g','fiber_g','sugar_g','sodium_mg']
for key in nutrients:
    calculated = round(sum(x['edible_grams'] / 100 * x['per_100g'][key] for x in es['nutrition']['inputs']) / es['servings'], 0 if key == 'sodium_mg' else 1)
    assert calculated == es['nutrition'][key], (key, calculated)
assets = {}
assert len(manifest['images']) == len(es['steps']) + 4
for image in manifest['images']:
    path = root / 'public/recetas' / slug / image['archivo']
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    assert digest == image['sha256']
    with Image.open(path) as decoded:
        assert decoded.format == 'WEBP' and decoded.size == (image['width'], image['height'])
        decoded.verify()
    assert image['visual_qa'].startswith('PASS') and set(image['alt_by_language']) == {r['language'] for r in records}
    assets['/recetas/' + slug + '/' + image['archivo']] = digest
for r in records:
    assert all(r[k] == es[k] for k in ['recipe_group_id','servings','prep_time_minutes','cook_time_minutes','total_time_minutes','category_slug'])
    assert len(r['ingredients']) == len(es['ingredients']) and len(r['steps']) == len(es['steps'])
    assert [x['amount'] for x in r['ingredients']] == [x['amount'] for x in es['ingredients']]
    assert all(r['nutrition'][k] == es['nutrition'][k] for k in nutrients)
    assert r['nutrition']['estimated'] is True
    assert len(r['seo']['faq']) == 3 and len(r['seo']['title']) <= 65
    assert r['image_url'] in assets and r['seo']['image_alt']
    assert all(s['image_url'] in assets and s['content'] and s['title'] and s['image_alt'] for s in r['steps'])
    for image in manifest['images']:
        n = None if image['paso'] == 'portada' else image['paso']['numero']
        assert image['alt_by_language'][r['language']] == (r['seo']['image_alt'] if n is None else r['steps'][n-1]['image_alt'])
report = {'recipe':slug, 'checked_at':datetime.now(timezone.utc).isoformat(), 'status':'PASS', 'languages':7, 'steps':len(es['steps']), 'assets':len(assets), 'steps_sha256':item['steps_sha256'], 'checks':['frozen ES instructions','seven unique routes and UUIDs','numeric and timing parity','USDA weighted calculation','WebP decode and SHA256 integrity','localized media alts and three FAQ'], 'publication':'PENDING_BATCH_COMPLETION', 'preview_http_visual_qa':'PENDING_PUBLICATION', 'no_kitchen_test_claim':True}
(root / f'editorial/{slug}-qa-20261008.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report))
