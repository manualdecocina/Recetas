"""Assemble authored localizations; preserve the frozen Spanish phase text."""
import copy,hashlib,html,json,re,uuid
from pathlib import Path
R=Path(__file__).resolve().parents[1];date='20261009';routes=json.loads((R/'editorial/lote05-identidades-rutas-20261009.json').read_text())['routes'];baseline=json.loads((R/'editorial/lote05-baseline-identities-20261009.json').read_text())['rows']
tax={}
for m in re.finditer(r"(?:'([^']+)'|(\w+)):\s*{([^}]+)}",(R/'src/lib/categories.ts').read_text()):tax[m.group(1)or m.group(2)]=dict(re.findall(r"(es|de|en|fr|it|ja|pt):\s*'([^']*)'",m.group(3)))
groups={'es':'Ingredientes','de':'Zutaten','en':'Ingredients','fr':'Ingrédients','it':'Ingredienti','ja':'材料','pt':'Ingredientes'}
diff={'es':'Media','de':'Mittel','en':'Medium','fr':'Moyenne','it':'Media','ja':'普通','pt':'Média'}
suffix={'es':'receta paso a paso','de':'Schritt für Schritt','en':'step-by-step recipe','fr':'recette étape par étape','it':'ricetta passo passo','ja':'作り方','pt':'receita passo a passo'}
home={'es':'Cocina casera','de':'Hausmannskost','en':'Home cooking','fr':'Cuisine familiale','it':'Cucina casalinga','ja':'家庭料理','pt':'Cozinha caseira'}
italian={'es':'Inspiración italiana','de':'Italienisch inspiriert','en':'Italian-inspired','fr':'Inspiration italienne','it':'Ispirazione italiana','ja':'イタリア風','pt':'Inspiração italiana'}
south={'es':'Inspiración del sur de Estados Unidos','de':'Südstaaten-inspiriert','en':'Southern US-inspired','fr':'Inspiration du Sud des États-Unis','it':'Ispirazione del Sud degli Stati Uniti','ja':'米国南部風','pt':'Inspiração do sul dos Estados Unidos'}
method={'de':'Summe der essbaren Ausgangsgewichte in Gramm × USDA-Nährwerte je100g, geteilt durch{n}. Keine ungemessenen Garverluste angewandt.','en':'Sum of edible starting grams × USDA nutrients per100g, divided by{n}. No unmeasured cooking losses applied.','fr':'Somme des poids comestibles initiaux en grammes × nutriments USDA pour100g, divisée par{n}. Aucune perte de cuisson non mesurée appliquée.','it':'Somma dei grammi comestibili iniziali × nutrienti USDA per100g, divisa per{n}. Nessuna perdita di cottura non misurata applicata.','ja':'可食部の初期重量g × USDAの100g当たり栄養値を合計し、{n}人分で割ります。未測定の加熱損失は補正しません。','pt':'Soma dos gramas comestíveis iniciais × nutrientes USDA por100g, dividida por{n}. Não se aplicam perdas de cocção não medidas.'}
note={'de':'Schätzung, keine Laboranalyse oder Küchenprüfung. Marken, Reste und Garertrag können variieren.','en':'Estimate, not a laboratory analysis or kitchen test. Brands, leftovers and cooked yield can vary.','fr':'Estimation, pas une analyse de laboratoire ni un essai en cuisine. Marques, restes et rendement peuvent varier.','it':'Stima, non analisi di laboratorio né prova in cucina. Marche, residui e resa possono variare.','ja':'推定値で、実験室分析や調理試験の値ではありません。製品、残量、調理後の収量で変わります。','pt':'Estimativa, não análise de laboratório nem teste de cozinha. Marcas, resíduos e rendimento podem variar.'}
serving={'de':'Eine von{n}gleichen Portionen','en':'One of{n}equal servings','fr':'Une des{n}portions égales','it':'Una delle{n}porzioni uguali','ja':'全量の{n}分の1','pt':'Uma de{n}porções iguais'}
names={'pollo-al-horno-con-hierbas-y-limon':'pollo','receta-torta-de-zanahoria':'torta','receta-de-rollos-de-berenjena-con-tomates':'berenjena','receta-crema-de-campinones':'crema','receta-de-pollo-frito-sureno':'frito'}
def normalize(s):
 s=s.replace('Frisez en deux fournées','Faites frire en deux fournées').replace('リコッタを1人分ずつ','12等分したリコッタを1つずつ').replace('薄力系の普通小麦粉','普通小麦粉')
 s=re.sub(r'(?<=[A-Za-zÀ-ž])(?=\d)', ' ',s);s=re.sub(r'(?<=\d)(?=[A-Za-zÀ-ž])',' ',s);return s
