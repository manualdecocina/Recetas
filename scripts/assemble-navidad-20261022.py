"""Assemble seven localized records per recipe and reproducible nutrient evidence."""
import json, hashlib, html, importlib.util
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('base',ROOT/'scripts/build-navidad-20261022.py')
base=importlib.util.module_from_spec(spec);spec.loader.exec_module(base)
LANGS=['es','de','en','fr','it','ja','pt']
LABELS={
 'es':('Postres','Entrantes y aperitivos','Postre','Entrada','Internacional','Fácil'),
 'de':('Desserts','Vorspeisen','Dessert','Vorspeise','International','Einfach'),
 'en':('Desserts','Starters & appetizers','Dessert','Starter','International','Easy'),
 'fr':('Desserts','Entrées et apéritifs','Dessert','Entrée','Internationale','Facile'),
 'it':('Dolci','Antipasti','Dessert','Antipasto','Internazionale','Facile'),
 'ja':('デザート','前菜・おつまみ','デザート','前菜','各国料理','簡単'),
 'pt':('Sobremesas','Entradas e aperitivos','Sobremesa','Entrada','Internacional','Fácil')}
NUTRITION_TEXT={
 'es':('Suma de nutrientes por 100 g × peso de cada ingrediente / 100, dividida por las porciones.','Estimación de la formulación; cambia según marcas, porción real y pérdidas de cocción. No es un análisis de laboratorio.'),
 'de':('Summe der Nährwerte je 100 g × Zutatengewicht / 100, geteilt durch die Portionenzahl.','Schätzung aus der Rezeptur; Marke, tatsächliche Portion und Garverluste verändern die Werte. Keine Laboranalyse.'),
 'en':('Sum of nutrients per 100 g × each ingredient weight / 100, divided by the number of servings.','Recipe-based estimate; brands, actual portions and cooking losses affect the values. Not a laboratory analysis.'),
 'fr':('Somme des nutriments pour 100 g × poids de chaque ingrédient / 100, divisée par le nombre de portions.','Estimation selon la formulation ; les marques, les portions réelles et les pertes de cuisson modifient les valeurs. Pas une analyse de laboratoire.'),
 'it':('Somma dei nutrienti per 100 g × peso di ogni ingrediente / 100, divisa per il numero di porzioni.','Stima della formulazione: marche, porzioni reali e perdite di cottura cambiano i valori. Non è un’analisi di laboratorio.'),
 'ja':('材料100 gあたりの栄養価×各使用重量÷100を合計し、人数で割って算出。','配合からの推定値です。製品、実際の盛り付け量、加熱による損失で変わります。検査機関での分析値ではありません。'),
 'pt':('Soma dos nutrientes por 100 g × peso de cada ingrediente / 100, dividida pelo número de porções.','Estimativa pela formulação; marcas, porções reais e perdas no cozimento alteram os valores. Não é análise laboratorial.')}

NUTRIENT_IDS={1008:'calories',1003:'protein_g',1005:'carbs_g',1004:'fat_g',1258:'saturated_fat_g',1079:'fiber_g',2000:'sugar_g',1093:'sodium_mg'}
USDA_IDS={173430,173418,169656,170859,170272,170185,171244,170848,171287,172177,167803,170187,172336,173473,172821,169593,171890,168191,173435,168277,169640,170932}
MAPPING={
 'pistacho':[('digestive',120),('173430',40),('173418',300),('170185',90),('169656',45),('170859',200),('170272',90),('170185',20)],
 'arbol':[('puff',500),('pesto',80),('171244',100),('170848',25),('171287',50)],
 'brie':[('puff',250),('172177',180),('167803',120),('170187',30),('172336',5),('173473',2)],
 'turron':[('turron',150),('mascarpone',250),('170859',200),('172821',120),('171890',180),('169593',8)],
 'datiles':[('168191',288),('173435',90),('168277',120),('169640',15),('170932',0.5)]}
PANTRY={
 'pistacho':['galletas-digestive','mantequilla','queso-crema','pasta-pistacho-pura','azucar-glas','crema-de-leche','chocolate-negro','pistachos'],
 'arbol':['hojaldre','pesto-albahaca','queso-mozzarella','queso-parmesano','huevo'],
 'brie':['hojaldre','queso-brie','salsa-arandanos-rojos','nueces','aceite-de-canola','romero'],
 'turron':['turron-blando-almendra','queso-mascarpone','crema-de-leche','bizcochos-soletilla','cafe-preparado','cacao-en-polvo'],
 'datiles':['datiles-medjool','queso-cabra','tocineta','miel','aji-seco']}

