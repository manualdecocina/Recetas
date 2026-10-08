import json,pathlib,copy,uuid,html,re
ROOT=pathlib.Path(__file__).resolve().parents[1]
LANGS=['de','en','fr','it','ja','pt']
META={
'de':{'Media':'Mittel','Fácil':'Einfach','Postre':'Dessert','Plato principal':'Hauptgericht','Latinoamericana':'Lateinamerikanisch','Internacional':'International','Alemana':'Deutsch','Fusión':'Fusion','Mexicana':'Mexikanisch','Japonesa':'Japanisch','Italiana':'Italienisch','unidades':'Stück'},
'en':{'Media':'Medium','Fácil':'Easy','Postre':'Dessert','Plato principal':'Main course','Latinoamericana':'Latin American','Internacional':'International','Alemana':'German','Fusión':'Fusion','Mexicana':'Mexican','Japonesa':'Japanese','Italiana':'Italian','unidades':'pieces'},
'fr':{'Media':'Moyenne','Fácil':'Facile','Postre':'Dessert','Plato principal':'Plat principal','Latinoamericana':'Latino-américaine','Internacional':'Internationale','Alemana':'Allemande','Fusión':'Fusion','Mexicana':'Mexicaine','Japonesa':'Japonaise','Italiana':'Italienne','unidades':'pièces'},
'it':{'Media':'Media','Fácil':'Facile','Postre':'Dolce','Plato principal':'Piatto principale','Latinoamericana':'Latinoamericana','Internacional':'Internazionale','Alemana':'Tedesca','Fusión':'Fusion','Mexicana':'Messicana','Japonesa':'Giapponese','Italiana':'Italiana','unidades':'pezzi'},
'ja':{'Media':'普通','Fácil':'簡単','Postre':'デザート','Plato principal':'主菜','Latinoamericana':'中南米料理','Internacional':'世界の料理','Alemana':'ドイツ料理','Fusión':'フュージョン料理','Mexicana':'メキシコ料理','Japonesa':'日本料理','Italiana':'イタリア料理','unidades':'個'},
'pt':{'Media':'Média','Fácil':'Fácil','Postre':'Sobremesa','Plato principal':'Prato principal','Latinoamericana':'Latino-americana','Internacional':'Internacional','Alemana':'Alemã','Fusión':'Fusão','Mexicana':'Mexicana','Japonesa':'Japonesa','Italiana':'Italiana','unidades':'unidades'}}
NUTR={
'de':['1 von {n} Portionen','Berechnet aus den geprüften USDA-SR-Legacy-Werten je 100 g, gewichtet nach essbarer Zutatenmenge und geteilt durch {n} Portionen. Angegebenes Öl und Salz sind vollständig eingerechnet; optionale Beilagen sind ausgeschlossen.','Orientierungswerte; Marken, Ausbeute und nicht verzehrte Sauce oder Fett verändern das Ergebnis. Mengen, Zeiten, Portionen und Nährwerte sind KI-Vorschläge und warten auf Bestätigung des Eigentümers.'],
'en':['1 of {n} servings','Verified USDA SR Legacy values per 100 g are multiplied by the edible ingredient weights and divided by {n} servings. All listed oil and salt are counted; optional sides are excluded.','Informational estimate; brands, yield and uneaten fat or sauce affect the result. Quantities, times, servings and nutrition are AI proposals awaiting owner confirmation.'],
'fr':['1 des {n} portions','Somme des valeurs USDA SR Legacy vérifiées pour 100 g, pondérées par le poids comestible des ingrédients et divisées par {n} portions. Toute l’huile et tout le sel indiqués sont comptés; les accompagnements facultatifs sont exclus.','Estimation indicative; les marques, le rendement et la sauce ou la graisse non consommée modifient le résultat. Quantités, durées, portions et nutrition proposées par IA, à confirmer par le propriétaire.'],
'it':['1 delle {n} porzioni','Valori USDA SR Legacy verificati per 100 g, moltiplicati per i pesi commestibili degli ingredienti e divisi per {n} porzioni. Tutto l’olio e il sale indicati sono conteggiati; i contorni facoltativi sono esclusi.','Stima orientativa; marche, resa e grasso o salsa non consumati cambiano il risultato. Quantità, tempi, porzioni e nutrizione proposti dall’IA, da confermare dal proprietario.'],
'ja':['全{n}人分のうち1人分','確認済みのUSDA SR Legacyの100 g当たりの値に各材料の可食重量を掛け、合計を{n}人分で割っています。記載した油と塩は全量を計上し、任意の付け合わせは含みません。','参考推定値です。製品、出来上がり量、食べ残した脂やソースで変わります。分量、時間、人数、栄養値はAIの提案で、所有者の確認待ちです。'],
'pt':['1 de {n} porções','Valores USDA SR Legacy verificados por 100 g, multiplicados pelos pesos comestíveis e divididos por {n} porções. Todo o óleo e sal indicados entram no cálculo; acompanhamentos opcionais ficam de fora.','Estimativa orientativa; marcas, rendimento e gordura ou molho não consumidos alteram o resultado. Quantidades, tempos, porções e nutrição são propostas de IA aguardando confirmação do proprietário.']}
def build(slug):
 src=ROOT/'editorial'/f'{slug}-20261008.json'; item=json.loads(src.read_text()); es=item['records'][0]
 patches=json.loads((ROOT/'editorial'/f'{slug}-localizaciones-20261008.json').read_text())
 assert set(patches)==set(LANGS)
 category_text=(ROOT/'src/lib/categories.ts').read_text()
 block=re.search(r"(?:'"+re.escape(es['category_slug'])+r"'|"+re.escape(es['category_slug'])+r"):\s*\{(.*?)\}",category_text,re.S).group(1)
 labels=dict(re.findall(r"(es|de|en|fr|it|ja|pt):\s*'([^']+)'",block))
 records=[es]
 for lang in LANGS:
  patch=patches[lang]; r=copy.deepcopy(es);alts=item['image_alts_by_language'][lang]
  r.update(language=lang,id=str(uuid.uuid5(uuid.UUID(es['recipe_group_id']),lang)),slug=patch['path'].split('/')[-1],public_path=patch['path'],source_url=None,title=alts['title'],excerpt=patch['excerpt'],summary=patch['summary'],notes=patch['notes'],category=labels[lang])
  for key in ['difficulty','course','cuisine']:r[key]=META[lang][es[key]]
  assert len(patch['ingredients'])==len(r['ingredients']) and len(patch['steps'])==len(r['steps']) and len(patch['faq'])==3
  for ing,trans in zip(r['ingredients'],patch['ingredients']):
   ing['name'],ing['group']=trans;ing['unit']=META[lang].get(ing['unit'],ing['unit'])
  for step,text,alt in zip(r['steps'],patch['steps'],alts['steps']):step.update(title=alt.removeprefix(alts['title']+': '),content=text,image_alt=alt)
  r['keywords']=patch['keywords'];r['seo'].update(title=r['title']+' | Manual de Cocina',description=r['excerpt'],image_alt=alts['cover'],faq=[{'q':q,'a':a} for q,a in patch['faq']])
  r['content_html']=''.join('<p>'+html.escape(p)+'</p>' for p in r['summary'].split('\n\n'))
  for key,text in zip(['serving_size','method','note'],NUTR[lang]):r['nutrition'][key]=text.format(n=r['servings'])
  if 'nutrition_note' in patch:r['nutrition']['note']+=' '+patch['nutrition_note']
  records.append(r)
 item['records']=records;item['state']='FULL_LOCALIZATION_PREPARED_IMAGES_QA_PENDING';item['publication_blockers']=['FINAL_IMAGES_QA_PENDING','GLOBAL_QA_PENDING']
 out=ROOT/'editorial'/f'{slug}-7idiomas-20261008.json';out.write_text(json.dumps(item,ensure_ascii=False,indent=2)+'\n')
 print(slug,'7 full records written')
if __name__=='__main__':
 import sys
 for slug in sys.argv[1:]:build(slug)
