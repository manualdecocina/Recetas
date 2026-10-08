"""Convert an individually generated step photograph to WebP and record its hash."""
import hashlib
import json
import sys
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
slug = 'como-preparar-limon-serrano-la-receta-de-ensalada-mas-buscada'
number = int(sys.argv[1])
assert 1 <= number <= 6
source = Path(sys.argv[2])
manifest_path = root / 'editorial' / f'{slug}-imagenes.json'
manifest = json.loads(manifest_path.read_text())
recipe = json.loads((root / 'editorial' / f'{slug}-20261008.json').read_text())
step = recipe['records'][0]['steps'][number - 1]
destination = root / manifest['directory'] / f'paso-{number:02d}.webp'
image = Image.open(source).convert('RGB')
image.save(destination, 'WEBP', quality=88, method=6)
manifest['images'] = [i for i in manifest['images'] if i['archivo'] != destination.name]
manifest['images'].append({'archivo': destination.name, 'paso': {'numero': number, 'titulo': step['title']}, 'muestra': recipe['step_visuals'][number - 1], 'alt_es': step['image_alt'], 'estado': 'entregada', 'sha256': hashlib.sha256(destination.read_bytes()).hexdigest(), 'width': image.width, 'height': image.height, 'visual_qa': sys.argv[3], 'source_original_sha256': hashlib.sha256(source.read_bytes()).hexdigest()})
manifest['images'].sort(key=lambda item: item['archivo'])
manifest['state'] = 'ALL_IMAGES_READY_LOCALIZATION_PENDING' if len(manifest['images']) == 11 else 'STEP_IMAGES_IN_PROGRESS'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'asset': destination.name, 'images_ready': len(manifest['images']), 'remaining': 11 - len(manifest['images'])}))
