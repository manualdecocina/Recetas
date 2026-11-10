import concurrent.futures
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import time
from urllib.parse import quote, unquote
from urllib.request import Request, urlopen

BASE = 'https://manualdecocina.com'
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'editorial/pollo-relleno-navideno-20261110'
manifest = json.loads((DATA / 'media.json').read_text())
records = json.loads((DATA / 'recipe.json').read_text())['records']

def fetch(path):
    request = Request(BASE + quote(path, safe='/?=&:-%'), headers={'User-Agent': 'ManualDeCocina-RecipeQA/1.0', 'Cache-Control': 'no-cache'})
    with urlopen(request, timeout=40) as response:
        return response.status, response.read(), response.headers.get('Content-Type', '')

def asset(item):
    status, body, mime = fetch(item['url_path'])
    assert status == 200 and body[:4] == b'RIFF' and body[8:12] == b'WEBP', item['url_path']
    assert hashlib.sha256(body).hexdigest() == item['sha256'], item['url_path']
    return item['url_path']

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.steps = {}
        self.inside = None
        self.canonical = None
        self.alternates = {}
        self.jsonld = []
        self.script = None
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == 'li' and d.get('id', '').startswith('paso-'):
            self.inside = int(d['id'][5:]); self.steps[self.inside] = []
        if tag == 'img' and self.inside:
            self.steps[self.inside].append(unquote(d.get('src', '')))
        if tag == 'link' and d.get('rel') == 'canonical': self.canonical = d.get('href')
        if tag == 'link' and d.get('hreflang'): self.alternates[d['hreflang']] = unquote(d.get('href', ''))
        if tag == 'script' and d.get('type') == 'application/ld+json': self.script = ''
    def handle_endtag(self, tag):
        if tag == 'li': self.inside = None
        if tag == 'script' and self.script is not None:
            self.jsonld.append(json.loads(self.script)); self.script = None
    def handle_data(self, data):
        if self.script is not None: self.script += data

def find_recipe(value):
    if isinstance(value, dict):
        if value.get('@type') == 'Recipe': return value
        for child in value.values():
            found = find_recipe(child)
            if found: return found
    if isinstance(value, list):
        for child in value:
            found = find_recipe(child)
            if found: return found

def page(row):
    status, body, mime = fetch(row['public_path'])
    p = Page(); p.feed(body.decode())
    assert status == 200 and unquote(p.canonical or '') == BASE + row['public_path'], row['language']
    assert len(p.steps) == 10, (row['language'], p.steps)
    for i, step in enumerate(row['steps'], 1):
        assert any(unquote(step['image_url']).removeprefix(BASE) in src for src in p.steps[i]), (row['language'], i, p.steps[i])
    assert all(lang in p.alternates for lang in ['es','de','en','fr','it','ja','pt-BR']), p.alternates
    schema = find_recipe(p.jsonld)
    assert schema and schema.get('nutrition') and len(schema.get('recipeInstructions', [])) == 10
    assert len(schema.get('recipeIngredient', [])) == 17
    return {'language': row['language'], 'status': status, 'visible_step_photos': 10, 'canonical': p.canonical, 'hreflang': len(p.alternates), 'recipe_schema': True}

if __name__ == '__main__':
    # Wait for the existing GitHub-to-Hostinger deployment to expose the new bytes.
    for attempt in range(18):
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
                assets = list(pool.map(asset, manifest['assets']))
            break
        except Exception as exc:
            print('Deployment pending:', type(exc).__name__, str(exc)[:150], flush=True)
            if attempt == 17: raise
            time.sleep(25)
    secret = os.getenv('REVALIDATE_SECRET', '').strip()
    for attempt in range(8):
        if secret:
            request = Request(BASE + '/api/revalidate', data=b'{}', headers={'x-revalidate-secret':secret, 'Content-Type':'application/json'})
            with urlopen(request, timeout=40) as response:
                assert json.load(response).get('revalidated') is True
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
                pages = list(pool.map(page, records))
            break
        except AssertionError as exc:
            print('Publication pending:', str(exc)[:150], flush=True)
            if attempt == 7: raise
            time.sleep(15)
    _, sitemap, _ = fetch('/sitemap.xml')
    assert b'pollo-relleno-navideno' in sitemap
    _, catalogue, _ = fetch('/es/recetas?q=pollo%20relleno')
    assert b'pollo-relleno-navideno' in catalogue
    result = {'assets': assets, 'pages': pages, 'sitemap': True, 'catalogue': True}
    Path('pollo-relleno-final-qa.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(result, ensure_ascii=False, indent=2))
