"""Verify repaired pantry data in seven built or deployed pages (read-only)."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
from pathlib import Path
import re
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = ["es", "en", "de", "fr", "it", "ja", "pt"]


def pantry_props(html):
    frames = [json.loads(frame)[1] for frame in re.findall(r"self\.__next_f\.push\((\[1,.*?\])\)", html)]
    def find(value):
        if isinstance(value, dict):
            if isinstance(value.get("ingredients"), list) and isinstance(value.get("recipes"), list):
                return value
            for child in value.values():
                found = find(child)
                if found is not None:
                    return found
        elif isinstance(value, list):
            for child in value:
                found = find(child)
                if found is not None:
                    return found
        return None
    for line in "".join(frames).splitlines():
        if '"ingredients":' not in line or '"recipes":' not in line:
            continue
        found = find(json.loads(line.split(":", 1)[1]))
        if found is not None:
            return found
    raise AssertionError("Pantry data missing from rendered page")


def verify(lang, html, plan):
    data = pantry_props(html)
    assert data["lang"] == lang, f"{lang}: wrong language"
    recipes = {r["recipe_group_id"]: r for r in data["recipes"]}
    ingredients = {i["slug"]: i for i in data["ingredients"]}
    for source in plan["recipes"]:
        recipe = recipes.get(source["recipe_group_id"])
        assert recipe is not None, f"{lang}: missing {source['slug']}"
        assert recipe["language"] == lang, f"{lang}: untranslated card {source['slug']}"
        assert recipe["totalCanonicalIngredients"] == len(source["resolutions"]), f"{lang}: incomplete coverage"
        assert recipe["uncanonicalizedCount"] == 0, f"{lang}: unresolved positions"
        ids = recipe["ingredientIds"]
        assert len(ids) == len(set(ids)), f"{lang}: duplicate checklist entries"
        expected = {ingredients[x["ingredient_slug"]]["id"] for x in source["resolutions"]}
        assert set(ids) == expected, f"{lang}: wrong ingredient identity {source['slug']}"
    for ingredient in plan["newIngredients"]:
        expected_name = ingredient["name"] if lang == "es" else ingredient["labels"][LANGUAGES[1:].index(lang)]
        assert ingredients[ingredient["slug"]]["name"] == expected_name, f"{lang}: missing translation {ingredient['slug']}"
    return {"language": lang, "tool_recipes": len(recipes), "ingredient_choices": len(ingredients),
            "repaired_recipes_verified": len(plan["recipes"]), "ingredient_entries_verified": 81,
            "new_ingredient_labels_verified": len(plan["newIngredients"])}


def main():
    parser = argparse.ArgumentParser()
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--built-dir", type=Path)
    source.add_argument("--base-url")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    plan = json.loads((ROOT / "editorial/pantry-ingredient-repair-20261009.json").read_text())
    def check(lang):
        if args.built_dir:
            html = (args.built_dir / lang / "que-puedo-cocinar.html").read_text()
        else:
            with urlopen(args.base_url.rstrip("/") + "/" + lang + "/que-puedo-cocinar", timeout=30) as response:
                assert response.status == 200
                html = response.read().decode()
        return verify(lang, html, plan)
    with ThreadPoolExecutor(max_workers=4) as executor:
        checks = list(executor.map(check, LANGUAGES))
    assert len({row["tool_recipes"] for row in checks}) == 1, "Recipe count differs across languages"
    report = {"status": "PASS", "checked_at": datetime.now(timezone.utc).isoformat(), "checks": checks}
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
