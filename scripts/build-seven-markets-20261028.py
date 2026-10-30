"""Build seven new recipe groups, preserving measured inputs across seven languages."""
import json,html,hashlib,re,runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'editorial/siete-mercados-20261028'
LANGS=['es','de','en','fr','it','ja','pt'];KEYS=['castanas','garbanzos','zwiebel','lentejas','chocolate','daigaku','farofa']
dump=lambda p,v:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
labels=runpy.run_path(str(D/'locale-labels.py'));NUT=labels['NUT'];SERV=labels['SERV'];HEAD=labels['HEAD']
CAT={}
for quoted,plain,body in re.findall(r"(?:'([^']+)'|(\w+)):\s*\{([^}]+)\}", (ROOT/'src/lib/categories.ts').read_text()):
 vals=dict(re.findall(r"(es|de|en|fr|it|ja|pt):\s*'([^']+)'",body))
 if len(vals)==7:CAT[quoted or plain]=vals
CUISINE=dict(zip(KEYS,[['Española','Spanisch','Spanish','Espagnole','Spagnola','スペイン料理','Espanhola'],['Estadounidense de inspiración italiana','US-amerikanisch, italienisch inspiriert','American, Italian inspired','Américaine, inspiration italienne','Statunitense, ispirazione italiana','イタリア風アメリカ料理','Estadunidense, inspiração italiana'],['Alemana','Deutsch','German','Allemande','Tedesca','ドイツ料理','Alemã'],['Francesa','Französisch','French','Française','Francese','フランス料理','Francesa'],['Italiana','Italienisch','Italian','Italienne','Italiana','イタリア料理','Italiana'],['Japonesa','Japanisch','Japanese','Japonaise','Giapponese','日本料理','Japonesa'],['Brasileña','Brasilianisch','Brazilian','Brésilienne','Brasiliana','ブラジル料理','Brasileira']]))
PROXY=['Referencias genéricas para mostaza preparada, crema, boniato, aceite y chocolate; las variedades y marcas concretas pueden diferir.','Generische Referenzen für Senf, Sahne, Süßkartoffeln, Öl und Schokolade; Sorten und Marken können abweichen.','Generic references for prepared mustard, cream, sweet potato, oil and chocolate; specific varieties and brands can differ.','Références génériques pour moutarde préparée, crème, patate douce, huile et chocolat ; variétés et marques peuvent différer.','Riferimenti generici per senape preparata, panna, patata dolce, olio e cioccolato; varietà e marche possono differire.','マスタード、生クリーム、さつまいも、油、チョコレートは一般的な参考値を使用し、品種や商品で異なります。','Referências genéricas para mostarda preparada, creme, batata-doce, óleo e chocolate; variedades e marcas podem diferir.']
refs=json.loads((D/'reference-foods.json').read_text());loc={l:json.loads((D/f'locales-{l}.json').read_text()) for l in LANGS if l!='es'}
recipes={r['key']:r for p in D.glob('*-es.json') if (r:=json.loads(p.read_text()))}
bundles=[]
for key in KEYS:
 r=recipes[key];ev=[]
 for name,amount,unit,pantry,ref,grams in r['ingredients']:
  if grams>0:ev.append(dict(ingredient=name,grams=grams,reference_key=ref,**refs[ref]))
 assert ev and all(all(k in x['per_100g'] for k in ['calories','protein_g','carbs_g','fat_g']) for x in ev)
 nums={k:round(sum(e['per_100g'][k]*e['grams']/100 for e in ev)/r['servings'],0 if k in ['calories','sodium_mg'] else 1) for k in ['calories','protein_g','carbs_g','fat_g','saturated_fat_g','fiber_g','sugar_g','sodium_mg'] if all(k in e['per_100g'] for e in ev)};nums['calories']=int(nums['calories'])
 records=[]
 for i,l in enumerate(LANGS):
  t={**r,'ingredients':[a[0] for a in r['ingredients']]} if l=='es' else loc[l][key]
  assert len(t['steps'])==8 and len(t['ingredients'])==len(r['ingredients']) and len(t['faq'])==3
  base='https://eqbdtctxbpepbeickhqi.supabase.co/storage/v1/object/public/recetas/'+r['slug']+'/'
  path=('/' if l=='es' else '/'+l+'/')+t['slug'];title=t['title'];notes='<p>'+html.escape(t['notes'])+'</p>'
  nutrition=dict(**nums,estimated=True,serving_size=SERV[i].format(n=r['servings']),source='USDA FoodData Central SR Legacy'+(' + TBCA BRC0088B' if key=='farofa' else ''),source_url=refs['cassavaflour']['source_url'] if key=='farofa' else 'https://fdc.nal.usda.gov/download-datasets/',method=NUT[i][0],note=NUT[i][1]+' '+PROXY[i])
  records.append(dict(language=l,slug=t['slug'],public_path=path,title=title,excerpt=t['summary'],summary=t['summary'],notes=notes,content_html='<p>'+html.escape(t['summary'])+'</p>'+notes,ingredients=[dict(name=n,amount=a[1],unit=a[2]) for n,a in zip(t['ingredients'],r['ingredients'])],steps=[dict(title=a,content=b,image_url=base+f'paso-{n:02}.webp',image_alt=title+': '+a) for n,(a,b) in enumerate(t['steps'],1)],category=CAT[r['category']][l],course=CAT[r['category']][l],cuisine=CUISINE[key][i],difficulty=(['Media','Mittel','Medium','Moyenne','Media','中級','Média'] if r['difficulty']=='Media' else ['Fácil','Einfach','Easy','Facile','Facile','簡単','Fácil'])[i],prep_time_minutes=r['prep'],cook_time_minutes=r['cook'],total_time_minutes=r['prep']+r['cook']+r['rest'],servings=r['servings'],image_url=base+'portada.webp',gallery=[dict(url=base+'portada.webp',alt=title)],video_urls=[],keywords=[title,*t['ingredients'][:2]],nutrition=nutrition,seo=dict(title=title,description=t['summary'],image_alt=title,image_variants=[base+'portada-'+a+'.webp' for a in ['1x1','4x3','16x9']],faq=[dict(q=q,a=a) for q,a in t['faq']],rest_time_minutes=r['rest']),published=False,editorial_status='draft',source_url=None,source_post_id=None))
 b=dict(slug=r['slug'],key=key,date='2026-10-28',target='https://manualdecocina.com',origin_market=r['market'],languages=LANGS,category_slug=r['category'],steps_es_sha256=hashlib.sha256(json.dumps(r['steps'],ensure_ascii=False).encode()).hexdigest(),physical_kitchen_test=False,pantry_slugs=[x[3] for x in r['ingredients']],sources=r['sources'],nutrition_calculation=dict(foods=ev,result=nums,servings=r['servings'],assumptions=['Edible chestnut yield estimated at 350 g from 500 g shell-on.','All listed salt, oil and bacon fat counted; no retention deduction.','Milk, broth and vinegar ml approximated as grams.','USDA prepared yellow mustard is a proxy for Dijon; generic sweet potato for Japanese variety, whole sesame for black, heavy cream for 35%, sunflower oil for vegetable oil, 70–85% dark chocolate for 70%.','Farofa cassava meal uses TBCA BRC0088B; missing sugar is omitted, never zero-filled.','Soaking and lentil cooking water are discarded and excluded; added glaze water has no macronutrients.','Accompanying bread, rice, beans, salads and optional toppings are excluded.']),records=records)
 bundles.append(b)
