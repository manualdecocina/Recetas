"""Auditoría global de solo lectura de preview.manualdecocina.com.

Recorre todas las URLs del sitemap y todo lo enlazado desde ellas y escribe
site-preview-audit.json con:
- report: una fila por URL del sitemap (status, canonical, robots, googlebot, lang,
  title, meta description, H1, hreflang, x-default, Recipe/BreadcrumbList,
  errores JSON-LD, enlaces internos entrantes);
- summary: conteos por status, recetas con Recipe válido, BreadcrumbList válidos,
  estado de hreflang por idioma, sitemap, robots;
- errors: lista de problemas (el proceso termina con código 1 si hay alguno).

Comprueba además: imágenes y enlaces internos, URLs históricas de
scripts/data/legacy-redirects.json, robots.txt bloqueado y un 404 real.
"""
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser

BASE = "https://preview.manualdecocina.com"
HOST = urllib.parse.urlsplit(BASE).netloc
LANGS = ["es", "de", "en", "fr", "it", "ja", "pt"]
HTML_LANG = {"pt": "pt-BR"}
HREFLANG_TAGS = {"es", "de", "en", "fr", "it", "ja", "pt-BR", "x-default"}
WP_MARKERS = re.compile(r"wp-content|wp-json|wp-includes|translatepress|trp-language", re.I)
ISO_DURATION = re.compile(r"^P(T(\d+H)?(\d+M)?(\d+S)?)$")
UA = {"User-Agent": "ManualDeCocina-Preview-QA/1.0", "Cache-Control": "no-cache"}
EXPECTED_ES_RECIPES = int(os.environ.get("EXPECTED_ES_RECIPES", "99"))
EXPECTED_CATEGORIES = 11


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


OPENER = urllib.request.build_opener(NoRedirect)


def quote(url):
    parts = urllib.parse.urlsplit(url)
    path = urllib.parse.quote(urllib.parse.unquote(parts.path), safe="/%")
    return urllib.parse.urlunsplit((parts.scheme or "https", parts.netloc or HOST, path, parts.query, ""))


def fetch(url, body=True, method="GET"):
    req = urllib.request.Request(quote(url), headers=UA, method=method)
    for attempt in range(3):
        try:
            with OPENER.open(req, timeout=40) as r:
                data = r.read().decode("utf-8", "replace") if body else ""
                return r.status, {k.lower(): v for k, v in r.headers.items()}, data
        except urllib.error.HTTPError as e:
            data = e.read().decode("utf-8", "replace") if body else ""
            return e.code, {k.lower(): v for k, v in e.headers.items()}, data
        except Exception:
            if attempt == 2:
                raise


def norm(url):
    url = urllib.parse.unquote(urllib.parse.urljoin(BASE + "/", url))
    return url.split("#")[0]


def path_lang(path):
    first = path.strip("/").split("/")[0] if path.strip("/") else ""
    return first if first in LANGS else "es"


def expected_lang(path):
    lang = path_lang(path)
    return HTML_LANG.get(lang, lang)