def nutrients():
 data=json.loads(Path('/workspace/scratch/12e0dc6a08a7/usda-sr.json').read_text())
 result={}
 for r in data['SRLegacyFoods']:
  if r['fdcId'] not in USDA_IDS:continue
  vals={NUTRIENT_IDS[n['nutrient']['id']]:n['amount'] for n in r['foodNutrients'] if n['nutrient']['id'] in NUTRIENT_IDS and 'amount' in n}
  result[str(r['fdcId'])]={'description':r['description'],'fdc_id':r['fdcId'],'per_100g':vals,'source_url':f"https://fdc.nal.usda.gov/food-details/{r['fdcId']}/nutrients"}
 def label(key,description,url,values,notes=None):
  result[key]={'description':description,'source_url':url,'per_100g':dict(zip(['calories','protein_g','carbs_g','fat_g','saturated_fat_g','fiber_g','sugar_g','sodium_mg'],values))}
  if notes:result[key]['assumptions']=notes
 label('digestive','McVitie’s Digestive Original reference label','https://www.mcvities.se/mcvities-digestive-original/',[483,7.1,63.7,21.3,10.1,3.7,15.1,520],'Salt 1.3 g / 2.5 × 1000 = 520 mg sodium per 100 g.')
 label('puff','Jus-Rol chilled puff pastry sheet reference label','https://www.jusrol.co.uk/products/puff-pastry-sheets/',[362,5.4,35.7,20,9.9,1.9,.3,312],'Salt 0.78 g / 2.5 × 1000 = 312 mg sodium. Reference composition only, pack shape not mandated.')
 label('pesto','Barilla Pesto alla Genovese reference label','https://www.barilla.com/en-gb/products/pesto/pesto/pesto-alla-genovese',[492,4.7,11,47,5.3,3,5,1280],'Salt 3.2 g / 2.5 × 1000 = 1280 mg sodium.')
 label('mascarpone','Galbani mascarpone reference label','https://www.galbani.co.uk/products/mascarpone/galbani-mascarpone-250g',[403,4.5,4,41,28,None,3,32],'Fibre not declared: not treated as zero. Salt 0.08 g / 2.5 × 1000 = 32 mg sodium.')
 label('turron','El Almendro Cosecha Propia soft almond turrón reference label','https://elalmendro.com/tienda/turron-tradicional/cosecha-propia/turron-blando/',[535.2,15,34,36,2.8,7.6,30,12],'Energy not declared on retrieved page: calculated as 4 × protein + 4 × carbohydrate + 9 × fat + 2 × fibre (EU label factors), not a quoted label energy. Salt 0.03 g / 2.5 × 1000 = 12 mg sodium. Brand labels differ.')
 return result

