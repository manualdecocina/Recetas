"""Read-only crawl of the complete current sitemap, with resumable evidence."""
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
import json
from pathlib import Path
import time
from urllib.parse import quote, unquote, urljoin, urlsplit, parse_qs
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import xml.etree.ElementTree as ET

BASE = 'https://manualdecocina.com'
OUT = Path('docs/audit-20261110')
OUT.mkdir(parents=True, exist_ok=True)

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.lang=''; self.canonical=''; self.h1=0; self.title=''; self.description=''; self.robots=''; self.alternates={}; self.links=set(); self.images=set(); self.schema=[]; self.schema_errors=[]; self.target=None; self.buffer=''
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='html': self.lang=a.get('lang','')
        if tag=='h1': self.h1+=1
        if tag=='title': self.target='title'
        if tag=='meta' and a.get('name')=='description': self.description=a.get('content','')
        if tag=='meta' and a.get('name')=='robots': self.robots=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical=unquote(a.get('href',''))
        if tag=='link' and a.get('hreflang'): self.alternates[a['hreflang']]=unquote(a.get('href',''))
        if tag=='a' and a.get('href'): self.links.add(a['href'])
        if tag=='img' and a.get('src'):
            src=a['src']; self.images.add(parse_qs(urlsplit(src).query).get('url',[src])[0] if urlsplit(src).path=='/_next/image' else src)
        if tag=='script' and a.get('type')=='application/ld+json': self.target='json';self.buffer=''
    def handle_data(self,data):
        if self.target=='title': self.title+=data
        if self.target=='json': self.buffer+=data
    def handle_endtag(self,tag):
        if tag=='title' and self.target=='title': self.target=None
        if tag=='script' and self.target=='json':
            try: self.schema.append(json.loads(self.buffer))
            except ValueError as e: self.schema_errors.append(str(e))
            self.target=None

def nodes(value,kind):
    if isinstance(value,dict):
        if value.get('@type')==kind: yield value
        for child in value.values(): yield from nodes(child,kind)
    if isinstance(value,list):
        for child in value: yield from nodes(child,kind)

def fetch(url):
    start=time.monotonic()
    request=Request(quote(url,safe=':/?=&%+-'),headers={'User-Agent':'ManualDeCocina-TechnicalAudit/20261110','Accept-Encoding':'identity'})
    try:
        with urlopen(request,timeout=30) as r: return r.status,r.read(),r.geturl(),time.monotonic()-start
    except HTTPError as e: return e.code,e.read(),e.geturl(),time.monotonic()-start

def audit(url):
    try:
        status,body,final,elapsed=fetch(url); p=Page();p.feed(body.decode('utf-8','replace'));issues=[]
        if status!=200: issues.append('http_'+str(status))
        if status==200:
            if p.h1!=1: issues.append('h1_count_'+str(p.h1))
            if not p.title: issues.append('missing_title')
            if not p.description: issues.append('missing_description')
            if p.canonical!=unquote(url): issues.append('canonical_mismatch')
            if 'noindex' in p.robots: issues.append('sitemap_noindex')
            if p.schema_errors: issues.append('invalid_jsonld')
            for recipe in nodes(p.schema,'Recipe'):
                if not recipe.get('nutrition'):issues.append('missing_nutrition')
                if not recipe.get('recipeInstructions'):issues.append('missing_instructions')
                if len(p.alternates)<7:issues.append('incomplete_recipe_alternates')
        return {'url':unquote(url),'status':status,'final':unquote(final),'seconds':round(elapsed,3),'bytes':len(body),'lang':p.lang,'title':p.title,'description':p.description,'canonical':p.canonical,'alternates':p.alternates,'h1':p.h1,'issues':issues,'links':sorted(p.links),'images':sorted(p.images)}
    except Exception as e: return {'url':unquote(url),'status':0,'issues':['fetch_error'],'error':str(e)}

if __name__=='__main__':
    _,xml,_,_=fetch(BASE+'/sitemap.xml');root=ET.fromstring(xml)
    urls=[x.text for x in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    (OUT/'sitemap.xml').write_bytes(xml)
    log=OUT/'crawl-before.jsonl'
    previous=[json.loads(line) for line in log.read_text().splitlines()] if log.exists() else []
    done={unquote(r['url']) for r in previous};pending=[u for u in urls if unquote(u) not in done]
    print('Sitemap',len(urls),'already checked',len(done),'pending',len(pending),flush=True)
    with ThreadPoolExecutor(max_workers=6) as pool,log.open('a') as output:
        futures={pool.submit(audit,url):url for url in pending}
        for i,future in enumerate(as_completed(futures),1):
            row=future.result();output.write(json.dumps(row,ensure_ascii=False)+'\n');output.flush();previous.append(row)
            if i%100==0 or row['issues']: print('Checked',len(previous),'issues',row['url'],row['issues'],flush=True)
    counts=Counter(issue for r in previous for issue in r['issues'])
    result={'sitemap_urls':len(urls),'crawled':len(previous),'statuses':dict(Counter(r['status'] for r in previous)),'issues':dict(counts),'affected':[r for r in previous if r['issues']]}
    (OUT/'crawl-summary-before.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k!='affected'},ensure_ascii=False),flush=True)
