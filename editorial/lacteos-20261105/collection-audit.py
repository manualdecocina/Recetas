"""Comprobación acotada de la colección publicada, sin descargar fotos de recetas."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.h1 = []
        self.in_h1 = False
        self.links = []
        self.meta = []
        self.cards = []
        self.recipes = 0
        self.sections = 0
        self.faq = 0
        self.in_faq = False
        self.script = None
        self.schemas = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        classes = a.get('class', '').split()
        if tag == 'html': self.lang = a.get('lang')
        if tag == 'h1': self.h1.append(''); self.in_h1 = True
        if tag == 'link': self.links.append(a)
        if tag == 'a':
            self.links.append(a)
            if 'md-collection-card' in classes: self.cards.append(a.get('href'))
        if tag == 'meta': self.meta.append(a)
        if tag == 'article' and 'md-recipe-card' in classes: self.recipes += 1
        if tag == 'section' and 'md-collection-section' in classes: self.sections += 1
        if tag == 'section' and 'md-collection-faq' in classes: self.in_faq = True
        if tag == 'summary' and self.in_faq: self.faq += 1
        if tag == 'script' and a.get('type') == 'application/ld+json': self.script = ''

    def handle_data(self, data):
        if self.in_h1: self.h1[-1] += data
        if self.script is not None: self.script += data

    def handle_endtag(self, tag):
        if tag == 'h1': self.in_h1 = False
        if tag == 'section': self.in_faq = False
        if tag == 'script' and self.script is not None:
            self.schemas.append(json.loads(self.script))
            self.script = None


def get(url):
    request = urllib.request.Request(urllib.parse.quote(url, safe=':/?=&%'), headers={'User-Agent': 'ManualDeCocina-CollectionQA/1.0'})
    with urllib.request.urlopen(request, timeout=45) as response:
        assert response.status == 120, (url, response.status)
        return response.read()


def normalized(url):
    return urllib.parse.unquote(url).rstrip('/')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='https://manualdecocina.com')
    parser.add_argument('--canonical-origin', default='https://manualdecocina.com')
    parser.add_argument('--output', default='live-qa.json')
    args = parser.parse_args()
    origin = args.base.rstrip('/')
    canonical_origin = args.canonical_origin.rstrip('/')
    config = json.loads((HERE / 'collections.json').read_text())
    dairy = next(c for c in config if c['id'] == 'derivados-de-la-leche')
    checks = []
    jobs = [(lang, kind) for lang in dairy['paths'] for kind in ['collection', 'index', 'home']]

    def check_page(job):
        lang, kind = job
        path = dairy['paths'][lang] if kind == 'collection' else f'/{lang}/colecciones' if kind == 'index' else f'/{lang}'
        html = get(origin + path).decode()
        p = Page(html)
        assert p.lang == ('pt-BR' if lang == 'pt' else lang), (path, 'html language', p.lang)
        assert len(p.h1) == 1, (path, 'H1 count', len(p.h1))
        canonical = [a['href'] for a in p.links if a.get('rel') == 'canonical']
        assert list(map(normalized, canonical)) == [normalized(canonical_origin + path)], (path, 'canonical', canonical)
        robots = [a.get('content', '') for a in p.meta if a.get('name') == 'robots']
        if origin == 'https://manualdecocina.com':
            assert robots and all('noindex' not in x for x in robots), (path, 'robots', robots)
        if kind == 'collection':
            assert p.h1 == [dairy['titles'][lang]], (path, 'title', p.h1)
            assert (p.recipes, p.sections, p.faq) == (12, 3, 4), (path, p.recipes, p.sections, p.faq)
            alternates = [a for a in p.links if a.get('rel') == 'alternate' and a.get('hreflang')]
            expected = {('pt-BR' if l == 'pt' else l): normalized(canonical_origin + v) for l, v in dairy['paths'].items()}
            expected['x-default'] = normalized(canonical_origin + dairy['paths']['es'])
            assert {a['hreflang']: normalized(a['href']) for a in alternates} == expected, (path, 'alternates')
            itemlists = [s for s in p.schemas if s.get('@type') == 'ItemList']
            assert len(itemlists) == 1 and len(itemlists[0]['itemListElement']) == 12, (path, 'ItemList')
            entries = itemlists[0]['itemListElement']
            assert [x['position'] for x in entries] == list(range(1, 13)), (path, 'positions')
            assert len({x['url'] for x in entries}) == 12, (path, 'duplicates')
            assert all(x['url'].startswith(canonical_origin + '/') for x in entries), (path, 'canonical recipe URLs')
            return {'kind': kind, 'language': lang, 'url': origin + path, 'recipes': p.recipes, 'sections': p.sections, 'faq': p.faq, 'hreflang': len(alternates), 'status': 'PASS'}
        expected = [c['paths'][lang] for c in (config[:2] if kind == 'home' else config)]
        assert [normalized(x) for x in p.cards] == [normalized(x) for x in expected], (path, 'collection order/count', p.cards)
        if kind == 'home':
            assert dairy['moreCopy'][lang] in html, (path, 'more collections label')
            assert any(a.get('href') == f'/{lang}/colecciones' for a in p.links), (path, 'index link')
        return {'kind': kind, 'language': lang, 'url': origin + path, 'collections': len(p.cards), 'order': expected, 'status': 'PASS'}

    with ThreadPoolExecutor(max_workers=3) as pool:
        checks.extend(pool.map(check_page, jobs))
    for image in json.loads((HERE / 'media.json').read_text()):
        path = '/' + image['path'].removeprefix('public/')
        data = get(origin + path)
        assert len(data) == image['bytes'] and hashlib.sha256(data).hexdigest() == image['sha256'], (path, 'media hash')
        checks.append({'kind': 'image', 'path': path, 'bytes': len(data), 'status': 'PASS'})

    sitemap = ET.fromstring(get(origin + '/sitemap.xml'))
    locations = {normalized(n.text) for n in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
    for c in config:
        for path in c['paths'].values():
            assert normalized(canonical_origin + path) in locations, ('sitemap missing', path)
    checks.append({'kind': 'sitemap', 'collection_urls': 28, 'status': 'PASS'})

    recipe_html = get(origin + '/yogur-natural-casero').decode()
    assert dairy['paths']['es'] in recipe_html, 'Missing recipe backlink to collection'
    checks.append({'kind': 'recipe-backlink', 'path': '/yogur-natural-casero', 'status': 'PASS'})
    result = {'checked_at': datetime.now(timezone.utc).isoformat(), 'base': origin, 'status': 'PASS', 'checks': checks}
    (HERE / args.output).write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(f'PASS: {len(checks)} checks; 7 collection pages, 7 indexes, 7 homes, 4 images, sitemap and recipe backlink')


if __name__ == '__main__':
    main()
