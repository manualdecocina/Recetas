"""Restore only archived batch originals in the CI workspace; never commit them."""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
batch = sys.argv[1]
plans = {
    "02": "editorial/lote-02-plan-20261008.json",
    "03": "editorial/lote-03-plan-20261008.json",
    "04": "editorial/lote-04-plan-20261009.json",
    "05": "editorial/lote05-baseline-identities-20261009.json",
}
plan = json.loads((ROOT / plans[batch]).read_text())
groups = plan["rows"] if batch == "05" else plan["groups"]
paths = []
for group in groups:
    manifest_path = ("editorial/" + group["slug"] + "-imagenes.json") if batch == "05" else group["images_file"]
    manifest = json.loads((ROOT / manifest_path).read_text())
    originals = manifest.get("originals", manifest.get("original_assets", []))
    if not originals:
        raise SystemExit("Missing archived original inventory: " + manifest_path)
    for item in originals:
        path = item.get("path") or item.get("repository_path")
        if not path or not path.startswith("public/recetas/") or not path.endswith(".png") or ".." in Path(path).parts:
            raise SystemExit("Invalid archived original path")
        paths.append(path)
paths = sorted(set(paths))
commit = "4e54b7519cfae212fd6cd4be4ae456ea1d755163"
subprocess.run(["git", "fetch", "--depth=1", "--filter=blob:none", "origin", commit], cwd=ROOT, check=True)
for i in range(0, len(paths), 50):
    subprocess.run(["git", "restore", "--source=" + commit, "--worktree", "--", *paths[i:i+50]], cwd=ROOT, check=True)
print("Restored archived originals for validation:", len(paths))
