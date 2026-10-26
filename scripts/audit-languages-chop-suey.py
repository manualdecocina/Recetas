"""Read-only production QA: language navigation and the existing seven-version chop suey."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://manualdecocina.com'
LANGUAGES = {'es', 'de', 'en', 'fr', 'it', 'ja', 'pt'}

def fetch(url, headers=None):
    request = urllib.request.Request(urllib.parse.quote(url, safe=':/?=&%'),
        headers={'Cache-Control': 'no-cache', **(headers or {})})
    with urllib.request.urlopen(request, timeout=45) as response:
        assert response.status == 200, url
        return response.read()

class Page(HTMLParser):
    def __init__(self, raw):
        super().__init__()
        self.canonical = []; self.alternates = {}; self.lang_links = set()
        self.ld = []; self.buffer = None; self.lang = None
        self.feed(raw.decode())
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html': self.lang = a.get('lang')
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical.append(urllib.parse.unquote(a['href']))
        if tag == 'link' and a.get('hreflang'): self.alternates[a['hreflang']] = urllib.parse.unquote(a['href'])
        if tag == 'a' and 'md-lang-item' in a.get('class', '').split(): self.lang_links.add(urllib.parse.unquote(a['href']))
        if tag == 'script' and a.get('type') == 'application/ld+json': self.buffer = ''
    def handle_data(self, text):
        if self.buffer is not None: self.buffer += text
    def handle_endtag(self, tag):
        if tag == 'script' and self.buffer is not None:
            self.ld.append(json.loads(self.buffer)); self.buffer = None

def nodes(value, kind):
    if isinstance(value, dict):
        if value.get('@type') == kind: yield value
        for child in value.values(): yield from nodes(child, kind)
    elif isinstance(value, list):
        for child in value: yield from nodes(child, kind)

def main():
    source = (ROOT / 'src/lib/supabase/public.ts').read_text()
    endpoint = re.search(r'https://[^\s\x27]+supabase.co', source)[0]
    key = re.search(r'sb_publishable_[^\x27]+', source)[0]
    records = json.loads(fetch(endpoint + '/rest/v1/recipes?select=*&recipe_group_id=eq.5ac7582a-4040-4983-a837-2e4f64ae0451', {'apikey': key}))
    assert {r['language'] for r in records} == LANGUAGES
    assert len(records) == 7 and all(r['published'] for r in records)
    def canonical(r):
        url = BASE + r['public_path']
        return url + '/' if r.get('source_url') == url.rstrip('/') + '/' and not url.endswith('/') else url
    expected = {('pt-BR' if r['language'] == 'pt' else r['language']): canonical(r) for r in records}
    report = {'navigation': [], 'recipes': [], 'images': []}
    for lang in ['es', 'ja', 'pt']:
        p = Page(fetch(BASE + '/' + lang))
        wanted = {'/' + item for item in LANGUAGES - {lang}}
        assert wanted <= p.lang_links, (lang, 'disabled languages', wanted - p.lang_links)
        report['navigation'].append({'language': lang, 'enabled_alternates': 6})
    for r in records:
        url = canonical(r); p = Page(fetch(url))
        assert p.canonical == [url], (url, p.canonical)
        assert p.alternates == expected, (url, 'hreflang', p.alternates)
        assert p.lang == ('pt-BR' if r['language'] == 'pt' else r['language'])
        recipes = list(nodes(p.ld, 'Recipe')); assert len(recipes) == 1
        schema = recipes[0]
        assert schema['name'] == r['title']
        assert len(schema['recipeInstructions']) == len(r['steps'])
        assert len(schema['recipeIngredient']) == len(r['ingredients'])
        assert str(r['nutrition']['calories']) in schema['nutrition']['calories']
        assert set(expected.values()) - {url} <= {urllib.parse.urljoin(BASE, item) for item in p.lang_links}
        report['recipes'].append({'language': r['language'], 'url': url, 'steps': len(r['steps']), 'hreflang': 7})
    images = {r['image_url'] for r in records}
    images.update(step['image_url'] for r in records for step in r['steps'])
    images.update(image for r in records for image in r['seo']['image_variants'])
    def check_image(path):
        raw = fetch(BASE + path); local = (ROOT / 'public' / path.lstrip('/')).read_bytes()
        assert hashlib.sha256(raw).digest() == hashlib.sha256(local).digest(), path
        return {'path': path, 'sha256': hashlib.sha256(raw).hexdigest()}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        report['images'] = list(pool.map(check_image, sorted(images)))
    sitemap = ET.fromstring(fetch(BASE + '/sitemap.xml'))
    locations = {urllib.parse.unquote(element.text) for element in sitemap.iter() if element.tag.endswith('}loc')}
    assert set(expected.values()) <= locations, ('sitemap missing', set(expected.values()) - locations)
    report['sitemap_recipes'] = 7
    Path('languages-chop-suey-qa.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'navigation': 3, 'recipes': 7, 'images': len(images), 'sitemap': 7, 'errors': 0}))

if __name__ == '__main__': main()
