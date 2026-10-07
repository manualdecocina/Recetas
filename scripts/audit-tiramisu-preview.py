"""Read-only preview QA for the published Tiramisú recipe group."""
import json
import os
import subprocess
import sys
import time
import urllib.parse
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

BASE = "https://preview.manualdecocina.com"
ROUTES = [
    ("de", "/de/tiramisu"),
    ("en", "/en/tiramisu"),
    ("es", "/tiramisu"),
    ("fr", "/fr/tiramisu"),
    ("it", "/it/tiramisu"),
    ("ja", "/ja/ティラミス"),
    ("pt-BR", "/pt/tiramisu"),
]
IMAGES = (["portada", "portada-1x1", "portada-4x3", "portada-16x9"] + ["paso-%02d" % i for i in range(1, 9)])
EXPECTED = {lang: BASE + path for lang, path in ROUTES}


def fetch(path):
    url = BASE + urllib.parse.quote(path, safe="/%")
    p = subprocess.run(
        ["node", "scripts/fetch-public-page.mjs", url],
        capture_output=True, text=True, timeout=35, check=True,
    )
    return json.loads(p.stdout)


def decoded(value):
    return urllib.parse.unquote(value or "")


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = []
        self.hreflang = {}
        self.links = set()
        self.html_lang = None
        self.json_ld = []
        self._buffer = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.html_lang = attrs.get("lang")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(decoded(attrs.get("href")))
        if tag == "link" and attrs.get("hreflang"):
            self.hreflang[attrs["hreflang"]] = decoded(attrs.get("href"))
        if tag == "a" and attrs.get("href"):
            self.links.add(decoded(urllib.parse.urljoin(BASE, attrs["href"])))
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self._buffer = ""

    def handle_data(self, data):
        if self._buffer is not None:
            self._buffer += data

    def handle_endtag(self, tag):
        if tag == "script" and self._buffer is not None:
            try:
                self.json_ld.append(json.loads(self._buffer))
            except json.JSONDecodeError:
                pass
            self._buffer = None


def recipes(node):
    if isinstance(node, dict):
        if node.get("@type") == "Recipe":
            yield node
        for value in node.values():
            if isinstance(value, (dict, list)):
                yield from recipes(value)
    elif isinstance(node, list):
        for value in node:
            yield from recipes(value)


results = []
for lang, path in ROUTES:
    item = {"language": lang, "path": path, "errors": []}
    try:
        response = fetch(path)
        item["http"] = response["status"]
        page = Page()
        page.feed(response["body"])
        expected_url = BASE + path
        found_recipes = list(recipes(page.json_ld))
        item["canonical"] = page.canonical
        item["hreflang"] = page.hreflang
        item["html_lang"] = page.html_lang
        item["recipe_count"] = len(found_recipes)
        if response["status"] != 200:
            item["errors"].append("http_not_200")
        if page.canonical != [expected_url]:
            item["errors"].append("canonical_mismatch")
        if page.hreflang != EXPECTED:
            item["errors"].append("hreflang_mismatch")
        if page.html_lang != lang:
            item["errors"].append("html_language_mismatch")
        if len(found_recipes) != 1:
            item["errors"].append("recipe_schema_count")
        else:
            recipe = found_recipes[0]
            if decoded(recipe.get("url")) != expected_url:
                item["errors"].append("recipe_schema_url")
            if recipe.get("inLanguage") != lang:
                item["errors"].append("recipe_schema_language")
        expected_switcher = set(EXPECTED.values()) - {expected_url}
        missing_links = sorted(expected_switcher - page.links)
        item["missing_language_links"] = missing_links
        if missing_links:
            item["errors"].append("language_switcher_missing")
    except Exception as exc:
        item["errors"].append(str(exc))
    results.append(item)


extra = {"images": {}, "es_trailing_slash": None, "errors": []}
for name in IMAGES:
    path = "/recetas/tiramisu/%s.webp" % name
    try:
        r = fetch(path)
        extra["images"][name] = {"http": r["status"], "content_type": r["headers"].get("content-type")}
        if r["status"] != 200 or "image/webp" not in (r["headers"].get("content-type") or ""):
            extra["errors"].append("image_" + name)
    except Exception as exc:
        extra["errors"].append("image_%s_%s" % (name, exc))
try:
    r = fetch("/tiramisu/")
    extra["es_trailing_slash"] = {"http": r["status"], "location": r["headers"].get("location")}
except Exception as exc:
    extra["es_trailing_slash"] = str(exc)

sitemap = {"errors": []}
strict_sitemap = os.environ.get("STRICT_SITEMAP", "false").lower() == "true"
attempts = 12 if strict_sitemap else 1
response = None
entries = {}
for attempt in range(attempts):
    try:
        response = fetch("/sitemap.xml")
        root = ET.fromstring(response["body"])
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9", "x": "http://www.w3.org/1999/xhtml"}
        entries = {}
        for node in root.findall("s:url", ns):
            loc = decoded(node.findtext("s:loc", namespaces=ns))
            alts = {
                link.attrib["hreflang"]: decoded(link.attrib["href"])
                for link in node.findall("x:link", ns)
            }
            entries[loc] = alts
        missing_now = [url for url in EXPECTED.values() if url not in entries]
        bad_now = [url for url in EXPECTED.values() if url in entries and entries[url] != EXPECTED]
        if not missing_now and not bad_now:
            break
    except Exception:
        if attempt == attempts - 1:
            raise
    if strict_sitemap and attempt < attempts - 1:
        time.sleep(15)

try:
    if response is None:
        raise RuntimeError("sitemap_not_fetched")
    sitemap["http"] = response["status"]
    sitemap["entries"] = len(entries)
    sitemap["missing"] = [url for url in EXPECTED.values() if url not in entries]
    sitemap["bad_alternates"] = [
        url for url in EXPECTED.values()
        if url in entries and entries[url] != EXPECTED
    ]
    if response["status"] != 200:
        sitemap["errors"].append("sitemap_http")
    if sitemap["missing"]:
        sitemap["errors"].append("sitemap_missing_routes")
    if sitemap["bad_alternates"]:
        sitemap["errors"].append("sitemap_hreflang_mismatch")
    sitemap["strict"] = strict_sitemap
except Exception as exc:
    sitemap["errors"].append(str(exc))

summary = {
    "routes": len(results),
    "passed_routes": sum(not r["errors"] for r in results),
    "sitemap_passed": not sitemap["errors"],
}
summary["images_passed"] = not extra["errors"]
report = {"summary": summary, "results": results, "sitemap": sitemap, "extra": extra}
with open("tiramisu-preview-audit.json", "w") as f:
    json.dump(report, f, ensure_ascii=False, indent=2)
print("TIRAMISU_QA " + json.dumps(report, ensure_ascii=False))
sys.exit(0 if summary["passed_routes"] == 7 and summary["images_passed"] and (summary["sitemap_passed"] or not strict_sitemap) else 1)
