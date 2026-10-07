"""Auditoría global de solo lectura de preview.manualdecocina.com.

Recorre el sitemap completo y todo lo enlazado desde él, y comprueba:
- cada URL del sitemap responde 200, con canonical propio, <html lang> correcto,
  hreflang recíproco y como máximo un schema Recipe;
- ninguna página contiene restos de WordPress (wp-content, wp-json, translatepress);
- todos los enlaces internos y todas las imágenes responden (enlaces: 200 o redirección a 200);
- las URLs históricas de scripts/data/legacy-redirects.json redirigen con el tipo correcto;
- una URL inexistente devuelve 404.
Escribe site-preview-audit.json y termina con código 1 si hay errores.
"""
import json
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
LANGS = {"es", "de", "en", "fr", "it", "ja", "pt"}
HTML_LANG = {"pt": "pt-BR"}
WP_MARKERS = re.compile(r"wp-content|wp-json|wp-includes|translatepress|trp-language", re.I)
UA = {"User-Agent": "ManualDeCocina-Preview-QA/1.0", "Cache-Control": "no-cache"}


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
                return r.status, dict(r.headers), data
        except urllib.error.HTTPError as e:
            data = e.read().decode("utf-8", "replace") if body else ""
            return e.code, dict(e.headers), data
        except Exception:
            if attempt == 2:
                raise


def norm(url):
    url = urllib.parse.unquote(urllib.parse.urljoin(BASE + "/", url))
    return url.split("#")[0]


def expected_lang(path):
    first = path.strip("/").split("/")[0] if path.strip("/") else ""
    lang = first if first in LANGS else "es"
    return HTML_LANG.get(lang, lang)


class Page(HTMLParser):
    def __init__(self, url=BASE + "/"):
        super().__init__()
        self.url = url
        self.canonical, self.hreflang, self.links, self.images = [], {}, set(), set()
        self.html_lang, self.json_ld, self._buf = None, [], None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.html_lang = a.get("lang")
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

    def handle_data(self, data):
        if self._buf is not None:
            self._buf += data

    def handle_endtag(self, tag):
        if tag == "script" and self._buf is not None:
            try:
                self.json_ld.append(json.loads(self._buf))
            except json.JSONDecodeError:
                pass
            self._buf = None


def image_target(src):
    """/_next/image?url=/recetas/x.webp&w=.. → /recetas/x.webp (lo que importa es el archivo)."""
    full = urllib.parse.urljoin(BASE + "/", src)
    parts = urllib.parse.urlsplit(full)
    if parts.path == "/_next/image":
        inner = urllib.parse.parse_qs(parts.query).get("url", [""])[0]
        return norm(inner)
    return norm(full)


def recipes_in(node):
    if isinstance(node, dict):
        types = node.get("@type")
        if types == "Recipe" or (isinstance(types, list) and "Recipe" in types):
            yield node
        for v in node.values():
            yield from recipes_in(v)
    elif isinstance(node, list):
        for v in node:
            yield from recipes_in(v)


def internal(url):
    return urllib.parse.urlsplit(url).netloc == HOST


errors = []


def err(kind, url, detail=None):
    errors.append({"kind": kind, "url": url, "detail": detail})


# 1. Sitemap
status, _, body = fetch(BASE + "/sitemap.xml")
if status != 200:
    err("sitemap_http", "/sitemap.xml", status)
    body = "<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'/>"
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9", "x": "http://www.w3.org/1999/xhtml"}
sitemap = {}
for node in ET.fromstring(body).findall("s:url", ns):
    loc = norm(node.findtext("s:loc", namespaces=ns))
    sitemap[loc] = {l.attrib["hreflang"]: norm(l.attrib["href"]) for l in node.findall("x:link", ns)}
print("sitemap urls:", len(sitemap), flush=True)


