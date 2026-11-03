"""Verify the exact step photos and their published recipe positions."""
import argparse,concurrent.futures,hashlib,html,json,os,pathlib,re,time,urllib.request,urllib.parse
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE='https://manualdecocina.com'
MANIFEST=json.loads((ROOT/'editorial/complete-step-photos-media-20261103.json').read_text())
PAGES=json.loads((ROOT/'editorial/complete-step-photos-pages-20261103.json').read_text())
REPORT={'stage':None,'checks':[]}
def get(path):
 url=path if path.startswith('https://') else BASE+path
 url=urllib.parse.quote(url,safe=':/?&=%')
 req=urllib.request.Request(url,headers={'User-Agent':'ManualDeCocina-StepPhotosQA/1.0','Cache-Control':'no-cache'})
 with urllib.request.urlopen(req,timeout=30) as r:return r.status,r.headers,r.read(),r.url
def asset(a):
 status,headers,data,url=get(a['url'])
 assert status==200 and headers.get_content_type()=='image/webp',(a['url'],status)
 assert data[:4]==b'RIFF' and data[8:12]==b'WEBP',a['url']
 if a.get('sha256'):assert hashlib.sha256(data).hexdigest()==a['sha256'],a['url']
 return {'url':a['url'],'http':status,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)}
def objects(x):
 if isinstance(x,dict):
  yield x
  for v in x.values():yield from objects(v)
 elif isinstance(x,list):
  for v in x:yield from objects(v)
def normalized(url):
 return urllib.parse.unquote(urllib.parse.urlsplit(url).path)
def page(p):
 status,headers,raw,url=get(p['path']);text=raw.decode()
 assert status==200,(p['path'],status)
 schemas=[json.loads(html.unescape(s)) for s in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',text,re.S)]
 recipes=[x for s in schemas for x in objects(s) if x.get('@type')=='Recipe']
 assert len(recipes)==1,p['path']
 steps=recipes[0]['recipeInstructions']
 assert len(steps)==len(p['step_images']),p['path']
 for i,expected in enumerate(p['step_images']):
  actual=steps[i].get('image')
  if isinstance(actual,dict):actual=actual.get('url')
  if isinstance(actual,list):actual=actual[0]
  assert actual and normalized(actual)==normalized(expected),(p['path'],i+1,'step image mismatch')
 return {'path':p['path'],'http':status,'steps':len(steps),'all_step_images':True}
def refresh():
 secret=(os.getenv('REVALIDATE_SECRET') or '').rstrip('\r\n')
 assert secret,'Missing revalidation secret'
 req=urllib.request.Request(BASE+'/api/revalidate',data=b'{}',headers={'x-revalidate-secret':secret,'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=40) as r:assert json.load(r).get('revalidated') is True
def main():
 parser=argparse.ArgumentParser();parser.add_argument('stage',choices=['assets','content']);args=parser.parse_args()
 REPORT['stage']=args.stage
 for attempt in range(25):
  try:
   if args.stage=='content':refresh()
   with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    REPORT['checks']=list(pool.map(asset if args.stage=='assets' else page,MANIFEST if args.stage=='assets' else PAGES))
   REPORT['status']='PASS';print('PASS',args.stage,len(REPORT['checks']));return
  except Exception as e:
   REPORT['last_error']=str(e);print('Waiting for publication:',args.stage,'attempt',attempt+1,str(e)[:180],flush=True)
   if attempt==24:raise
   time.sleep(15)
if __name__=='__main__':
 try:main()
 finally:
  (ROOT/('complete-step-photos-'+str(REPORT['stage'])+'-qa.json')).write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')

