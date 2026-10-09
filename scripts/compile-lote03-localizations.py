"""Compile authored translations with the reserved identities and frozen ES data."""
import copy
import hashlib
import html
import json
import os
import re
import uuid
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
slug = sys.argv[1]
source = root / 'editorial' / f'{slug}-20261008.json'
item = json.loads(source.read_text())
assert len(item['records']) == 1, 'Never replace completed localizations'
es = item['records'][0]
patches = json.loads((root / 'editorial' / f'{slug}-localizaciones-20261008.json').read_text())
langs = ['de', 'en', 'fr', 'it', 'ja', 'pt']
assert set(patches) == set(langs)
identity = next(r for r in json.loads((root / 'editorial/lote03-identidades-rutas-20261008.json').read_text())['recipes'] if r['slug'] == slug)
routes = {r['language']: r for r in identity['routes']}
manifest_path = root / 'editorial' / f'{slug}-imagenes.json'
manifest = json.loads(manifest_path.read_text())
assert len(manifest['images']) == len(es['steps']) + 4
assert all((root / a['path']).stat().st_size == a['bytes'] for a in manifest['images'])
blank = copy.deepcopy(es['steps'])
for step in blank:
    step['image_url'] = ''
frozen_candidates = [
    hashlib.sha256(json.dumps(es['steps'], ensure_ascii=False, separators=(',', ':')).encode()).hexdigest(),
    hashlib.sha256(json.dumps(blank, ensure_ascii=False, sort_keys=True).encode()).hexdigest(),
]
assert item['steps_sha256'] in frozen_candidates
category = re.search(r"(?:'" + re.escape(es['category_slug']) + r"'|" + re.escape(es['category_slug']) + r"):\s*\{(.*?)\}", (root / 'src/lib/categories.ts').read_text(), re.S).group(1)
labels = dict(re.findall(r"(es|de|en|fr|it|ja|pt):\s*'([^']+)'", category))
records = [es]
for lang in langs:
    p = patches[lang]
    assert len(p['steps']) == len(es['steps']) and len(p['ingredients']) == len(es['ingredients']) and len(p['faq']) == 3
    record = copy.deepcopy(es)
    route = routes[lang]
    record.update(id=str(uuid.uuid5(uuid.UUID(es['recipe_group_id']), lang)), language=lang,
                  public_path=route['public_path'], slug=route['slug'],
                  source_url=('https://manualdecocina.com' + route['public_path'] + '/') if route['source'].startswith('preserved_historical') else None,
                  category=labels[lang])
    for key in ['title', 'excerpt', 'summary', 'notes', 'difficulty', 'course', 'cuisine', 'keywords']:
        record[key] = p[key]
    for ingredient, name in zip(record['ingredients'], p['ingredients']):
        ingredient['name'] = name
        ingredient['group'] = p['groups'][ingredient['group']]
    for step, (title, content) in zip(record['steps'], p['steps']):
        step.update(title=title, content=content, image_alt=record['title'] + ': ' + title)
    record['seo'].update(title=p['seo_title'], description=p['excerpt'], image_alt=p['cover_alt'], faq=[{'q': q, 'a': a} for q, a in p['faq']])
    assert len(record['seo']['title']) <= 65
    for key in ['serving_size', 'method', 'note']:
        record['nutrition'][key] = p['nutrition'][key]
    assert len(p['nutrition_inputs']) == len(record['nutrition']['inputs'])
    for entry, name in zip(record['nutrition']['inputs'], p['nutrition_inputs']):
        entry['ingredient'] = name
    record['content_html'] = '<p>' + html.escape(record['summary']) + '</p><p>' + html.escape(record['notes']) + '</p>'
    records.append(record)
item.update(records=records, state='COMPLETE_7_LANGUAGES_AND_IMAGES_BATCH_PUBLICATION_PENDING',
            publication_blockers=['FULL15_CI_DEPLOY_DB_CACHE_LIVE_QA_PENDING'], portuguese_locale='pt-BR', published_database=False)
for asset in manifest['images']:
    phase = None if asset['asset'].startswith('portada') else int(asset['asset'].split('-')[1].split('.')[0])
    asset['alt_by_language'] = {r['language']: r['seo']['image_alt'] if phase is None else r['steps'][phase-1]['image_alt'] for r in records}
manifest['state'] = 'COMPLETE_LOCALIZED_ALTS_AND_VISUAL_QA'
for path, data in [(source, item), (manifest_path, manifest)]:
    pending = path.with_suffix('.json.pending')
    with pending.open('wb') as handle:
        handle.write((json.dumps(data, ensure_ascii=False, indent=2) + '\n').encode())
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(pending, path)
print(json.dumps({'slug': slug, 'languages': len(records), 'steps': len(es['steps']), 'webp': len(manifest['images']), 'state': item['state']}))