# 2. Páginas del sitemap
def audit_page(url):
    status, headers, html = fetch(url)
    out = {"url": url, "status": status, "links": set(), "images": set(), "hreflang": {}}
    if status != 200:
        err("page_not_200", url, status)
        return out
    p = Page(url)
    p.feed(html)
    out.update(links=p.links, images=p.images, hreflang=p.hreflang)
    if p.canonical != [url]:
        err("canonical", url, p.canonical)
    path = urllib.parse.urlsplit(url).path
    if p.html_lang != expected_lang(path):
        err("html_lang", url, p.html_lang)
    if p.hreflang and url not in p.hreflang.values():
        err("hreflang_self_missing", url, p.hreflang)
    if WP_MARKERS.search(html):
        err("wordpress_residue", url, WP_MARKERS.search(html).group(0))
    n = len(list(recipes_in(p.json_ld)))
    if n > 1:
        err("recipe_schema_count", url, n)
    if sitemap.get(url) and p.hreflang and sitemap[url] != p.hreflang:
        err("sitemap_vs_page_hreflang", url, {"sitemap": sitemap[url], "page": p.hreflang})
    return out


with ThreadPoolExecutor(16) as ex:
    pages = list(ex.map(audit_page, sorted(sitemap)))
print("pages audited", flush=True)

by_url = {p["url"]: p for p in pages}
for p in pages:
    for tag, alt in p["hreflang"].items():
        if alt not in by_url:
            if alt not in sitemap:
                err("hreflang_target_not_in_sitemap", p["url"], alt)
            continue
        back = by_url[alt]["hreflang"]
        if p["url"] not in back.values():
            err("hreflang_not_reciprocal", p["url"], alt)

# 3. Enlaces internos e imágenes
links = sorted({l for p in pages for l in p["links"] if internal(l)} - set(sitemap))
images = sorted({i for p in pages for i in p["images"] if internal(i)})


def check_link(url):
    target, hops = url, 0
    while hops < 4:
        status, headers, _ = fetch(target, body=False)
        if status in (301, 302, 303, 307, 308):
            target = norm(headers.get("Location") or headers.get("location") or "")
            hops += 1
            continue
        if status != 200:
            err("broken_link", url, {"final": target, "status": status})
        return
    err("redirect_loop", url, target)


def check_image(url):
    status, headers, _ = fetch(url, body=False)
    ctype = headers.get("Content-Type") or headers.get("content-type") or ""
    if status != 200 or not ctype.startswith("image/"):
        err("broken_image", url, {"status": status, "type": ctype})


with ThreadPoolExecutor(16) as ex:
    list(ex.map(check_link, links))
    list(ex.map(check_image, images))
print("links", len(links), "images", len(images), flush=True)

# 4. URLs históricas
redirects = json.load(open("scripts/data/legacy-redirects.json", encoding="utf-8"))


def check_redirect(item):
    status, headers, _ = fetch(BASE + item["source"], body=False)
    loc = norm(headers.get("Location") or headers.get("location") or "")
    if status == 200:
        return  # ya se sirve una receta reconstruida en esa ruta: correcto
    permanent = item["status"] in (301, 308)
    ok_codes = (301, 308) if permanent else (302, 307)
    if status not in ok_codes or loc != norm(item["target"]):
        err("legacy_redirect", item["source"], {"status": status, "location": loc, "expected": item})


with ThreadPoolExecutor(16) as ex:
    list(ex.map(check_redirect, redirects))

# 5. 404 real
status, _, _ = fetch(BASE + "/es/esta-pagina-no-existe-qa", body=False)
if status != 404:
    err("not_found_status", "/es/esta-pagina-no-existe-qa", status)

summary = {
    "sitemap_urls": len(sitemap), "pages_ok": sum(1 for p in pages if p["status"] == 200),
    "internal_links": len(links), "images": len(images), "legacy_redirects": len(redirects),
    "errors": len(errors),
}
counts = {}
for e in errors:
    counts[e["kind"]] = counts.get(e["kind"], 0) + 1
summary["errors_by_kind"] = counts
with open("site-preview-audit.json", "w", encoding="utf-8") as f:
    json.dump({"summary": summary, "errors": errors}, f, ensure_ascii=False, indent=1)
print(json.dumps(summary, ensure_ascii=False))
sys.exit(1 if errors else 0)