def main():
 ns=nutrients(); bundles=[]
 for r in base.RECIPES:
  if r['key']=='arbol':r['rest']=20 # 15 min chilled + 5 min after baking
  r['total']=r['prep']+r['cook']+r['rest']
  evidence=[]
  for key,grams in MAPPING[r['key']]:evidence.append({**ns[key],'grams':grams})
  numeric={}
  for k in NUTRIENT_IDS.values():
   if all(f['per_100g'].get(k) is not None for f in evidence):numeric[k]=round(sum(f['per_100g'][k]*f['grams']/100 for f in evidence)/r['servings'],0 if k=='calories' else 1)
  numeric['calories']=int(numeric['calories'])
  records=[]
  for lang in LANGS:
   loc=({'slug':r['slug'],'title':r['title'],'summary':r['summary'],'notes':r['notes'],'steps':r['steps'],'faq':r['faq'],'ingredients':[x[0] for x in r['ingredients']],'serving_size':{'pistacho':'1 de 6 vasitos','arbol':'1/8 del árbol y de todos los recortes horneados','brie':'2 de los 12 bocaditos','turron':'1 de los 6 vasitos','datiles':'2 de los 12 dátiles rellenos'}[r['key']]} if lang=='es' else json.loads((ROOT/'editorial'/f'navidad-20261022-{lang}.json').read_text())[r['key']])
   assert len(loc['steps'])==8 and len(loc['ingredients'])==len(r['ingredients']) and len(loc['faq'])==3
   path=f"/{loc['slug']}" if lang=='es' else f"/{lang}/{loc['slug']}"
   imagebase=f"/recetas/{r['slug']}"
   dessert=r['category']=='Postres';labels=LABELS[lang]
   ingredients=[{'name':name,'amount':amount,'unit':unit} for name,(_,amount,unit) in zip(loc['ingredients'],r['ingredients'])]
   record={'language':lang,'slug':loc['slug'],'public_path':path,'title':loc['title'],'excerpt':loc['summary'],'summary':loc['summary'],'notes':loc['notes'],
    'content_html':'<p>'+html.escape(loc['summary'])+'</p><p>'+html.escape(loc['notes'])+'</p>',
    'ingredients':ingredients,'steps':[{'title':a,'content':b,'image_url':f'{imagebase}/paso-{i:02}.webp','image_alt':f"{loc['title']}: {a}"} for i,(a,b) in enumerate(loc['steps'],1)],
    'category':labels[0 if dessert else 1],'course':labels[2 if dessert else 3],'cuisine':labels[4],'difficulty':labels[5],
    'prep_time_minutes':r['prep'],'cook_time_minutes':r['cook'],'total_time_minutes':r['total'],'servings':r['servings'],
    'image_url':f'{imagebase}/portada.webp','gallery':[{'url':f'{imagebase}/portada.webp','alt':loc['title']}],'video_urls':[],
    'keywords':[loc['title'],*loc['ingredients'][:3]],
    'nutrition':{**numeric,'estimated':True,'serving_size':loc['serving_size'],'source':'USDA FoodData Central SR Legacy + manufacturer reference labels','source_url':'https://fdc.nal.usda.gov/','method':NUTRITION_TEXT[lang][0],'note':NUTRITION_TEXT[lang][1]},
    'seo':{'title':loc['title']+' | Manual de Cocina','description':loc['summary'],'image_alt':loc['title'],'image_variants':[f'{imagebase}/portada-{ratio}.webp' for ratio in ['1x1','4x3','16x9']],'faq':[{'q':q,'a':a} for q,a in loc['faq']],'rest_time_minutes':r['rest']},
    'published':False,'editorial_status':'draft','source_url':None,'source_post_id':None}
   records.append(record)
  bundle={'slug':r['slug'],'key':r['key'],'date':'2026-10-22','target':'https://manualdecocina.com','state':'SEVEN_LANGUAGES_DRAFT_AWAITING_MEDIA_QA','languages':LANGS,'steps_es_sha256':r['steps_es_sha256'] if 'steps_es_sha256' in r else hashlib.sha256(json.dumps(r['steps'],ensure_ascii=False,separators=(',',':')).encode()).hexdigest(),'physical_kitchen_test':False,'category_slug':'postres' if dessert else 'entrantes-y-aperitivos','nutrition_calculation':{'servings':r['servings'],'foods':evidence,'result':numeric,'archive_sha256':'0fe8ae486a2c8eb42cb96413f058deb51863a46c8fb8eeb4b1fb45006dd338ef','assumptions':['All recipe inputs counted, including pastry offcuts and all brushing egg.','Pure pistachio paste approximated by unsalted dry-roasted pistachio nuts.','Cream 35% approximated by USDA heavy whipping cream.','Full 180 ml unsweetened coffee counted, though some dipping coffee may remain.','All bacon counted; rendered fat is not subtracted.','Manufacturer label reference foods vary by market; this is not a brand-specific requirement.']},'pantry_slugs':PANTRY[r['key']],'records':records}
  (ROOT/'editorial'/f"{r['slug']}-20261022.json").write_text(json.dumps(bundle,ensure_ascii=False,indent=2)+'\n')
  bundles.append(bundle)
  print(r['slug'],len(records),'languages',numeric['calories'],'kcal','total',r['total'])
 (ROOT/'editorial/navidad-20261022-nutrition-sources.json').write_text(json.dumps(ns,ensure_ascii=False,indent=2)+'\n')
 (ROOT/'editorial/navidad-20261022-records.json').write_text(json.dumps([x for b in bundles for x in b['records']],ensure_ascii=False,indent=2)+'\n')

if __name__=='__main__':main()
