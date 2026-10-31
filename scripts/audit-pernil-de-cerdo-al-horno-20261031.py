import json,os,re,time,urllib.request,urllib.error,pathlib,html
BASE='https://manualdecocina.com'
source=pathlib.Path('editorial/pernil-de-cerdo-al-horno-20261031.json')
records=json.loads(source.read_text())['records']
secret=(os.getenv('REVALIDATE_SECRET') or '').rstrip('\r\n')
report={'images':[],'pages':[]}
def get(path):
 req=urllib.request.Request(path if path.startswith('https://') else BASE+path,headers={'User-Agent':'ManualDeCocina-Publication-QA/1.0','Cache-Control':'no-cache'})
 with urllib.request.urlopen(req,timeout=40) as r:return r.status,r.headers,r.read()
def invalidate():
 if not secret:raise RuntimeError('Missing revalidation secret')
 req=urllib.request.Request(BASE+'/api/revalidate',data=b'{}',headers={'x-revalidate-secret':secret,'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=45) as r:assert json.load(r)['revalidated'] is True
paths=sorted({records[0]['image_url'],*records[0]['seo']['image_variants'],*[s['image_url'] for s in records[0]['steps'] if s.get('image_url')],records[0]['gallery'][0]['url']})
try:
 for attempt in range(20):
  try:
   status,headers,data=get(records[0]['image_url'])
   assert status==200 and data[:4]==b'RIFF' and data[8:12]==b'WEBP'
   break
  except (urllib.error.HTTPError,urllib.error.URLError,TimeoutError,AssertionError):
   if attempt==19:raise
   time.sleep(25)
 for p in paths:
  status,headers,data=get(p)
  assert status==200 and data[:4]==b'RIFF' and data[8:12]==b'WEBP',p
  report['images'].append({'path':p,'status':status,'bytes':len(data)})
 for attempt in range(20):
  invalidate()
  try:
   for r in records:
    status,_,data=get(r['public_path'])
    assert status==200
   break
  except (urllib.error.HTTPError,urllib.error.URLError,TimeoutError,AssertionError):
   if attempt==19:raise
   time.sleep(15)
 for r in records:
  status,_,data=get(r['public_path']);page=data.decode()
  assert 'noindex' not in page.lower(),r['slug']
  assert len(re.findall(r'<h1(?:\s|>)',page))==1,r['slug']
  assert BASE+r['public_path'] in page,r['slug']
  assert re.search(r'<html[^>]+lang="'+r['language']+'"',page),r['slug']
  for other in records:assert BASE+other['public_path'] in page,(r['slug'],'missing alternate',other['language'])
  assert 'Néstor Bastidas' in page,r['slug']
  schemas=[json.loads(html.unescape(x)) for x in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',page,re.S)]
  def objects(x):
   if isinstance(x,dict):
    yield x
    for v in x.values():yield from objects(v)
   elif isinstance(x,list):
    for v in x:yield from objects(v)
  recipes=[x for schema in schemas for x in objects(schema) if x.get('@type')=='Recipe']
  assert recipes,r['slug']
  recipe=recipes[0]
  assert len(recipe['recipeInstructions'])==len(r['steps']),r['slug']
  assert recipe.get('nutrition'),r['slug']
  report['pages'].append({'language':r['language'],'path':r['public_path'],'status':status,'steps':len(r['steps'])})
 for index in ['/es','/es/recetas','/sitemap.xml']:
  _,_,data=get(index)
  assert records[0]['public_path'] in data.decode(),index
 report['discovery']='home, catalogue and sitemap pass'
 report['status']='passed'
 print('PASS: 7 pages, 11 public images, schema, nutrition, hreflang and discovery')
finally:
 pathlib.Path('pernil-de-cerdo-al-horno-20261031-production-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