class Page(HTMLParser):
    def __init__(self, url):
        super().__init__()
        self.url = url
        self.canonical, self.hreflang, self.links, self.images = [], {}, set(), set()
        self.html_lang, self.json_ld, self.json_ld_errors = None, [], []
        self.robots = self.googlebot = self.description = None
        self.title, self.h1 = "", []
        self.crumbs, self.steps = [], 0
        self._buf = self._text_target = None
        self._crumb_depth = 0
        self._crumb_text = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.html_lang = a.get("lang")
        elif tag == "meta" and a.get("name") in ("robots", "googlebot", "description"):
            setattr(self, {"robots": "robots", "googlebot": "googlebot", "description": "description"}[a["name"]], a.get("content"))
        elif tag == "link" and a.get("rel") == "canonical":
            self.canonical.append(norm(a.get("href", "")))
        elif tag == "link" and a.get("hreflang"):
            self.hreflang[a["hreflang"]] = norm(a.get("href", ""))
        elif tag == "a" and a.get("href"):
            self.links.add(norm(urllib.parse.urljoin(self.url, a["href"])))
        elif tag in ("img", "source"):
            for key in ("src", "srcset"):
                for part in (a.get(key) or "").split(","):
                    src = part.strip().split(" ")[0]
                    if src:
                        self.images.add(image_target(src))
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._buf = ""
        elif tag == "title":
            self._text_target = "title"
        elif tag == "h1":
            self.h1.append("")
            self._text_target = "h1"
        elif tag == "li" and "md-step-item" in (a.get("class") or ""):
            self.steps += 1
        if tag == "nav" and "md-crumbs" in (a.get("class") or ""):
            self._crumb_depth = 1
        elif self._crumb_depth and tag in ("a", "span") and (tag == "a" or a.get("aria-current") == "page"):
            self._crumb_text = ""

    def handle_data(self, data):
        if self._buf is not None:
            self._buf += data
        if self._text_target == "title":
            self.title += data
        elif self._text_target == "h1":
            self.h1[-1] += data
        if self._crumb_text is not None:
            self._crumb_text += data

    def handle_endtag(self, tag):
        if tag == "script" and self._buf is not None:
            try:
                self.json_ld.append(json.loads(self._buf))
            except json.JSONDecodeError as exc:
                self.json_ld_errors.append(str(exc))
            self._buf = None
        if tag in ("title", "h1"):
            self._text_target = None
        if self._crumb_text is not None and tag in ("a", "span"):
            self.crumbs.append(self._crumb_text.strip())
            self._crumb_text = None
        if tag == "nav" and self._crumb_depth:
            self._crumb_depth = 0


def image_target(src):
    """/_next/image?url=/recetas/x.webp&w=.. → /recetas/x.webp (lo que importa es el archivo)."""
    full = urllib.parse.urljoin(BASE + "/", src)
    parts = urllib.parse.urlsplit(full)
    if parts.path == "/_next/image":
        inner = urllib.parse.parse_qs(parts.query).get("url", [""])[0]
        return norm(inner)
    return norm(full)


def nodes_of(node, kind):
    if isinstance(node, dict):
        types = node.get("@type")
        if types == kind or (isinstance(types, list) and kind in types):
            yield node
        for v in node.values():
            yield from nodes_of(v, kind)
    elif isinstance(node, list):
        for v in node:
            yield from nodes_of(v, kind)


def internal(url):
    return urllib.parse.urlsplit(url).netloc == HOST


errors = []


def err(kind, url, detail=None):
    errors.append({"kind": kind, "url": url, "detail": detail})


def validate_recipe(url, r, visible_steps):
    problems = []
    for key in ("name", "description", "image", "author", "datePublished", "dateModified",
                "recipeIngredient", "recipeInstructions", "recipeYield", "recipeCategory", "nutrition", "totalTime"):
        if r.get(key) in (None, "", []):
            problems.append("missing_" + key)
    for key in ("prepTime", "cookTime", "totalTime"):
        if r.get(key) is not None and not ISO_DURATION.match(str(r[key])):
            problems.append("bad_" + key)
    if r.get("datePublished") and r.get("dateModified") and r["dateModified"] < r["datePublished"]:
        problems.append("dateModified_before_datePublished")
    steps = r.get("recipeInstructions") or []
    if any(not isinstance(s, dict) or s.get("@type") != "HowToStep" or not s.get("text") for s in steps):
        problems.append("instruction_not_HowToStep")
    if visible_steps and len(steps) != visible_steps:
        problems.append("instructions_%d_vs_visible_%d" % (len(steps), visible_steps))
    if r.get("recipeCuisine") and r.get("recipeCuisine") == r.get("recipeCategory"):
        problems.append("cuisine_equals_category")
    imgs = r.get("image") or []
    imgs = imgs if isinstance(imgs, list) else [imgs]
    if any("/_next/image" in str(i) for i in imgs):
        problems.append("image_uses_next_optimizer")
    for p in problems:
        err("recipe_schema", url, p)
    return not problems, [str(i) for i in imgs]


