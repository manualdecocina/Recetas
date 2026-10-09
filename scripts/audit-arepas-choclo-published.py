"""Compare all seven published recipe pages with their frozen editorial packages."""
import concurrent.futures,datetime,json,pathlib,re,urllib.parse,urllib.request
from html.parser import HTMLParser
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE='https://preview.manualdecocina.com'
def norm(s):return re.sub(r'\s+',' ',str(s)).strip()
def duration_minutes(value):
 match=re.fullmatch(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?',str(value))
 if not match:return None
 hours,minutes,seconds=(int(part or 0) for part in match.groups())
 return hours*60+minutes+seconds/60
def url(s):return urllib.parse.unquote(urllib.parse.urljoin(BASE+'/',s)).split('#')[0]
def nodes(value,kind):
 if isinstance(value,dict):
  if value.get('@type')==kind:yield value
  for child in value.values():yield from nodes(child,kind)
 elif isinstance(value,list):
  for child in value:yield from nodes(child,kind)
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.text=[];self.h1=[];self.capture_h1=False;self.skip=0;self.ld_buffer=None;self.ld=[];self.canonical=[];self.hreflang={};self.links=set();self.selector_links=set();self.current_language=0;self.disabled_languages=0;self.images=set();self.lang=None;self.robots='';self.steps=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ('script','style'):
   self.skip+=1
   if tag=='script' and a.get('type')=='application/ld+json':self.ld_buffer=''
  if tag=='html':self.lang=a.get('lang')
  if tag=='h1':self.capture_h1=True
  if tag=='meta' and a.get('name')=='robots':self.robots=a.get('content','')
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(url(a.get('href','')))
  if tag=='link' and a.get('hreflang'):self.hreflang[a['hreflang']]=url(a.get('href',''))
  if tag=='a' and a.get('href'):self.links.add(url(a['href']))
  if 'md-lang-item' in a.get('class',''):
   if tag=='a':self.selector_links.add(url(a.get('href','')))
   if a.get('aria-current')=='true':self.current_language+=1
   if a.get('aria-disabled')=='true':self.disabled_languages+=1
  if tag=='li' and 'md-step-item' in a.get('class',''):self.steps+=1
  if tag in ('img','source'):
   for key in ('src','srcset'):
    for part in a.get(key,'').split(','):
     src=part.strip().split(' ')[0]
     if not src:continue
     parsed=urllib.parse.urlsplit(src)
     if parsed.path=='/_next/image':src=urllib.parse.parse_qs(parsed.query).get('url',[''])[0]
     self.images.add(url(src))
 def handle_endtag(self,tag):
  if tag=='script' and self.ld_buffer is not None:
   self.ld.append(json.loads(self.ld_buffer));self.ld_buffer=None
  if tag in ('script','style'):self.skip=max(0,self.skip-1)
  if tag=='h1':self.capture_h1=False
 def handle_data(self,data):
  if self.ld_buffer is not None:self.ld_buffer+=data
  if not self.skip:self.text.append(data)
  if self.capture_h1:self.h1.append(data)
def check(task):
 record,alternates=task;errors=[];address=BASE+record['public_path']
 try:
  encoded=urllib.parse.quote(address,safe=':/%')
  request=urllib.request.Request(encoded,headers={'Cache-Control':'no-cache','User-Agent':'ManualDeCocina-ArepasChoclo-QA'})
  with urllib.request.urlopen(request,timeout=45) as response:status=response.status;body=response.read().decode('utf-8');final=url(response.url)
  p=Page();p.feed(body);visible=norm(' '.join(p.text));schemas=list(nodes(p.ld,'Recipe'));crumbs=list(nodes(p.ld,'BreadcrumbList'))
  if status!=200 or final!=address:errors.append('HTTP/canonical route redirected')
  if p.canonical!=[address]:errors.append('canonical')
  if p.hreflang!=alternates:errors.append('reciprocal hreflang or x-default')
  if p.selector_links!=set(alternates.values())-{address} or p.current_language!=1 or p.disabled_languages:errors.append('language selector links')
  if p.lang!=('pt-BR' if record['language']=='pt' else record['language']):errors.append('html lang')
  if 'noindex' not in p.robots:errors.append('noindex')
  if norm(' '.join(p.h1))!=norm(record['title']):errors.append('visible title')
  if len(schemas)!=1 or not crumbs:errors.append('Recipe/BreadcrumbList')
  if p.steps!=len(record['steps']):errors.append('visible step count')
  for label,values in [('step',[s['content'] for s in record['steps']]),('ingredient',[i['name'] for i in record['ingredients']]),('FAQ',[s[k] for s in record['seo']['faq'] for k in ('q','a')]),('summary',[record['summary']]),('notes',[record['notes']])]:
   for value in values:
    if norm(value) not in visible:errors.append('missing visible '+label)
  expected={url(record['image_url']),*(url(s['image_url']) for s in record['steps'])}
  if not expected<=p.images:errors.append('visible recipe/step images')
  if schemas:
   schema=schemas[0]
   if schema.get('name')!=record['title']:errors.append('Recipe title')
   for field,key in [('prepTime','prep_time_minutes'),('cookTime','cook_time_minutes'),('totalTime','total_time_minutes')]:
    if record[key]==0 and field not in schema:continue
    if duration_minutes(schema.get(field))!=record[key]:errors.append('Recipe '+field+' differs from editorial time')
   if [norm(s.get('text','')) for s in schema.get('recipeInstructions',[])]!=[norm(s['content']) for s in record['steps']]:errors.append('Recipe step text')
  return {'path':record['public_path'],'language':record['language'],'http':status,'ok':not errors,'errors':errors}
 except Exception as error:return {'path':record['public_path'],'language':record['language'],'ok':False,'errors':[str(error)]}
plan=json.loads((ROOT/'editorial/arepas-de-choclo-con-queso-plan-20261009.json').read_text());tasks=[]
for g in plan['groups']:
 records=json.loads((ROOT/g['editorial_file']).read_text())['records'];alternates={('pt-BR' if r['language']=='pt' else r['language']):BASE+r['public_path'] for r in records}
 tasks.extend((r,alternates) for r in records)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:rows=list(pool.map(check,tasks))
report={'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'groups':1,'pages':len(rows),'passed':sum(r['ok'] for r in rows),'errors':[r for r in rows if not r['ok']],'results':rows}
(ROOT/'arepas-choclo-published-page-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='results'},ensure_ascii=False))
raise SystemExit(0 if report['pages']==7 and report['passed']==7 else 1)
