"""Read-only publication QA, with the existing protected cache refresh when configured."""
import concurrent.futures,hashlib,html,json,os,re,sys,time,urllib.request
from pathlib import Path
D=Path(__file__).resolve().parent;BASE='https://manualdecocina.com'
REPORT={'pages':[],'images':[],'discovery':[]}
def get(url):
    req=urllib.request.Request(url if url.startswith('https://') else BASE+url,headers={'User-Agent':'ManualDeCocina-PublicationQA/1.0','Cache-Control':'no-cache'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req,timeout=45) as r:
                data=r.read();assert data,'Empty response'
                return r.status,r.headers,data,r.url
        except Exception:
            if attempt==2:raise
            time.sleep(2)
def objects(x):
    if isinstance(x,dict):
        yield x
        for v in x.values():yield from objects(v)
    elif isinstance(x,list):
        for v in x:yield from objects(v)
def page(pair):
    record,doc=pair;status,headers,raw,url=get(record['public_path']);text=raw.decode()
    assert status==200 and url.rstrip('/')==(BASE+record['public_path']).rstrip('/'),(record['language'],'status/redirect')
    assert len(re.findall(r'<h1(?:\s|>)',text))==1
    assert not re.search(r'<meta[^>]+name="robots"[^>]+content="[^"]*noindex',text)
    lang='pt-BR' if record['language']=='pt' else record['language']
    assert re.search(r'<html[^>]+lang="'+lang+'"',text)
    c=re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"',text)
    assert c and html.unescape(c.group(1)).rstrip('/')==(BASE+record['public_path']).rstrip('/'),'canonical'
    for alt in doc['records']:assert BASE+alt['public_path'] in text,('alternate',alt['language'])
    schemas=[json.loads(html.unescape(s)) for s in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',text,re.S)]
    recipes=[x for schema in schemas for x in objects(schema) if x.get('@type')=='Recipe'];assert len(recipes)==1
    r=recipes[0];assert r['name']==record['title']
    assert len(r['recipeInstructions'])==8 and len(r['recipeIngredient'])==len(record['ingredients'])
    assert r.get('nutrition') and r.get('totalTime')
    assert all(s['image_url'] in text for s in record['steps'])
    assert 'Néstor Bastidas' in text
    return dict(path=record['public_path'],language=record['language'],http=200,steps=8,ingredients=len(record['ingredients']),canonical=True,alternates=7,nutrition=True)
def image(m):
    status,headers,data,url=get(m['url']);assert status==200 and headers.get_content_type()=='image/webp'
    assert hashlib.sha256(data).hexdigest()==m['sha256'],m['url']
    return dict(url=m['url'],http=200,bytes=len(data),sha256=m['sha256'])
def main():
    secret=(os.getenv('REVALIDATE_SECRET') or '').rstrip('\r\n')
    if secret:
        req=urllib.request.Request(BASE+'/api/revalidate',data=b'{}',headers={'x-revalidate-secret':secret,'Content-Type':'application/json'})
        with urllib.request.urlopen(req,timeout=45) as r:assert json.load(r).get('revalidated') is True
        REPORT['cache_refreshed']=True
    keys=json.loads((D/'published.json').read_text())
    if '--latest' in sys.argv:keys=keys[-1:]
    docs=[json.loads((D/(key+'.json')).read_text()) for key in keys]
    media=[m for key in keys for m in json.loads((D/(key+'-media.json')).read_text())['images']]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:REPORT['images']=list(pool.map(image,media))
    for attempt in range(4):
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:REPORT['pages']=list(pool.map(page,[(r,doc) for doc in docs for r in doc['records']]))
            break
        except Exception:
            if attempt==3:raise
            time.sleep(8)
    for path in ['/es/recetas','/sitemap.xml']:
        status,headers,data,url=get(path);text=data.decode()
        for doc in docs:assert doc['records'][0]['public_path'] in text,('discovery',path,doc['key'])
        REPORT['discovery'].append(dict(path=path,http=status,recipes=len(docs)))
    REPORT['status']='PASS';REPORT['checked_at']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    if len(keys)==1:(D/(keys[0]+'-production-qa.json')).write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
    print('PASS',len(docs),'recipes',len(REPORT['pages']),'pages',len(media),'images; canonical, alternates, Recipe schema, nutrition and discovery')
if __name__=='__main__':
    try:main()
    finally:(D/'production-qa.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
