import json,urllib.request,urllib.error,concurrent.futures,re,html,os,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
D=json.loads((ROOT/'editorial/rollo-tres-carnes-navideno-20261103.json').read_text());base='https://manualdecocina.com'
secret=(os.getenv('REVALIDATE_SECRET') or '').rstrip('\r\n')
if secret:
 req=urllib.request.Request(base+'/api/revalidate',data=b'{}',headers={'x-revalidate-secret':secret,'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=40) as res: assert json.load(res).get('revalidated') is True
def page(r):
 try:
  with urllib.request.urlopen(urllib.request.Request(base+r['public_path'],headers={'User-Agent':'ManualDeCocina-RecipeQA/1.0','Cache-Control':'no-cache'}),timeout=40) as res:
   s=res.read().decode();status=res.status
  schemas=[json.loads(html.unescape(x)) for x in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',s,re.S)]
  recipe=next((x for x in schemas if x.get('@type')=='Recipe'),{})
  return {'language':r['language'],'status':status,'title_ok':recipe.get('name')==r['title'],'steps':len(recipe.get('recipeInstructions',[])),'ingredients':len(recipe.get('recipeIngredient',[])),'video_player':'<video' in s and 'preparacion.mp4' in s,'canonical':re.findall(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"',s),'alternates':all(base+x['public_path'] in s for x in D['records']),'nutrition':bool(recipe.get('nutrition'))}
 except Exception as e:return {'language':r['language'],'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(page,D['records']))
for r in results:print(json.dumps(r,ensure_ascii=False))
for path in ['/es/recetas','/sitemap.xml']:
 try:
  with urllib.request.urlopen(base+path,timeout=40) as res:s=res.read().decode();status=res.status
  results.append({'discovery':path,'status':status,'present':D['records'][0]['public_path'] in s})
 except Exception as e:results.append({'discovery':path,'error':str(e)})
print(json.dumps(results[-2:]))
(ROOT/'rollo-publication-qa.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))

assert all(r.get('status')==200 and r.get('title_ok') and r.get('steps')==8 and r.get('ingredients')==15 and r.get('video_player') and r.get('alternates') and r.get('nutrition') for r in results[:7]), 'Publication QA incomplete'
assert results[7].get('present'), 'Missing from recipe catalogue'
print('PASS: seven languages, eight steps, 15 ingredients, video player, nutrition, alternates and discovery')
