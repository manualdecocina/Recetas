"""Bounded verification of exact public images and recipe HTML/schema."""
import concurrent.futures,hashlib,json,sys,urllib.request,urllib.parse
from pathlib import Path
from html.parser import HTMLParser
D=Path(__file__).resolve().parent
def get(url):
 req=urllib.request.Request(urllib.parse.quote(url,safe=':/%?=&'),headers={'User-Agent':'ManualDeCocina-DairyQA/1.0'})
 with urllib.request.urlopen(req,timeout=45) as r:return r.headers.get_content_type(),r.read()
def media(key):
 m=json.loads((D/f'{key}.media.json').read_text())['images']
 def one(x):
  url='https://manualdecocina.com/'+x['path'].removeprefix('public/')
  typ,data=get(url)
  assert typ=='image/webp' and len(data)==x['bytes'] and hashlib.sha256(data).hexdigest()==x['sha256'],url
  return dict(url=url,status=200,sha256=x['sha256'])
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as p:out=list(p.map(one,m))
 (D/f'{key}.assets-qa.json').write_text(json.dumps(dict(status='PASS',images=out),indent=2)+'\n')
 print('PASS',key,len(out),'public WebP hashes')
class Page(HTMLParser):
 def __init__(self,s):
  super().__init__();self.links=[];self.schemas=[];self.script=None;self.images=[];self.feed(s)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='link':self.links.append(a)
  if tag=='img':self.images.append(a)
  if tag=='script' and a.get('type')=='application/ld+json':self.script=''
 def handle_data(self,s):
  if self.script is not None:self.script+=s
 def handle_endtag(self,tag):
  if tag=='script' and self.script is not None:self.schemas.append(json.loads(self.script));self.script=None
def pages(key):
 recs=json.loads((D/f'{key}.json').read_text())['records']
 def one(r):
  url='https://manualdecocina.com'+r['public_path'];typ,data=get(url);p=Page(data.decode())
  recipes=[]
  for s in p.schemas:
   vals=s if isinstance(s,list) else s.get('@graph',[s])
   recipes.extend(x for x in vals if x.get('@type')=='Recipe')
  assert len(recipes)==1,(url,'Recipe schema',len(recipes))
  s=recipes[0];assert s['name']==r['title'] and len(s['recipeInstructions'])==len(r['steps']),(url,'content')
  assert s.get('nutrition') and len(s.get('image',[]))>=3,(url,'nutrition/images')
  canonical=[x['href'].rstrip('/') for x in p.links if x.get('rel')=='canonical'];assert canonical==[url.rstrip('/')],(url,'canonical')
  assert len([x for x in p.links if x.get('hreflang')])>=7,(url,'alternates')
  assert len(s['recipeIngredient'])==len(r['ingredients']),(url,'ingredients')
  return dict(language=r['language'],url=url,status=200,steps=len(r['steps']),nutrition=True,canonical=True,hreflang=True)
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as p:out=list(p.map(one,recs))
 (D/f'{key}.live-qa.json').write_text(json.dumps(dict(status='PASS',pages=out),ensure_ascii=False,indent=2)+'\n')
 print('PASS',key,len(out),'recipe pages')
if __name__=='__main__':
 (pages if '--pages' in sys.argv else media)(sys.argv[1])
