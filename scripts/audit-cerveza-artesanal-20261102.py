"""Focused production checks for this one seven-language beer group."""
import concurrent.futures, hashlib, html, json, os, pathlib, re, time, urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=os.environ.get('AUDIT_BASE','https://manualdecocina.com').rstrip('/')
DOC=json.loads((ROOT/'editorial/cerveza-artesanal-20261102.json').read_text())
MEDIA=json.loads((ROOT/'editorial/cerveza-artesanal-imagenes-20261102.json').read_text())['manifest']
REPORT={'base':BASE,'images':[],'pages':[],'discovery':[]}
def get(url):
 req=urllib.request.Request(url if url.startswith('https://') else BASE+url,headers={'User-Agent':'ManualDeCocina-RecipeQA/1.0','Cache-Control':'no-cache'})
 with urllib.request.urlopen(req,timeout=35) as r:return r.status,r.headers,r.read(),r.url
def objects(x):
 if isinstance(x,dict):
  yield x
  for v in x.values():yield from objects(v)
 elif isinstance(x,list):
  for v in x:yield from objects(v)
def page(record):
 status,headers,raw,url=get(record['public_path']);text=raw.decode()
 assert status==200 and url.rstrip('/')==(BASE+record['public_path']).rstrip('/'),(record['language'],'redirect or status')
 assert len(re.findall(r'<h1(?:\s|>)',text))==1,record['language']
 assert not re.search(r'<meta[^>]+name="robots"[^>]+content="[^"]*noindex',text),record['language']
 expected_lang='pt-BR' if record['language']=='pt' else record['language']
 assert re.search(r'<html[^>]+lang="'+expected_lang+'"',text),(record['language'],'html lang')
 canonical=re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"',text)
 assert canonical and html.unescape(canonical.group(1)).rstrip('/')==(BASE+record['public_path']).rstrip('/'),(record['language'],'canonical')
 for other in DOC['records']:
  assert BASE+other['public_path'] in text,(record['language'],'missing alternate',other['language'])
 schemas=[json.loads(html.unescape(x)) for x in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',text,re.S)]
 recipes=[x for schema in schemas for x in objects(schema) if x.get('@type')=='Recipe'];assert len(recipes)==1
 recipe=recipes[0];assert len(recipe['recipeInstructions'])==8;assert len(recipe['recipeIngredient'])==5
 assert recipe.get('nutrition') and recipe.get('totalTime'),record['language']
 assert recipe['name']==record['title'],record['language']
 assert all(s['image_url'] in text for s in record['steps']),(record['language'],'step images')
 assert 'Néstor Bastidas' in text
 return {'language':record['language'],'path':record['public_path'],'http':status,'canonical':canonical.group(1),'steps':8,'ingredients':5,'nutrition':True,'hreflang':7}
def image(pair):
 path,expected=pair;url='https://eqbdtctxbpepbeickhqi.supabase.co/storage/v1/object/public/recetas/'+path
 status,headers,data,_=get(url);assert status==200 and headers.get_content_type()=='image/webp'
 assert hashlib.sha256(data).hexdigest()==expected['sha256'],path
 return {'path':path,'http':status,'bytes':len(data),'sha256':expected['sha256']}
def main():
 secret=(os.getenv('REVALIDATE_SECRET') or '').rstrip('\r\n')
 if secret:
  req=urllib.request.Request(BASE+'/api/revalidate',data=b'{}',headers={'x-revalidate-secret':secret,'Content-Type':'application/json'})
  with urllib.request.urlopen(req,timeout=40) as r:assert json.load(r).get('revalidated') is True
  REPORT['revalidation']=True
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:REPORT['images']=list(pool.map(image,MEDIA.items()))
 for attempt in range(4):
  try:
   with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:REPORT['pages']=list(pool.map(page,DOC['records']))
   break
  except Exception:
   if attempt==3:raise
   time.sleep(8)
 for path in ['/es/recetas','/sitemap.xml']:
  status,_,data,_=get(path);assert DOC['records'][0]['public_path'] in data.decode(),('not discoverable',path)
  REPORT['discovery'].append({'path':path,'http':status,'recipe_present':True})
 REPORT['status']='PASS'
 print('PASS: 7 public pages, 8 steps each, 5 ingredients, nutrition, reciprocal alternates, canonical, 12 exact media hashes, catalogue and sitemap')
if __name__=='__main__':
 try:main()
 finally:(ROOT/'cerveza-artesanal-20261102-production-qa.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
