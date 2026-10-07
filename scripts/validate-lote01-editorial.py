"""Validate the prepared Spanish batch and its frozen image briefs without DB writes."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LANGS = {'es', 'de', 'en', 'fr', 'it', 'ja', 'pt'}
batch = json.loads((ROOT / 'editorial/lote-01-plan-v2-20261008.json').read_text())
assert batch['publication_status'] == 'NOT_EXECUTED'
assert len(batch['groups']) == 10
assert len({g['recipe_group_id'] for g in batch['groups']}) == 10
assert len({g['public_path'] for g in batch['groups']}) == 10
reference = json.loads((ROOT / 'editorial/lote-01-usda-sr-legacy-20261008.json').read_text())
food = {v['fdc_id']: v for v in reference['foods']}
images_count = 0
for g in batch['groups']:
    item = json.loads((ROOT / g['editorial_file']).read_text())
    manifest = json.loads((ROOT / g['images_file']).read_text())
    assert len(item['records']) == 1, 'Full localizations are pending, not fabricated'
    r = item['records'][0]
    assert r['language'] == 'es' and not r['published']
    assert r['editorial_status'] == 'draft'
    assert r['recipe_group_id'] == g['recipe_group_id'] == manifest['recipe_group_id']
    assert r['public_path'] == g['public_path']
    assert r['image_url'] is None and r['gallery'] == [] and r['seo']['image_variants'] == []
    for key in ('title','excerpt','summary','category','difficulty','course','cuisine','notes','ingredients','keywords','content_html'):
        assert r[key], (g['slug'], key)
    assert len(r['seo']['faq']) == 3 and all(q['q'] and q['a'] for q in r['seo']['faq'])
    assert r['prep_time_minutes'] + r['cook_time_minutes'] <= r['total_time_minutes']
    assert len(r['steps']) == 8 and all(s['title'] and s['content'] and s['image_alt'] and s['image_url'] == '' for s in r['steps'])
    assert set(item['image_alts_by_language']) == LANGS
    for lang, a in item['image_alts_by_language'].items():
        assert a['cover'] and len(a['steps']) == len(r['steps']) and all(a['steps'])
    digest = hashlib.sha256(json.dumps(r['steps'], ensure_ascii=False, sort_keys=True).encode()).hexdigest()
    assert manifest['steps_sha256'] == digest
    assert len(manifest['images']) == len(r['steps']) + 4
    assert len({im['archivo'] for im in manifest['images']}) == len(manifest['images'])
    for im in manifest['images']:
        assert im['estado'] == 'pendiente' and im['muestra'] and set(im['alt_by_language']) == LANGS
    for index, step in enumerate(r['steps']):
        im = manifest['images'][index + 4]
        assert im['paso'] == {'numero': index + 1, 'titulo': step['title']}
        assert im['alt_es'] == step['image_alt']
    n = r['nutrition']
    assert n['estimated'] and n['source'] and n['method'] and n['note']
    keys = ['calories','protein_g','carbs_g','fat_g','saturated_fat_g','fiber_g','sugar_g','sodium_mg']
    summed = {key: 0 for key in keys}
    for inp in n['inputs']:
        assert inp['per_100g'] == food[inp['fdc_id']]['per_100g']
        assert inp['fdc_description'] == food[inp['fdc_id']]['description']
        for key in keys:
            summed[key] += inp['per_100g'].get(key, 0) * inp['edible_grams'] / 100
    for key in keys:
        places = 0 if key in ('calories', 'sodium_mg') else 1
        assert n[key] == round(summed[key] / r['servings'], places), (g['slug'], key)
    assert item['ai_owner_confirmation']['status'] == 'pending'
    images_count += len(manifest['images'])
print(f'OK: 10 Spanish drafts, 80 frozen steps, {images_count} image slots, alts in 7 languages; USDA arithmetic verified.')
print('Full recipe translations, final media, publication and public QA remain pending.')
