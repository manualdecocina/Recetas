"""Read-only post-deployment checks for the November site quality repairs."""
import concurrent.futures
import datetime
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

BASE = os.environ.get('AUDIT_BASE', 'https://manualdecocina.com').rstrip('/')
CANONICAL_BASE = os.environ.get('QUALITY_CANONICAL_BASE', BASE).rstrip('/')
ROOT = Path(__file__).resolve().parents[1]
PATCHES = json.loads((ROOT / 'editorial/quality-audit-20261103/patches.json').read_text())
LANGS = ['es', 'en', 'de', 'fr', 'it', 'ja', 'pt']
GARLIC = dict(zip(LANGS, ['Ajo', 'Garlic', 'Knoblauch', 'Ail', 'Aglio', 'にんにく', 'Alho']))

class Page(HTMLParser):
    def __init__(self, body):
        super().__init__(convert_charrefs=True)
        self.text = []
        self.ld = []
        self.cards = set()
        self.robots = {}
        self.canonical = None
        self.styles = []
        self.select = None
        self.option = None
        self.ingredients = {}
        self.cuisines = {}
        self._buf = None
        self._ignore = False
        self.feed(body)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'script':
            self._ignore = True
            if a.get('type') == 'application/ld+json': self._buf = ''
        if tag == 'style': self._ignore = True
        if tag == 'meta' and a.get('name') in ['robots', 'googlebot']: self.robots[a['name']] = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical = a.get('href')
        if tag == 'link' and a.get('rel') == 'stylesheet': self.styles.append(a.get('href'))
        if tag == 'a' and 'md-card-photo-link' in a.get('class', '').split(): self.cards.add(a.get('href'))
        if tag == 'select': self.select = a.get('name')
        if tag == 'option' and self.select in ['ingrediente', 'cocina']:
            self.option = a.get('value', '')
            target = self.ingredients if self.select == 'ingrediente' else self.cuisines
            target[self.option] = ''
    def handle_data(self, data):
        if self._buf is not None: self._buf += data
        if not self._ignore: self.text.append(data)
        if self.option is not None:
            target = self.ingredients if self.select == 'ingrediente' else self.cuisines
            target[self.option] += data
    def handle_endtag(self, tag):
        if tag == 'script':
            if self._buf is not None:
                self.ld.append(json.loads(self._buf))
                self._buf = None
            self._ignore = False
        if tag == 'style': self._ignore = False
        if tag == 'option': self.option = None
        if tag == 'select': self.select = None
    @property
    def visible(self): return ' '.join(' '.join(self.text).split())

