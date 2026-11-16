#!/usr/bin/env python3
"""Rescata solo medios PUBLICOS ausentes de GitHub. No modifica Supabase.
Manifiesto fijo de Storage; protege rutas, comprueba tamaño y firma antes de guardar.
No ejecuta SQL, no necesita claves ni cambia archivos existentes.
"""
from __future__ import annotations
import concurrent.futures
import hashlib
import json
from pathlib import Path
import time
from urllib.parse import quote
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "scripts/migracion-hostinger/media-pendientes.json"
BASE = "https://eqbdtctxbpepbeickhqi.supabase.co/storage/v1/object/public/"

def retrieve(item: dict) -> dict:
    bucket = item["bucket"]
    object_path = item["path"]
    relative = item["output"]
    expected = item["bytes"]
    if bucket not in ("recetas", "receta-videos") or not isinstance(expected, int) or expected < 1 or expected > 30_000_000:
        raise ValueError("Manifiesto de medios inválido")
    if not isinstance(relative, str) or relative.startswith("/") or ".." in relative.split("/"):
        raise ValueError("Ruta de archivo insegura")
    prefix = "public/recetas/" if bucket == "recetas" else "public/videos/"
    if not relative.startswith(prefix) or relative != prefix + object_path:
        raise ValueError("El destino no corresponde al objeto")
    expected_ext = ".webp" if bucket == "recetas" else ".mp4"
    if not relative.endswith(expected_ext):
        raise ValueError("Extensión de medio inesperada")
    dest = (ROOT / relative).resolve()
    if not dest.is_relative_to(ROOT / "public"):
        raise ValueError("Destino fuera de public")
    if dest.exists():
        return {"file": relative, "status": "existing", "sha256": hashlib.sha256(dest.read_bytes()).hexdigest()}
    url = BASE + quote(bucket, safe="") + "/" + quote(object_path, safe="/")
    last_error = None
    for attempt in range(3):
        try:
            req = Request(url, headers={"User-Agent": "ManualDeCocina-Rescue/1.0"})
            with urlopen(req, timeout=50) as response:
                body = response.read(expected + 1)
            if len(body) != expected:
                raise ValueError(f"Tamaño incorrecto {relative}: {len(body)} != {expected}")
            if bucket == "recetas":
                if body[:4] != b"RIFF" or body[8:12] != b"WEBP":
                    raise ValueError("Firma WebP incorrecta: " + relative)
            elif len(body) < 12 or body[4:8] != b"ftyp":
                raise ValueError("Firma MP4 incorrecta: " + relative)
            dest.parent.mkdir(parents=True, exist_ok=True)
            # Exclusive create: no sobreescribir imágenes ya existentes.
            with dest.open("xb") as f:
                f.write(body)
            return {"file": relative, "status": "rescued", "sha256": hashlib.sha256(body).hexdigest()}
        except (HTTPError, URLError, TimeoutError, OSError) as exc:
            last_error = exc
            if attempt < 2:
                time.sleep(2 ** attempt)
            else:
                raise RuntimeError(f"No se pudo rescatar {relative}: {exc}") from exc
    raise RuntimeError(f"Error descargando {relative}: {last_error}")

def main() -> None:
    payload = json.loads(MANIFEST.read_text(encoding="utf-8"))
    objects = payload["objects"]
    if len(objects) != 104 or len({x["output"] for x in objects}) != 104:
        raise SystemExit("Manifiesto no es el esperado: detener trabajo")
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as workers:
        results = list(workers.map(retrieve, objects))
    rescued = sum(r["status"] == "rescued" for r in results)
    print(f"Medios comprobados: {len(results)}, nuevos: {rescued}, existentes: {len(results)-rescued}")
    report = ROOT / "media-rescue-qa.json"
    report.write_text(json.dumps({"files": results}, indent=2), encoding="utf-8")
    if len(results) != 104:
        raise SystemExit("Descarga incompleta")

if __name__ == "__main__":
    main()