existing=json.loads((D/'existing-related.json').read_text());bykey={b['key']:b for b in bundles}
related={'castanas':[('old','/vasitos-manzana-spekulatius'),('new','chocolate')],'garbanzos':[('old','/pizza-beans-alubias-gratinadas'),('new','lentejas')],'zwiebel':[('old','/tartiflette-reblochon-patatas'),('old','/focaccia-sin-amasado-romero')],'lentejas':[('old','/sopa-de-lentejas-con-verduras'),('new','garbanzos')],'chocolate':[('old','/receta-de-galletas-de-naranja'),('new','castanas')],'daigaku':[('old','/cerdo-repollo-vapor-seiro'),('old','/mango-sago-coco')],'farofa':[('old','/receta-de-feijoada'),('old','/arroz-blanco-perfecto')]}
for b in bundles:
 for i,r in enumerate(b['records']):
  linked=[]
  for kind,key in related[b['key']]:
   if kind=='new':linked.append(bykey[key]['records'][i])
   else:
    group=next(x['recipe_group_id'] for x in existing if x['public_path']==key and x['language']=='es')
    linked.append(next(x for x in existing if x['recipe_group_id']==group and x['language']==r['language']))
  extra='<h2>'+HEAD[i]+'</h2><ul>'+''.join('<li><a href="'+x['public_path']+'">'+html.escape(x['title'])+'</a></li>' for x in linked)+'</ul>'
  r['notes']+=extra;r['content_html']+=extra
 dump(D/(b['slug']+'.json'),b)
dump(D/'plan.json',dict(date='2026-10-28',state='49_LOCALIZED_DRAFTS_READY_NOT_PUBLISHED',recipes=[dict(key=b['key'],slug=b['slug'],market=b['origin_market']) for b in bundles],pages=49,original_images=56,webp_images=84,physical_kitchen_test=False,keyword_metrics='Unavailable: GSC payment_required; Google Trends HTTP 429; no numeric demand, ranking or revenue claims.'))
print('Assembled',len(bundles),'groups;',sum(len(b['records']) for b in bundles),'localized records')
for b in bundles:print(b['slug'],b['nutrition_calculation']['result'])