def fetch(path):
    url = urllib.parse.urljoin(BASE + '/', path)
    parts = urllib.parse.urlsplit(url)
    url = urllib.parse.urlunsplit((parts.scheme, parts.netloc, urllib.parse.quote(urllib.parse.unquote(parts.path), safe='/'), parts.query, ''))
    req = urllib.request.Request(url, headers={'User-Agent': 'ManualDeCocina-QualityVerification/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=40) as r: return r.status, r.url, r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e: return e.code, e.url, e.read().decode('utf-8', 'replace')
    except Exception as e: return 0, url, 'FETCH_ERROR: ' + str(e)

def nodes(data, kind):
    if isinstance(data, dict):
        if data.get('@type') == kind: yield data
        for value in data.values(): yield from nodes(value, kind)
    elif isinstance(data, list):
        for value in data: yield from nodes(value, kind)

results = []
errors = []
def check_editorial(patch):
    try:
        status, url, body = fetch(patch['public_path'])
        page = Page(body)
        problems = []
        if status != 200: problems.append('http_' + str(status))
        faqs = patch['after'].get('seo', {}).get('faq', [])
        for faq in faqs:
            for text in [faq['q'], faq['a']]:
                if ' '.join(text.split()) not in page.visible: problems.append('missing_visible_faq')
        recipe = next(nodes(page.ld, 'Recipe'), None)
        if not recipe: problems.append('missing_recipe_schema')
        else:
            if recipe.get('publisher', {}).get('url') != CANONICAL_BASE + '/es': problems.append('publisher_url')
            if 'title' in patch['after'] and recipe['name'] != patch['after']['title']: problems.append('recipe_name')
            if 'ingredients' in patch['after'] and len(recipe.get('recipeIngredient', [])) != len(patch['after']['ingredients']): problems.append('ingredient_count')
            if recipe.get('url') != page.canonical: problems.append('schema_canonical')
            if any(s.get('url', '').split('#')[0] != page.canonical for s in recipe.get('recipeInstructions', [])): problems.append('step_canonical')
        result = {'path': patch['public_path'], 'status': status, 'faq_checked': len(faqs), 'problems': sorted(set(problems))}
    except Exception as e: result = {'path': patch['public_path'], 'problems': [str(e)]}
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    for row in pool.map(check_editorial, PATCHES):
        results.append(row)
        if row['problems']: errors.append(row)
print('Editorial pages checked:', len(results), 'problems:', len(errors), flush=True)
print('Editorial issues:', json.dumps(errors, ensure_ascii=False), flush=True)
Path(os.environ.get('QUALITY_REPORT', 'quality-fixes-20261103-verification.json')).write_text(json.dumps({'phase': 'editorial', 'results': results, 'errors': errors}, ensure_ascii=False, indent=2))

for lang in LANGS:
    status, _, body = fetch('/' + lang + '/recetas?ingrediente=ajo')
    filtered = Page(body)
    detail_status, _, detail_body = fetch('/' + lang + '/ingredientes/ajo')
    detail = Page(detail_body)
    problems = []
    if status != 200 or detail_status != 200: problems.append('http')
    if filtered.ingredients.get('ajo') != GARLIC[lang]: problems.append('localized_ingredient_option')
    if 'cocina-estadounidense' not in filtered.cuisines: problems.append('missing_cuisine_discovery_groups')
    if not filtered.cards: problems.append('empty_ingredient_filter')
    if not filtered.cards.issubset(detail.cards): problems.append('filter_vs_landing')
    if not all('noindex' in filtered.robots.get(key, '') for key in ['robots', 'googlebot']): problems.append('facet_indexing')
    row = {'language': lang, 'filter_cards': len(filtered.cards), 'landing_cards': len(detail.cards), 'problems': problems}
    results.append(row)
    if problems: errors.append(row)
    print('Ingredient filter:', lang, row, flush=True)
    cuisine_status, _, cuisine_body = fetch('/' + lang + '/recetas?cocina=cocina-estadounidense')
    cuisine = Page(cuisine_body)
    cuisine_problems = [] if cuisine_status == 200 and cuisine.cards else ['empty_american_cuisine_filter']
    cuisine_result = {'language': lang, 'cuisine_filter_cards': len(cuisine.cards), 'problems': cuisine_problems}
    results.append(cuisine_result)
    if cuisine_problems: errors.append(cuisine_result)

for path, expected in [('/en/recetas?q=rice&q=beans', 200), ('/es/recetas?page=999', 404), ('/xx', 404), ('/es/quality-audit-page-does-not-exist', 404)]:
    status, _, body = fetch(path)
    problems = [] if status == expected else ['expected_%s_got_%s' % (expected, status)]
    if expected == 200 and 'id="md-main"' not in body: problems.append('missing_main')
    row = {'path': path, 'status': status, 'problems': problems}
    results.append(row)
    if problems: errors.append(row)

status, _, marker = fetch('/.well-known/quality-audit-20261103.txt')
if status != 200 or 'manualdecocina-quality-20261103-v1' not in marker: errors.append({'problems': ['deployment_marker']})
status, _, body = fetch('/es')
home = Page(body)
styles = ''.join(fetch(path)[2] for path in home.styles)
if 'unfilled' not in styles or 'google-auto-placed' not in styles: errors.append({'problems': ['unfilled_ad_css']})
report = {'checked_at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'base': BASE, 'editorial_pages': len(PATCHES), 'results': results, 'errors': errors}
Path(os.environ.get('QUALITY_REPORT', 'quality-fixes-20261103-verification.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2))
print('QUALITY_FIXES_VERIFIED', json.dumps({'editorial_pages': len(PATCHES), 'languages': len(LANGS), 'errors': len(errors)}), flush=True)
sys.exit(bool(errors))
