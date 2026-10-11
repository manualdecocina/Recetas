"""Postpublication audit for the priority recipe Hojuelas colombianas."""
import concurrent.futures
import datetime
import json
import pathlib
import re
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = "https://manualdecocina.com"
PACKAGE = ROOT / "editorial/hojuelas-colombianas-20261011.json"


def norm(value):
    return re.sub(r"\s+", " ", str(value)).strip()


def absolute(value):
    return urllib.parse.unquote(urllib.parse.urljoin(BASE + "/", value)).split("#")[0]


def schema_nodes(value, kind):
    if isinstance(value, dict):
        if value.get("@type") == kind:
            yield value
        for child in value.values():
            yield from schema_nodes(child, kind)
    elif isinstance(value, list):
        for child in value:
            yield from schema_nodes(child, kind)


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.h1 = []
        self.capture_h1 = False
        self.skip = 0
        self.ld_buffer = None
        self.ld = []
        self.canonical = []
        self.hreflang = {}
        self.images = set()
        self.meta = {}
        self.lang = None
        self.steps = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("script", "style"):
            self.skip += 1
            if tag == "script" and attrs.get("type") == "application/ld+json":
                self.ld_buffer = ""
        if tag == "html":
            self.lang = attrs.get("lang")
        if tag == "h1":
            self.capture_h1 = True
        if tag == "meta":
            key = attrs.get("property") or attrs.get("name")
            if key:
                self.meta[key] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(absolute(attrs.get("href", "")))
        if tag == "link" and attrs.get("hreflang"):
            self.hreflang[attrs["hreflang"]] = absolute(attrs.get("href", ""))
        if tag == "li" and "md-step-item" in attrs.get("class", ""):
            self.steps += 1
        if tag in ("img", "source"):
            for key in ("src", "srcset"):
                for part in attrs.get(key, "").split(","):
                    src = part.strip().split(" ")[0]
                    if not src:
                        continue
                    parsed = urllib.parse.urlsplit(src)
                    if parsed.path == "/_next/image":
                        src = urllib.parse.parse_qs(parsed.query).get("url", [""])[0]
                    self.images.add(absolute(src))

    def handle_endtag(self, tag):
        if tag == "script" and self.ld_buffer is not None:
            self.ld.append(json.loads(self.ld_buffer))
            self.ld_buffer = None
        if tag in ("script", "style"):
            self.skip = max(0, self.skip - 1)
        if tag == "h1":
            self.capture_h1 = False

    def handle_data(self, data):
        if self.ld_buffer is not None:
            self.ld_buffer += data
        if not self.skip:
            self.text.append(data)
        if self.capture_h1:
            self.h1.append(data)


def fetch(url):
    encoded = urllib.parse.quote(url, safe=":/%?=&")
    request = urllib.request.Request(
        encoded,
        headers={"Cache-Control": "no-cache", "User-Agent": "ManualDeCocina-Priority-QA"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.status, absolute(response.url), response.read()


package = json.loads(PACKAGE.read_text())
records = package["records"]
alternates = {
    ("pt-BR" if record["language"] == "pt" else record["language"]): BASE + record["public_path"]
    for record in records
}


def check(record):
    address = BASE + record["public_path"]
    errors = []
    try:
        status, final, raw = fetch(address)
        page = Page()
        page.feed(raw.decode("utf-8"))
        visible = norm(" ".join(page.text))
        recipes = list(schema_nodes(page.ld, "Recipe"))
        faqs = list(schema_nodes(page.ld, "FAQPage"))
        crumbs = list(schema_nodes(page.ld, "BreadcrumbList"))
        if status != 200 or final != address:
            errors.append("HTTP 200/final URL")
        if page.canonical != [address]:
            errors.append("canonical")
        if page.hreflang != alternates:
            errors.append("reciprocal hreflang or x-default")
        expected_lang = "pt-BR" if record["language"] == "pt" else record["language"]
        if page.lang != expected_lang:
            errors.append("html lang")
        if norm(" ".join(page.h1)) != norm(record["title"]):
            errors.append("visible title")
        if len(recipes) != 1 or len(faqs) != 1 or not crumbs:
            errors.append("Recipe/FAQPage/BreadcrumbList")
        if page.steps != 8:
            errors.append("eight visible steps")
        for label, values in (
            ("ingredient", [item["name"] for item in record["ingredients"]]),
            ("step", [step["content"] for step in record["steps"]]),
            ("FAQ", [faq[key] for faq in record["seo"]["faq"] for key in ("q", "a")]),
        ):
            for value in values:
                if norm(value) not in visible:
                    errors.append("missing visible " + label)
        expected_images = {absolute(record["image_url"]), *(absolute(step["image_url"]) for step in record["steps"])}
        if not expected_images <= page.images:
            errors.append("visible recipe/step images")
        if absolute(page.meta.get("og:url", "")) != address or not page.meta.get("og:image"):
            errors.append("Open Graph")
        if recipes and recipes[0].get("aggregateRating") is not None:
            errors.append("unexpected AggregateRating")
        if faqs and len(faqs[0].get("mainEntity", [])) != 5:
            errors.append("FAQPage count")
        return {"url": address, "language": record["language"], "http": status, "ok": not errors, "errors": errors}
    except Exception as error:
        return {"url": address, "language": record["language"], "ok": False, "errors": [str(error)]}


with concurrent.futures.ThreadPoolExecutor(max_workers=7) as pool:
    rows = list(pool.map(check, records))

for attempt in range(20):
    _, _, sitemap_raw = fetch(BASE + "/sitemap.xml")
    sitemap = ET.fromstring(sitemap_raw)
    found = {urllib.parse.unquote(node.text or "") for node in sitemap.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")}
    missing_sitemap = sorted(set(alternates.values()) - found)
    surface_checks = {}
    for path in ("/es", "/es/recetas"):
        status, final, raw = fetch(BASE + path)
        text = raw.decode("utf-8")
        surface_checks[path] = {
            "http": status,
            "final": final,
            "contains_es_path": "/hojuelas-colombianas" in text,
        }
    if not missing_sitemap and all(item["http"] == 200 and item["contains_es_path"] for item in surface_checks.values()):
        break
    time.sleep(10)

report = {
    "checked_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "recipe_group_id": package["recipe_group_id"],
    "pages": len(rows),
    "passed": sum(row["ok"] for row in rows),
    "missing_sitemap": missing_sitemap,
    "surfaces": surface_checks,
    "results": rows,
}
(ROOT / "priority-hojuelas-published-audit.json").write_text(
    json.dumps(report, ensure_ascii=False, indent=2) + "\n"
)
print(json.dumps(report, ensure_ascii=False))
surfaces_ok = all(item["http"] == 200 and item["contains_es_path"] for item in surface_checks.values())
raise SystemExit(0 if len(rows) == 7 and report["passed"] == 7 and not missing_sitemap and surfaces_ok else 1)
