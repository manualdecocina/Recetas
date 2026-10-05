"""Read-only deployment gate for the nine approved recipe groups."""
import concurrent.futures
import json
import sys
import subprocess
import urllib.parse
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

BASE = 'https://preview.manualdecocina.com'
FETCH_BASE = sys.argv[1] if len(sys.argv) > 1 else BASE
ROWS = json.load(open('docs/URL-MASTER-NINE-RECIPES-20261005.json'))


def canonical_text(value):
    return urllib.parse.unquote(value or '')


def request(path):
    url = FETCH_BASE + urllib.parse.quote(path, safe='/%')
    probe = subprocess.run(['node', 'scripts/fetch-public-page.mjs', url], capture_output=True, text=True, timeout=35, check=True)
    value = json.loads(probe.stdout)
    return value['status'], value['headers'], value['body']


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = []
        self.alternates = {}
        self.links = set()
        self.html_lang = None
        self.ld = []
        self.buffer = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html':
            self.html_lang = attrs.get('lang')
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical.append(canonical_text(attrs.get('href')))
        if tag == 'link' and attrs.get('hreflang'):
            self.alternates[attrs['hreflang']] = canonical_text(attrs.get('href'))
        if tag == 'a' and attrs.get('href'):
            self.links.add(canonical_text(urllib.parse.urljoin(BASE, attrs['href'])))
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.buffer = ''

    def handle_data(self, data):
        if self.buffer is not None:
            self.buffer += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.buffer is not None:
            try:
                self.ld.append(json.loads(self.buffer))
            except json.JSONDecodeError:
                pass
            self.buffer = None


def recipes_in(node):
    if isinstance(node, dict):
        if node.get('@type') == 'Recipe':
            yield node
        for value in node.values():
            if isinstance(value, (dict, list)):
                yield from recipes_in(value)
    elif isinstance(node, list):
        for value in node:
            yield from recipes_in(value)


def expected_alternates(row):
    return {r['hreflang']: BASE + r['new_path'] for r in ROWS if r['recipe_group_id'] == row['recipe_group_id']}


def check(row):
    result = {'id': row['id'], 'slug': row['slug'], 'language': row['hreflang'],
              'path': row['new_path'], 'decision': row['decision'], 'errors': []}
    try:
        status, headers, body = request(row['new_path'])
        result['http'] = status
        result['location'] = canonical_text(headers.get('location'))
        page = Page()
        page.feed(body)
        result['canonical'] = page.canonical
        result['hreflang'] = page.alternates
        result['html_lang'] = page.html_lang
        recipe = list(recipes_in(page.ld))
        result['recipe_count'] = len(recipe)
        expected = expected_alternates(row)
        expected_url = BASE + row['new_path']
        if status != 200:
            result['errors'].append('not_direct_HTTP_200')
        if page.canonical != [expected_url]:
            result['errors'].append('canonical_mismatch')
        if page.alternates != expected:
            result['errors'].append('hreflang_mismatch')
        if page.html_lang != row['hreflang']:
            result['errors'].append('html_language_mismatch')
        if len(recipe) != 1 or canonical_text(recipe[0].get('url')) != expected_url:
            result['errors'].append('recipe_schema_mismatch')
        if recipe and recipe[0].get('inLanguage') != row['hreflang']:
            result['errors'].append('recipe_language_mismatch')
        missing = sorted(set(expected.values()) - {expected_url} - page.links)
        result['missing_language_links'] = missing
        if missing:
            result['errors'].append('language_selector_missing_targets')
        generic = {BASE+r['old_path'] for r in ROWS if r['language'] != 'es'}
        stale = sorted(generic & page.links)
        result['stale_generic_links'] = stale
        if stale:
            result['errors'].append('stale_internal_generic_link')
    except Exception as exc:
        result['errors'].append(str(exc))
    return result


with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    results = list(pool.map(check, ROWS))

sitemap_result = {}
try:
    status, headers, body = request('/sitemap.xml')
    root = ET.fromstring(body)
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'x': 'http://www.w3.org/1999/xhtml'}
    entries = {}
    for node in root.findall('s:url', ns):
        loc = canonical_text(node.findtext('s:loc', namespaces=ns))
        alternates = {link.attrib['hreflang']: canonical_text(link.attrib['href']) for link in node.findall('x:link', ns)}
        entries[loc] = alternates
    sitemap_result = {'http': status, 'entries': len(entries), 'all_preview': all(url.startswith(BASE+'/') for url in entries)}
    for row, result in zip(ROWS, results):
        url = BASE + row['new_path']
        result['sitemap'] = url in entries
        result['sitemap_hreflang'] = entries.get(url) == expected_alternates(row)
        if status != 200 or not result['sitemap'] or not result['sitemap_hreflang']:
            result['errors'].append('sitemap_mismatch')
except Exception as exc:
    sitemap_result['error'] = str(exc)
    for result in results:
        result['errors'].append('sitemap_unverified')

# All hreflang endpoints were fetched above, not merely compared as strings.
targets = {BASE+r['path']:r.get('http') for r in results}
for result in results:
    result['hreflang_targets_200'] = all(targets.get(url) == 200 for url in result.get('hreflang', {}).values()) and len(result.get('hreflang', {})) == 7
    if not result['hreflang_targets_200']:
        result['errors'].append('hreflang_target_not_200')

summary = {'total': len(results), 'passed': sum(not r['errors'] for r in results),
           'http_403': sum(r.get('http') == 403 for r in results),
           'http_404': sum(r.get('http') == 404 for r in results), 'sitemap': sitemap_result}
report = {'summary': summary, 'results': results}
with open('restored-preview-audit.json', 'w') as output:
    json.dump(report, output, ensure_ascii=False, indent=2)
for result in results:
    print('RESTORED_URL '+json.dumps(result, ensure_ascii=False), flush=True)
print('RESTORED_SUMMARY '+json.dumps(summary, ensure_ascii=False), flush=True)
sys.exit(0 if summary['passed'] == 63 else 1)
