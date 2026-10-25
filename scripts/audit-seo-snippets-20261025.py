import json,urllib.request,concurrent.futures,re
from pathlib import Path
D=Path('editorial/lote-cinco-20261024')
a=json.load(open(D/'seo-snippet-patches.json'))
def check(x):
 u='https://manualdecocina.com'+x['public_path']
 try:
  with urllib.request.urlopen(urllib.request.Request(u,headers={'Cache-Control':'no-cache'}),timeout=45) as r:s=r.read().decode()
  title=re.search(r'<title>(.*?)</title>',s,re.S)
  from html import unescape
  actual=unescape(title.group(1)) if title else ''
  # Next metadata escapes quotes; HTMLParser decodes attribute values.
  from html.parser import HTMLParser
  class P(HTMLParser):
   def handle_starttag(self,t,attrs):
    z=dict(attrs)
    if t=='meta' and z.get('name')=='description':self.description=z.get('content')
  p=P();p.description=None;p.feed(s)
  return {'url':u,'ok':actual==x['new_seo']['title'] and p.description==x['new_seo']['description'],'title':actual,'expected_title':x['new_seo']['title']}
 except Exception as e:return {'url':u,'ok':False,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:r=list(ex.map(check,a))
Path('seo-snippet-readback.json').write_text(json.dumps(r,ensure_ascii=False,indent=2))
print('SEO_READBACK_JSON '+json.dumps({'checked':len(r),'passed':sum(x['ok'] for x in r),'errors':[x for x in r if not x['ok']]},ensure_ascii=False))
raise SystemExit(0 if all(x['ok'] for x in r) else 1)
