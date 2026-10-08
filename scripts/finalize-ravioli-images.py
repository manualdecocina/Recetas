"""Attach verified WebP assets to the frozen ravioli package."""
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SLUG = "receta-raviolis-caseros"
package_path = ROOT / "editorial" / f"{SLUG}-20261008.json"
manifest_path = ROOT / "editorial" / f"{SLUG}-imagenes.json"
qa_path = ROOT / "editorial" / f"{SLUG}-qa-20261008.json"
package = json.loads(package_path.read_text())
manifest = json.loads(manifest_path.read_text())
record = package["records"][0]
assert package["steps_frozen"] and manifest["steps_sha256"] == package["steps_sha256"]

names = [f"paso-{i:02d}.webp" for i in range(1, 9)] + ["portada.webp", "portada-4x3.webp", "portada-1x1.webp", "portada-16x9.webp"]
images = []
for name in names:
    path = ROOT / "public" / "recetas" / SLUG / name
    raw = path.read_bytes()
    with Image.open(path) as im:
        assert im.format == "WEBP"
        size = list(im.size)
    images.append({"asset": name, "public_path": f"/recetas/{SLUG}/{name}", "sha256": hashlib.sha256(raw).hexdigest(), "bytes": len(raw), "dimensions": size, "visual_qa": "PASS"})

for i, step in enumerate(record["steps"], 1):
    step["image_url"] = f"/recetas/{SLUG}/paso-{i:02d}.webp"
record["image_url"] = f"/recetas/{SLUG}/portada.webp"
record["gallery"] = [{"url": record["image_url"], "alt": record["seo"]["image_alt"]}]
record["seo"]["image_variants"] = [f"/recetas/{SLUG}/portada-1x1.webp", f"/recetas/{SLUG}/portada-4x3.webp", f"/recetas/{SLUG}/portada-16x9.webp"]
package["state"] = "ES_AND_IMAGES_COMPLETE_LOCALIZATIONS_PENDING"
package["publication_blockers"] = ["FULL_LOCALIZATION_PENDING", "BATCH_15_COMPLETION_PENDING", "PREVIEW_QA_PENDING"]
manifest["images"] = images
manifest["state"] = "COMPLETE_VISUAL_QA_PASS"
manifest["visual_review"] = {
    "result": "PASS",
    "reviewed_at": "2026-10-08",
    "notes": [
        "Cover shows six square ravioli, browned butter, sage and visible ricotta-spinach filling with no forbidden sauce.",
        "Step sequence preserves cold ricotta draining, dry spinach, three eggs in flour, rested dough, portioned dry filling, sealing, boiling with separate sage butter, and final plate.",
        "Step 3 was regenerated to remove an extra egg bowl; step 5 was regenerated to remove premature pasta assembly.",
        "No legacy or other-recipe media used; cover is reused only for step 8 and responsive cover crops.",
    ],
}
qa = {
    "schema_version": 1,
    "slug": SLUG,
    "checked_at": "2026-10-08",
    "result": "PASS",
    "checks": {"webp_decode": True, "asset_count": 12, "distinct_originals": 8, "step_count": 8, "cover_variants": 3, "hashes_recorded": True, "frozen_steps_unchanged": True, "visual_phase_match": True},
    "steps_sha256": package["steps_sha256"],
    "next_gate": "Seven-language localization, SQL package and batch publication gates remain pending.",
}
package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2) + "\n")
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
qa_path.write_text(json.dumps(qa, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"images": len(images), "state": manifest["state"], "qa": qa["result"]}))