def objnorm(v):
 if isinstance(v,str):return normalize(v)
 if isinstance(v,list):return [objnorm(x)for x in v]
 if isinstance(v,dict):return {k:objnorm(x)for k,x in v.items()}
 return v
for b in baseline:
 slug=b['slug'];p=R/'editorial'/f'{slug}-{date}.json';j=json.loads(p.read_text());es=copy.deepcopy(next(r for r in j['records']if r['language']=='es'));frozen=copy.deepcopy(es['steps']);assert hashlib.sha256(json.dumps(frozen,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()==j['steps_sha256']
 for short in ['prep','cook','total']:
  old=short+'_minutes';new=short+'_time_minutes'
  if old in es:es[new]=es.pop(old)
 evidence=json.loads((R/'editorial'/f'{slug}-usda-verificado-{date}.json').read_text());es['nutrition']['inputs']=[{'fdc_id':a['fdc_id'],'description':a['description'],'recipe_grams':a.get('recipe_grams',a.get('grams')),'edible_grams':a.get('calculation_grams',a.get('grams')),'per_100g':a['per_100g'],'basis':'initial_edible_formula_grams'if slug!='receta-de-pollo-frito-sureno'or a['fdc_id']!=172336 else'assumed_retained_frying_oil_40g_not_measured'}for a in evidence['foods']]
 es['nutrition']['source']='USDA FoodData Central — SR Legacy (2018)';es['nutrition']['source_url']='https://fdc.nal.usda.gov/';records=[es];tr=objnorm(json.loads((R/'editorial'/f'lote05-traducciones-{names[slug]}-{date}.json').read_text()))
 for lang in ['de','en','fr','it','ja','pt']:
  t=tr[lang];r=copy.deepcopy(es);route=next(x for x in routes if x['recipe_group_id']==b['recipe_group_id']and x['language']==lang);r.update({k:route[k]for k in ['language','slug','public_path','source_url']});r['id']=str(uuid.uuid5(uuid.UUID(b['recipe_group_id']),lang));r.update(title=t['title'],excerpt=t['excerpt'],notes=t['notes']);assert len(t['ingredients'])==len(r['ingredients'])and len(t['steps'])==len(frozen)
  for a,name in zip(r['ingredients'],t['ingredients']):a['name']=name
  for a,(title,content) in zip(r['steps'],t['steps']):a.update(title=title,content=content,image_alt=t['title']+': '+title)
  mt=normalize(method[lang].format(n=r['servings']));mt=(mt.split('。')[0]+'。'if lang=='ja'else mt.split('.')[0]+'.')if names[slug]=='frito'else mt;r['nutrition'].update(serving_size=normalize(serving[lang].format(n=r['servings'])),method=mt+' '+t['nutrition_extra'],note=note[lang]+' '+t['nutrition_extra']);r['seo']={'title':t['title']+': '+suffix[lang],'description':t['excerpt'],'about':t['excerpt'],'faq':[{'q':q,'a':a}for q,a in t['faq']]};records.append(r)
 for r in records:
  lang=r['language'];r['category']=tax[r['category_slug']][lang];r['difficulty']=diff[lang];r['course']=r['category'];r['cuisine']=(italian if names[slug]=='berenjena'else south if names[slug]=='frito'else home)[lang];r['summary']=r['seo']['about'];r['content_html']='<p>'+html.escape(r['summary'])+'</p>';r['keywords']=[r['title']];r['gallery']=[{'url':r['image_url'],'alt':r['title']}];r['seo'].update(image_alt=r['title'],image_variants=[f'/recetas/{slug}/portada-{s}.webp'for s in ['1x1','4x3','16x9']]);r['published']=True;r['editorial_status']='published'
  for a in r['ingredients']:a['group']=groups[lang]
 assert records[0]['steps']==frozen;j['records']=records;j['state']='SEVEN_LANGUAGES_READY_MEDIA_AND_PUBLICATION_PENDING';j['publication_blockers']=['MEDIA_FINAL_VALIDATION','CI_DEPLOY_DB_CACHE_LIVE_QA_PENDING'];p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n');print(slug,len(records))
