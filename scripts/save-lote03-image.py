"""Persist an inspected ImageGen phase and its reproducible WebP inventory."""
import hashlib
import io
import json
import os
import sys
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
slug, phase, source_name = sys.argv[1:4]
phase = int(phase)
source = Path(source_name)
package = json.loads((root / 'editorial' / f'{slug}-20261008.json').read_text())
manifest_path = root / 'editorial' / f'{slug}-imagenes.json'
manifest = json.loads(manifest_path.read_text())
last = len(package['records'][0]['steps'])
assert 0 <= phase < last
directory = root / manifest['directory']
directory.mkdir(parents=True, exist_ok=True)
original_directory = directory / 'originals'
original_directory.mkdir(exist_ok=True)
name = 'portada' if phase == 0 else f'paso-{phase:02d}'
original = original_directory / f'{name}.png'
assert not original.exists(), f'Accepted original exists: {original}'
source_bytes = source.read_bytes()
with Image.open(io.BytesIO(source_bytes)) as decoded:
    assert decoded.format == 'PNG'
    decoded.load()
    image = decoded.convert('RGB')

def atomic_write(path, data):
    assert not path.exists(), f'Accepted asset exists: {path}'
    pending = path.with_suffix(path.suffix + '.pending')
    with pending.open('xb') as handle:
        handle.write(data)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(pending, path)
    assert path.read_bytes() == data

atomic_write(original, source_bytes)
manifest['originals'].append({'asset': original.name, 'path': str(original.relative_to(root)),
    'sha256': hashlib.sha256(source_bytes).hexdigest(), 'bytes': len(source_bytes),
    'width': image.width, 'height': image.height, 'phase': last if phase == 0 else phase,
    'visual_qa': 'PASS', 'source': 'built-in ImageGen'})
outputs = [(name + '.webp', (1280, 960))]
if phase == 0:
    outputs += [('portada-1x1.webp', (960, 960)), ('portada-4x3.webp', (1280, 960)),
                ('portada-16x9.webp', (1280, 720)), (f'paso-{last:02d}.webp', (1280, 960))]
for filename, dimensions in outputs:
    converted = ImageOps.fit(image, dimensions, method=Image.Resampling.LANCZOS)
    buffer = io.BytesIO()
    converted.save(buffer, format='WEBP', quality=88, method=6)
    data = buffer.getvalue()
    destination = directory / filename
    atomic_write(destination, data)
    with Image.open(destination) as check:
        assert check.format == 'WEBP' and check.size == dimensions
        check.verify()
    manifest['images'].append({'asset': filename, 'path': str(destination.relative_to(root)),
        'public_path': '/recetas/' + slug + '/' + filename,
        'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data),
        'width': dimensions[0], 'height': dimensions[1], 'original': original.name,
        'visual_qa': 'PASS'})
manifest['images'].sort(key=lambda entry: entry['asset'])
manifest['state'] = 'ALL_IMAGES_READY_LOCALIZATION_PENDING' if len(manifest['images']) == last + 4 else 'IMAGES_IN_PROGRESS'
manifest_bytes = (json.dumps(manifest, ensure_ascii=False, indent=2) + '\n').encode()
manifest_pending = manifest_path.with_suffix('.json.pending')
with manifest_pending.open('wb') as handle:
    handle.write(manifest_bytes)
    handle.flush()
    os.fsync(handle.fileno())
os.replace(manifest_pending, manifest_path)
print(json.dumps({'slug': slug, 'saved': [x[0] for x in outputs], 'originals': len(manifest['originals']), 'webp': len(manifest['images'])}))
