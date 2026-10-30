import concurrent.futures,html,json,re,sys,time,urllib.request,xml.etree.ElementTree as ET
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parent
DATA=ROOT if (ROOT/'plan.json').exists() else ROOT.parent/'editorial/seven-new-20261029'
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ld=[];self.buf=None;self.links=[];self.h1=0;self.robots=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='script' and a.get('type')=='application/ld+json':self.buf=''
  if t=='link':self.links.append(a)
  if t=='h1':self.h1+=1
  if t=='meta' and a.get('name')=='robots':self.robots.append(a.get('content',''))
 def handle_data(self,s):
  if self.buf is not None:self.buf+=s
 def handle_endtag(self,t):
  if t=='script' and self.buf is not None:
   self.ld.append(json.loads(self.buf));self.buf=None
def get(url):
 with urllib.request.urlopen(urllib.request.Request(url,headers={'Cache-Control':'no-cache'}),timeout=45) as r:return r.status,r.read().decode(),r.geturl()
def nodes(v):
 if isinstance(v,list):
  for x in v:yield from nodes(x)
 elif isinstance(v,dict):
  if '@type' in v:yield v
  for x in v.values():
   if isinstance(x,(dict,list)):yield from nodes(x)
def audit(bundle):
 out=[]
 def one(r):
  url='https://manualdecocina.com'+r['public_path'];status,s,final=get(url);p=Page();p.feed(s);assert status==200 and final.rstrip('/')==url.rstrip('/'),(url,final)
  assert p.h1==1 and not any('noindex' in x for x in p.robots)
  canonical=[x['href'] for x in p.links if x.get('rel')=='canonical'];assert canonical==[url],(url,canonical)
  alternates=[x for x in p.links if x.get('rel')=='alternate' and x.get('hreflang')]
  expected={'https://manualdecocina.com'+x['public_path'] for x in bundle['records']};assert expected.issubset({x['href'] for x in alternates})
  allnodes=list(nodes(p.ld));recipes=[x for x in allnodes if x.get('@type')=='Recipe'];assert len(recipes)==1
  recipe=recipes[0];assert recipe['name']==r['title'];assert len(recipe['recipeIngredient'])==len(r['ingredients']);assert len(recipe['recipeInstructions'])==8
  assert all(x.get('@type')=='HowToStep' and x.get('image') and x.get('url') and x.get('text') for x in recipe['recipeInstructions'])
  assert recipe.get('datePublished') and recipe.get('author') and recipe.get('recipeYield') and recipe.get('totalTime') and recipe.get('nutrition')
  assert not any(x.get('@type')=='FAQPage' for x in allnodes)
  assert any(x.get('@type')=='BreadcrumbList' for x in allnodes)
  assert 'aggregateRating' not in recipe or recipe['aggregateRating'].get('ratingCount',0)>0
  assert r['seo']['title'] in html.unescape(s) and r['seo']['description'] in html.unescape(s)
  for route in ['/'+r['language'],'/'+r['language']+'/recetas']:
   for attempt in range(3):
    _,listing,_=get('https://manualdecocina.com'+route)
    if r['public_path'] in listing:break
    if attempt<2:time.sleep(1)
   assert r['public_path'] in listing,(r['public_path'],'not in',route)
  return dict(language=r['language'],url=url,http=status,canonical=canonical[0],hreflang=len(alternates),ingredients=len(recipe['recipeIngredient']),steps=8,schema=True,home=True,catalog=True)
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:out=list(ex.map(one,bundle['records']))
 return dict(slug=bundle['slug'],pages=out)
if __name__=='__main__':
 bundles=[json.loads(p.read_text()) for p in DATA.glob('*-bundle.json') if not sys.argv[1:] or p.name.startswith(sys.argv[1]+'-')]
 result=dict(checked_at=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),recipes=[audit(b) for b in bundles])
 _,s,_=get('https://manualdecocina.com/sitemap.xml');locs={e.text for e in ET.fromstring(s).iter() if e.tag.endswith('}loc')}
 for b in bundles:
  for r in b['records']:assert 'https://manualdecocina.com'+r['public_path'] in locs,(r['public_path'],'missing sitemap')
 result['sitemap']=True
 out=Path('seven-new-20261029-production-qa.json');out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False))
