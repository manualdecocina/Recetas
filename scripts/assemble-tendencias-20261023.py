"""Seven complete records, traceable nutrition and contextual internal links."""
import json,html,hashlib,importlib.util
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
base=module('tendencias',ROOT/'scripts/build-tendencias-20261023.py')
old=module('nutrition_text',ROOT/'scripts/assemble-navidad-20261022.py')
LANGS=['es','de','en','fr','it','ja','pt']
CAT={
'guarniciones':['Guarniciones','Beilagen','Side dishes','Accompagnements','Contorni','付け合わせ','Acompanhamentos'],
'ensaladas':['Ensaladas','Salate','Salads','Salades','Insalate','サラダ','Saladas'],
'entrantes-y-aperitivos':['Entrantes y aperitivos','Vorspeisen','Starters & appetizers','Entrées et apéritifs','Antipasti','前菜・おつまみ','Entradas e aperitivos'],
'platos-principales':['Platos principales','Hauptgerichte','Main dishes','Plats principaux','Secondi piatti','主菜','Pratos principais'],
'postres':['Postres','Desserts','Desserts','Desserts','Dolci','デザート','Sobremesas']}
COURSE={'guarniciones':['Guarnición','Beilage','Side dish','Accompagnement','Contorno','副菜','Acompanhamento'],'ensaladas':['Ensalada','Salat','Salad','Salade','Insalata','サラダ','Salada'],'entrantes-y-aperitivos':['Entrada','Vorspeise','Starter','Entrée','Antipasto','前菜','Entrada'],'platos-principales':['Plato principal','Hauptgericht','Main course','Plat principal','Secondo piatto','主菜','Prato principal'],'postres':['Postre','Dessert','Dessert','Dessert','Dessert','デザート','Sobremesa']}
IDS={1008:'calories',1003:'protein_g',1005:'carbs_g',1004:'fat_g',1258:'saturated_fat_g',1079:'fiber_g',2000:'sugar_g',1093:'sodium_mg'}
MAP={'repollo':[169975,171413,173430,172442,167747,169230,'water',170151],
'arroz':[168878,173757,168409,170393,171413,174277,170189,167747,'water',170416],
'coliflor':[169986,169761,'water','panko',171413,171329,173468,169640,170932,167747],
'gyozas':['gyoza',170173,'water','curry',174277,169231,169230,168462,168156,170005],
'yogur':[171304,172819,167762]}
PANTRY={'repollo':['repollo','aceite-de-oliva','mantequilla',None,'limon','ajo','agua','semillas-de-sesamo'],
'arroz':['arroz-blanco-cocido','garbanzos','pepino','zanahoria','aceite-de-oliva','salsa-de-soja','tahini','limon','agua','perejil'],
'coliflor':[None,'harina-de-trigo','agua','pan-rallado','aceite-de-oliva','pimenton-dulce','sal','miel','chile-molido','limon'],
'gyozas':[None,None,'agua',None,'salsa-de-soja','jengibre','ajo','espinacas',None,'cebolleta'],
'yogur':['yogur-griego','galletas-dulces-sencillas','fresas']}
RELATED={'repollo':['/receta-de-okonomiyaki','/zanahorias-glaseadas'],'arroz':['/arroz-blanco-perfecto','/receta-de-hummus'],'coliflor':['/receta-de-hummus','/receta-guacamole'],'gyozas':['/arroz-blanco-perfecto','/bulgogi-carne-marinada-coreana'],'yogur':['/vasitos-cheesecake-pistacho-chocolate','/tiramisu-turron-vasitos']}
NEWRELATED={'repollo':'gyozas','arroz':'coliflor','coliflor':'arroz','gyozas':'repollo','yogur':'repollo'}
def main():
 archive=ROOT.parent/'usda-sr-new.json';data=json.loads(archive.read_text());wanted={x for a in MAP.values() for x in a if isinstance(x,int)};foods={}
 for f in data['SRLegacyFoods']:
  if f['fdcId'] in wanted:foods[str(f['fdcId'])]={'description':f['description'],'fdc_id':f['fdcId'],'source_url':f"https://fdc.nal.usda.gov/food-details/{f['fdcId']}/nutrients",'per_100g':{IDS[n['nutrient']['id']]:n['amount'] for n in f['foodNutrients'] if n['nutrient']['id'] in IDS and 'amount' in n}}
 def label(key,description,url,vals,note):foods[key]={'description':description,'source_url':url,'per_100g':dict(zip(IDS.values(),vals)),'assumptions':note}
 label('water','Water','https://fdc.nal.usda.gov/',[0,0,0,0,0,0,0,0],'Cooking water; does not add macronutrients. Mineral composition not modelled.')
 label('panko','Kikkoman Panko reference label','https://www.kikkoman.eu/food-service/products/detail/fs-kikkoman-panko-japanese-style-crispy-bread-crumbs',[369,14,72,1.9,.5,None,4.9,120],'Salt 0.3 g / 2.5 × 1000 = 120 mg sodium. Fibre not stated, not assumed zero.')
 label('gyoza','Itsu vegetable fusion gyoza reference label','https://www.itsu.com/grocery/products/gyoza-and-bao/vegetable-fusion-gyoza/',[173,9.4,25,3.5,.5,2.6,3.8,440],'Salt 1.1 g / 2.5 × 1000 = 440 mg sodium. Nutrition reference, not a brand requirement; follow the actual product cooking/storage label.')
 label('curry','Thai Kitchen red curry paste Canadian reference label','https://www.clubhouse.ca/en-ca/thai-kitchen/products/pastes-dips-and-sauces/red-curry-paste',[62.5,2.5,18.75,0,0,6.25,6.25,2062.5],'Label per 16 g scaled × 100/16. Values and sodium vary considerably by product.')
 locales={l:json.loads((ROOT/'editorial'/f'tendencias-20261023-{l}.json').read_text()) for l in LANGS if l!='es'}
 related=json.loads((ROOT/'editorial/tendencias-20261023-related.json').read_text());bygroup={}
 for row in related:bygroup.setdefault(row['recipe_group_id'],{})[row['language']]=row
 byes={v['es']['public_path']:v for v in bygroup.values() if 'es' in v}
 allbundles=[]
 for r in base.RECIPES:
  evidence=[{**foods[str(f)],'grams':float(i[1]),'ingredient':i[0]} for f,i in zip(MAP[r['key']],r['ingredients'])]
  numeric={k:round(sum(e['per_100g'][k]*e['grams']/100 for e in evidence)/r['servings'],0 if k=='calories' else 1) for k in IDS.values() if all(e['per_100g'].get(k) is not None for e in evidence)};numeric['calories']=int(numeric['calories'])
  records=[];frozen=json.loads((ROOT/'editorial'/f"{r['slug']}-20261023-es.json").read_text())
  for li,l in enumerate(LANGS):
   loc=({'slug':r['slug'],'title':r['title'],'summary':r['summary'],'notes':r['notes'],'ingredients':[i[0] for i in r['ingredients']],'steps':r['steps'],'faq':r['faq'],'serving_size':{'repollo':'2 de los 8 gajos','arroz':'un cuarto de la ensalada','coliflor':'un cuarto de la coliflor y la salsa','gyozas':'un cuarto de las gyozas, espinacas y salsa','yogur':'1 de los 4 vasitos'}[r['key']]} if l=='es' else locales[l][r['key']])
   assert len(loc['steps'])==8 and len(loc['ingredients'])==len(r['ingredients']) and len(loc['faq'])==3
   links=[]
   for path in RELATED[r['key']]:
    if l in byes.get(path,{}):links.append(byes[path][l])
   nr=next(x for x in base.RECIPES if x['key']==NEWRELATED[r['key']]);nl=({'slug':nr['slug'],'title':nr['title']} if l=='es' else locales[l][nr['key']]);links.append({'public_path':('/' if l=='es' else f'/{l}/')+nl['slug'],'title':nl['title']})
   heading=['También puedes preparar','Dazu passen','You may also like','À préparer aussi','Da provare anche','こちらのレシピも','Prepare também'][li]
   content='<p>'+html.escape(loc['summary'])+'</p><p>'+html.escape(loc['notes'])+'</p><h2>'+heading+'</h2><ul>'+''.join('<li><a href="'+html.escape(a['public_path'],quote=True)+'">'+html.escape(a['title'])+'</a></li>' for a in links)+'</ul>'
   imagebase=f"https://eqbdtctxbpepbeickhqi.supabase.co/storage/v1/object/public/recetas/{r['slug']}"
   records.append({'language':l,'slug':loc['slug'],'public_path':('/' if l=='es' else f'/{l}/')+loc['slug'],'title':loc['title'],'excerpt':loc['summary'],'summary':loc['summary'],'notes':'<p>'+html.escape(loc['notes'])+'</p>'+content[content.index('<h2>'):],'content_html':content,'ingredients':[{'name':n,'amount':a,'unit':u} for n,(_,a,u) in zip(loc['ingredients'],r['ingredients'])],'steps':[{'title':a,'content':b,'image_url':f'{imagebase}/paso-{i:02}.webp','image_alt':loc['title']+': '+a} for i,(a,b) in enumerate(loc['steps'],1)],'category':CAT[r['category']][li],'course':COURSE[r['category']][li],'cuisine':['Internacional','International','International','Internationale','Internazionale','各国料理','Internacional'][li],'difficulty':['Fácil','Einfach','Easy','Facile','Facile','簡単','Fácil'][li],'prep_time_minutes':r['prep'],'cook_time_minutes':r['cook'],'total_time_minutes':r['prep']+r['cook']+r['rest'],'servings':r['servings'],'image_url':imagebase+'/portada.webp','gallery':[{'url':imagebase+'/portada.webp','alt':loc['title']}],'video_urls':[],'keywords':[loc['title'],*loc['ingredients'][:2]],'nutrition':{**numeric,'estimated':True,'serving_size':loc['serving_size'],'source':'USDA FoodData Central SR Legacy + manufacturer reference labels','source_url':'https://fdc.nal.usda.gov/','method':old.NUTRITION_TEXT[l][0],'note':old.NUTRITION_TEXT[l][1]},'seo':{'title':loc['title']+' | Manual de Cocina','description':loc['summary'],'image_alt':loc['title'],'image_variants':[imagebase+'/portada-'+a+'.webp' for a in ['1x1','4x3','16x9']],'faq':[{'q':q,'a':a} for q,a in loc['faq']],'rest_time_minutes':r['rest']},'published':False,'editorial_status':'draft','source_url':None,'source_post_id':None})
  b={'slug':r['slug'],'key':r['key'],'date':'2026-10-23','target':'https://manualdecocina.com','state':'seven_languages_draft','languages':LANGS,'category_slug':r['category'],'steps_es_sha256':frozen['steps_es_sha256'],'physical_kitchen_test':False,'nutrition_calculation':{'foods':evidence,'servings':r['servings'],'result':numeric,'archive_sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'assumptions':['All ingredient inputs counted; cooking losses are not subtracted.','Generic USDA miso models white miso and varies by product.','Dried chilli flakes approximated by USDA red/cayenne pepper.','Manufacturer reference values vary by market; use actual labels for personal calculations.']},'pantry_slugs':PANTRY[r['key']],'records':records}
  (ROOT/'editorial'/f"{r['slug']}-20261023.json").write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n');allbundles.append(b)
  print(r['slug'],len(records),'versions',numeric['calories'],'estimated kcal')
 (ROOT/'editorial/tendencias-20261023-nutrition-sources.json').write_text(json.dumps(foods,ensure_ascii=False,indent=2)+'\n')
 (ROOT/'editorial/tendencias-20261023-records.json').write_text(json.dumps([r for b in allbundles for r in b['records']],ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
