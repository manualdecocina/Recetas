"""Verify the 28 reinforced recipes against their approved editorial payload."""
import concurrent.futures
import json
import re
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'editorial/refuerzo-cuatro-20261027'
BASE = 'https://manualdecocina.com'

def fetch(path):
    url = urllib.parse.quote(BASE + path, safe=':/?=&%')
    req = urllib.request.Request(url, headers={'Cache-Control': 'no-cache'})
    with urllib.request.urlopen(req, timeout=50) as response:
        assert response.status == 200, (path, response.status)
        return response.read().decode()

class Page(HTMLParser):
    def __init__(self, raw):
        super().__init__()
        self.title = ''; self.h1 = []; self.description = None
        self.canonical = []; self.alternates = {}; self.links = set()
        self.ld = []; self.text = []; self.active = None; self.buffer = ''
        self.robots = ''; self.html_lang = None; self.hidden = 0
        self.feed(raw)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ('script', 'style'): self.hidden += 1
        if tag == 'html': self.html_lang = a.get('lang')
        if tag == 'title': self.active = 'title'; self.buffer = ''
        if tag == 'h1': self.active = 'h1'; self.buffer = ''
        if tag == 'script' and a.get('type') == 'application/ld+json': self.active = 'ld'; self.buffer = ''
        if tag == 'meta' and a.get('name') == 'description': self.description = a.get('content')
        if tag == 'meta' and a.get('name') == 'robots': self.robots = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical.append(urllib.parse.unquote(a['href']))
        if tag == 'link' and a.get('hreflang'): self.alternates[a['hreflang']] = urllib.parse.unquote(a['href'])
        if tag == 'a': self.links.add(urllib.parse.unquote(a.get('href', '')))
    def handle_data(self, data):
        if self.active: self.buffer += data
        if not self.hidden: self.text.append(data)
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.hidden = max(0, self.hidden-1)
        if self.active == 'title' and tag == 'title': self.title = self.buffer; self.active = None
        elif self.active == 'h1' and tag == 'h1': self.h1.append(self.buffer); self.active = None
        elif self.active == 'ld' and tag == 'script': self.ld.append(json.loads(self.buffer)); self.active = None

def nodes(x, kind):
    if isinstance(x, dict):
        if x.get('@type') == kind: yield x
        for value in x.values(): yield from nodes(value, kind)
    elif isinstance(x, list):
        for value in x: yield from nodes(value, kind)

def duration(minutes):
    return 'PT'+str(minutes)+'M'

def canonical(r):
    url = BASE+r['public_path']
    return url+'/' if r.get('source_url') == url+'/' else url

def lang_tag(language):
    return 'pt-BR' if language == 'pt' else language

def check_record(r, records):
    path = r['public_path']
    try:
        p = Page(fetch(path)); text = ' '.join(p.text)
        assert p.h1 == [r['title']], ('h1', p.h1)
        assert p.title == r['seo']['title'] + ' | Manual de Cocina', ('title', p.title)
        assert p.description == r['seo']['description'], ('description', p.description)
        assert p.canonical == [canonical(r)], ('canonical', p.canonical)
        assert p.html_lang == lang_tag(r['language']), ('lang', p.html_lang)
        assert 'noindex' not in p.robots and 'nofollow' not in p.robots, ('robots', p.robots)
        for sibling in records:
            if sibling['recipe_group_id'] == r['recipe_group_id']:
                assert p.alternates.get(lang_tag(sibling['language'])) == canonical(sibling), ('hreflang', sibling['language'])
        recipe = list(nodes(p.ld, 'Recipe'))
        assert len(recipe) == 1, ('recipe-count', len(recipe))
        recipe = recipe[0]
        assert recipe['name'] == r['title']
        assert recipe['totalTime'] == duration(r['total_time_minutes']), ('totalTime', recipe['totalTime'])
        assert [x['text'] for x in recipe['recipeInstructions']] == [x['content'] for x in r['steps']]
        assert len(recipe['recipeIngredient']) == len(r['ingredients'])
        assert recipe['nutrition']['calories'] == str(r['nutrition']['calories'])+' calories'
        for faq in r['seo']['faq']:
            assert faq['q'] in text and faq['a'] in text, ('faq', faq['q'])
        for paragraph in r['summary'].split('\n\n'): assert paragraph in text, ('summary', paragraph[:30])
        expected_links = re.findall(r'href="(/[^"]+)"', r['notes'])
        assert len(expected_links) == 2
        assert all(link in p.links for link in expected_links), ('internal-links', expected_links)
        return {'path': path, 'language': r['language'], 'ok': True, 'faqs': len(r['seo']['faq']), 'links': len(expected_links)}
    except Exception as error:
        return {'path': path, 'ok': False, 'error': str(error)}

def main():
    records = json.loads((DATA/'after.json').read_text())
    before = json.loads((DATA/'before.json').read_text())
    mutable = {'title','excerpt','summary','notes','steps','total_time_minutes','keywords','seo'}
    assert len(records) == 28
    for old, new in zip(before, records):
        assert {k:v for k,v in old.items() if k not in mutable} == {k:v for k,v in new.items() if k not in mutable}
        assert [(s.get('image_url'),s.get('image_alt')) for s in old['steps']] == [(s.get('image_url'),s.get('image_alt')) for s in new['steps']]
        assert new['seo'].get('image_variants') == old['seo'].get('image_variants')
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        results = list(pool.map(lambda r: check_record(r, records), records))
    # A stale ISR response may be served once while its replacement is generated.
    for attempt in range(2):
        failed = {item['path'] for item in results if not item['ok']}
        if not failed: break
        time.sleep(10)
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
            retried = list(pool.map(lambda r: check_record(r, records), [r for r in records if r['public_path'] in failed]))
        replacements = {item['path']: item for item in retried}
        results = [replacements.get(item['path'], item) for item in results]
    sitemap = ET.fromstring(fetch('/sitemap.xml'))
    urls = {urllib.parse.unquote(x.text).rstrip('/') for x in sitemap.iter() if x.tag.endswith('}loc')}
    missing = [r['public_path'] for r in records if (BASE+r['public_path']).rstrip('/') not in urls]
    report = {'checked':len(results),'passed':sum(r['ok'] for r in results),'missing_sitemap':missing,'pages':results}
    (DATA/'production-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False))
    raise SystemExit(0 if report['passed']==28 and not missing else 1)

if __name__ == '__main__': main()
