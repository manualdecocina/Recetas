#!/usr/bin/env bash
# Ejecutar EN un GitHub Codespace de la rama cierre-mysql-seguro-20261116.
# Descarga solo los 104 medios publicos ausentes, verifica firmas/tamanos,
# y los publica en la MISMA rama. No utiliza GitHub Actions ni toca main.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "cierre-mysql-seguro-20261116" ]]; then
  echo "ERROR: cambia a cierre-mysql-seguro-20261116 antes de ejecutar." >&2
  exit 2
fi
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: Codespace tiene cambios sin guardar. No se va a mezclar otro trabajo." >&2
  exit 2
fi
python3 scripts/migracion-hostinger/rescatar-media.py
python3 - <<'PY'
import json,subprocess
from pathlib import Path
manifest=json.loads(Path('scripts/migracion-hostinger/media-pendientes.json').read_text())
objects=manifest['objects']
if len(objects)!=104 or len({x['output'] for x in objects})!=104:
    raise SystemExit('Manifiesto incompleto: no publicar')
paths=[x['output'] for x in objects]
for x in objects:
    f=Path(x['output'])
    if not f.is_file() or f.stat().st_size!=x['bytes']:
        raise SystemExit('Medio ausente o con tamaño inesperado: '+str(f))
subprocess.run(['git','add','--',*paths],check=True)
print('OK: 104 medios verificados y preparados para commit.')
PY
if git diff --cached --quiet; then
  echo "Ya estaban todos los medios publicados. No hay cambios."
  exit 0
fi
git commit -m "Rescate MySQL: publicar 104 medios propios verificados [skip ci]"
git push origin cierre-mysql-seguro-20261116
echo "LISTO: medios publicados en la rama aislada. No se modificó main."