def validate_breadcrumb(url, b, visible):
    items = b.get("itemListElement") or []
    problems = []
    for i, it in enumerate(items, 1):
        if it.get("position") != i or not it.get("name") or not it.get("item"):
            problems.append("bad_list_item_%d" % i)
    names = [it.get("name") for it in items]
    if visible and names != visible:
        problems.append({"jsonld": names, "visible": visible})
    for p in problems:
        err("breadcrumb_schema", url, p)
    return not problems, [norm(it.get("item", "")) for it in items]


# 1. robots.txt y sitemap
status, _, robots_txt = fetch(BASE + "/robots.txt")
robots_blocked = status == 200 and re.search(r"User-agent:\s*\*\s*\n\s*Disallow:\s*/\s*$", robots_txt, re.I | re.M) is not None
if not robots_blocked:
    err("robots_txt_not_blocking", "/robots.txt", robots_txt[:200])

status, _, body = fetch(BASE + "/sitemap.xml")
if status != 200:
    err("sitemap_http", "/sitemap.xml", status)
    body = "<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'/>"
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9", "x": "http://www.w3.org/1999/xhtml"}
sitemap = {}
for node in ET.fromstring(body).findall("s:url", ns):
    loc = norm(node.findtext("s:loc", namespaces=ns))
    if loc in sitemap:
        err("sitemap_duplicate", loc)
    sitemap[loc] = {l.attrib["hreflang"]: norm(l.attrib["href"]) for l in node.findall("x:link", ns)}
    if not loc.startswith(BASE + "/"):
        err("sitemap_wrong_host", loc)
print("sitemap urls:", len(sitemap), flush=True)


# 2. Páginas del sitemap
def audit_page(url):
    status, headers, html = fetch(url)
    row = {"url": url, "status": status, "location": headers.get("location"), "links": set(), "images": set(), "hreflang": {}}
    if status != 200:
        err("sitemap_url_not_200", url, {"status": status, "location": headers.get("location")})
        return row
    p = Page(url)
    p.feed(html)
    path = urllib.parse.urlsplit(url).path
    recipes = list(nodes_of(p.json_ld, "Recipe"))
    crumbs = list(nodes_of(p.json_ld, "BreadcrumbList"))
    row.update(
        links=p.links, images=p.images, hreflang=p.hreflang, canonical=p.canonical,
        robots=p.robots, googlebot=p.googlebot, x_robots=headers.get("x-robots-tag"), lang=p.html_lang,
        title=p.title.strip(), description=p.description, h1=[h.strip() for h in p.h1],
        x_default=p.hreflang.get("x-default"), recipe_schema=len(recipes), breadcrumb_schema=len(crumbs),
        json_ld_errors=p.json_ld_errors, recipe_valid=None, breadcrumb_valid=None,
        recipe_language=recipes[0].get("inLanguage") if recipes else None,
    )
    if p.canonical != [url]:
        err("canonical", url, p.canonical)
    if p.html_lang != expected_lang(path):
        err("html_lang", url, p.html_lang)
    if "noindex" not in (p.robots or "") or "nofollow" not in (p.robots or ""):
        err("meta_robots_not_noindex", url, p.robots)
    if "noindex" not in (p.googlebot or "") or "nofollow" not in (p.googlebot or ""):
        err("meta_googlebot_not_noindex", url, p.googlebot)
    if not row["title"]:
        err("missing_title", url)
    if not p.description:
        err("missing_meta_description", url)
    if len(p.h1) != 1:
        err("h1_count", url, len(p.h1))
    if p.json_ld_errors:
        err("json_ld_parse", url, p.json_ld_errors)
    if p.hreflang:
        if url not in p.hreflang.values():
            err("hreflang_self_missing", url, p.hreflang)
        unknown = set(p.hreflang) - HREFLANG_TAGS
        if unknown:
            err("hreflang_unknown_tag", url, sorted(unknown))
        es = p.hreflang.get("es")
        if es and p.hreflang.get("x-default") != es:
            err("x_default_policy", url, {"x-default": p.hreflang.get("x-default"), "es": es})
    if WP_MARKERS.search(html):
        err("wordpress_residue", url, WP_MARKERS.search(html).group(0))
    if len(recipes) > 1:
        err("recipe_schema_count", url, len(recipes))
    if recipes:
        row["recipe_valid"], row["recipe_images"] = validate_recipe(url, recipes[0], p.steps)
    if len(crumbs) > 1:
        err("breadcrumb_schema_count", url, len(crumbs))
    if crumbs:
        row["breadcrumb_valid"], row["breadcrumb_items"] = validate_breadcrumb(url, crumbs[0], p.crumbs)
    elif p.crumbs:
        err("visible_breadcrumb_without_schema", url, p.crumbs)
    if sitemap.get(url) and p.hreflang and sitemap[url] != p.hreflang:
        err("sitemap_vs_page_hreflang", url, {"sitemap": sitemap[url], "page": p.hreflang})
    if sitemap.get(url) and not p.hreflang:
        err("sitemap_hreflang_but_page_none", url)
    return row


