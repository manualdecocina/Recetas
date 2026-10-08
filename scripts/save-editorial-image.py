"""Save one accepted generated original as WebP, cover crops, hashes and localized alts."""
import hashlib
import io
import json
import os
import sys
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
slug, number, source_path, qa = sys.argv[1:5]
number = int(number)
source = Path(source_path)
recipe = json.loads((root / 'editorial' / f'{slug}-20261008.json').read_text())
manifest_path = root / 'editorial' / f'{slug}-imagenes.json'
manifest = json.loads(manifest_path.read_text())
directory = root / manifest['directory']
directory.mkdir(parents=True, exist_ok=True)
image = Image.open(source).convert('RGB')
last = len(recipe['records'][0]['steps'])
if number == 0:
    # Full-resolution cover is the original. Responsive versions only crop it.
    w, h = image.size
    square = min(w, h)
    four_three = (min(w, int(h * 4 / 3)), min(h, int(w * 3 / 4)))
    sixteen_nine = (min(w, int(h * 16 / 9)), min(h, int(w * 9 / 16)))
    outputs = [('portada.webp', (w, h), None), ('portada-1x1.webp', (square, square), None), ('portada-4x3.webp', four_three, None), ('portada-16x9.webp', sixteen_nine, None), (f'paso-{last:02d}.webp', (w, h), last)]
else:
    assert 1 <= number < last
    outputs = [(f'paso-{number:02d}.webp', image.size, number)]
for name, size, step in outputs:
    out = image if size == image.size else ImageOps.fit(image, size)
    destination = directory / name
    assert not destination.exists(), f'Do not overwrite an accepted asset: {destination}'
    buffer = io.BytesIO()
    out.save(buffer, 'WEBP', quality=88, method=6)
    encoded = buffer.getvalue()
    temporary = destination.with_suffix('.webp.pending')
    with temporary.open('xb') as handle:
        handle.write(encoded)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, destination)
    assert destination.read_bytes() == encoded, 'Written WebP differs from encoded original'
    alts = {lang: alt['cover'] if step is None else alt['steps'][step - 1] for lang, alt in recipe['image_alts_by_language'].items()}
    manifest['images'].append({'archivo': name, 'paso': 'portada' if step is None else {'numero': step, 'titulo': recipe['records'][0]['steps'][step - 1]['title']}, 'muestra': recipe['cover'] if step is None else recipe['step_visuals'][step - 1], 'alt_es': alts['es'], 'alt_by_language': alts, 'estado': 'entregada', 'sha256': hashlib.sha256(destination.read_bytes()).hexdigest(), 'width': out.width, 'height': out.height, 'visual_qa': qa, 'source_original_sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'full_resolution_original': number == 0 and name == 'portada.webp'})
manifest['images'].sort(key=lambda entry: entry['archivo'])
manifest['state'] = 'ALL_IMAGES_READY_LOCALIZATION_PENDING' if len(manifest['images']) == last + 4 else 'IMAGES_IN_PROGRESS'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'recipe': slug, 'saved': [x[0] for x in outputs], 'images_ready': len(manifest['images']), 'remaining': last + 4 - len(manifest['images'])}))
