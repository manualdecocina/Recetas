"""Read-only production QA for five Christmas recipes and their 35 localizations."""
import argparse,concurrent.futures,datetime,hashlib,json,re,urllib.request,urllib.parse
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
BASE='https://manualdecocina.com'
CHECKPOINT=json.loads((ROOT/'editorial/navidad-20261022-checkpoint.json').read_text())
BUNDLES=[json.loads((ROOT/'editorial'/f"{r['slug']}-20261022.json").read_text()) for r in CHECKPOINT['recipes']]
RECORDS=[r for b in BUNDLES for r in b['records']]
def norm(s):return re.sub(r'\s+',' ',str(s)).strip()
def absolute(s):return urllib.parse.unquote(urllib.parse.urljoin(BASE+'/',s)).split('#')[0]
def fetch(path):
 url=urllib.parse.quote(urllib.parse.urljoin(BASE+'/',path),safe=':/%?=&')
 req=urllib.request.Request(url,headers={'User-Agent':'ManualDeCocina-Christmas-QA','Cache-Control':'no-cache'})
 with urllib.request.urlopen(req,timeout=45) as r:return r.status,absolute(r.url),r.read()
def nodes(o,kind):
 if isinstance(o,dict):
  if o.get('@type')==kind:yield o
  for v in o.values():yield from nodes(v,kind)
 elif isinstance(o,list):
  for v in o:yield from nodes(v,kind)
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.text=[];self.h1=[];self.in_h1=False;self.skip=0;self.buffer=None;self.ld=[];self.canonical=[];self.alternates={};self.images=set();self.steps=0;self.lang=None;self.meta={}
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ('script','style'):
   self.skip+=1
   if a.get('type')=='application/ld+json':self.buffer=''
  if tag=='html':self.lang=a.get('lang')
  if tag=='h1':self.in_h1=True
  if tag=='li' and 'md-step-item' in a.get('class',''):self.steps+=1
  if tag=='meta':self.meta[a.get('name') or a.get('property')]=a.get('content','')
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(absolute(a.get('href','')))
  if tag=='link' and a.get('hreflang'):self.alternates[a['hreflang']]=absolute(a.get('href',''))
  if tag in ('img','source'):
   for key in ('src','srcset'):
    for part in a.get(key,'').split(','):
     value=part.strip().split(' ')[0]
     if not value:continue
     p=urllib.parse.urlsplit(value)
     if p.path=='/_next/image':value=urllib.parse.parse_qs(p.query).get('url',[''])[0]
     self.images.add(absolute(value))
 def handle_endtag(self,tag):
  if tag=='script' and self.buffer is not None:self.ld.append(json.loads(self.buffer));self.buffer=None
  if tag in ('script','style'):self.skip=max(0,self.skip-1)
  if tag=='h1':self.in_h1=False
 def handle_data(self,data):
  if self.buffer is not None:self.buffer+=data
  if not self.skip:self.text.append(data)
  if self.in_h1:self.h1.append(data)
def check_page(pair):
 bundle,r=pair;url=BASE+r['public_path'];errors=[]
 try:
  status,final,raw=fetch(url);p=Page();p.feed(raw.decode());visible=norm(' '.join(p.text))
  expected={('pt-BR' if x['language']=='pt' else x['language']):BASE+x['public_path'] for x in bundle['records']}
  if status!=200 or final!=url:errors.append('HTTP/final URL')
  if p.canonical!=[url]:errors.append('self canonical')
  if p.alternates!=expected:errors.append('seven reciprocal hreflang')
  if p.lang!=('pt-BR' if r['language']=='pt' else r['language']):errors.append('html lang')
  if norm(' '.join(p.h1))!=norm(r['title']):errors.append('title')
  if p.steps!=8:errors.append('eight steps')
  for kind,values in [('ingredient',[i['name'] for i in r['ingredients']]),('step',[s['content'] for s in r['steps']]),('FAQ',[v for f in r['seo']['faq'] for v in f.values()])]:
   for value in values:
    if norm(value) not in visible:errors.append('missing visible '+kind)
  recipes=list(nodes(p.ld,'Recipe'))
  if len(recipes)!=1:errors.append('one Recipe JSON-LD')
  else:
   schema=recipes[0];nutrition=schema.get('nutrition',{})
   if str(r['nutrition']['calories']) not in str(nutrition.get('calories','')):errors.append('schema calories')
   if len(schema.get('recipeInstructions',[]))!=8:errors.append('schema steps')
   if schema.get('aggregateRating') is not None:errors.append('unexpected rating')
   if schema.get('totalTime')!=f"PT{r['total_time_minutes']}M":errors.append('schema total time')
  expected_images={absolute(r['image_url']),*[absolute(s['image_url']) for s in r['steps']]}
  if not expected_images<=p.images:errors.append('visible photos')
  if 'noindex' in p.meta.get('robots',''):errors.append('robots noindex')
  if absolute(p.meta.get('og:url',''))!=url or not p.meta.get('og:image'):errors.append('Open Graph')
  return {'url':url,'language':r['language'],'ok':not errors,'errors':errors}
 except Exception as e:return {'url':url,'language':r['language'],'ok':False,'errors':[str(e)]}
def check_media(item):
 try:
  status,final,data=fetch(item['public_path'])
  good=status==200 and data[:4]==b'RIFF' and data[8:12]==b'WEBP' and hashlib.sha256(data).hexdigest()==item['sha256']
  return {'path':item['public_path'],'ok':good}
 except Exception as e:return {'path':item['public_path'],'ok':False,'error':str(e)}
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--media-only',action='store_true');args=parser.parse_args()
 media=[x for b in BUNDLES for x in json.loads((ROOT/'editorial'/f"{b['slug']}-imagenes-20261022.json").read_text())['images']]
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:m=list(pool.map(check_media,media))
 report={'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'media':m,'media_passed':sum(x['ok'] for x in m)}
 if not args.media_only:
  with concurrent.futures.ThreadPoolExecutor(max_workers=7) as pool:pages=list(pool.map(check_page,[(b,r) for b in BUNDLES for r in b['records']]))
  report['pages']=pages;report['pages_passed']=sum(x['ok'] for x in pages)
  _,_,sitemap=fetch('/sitemap.xml');text=urllib.parse.unquote(sitemap.decode())
  report['missing_sitemap']=[r['public_path'] for r in RECORDS if BASE+r['public_path'] not in text]
  surfaces={}
  for route in ['/es','/es/recetas']:
   status,_,raw=fetch(route);text=urllib.parse.unquote(raw.decode());surfaces[route]={'http':status,'missing':[b['records'][0]['public_path'] for b in BUNDLES if b['records'][0]['public_path'] not in text]}
  report['surfaces']=surfaces
 out=ROOT/'navidad-20261022-production-qa.json';out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(report,ensure_ascii=False))
 ok=report['media_passed']==60
 if not args.media_only:ok=ok and report['pages_passed']==35 and not report['missing_sitemap'] and all(x['http']==200 and not x['missing'] for x in report['surfaces'].values())
 raise SystemExit(0 if ok else 1)
if __name__=='__main__':main()