with ThreadPoolExecutor(16) as ex:
    pages = list(ex.map(audit_page, sorted(sitemap)))
print("pages audited", flush=True)

by_url = {p["url"]: p for p in pages}
for p in pages:
    for tag, alt in p["hreflang"].items():
        if tag == "x-default":
            continue
        if alt not in by_url:
            err("hreflang_target_not_in_sitemap", p["url"], alt)
            continue
        if by_url[alt]["status"] != 200:
            err("hreflang_target_not_200", p["url"], alt)
            continue
        back = by_url[alt]["hreflang"]
        if p["url"] not in back.values():
            err("hreflang_not_reciprocal", p["url"], alt)

# Enlaces internos entrantes (páginas huérfanas dentro del sitemap)
inbound = {u: 0 for u in sitemap}
for p in pages:
    for l in p["links"]:
        if l in inbound and l != p["url"]:
            inbound[l] += 1
for p in pages:
    p["inbound_links"] = inbound.get(p["url"], 0)
orphans = [u for u, n in inbound.items() if n == 0]
for u in orphans:
    err("no_internal_inbound_links", u)

# 3. Enlaces internos e imágenes
links = sorted({l for p in pages for l in p["links"] if internal(l)} - set(sitemap))
images = sorted({i for p in pages for i in p["images"] if internal(i)}
                | {norm(i) for p in pages for i in p.get("recipe_images", []) if internal(norm(i))})
link_status = {}


def check_link(url):
    target, hops = url, 0
    first = None
    while hops < 4:
        status, headers, _ = fetch(target, body=False)
        first = first or status
        if status in (301, 302, 303, 307, 308):
            target = norm(headers.get("location") or "")
            hops += 1
            continue
        link_status[url] = {"first": first, "final": status, "target": target}
        if status != 200:
            err("broken_link", url, {"final": target, "status": status})
        return
    err("redirect_loop", url, target)


def check_image(url):
    status, headers, _ = fetch(url, body=False)
    ctype = headers.get("content-type") or ""
    if status != 200 or not ctype.startswith("image/"):
        err("broken_image", url, {"status": status, "type": ctype})


with ThreadPoolExecutor(16) as ex:
    list(ex.map(check_link, links))
    list(ex.map(check_image, images))
print("links", len(links), "images", len(images), flush=True)

# 4. URLs históricas
redirects = json.load(open("scripts/data/legacy-redirects.json", encoding="utf-8"))
redirect_status = {}


def check_redirect(item):
    status, headers, _ = fetch(BASE + item["source"], body=False)
    loc = norm(headers.get("location") or "")
    redirect_status[item["source"]] = status
    if status == 200:
        return  # ya se sirve una receta reconstruida en esa ruta: correcto
    permanent = item["status"] in (301, 308)
    ok_codes = (301, 308) if permanent else (302, 307)
    if status not in ok_codes or loc != norm(item["target"]):
        err("legacy_redirect", item["source"], {"status": status, "location": loc, "expected": item})


