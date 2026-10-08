"""Compile six authored localizations without changing frozen ES instructions or quantities."""
import copy
import hashlib
import html
import json
import re
import sys
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
slug = sys.argv[1]
source = ROOT / 'editorial' / f'{slug}-20261008.json'
item = json.loads(source.read_text())
patches = json.loads((ROOT / 'editorial' / f'{slug}-localizaciones-20261008.json').read_text())
assert set(patches) == {'de', 'en', 'fr', 'it', 'ja', 'pt'}
es = item['records'][0]
assert es['language'] == 'es' and item['steps_frozen']
frozen_steps = copy.deepcopy(es['steps'])
for step in frozen_steps:
    step['image_url'] = ''
assert hashlib.sha256(json.dumps(frozen_steps, ensure_ascii=False, sort_keys=True).encode()).hexdigest() == item['steps_sha256']
category = re.search(r"(?:'" + re.escape(es['category_slug']) + r"'|" + re.escape(es['category_slug']) + r"):\s*\{(.*?)\}", (ROOT / 'src/lib/categories.ts').read_text(), re.S).group(1)
labels = dict(re.findall(r"(es|de|en|fr|it|ja|pt):\s*'([^']+)'", category))
records = [es]
for lang in ['de', 'en', 'fr', 'it', 'ja', 'pt']:
    patch = patches[lang]
    record = copy.deepcopy(es)
    record.update(id=str(uuid.uuid5(uuid.UUID(es['recipe_group_id']), lang)), language=lang, public_path=patch['path'], slug=patch['path'].split('/')[-1], source_url=('https://manualdecocina.com' + patch['path'] + '/') if patch['historical_path'] else None, title=patch['title'], excerpt=patch['excerpt'], summary=patch['summary'], notes=patch['notes'], category=labels[lang], difficulty=patch['difficulty'], course=patch['course'], cuisine=patch['cuisine'], keywords=patch['keywords'])
    assert len(patch['ingredients']) == len(record['ingredients']) and len(patch['steps']) == len(record['steps']) and len(patch['faq']) == 3
    for ingredient, name in zip(record['ingredients'], patch['ingredients']):
        ingredient['name'] = name
        ingredient['group'] = patch['groups'][ingredient['group']]
        ingredient['unit'] = patch.get('units', {}).get(ingredient['unit'], ingredient['unit'])
    for step, (title, content) in zip(record['steps'], patch['steps']):
        step.update(title=title, content=content, image_alt=record['title'] + ': ' + title)
    record['seo'].update(title=patch['seo_title'], description=patch['excerpt'], image_alt=patch['cover_alt'], faq=[{'q': q, 'a': a} for q, a in patch['faq']])
    record['content_html'] = ''.join('<p>' + html.escape(p) + '</p>' for p in record['summary'].split('\n\n'))
    for key, text in patch['nutrition'].items():
        record['nutrition'][key] = text
    for i, entry in enumerate(record['nutrition']['inputs']):
        entry['ingredient'] = patch['ingredients'][i]
        if 'proxy_note' in entry:
            entry['proxy_note'] = patch['nutrition_proxies'][str(i)]
    records.append(record)
prefix = f'/recetas/{slug}/'
for record in records:
    record['image_url'] = prefix + 'portada.webp'
    record['gallery'] = [{'url': record['image_url'], 'alt': record['seo']['image_alt']}]
    record['seo']['image_variants'] = [prefix + 'portada-' + ratio + '.webp' for ratio in ['1x1', '4x3', '16x9']]
    for i, step in enumerate(record['steps'], 1):
        step['image_url'] = prefix + f'paso-{i:02d}.webp'
item['records'] = records
item['image_alts_by_language'] = {r['language']: {'title': r['title'], 'cover': r['seo']['image_alt'], 'steps': [s['image_alt'] for s in r['steps']]} for r in records}
item['state'] = 'COMPLETE_7_LANGUAGES_AND_IMAGES_BATCH_PUBLICATION_PENDING'
item['publication_blockers'] = ['BATCH_15_COMPLETION_PENDING', 'PREVIEW_QA_PENDING']
source.write_text(json.dumps(item, ensure_ascii=False, indent=2) + '\n')
manifest_path = ROOT / 'editorial' / f'{slug}-imagenes.json'
manifest = json.loads(manifest_path.read_text())
for image in manifest['images']:
    n = None if image['paso'] == 'portada' else image['paso']['numero']
    image['alt_by_language'] = {lang: alt['cover'] if n is None else alt['steps'][n - 1] for lang, alt in item['image_alts_by_language'].items()}
    image['alt_es'] = image['alt_by_language']['es']
manifest['state'] = 'COMPLETE_LOCALIZED_ALTS_AND_VISUAL_QA'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'recipe': slug, 'records': len(records), 'images': len(manifest['images']), 'state': item['state']}))