with ThreadPoolExecutor(16) as ex:
    list(ex.map(check_redirect, redirects))

# 5. 404 real
status_404, _, _ = fetch(BASE + "/es/esta-pagina-no-existe-qa", body=False)
if status_404 != 404:
    err("not_found_status", "/es/esta-pagina-no-existe-qa", status_404)

# 6. Resumen
def bucket(code):
    if code == 200:
        return "200"
    if 300 <= code < 400:
        return "3xx"
    if code in (403, 404):
        return str(code)
    if code >= 500:
        return "5xx"
    return "other"


status_counts = {"200": 0, "3xx": 0, "404": 0, "403": 0, "5xx": 0, "other": 0}
for p in pages:
    status_counts[bucket(p["status"])] += 1
link_counts = {"200": 0, "3xx": 0, "404": 0, "403": 0, "5xx": 0, "other": 0}
for v in link_status.values():
    link_counts["3xx" if v["first"] in (301, 302, 303, 307, 308) else bucket(v["final"])] += 1

recipe_pages = [p for p in pages if p.get("recipe_schema")]
es_recipes = [p for p in recipe_pages if p.get("recipe_language") == "es"]
if len(es_recipes) != EXPECTED_ES_RECIPES:
    err("es_recipe_count", "/sitemap.xml", len(es_recipes))
category_pages = [u for u in sitemap if re.search(r"/es/categorias/[^/]+$", u)]
if len(category_pages) != EXPECTED_CATEGORIES:
    err("es_category_count", "/sitemap.xml", len(category_pages))

hreflang_by_lang = {}
for lang in LANGS:
    group = [p for p in pages if p["status"] == 200 and path_lang(urllib.parse.urlsplit(p["url"]).path) == lang]
    with_h = [p for p in group if p["hreflang"]]
    lang_errors = sum(1 for e in errors if e["kind"].startswith(("hreflang", "x_default", "sitemap_vs_page")) and isinstance(e["url"], str)
                      and path_lang(urllib.parse.urlsplit(e["url"]).path) == lang)
    hreflang_by_lang[HTML_LANG.get(lang, lang)] = {"pages": len(group), "with_hreflang": len(with_h),
                                                  "with_x_default": sum(1 for p in with_h if p.get("x_default")), "errors": lang_errors}

summary = {
    "sitemap_urls": len(sitemap),
    "status": status_counts,
    "internal_links_outside_sitemap": len(links),
    "internal_link_status": link_counts,
    "images": len(images),
    "legacy_redirects": len(redirects),
    "legacy_redirect_status": {str(k): sum(1 for v in redirect_status.values() if v == k) for k in sorted(set(redirect_status.values()))},
    "recipe_pages": len(recipe_pages),
    "recipe_schema_valid": sum(1 for p in recipe_pages if p.get("recipe_valid")),
    "es_recipes": len(es_recipes),
    "breadcrumb_pages": sum(1 for p in pages if p.get("breadcrumb_schema")),
    "breadcrumb_valid": sum(1 for p in pages if p.get("breadcrumb_valid")),
    "hreflang_by_language": hreflang_by_lang,
    "orphan_pages": len(orphans),
    "robots_txt_blocked": robots_blocked,
    "pages_noindex_nofollow": sum(1 for p in pages if "noindex" in (p.get("robots") or "") and "noindex" in (p.get("googlebot") or "")),
    "not_found_probe": status_404,
    "errors": len(errors),
}
counts = {}
for e in errors:
    counts[e["kind"]] = counts.get(e["kind"], 0) + 1
summary["errors_by_kind"] = counts

report = []
for p in pages:
    report.append({k: (sorted(v) if isinstance(v, set) else v) for k, v in p.items() if k not in ("links", "images", "recipe_images")})
with open("site-preview-audit.json", "w", encoding="utf-8") as f:
    json.dump({"summary": summary, "errors": errors, "report": report}, f, ensure_ascii=False, indent=1)
print(json.dumps(summary, ensure_ascii=False))
sys.exit(1 if errors else 0)
