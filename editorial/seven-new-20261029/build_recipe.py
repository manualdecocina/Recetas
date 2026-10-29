import json,html,re,sys
from pathlib import Path
from nutrition import calculate
ROOT=Path(__file__).parent
LANGS=['es','de','en','fr','it','ja','pt']
LABELS={
'es':['Consejos','Sustituciones','Conservación','Fuentes','También puedes preparar','Fácil','Española, adaptación en freidora de aire','1 de {n} porciones','Estimación por peso de ingredientes, dividida entre las porciones.','Estimación informativa, no medición del plato cocinado. Se cuenta todo el rebozado ofrecido, aunque sobre; marcas y cantidad adherida pueden cambiar los valores.'],
'en':['Tips','Substitutions','Storage','Sources','You may also like','Easy','Spanish inspired, air fryer adaptation','1 of {n} servings','Ingredient reference values weighted by grams and divided by servings.','Informational estimate, not a measurement of the cooked food. All offered coating is counted even if some is discarded; brands and retained coating change the values.'],
'de':['Tipps','Alternativen','Aufbewahrung','Quellen','Auch ausprobieren','Einfach','Spanisch inspiriert, Heißluftfritteusen-Variante','1 von {n} Portionen','Referenzwerte nach Zutatengewicht summiert und durch die Portionen geteilt.','Ungefähre Schätzung, keine Messung des fertigen Gerichts. Die gesamte bereitgestellte Panade wird mitgerechnet, auch Reste; Marken und haftende Menge verändern die Werte.'],
'fr':['Conseils','Substitutions','Conservation','Sources','À préparer aussi','Facile','Inspiration espagnole, adaptation à l’air fryer','1 des {n} portions','Somme des valeurs de référence selon le poids des ingrédients, divisée par les portions.','Estimation indicative, pas une mesure du plat cuisiné. Toute la panure préparée est comptée, même les restes ; marques et quantité adhérente changent les valeurs.'],
'it':['Consigli','Sostituzioni','Conservazione','Fonti','Da provare anche','Facile','Ispirazione spagnola, adattamento in friggitrice ad aria','1 di {n} porzioni','Valori di riferimento ponderati per il peso e divisi per le porzioni.','Stima informativa, non misurazione del piatto cotto. Si conta tutta la panatura preparata, anche gli avanzi; marche e quantità aderente cambiano i valori.'],
'ja':['コツ','代用','保存','参考資料','こちらのレシピも','簡単','スペイン風・エアフライヤー向けアレンジ','全{n}人分のうち1人分','材料の重量に応じた参考栄養値を合計し、人数で割った概算です。','調理済み料理の実測値ではありません。残った分も含め、用意した衣全量を計算しています。商品や実際についた量によって変わります。'],
'pt':['Dicas','Substituições','Conservação','Fontes','Prepare também','Fácil','Inspiração espanhola, adaptação para airfryer','1 das {n} porções','Soma das referências pelo peso dos ingredientes, dividida pelas porções.','Estimativa informativa, não medição do prato pronto. Todo o empanado preparado é contado, inclusive as sobras; marcas e quantidade aderida mudam os valores.']}
CAT={'Entrantes y aperitivos':['Entrantes y aperitivos','Vorspeisen','Starters & appetizers','Entrées et apéritifs','Antipasti','前菜・おつまみ','Entradas e aperitivos'],'Postres':['Postres','Desserts','Desserts','Desserts','Dolci','デザート','Sobremesas'],'Guarniciones':['Guarniciones','Beilagen','Side dishes','Accompagnements','Contorni','副菜','Acompanhamentos'],'Panes y masas':['Panes y masas','Brot und Teig','Breads & doughs','Pains et pâtes','Pane e impasti','パン・生地','Pães e massas'],'Platos principales':['Platos principales','Hauptgerichte','Main dishes','Plats principaux','Secondi piatti','主菜','Pratos principais'],'Salsas y aderezos':['Salsas y aderezos','Saucen und Dressings','Sauces & dressings','Sauces et assaisonnements','Salse e condimenti','ソース・ドレッシング','Molhos e temperos']}
def build(key):
    d=json.loads((ROOT/f'{key}.json').read_text());records=[]
    foods=[(d['locales']['es']['ingredients'][i],g,fid) for i,(g,u,s,fid) in enumerate(d['ingredients'])]
    nums,evidence=calculate(foods,d['servings'])
    (ROOT/f'{key}-nutrition.json').write_text(json.dumps(dict(**evidence,assumptions=d['nutrition_assumptions']),ensure_ascii=False,indent=2)+'\n')
    related=json.loads((ROOT/'related-recipes.json').read_text())
    for i,l in enumerate(LANGS):
        t=d['locales'][l];labels=LABELS[l];base='https://eqbdtctxbpepbeickhqi.supabase.co/storage/v1/object/public/recetas/'+d['slug']+'/'
        notes=''.join('<h3>'+html.escape(h)+'</h3><p>'+html.escape(t[k])+'</p>' for h,k in zip(labels[:3],['tips','substitutions','storage']))
        notes+='<p class="md-sources">'+labels[3]+': '+', '.join('<a href="'+u+'" rel="noopener">'+html.escape(re.sub(r'^https?://(www\\.)?','',u).split('/')[0])+'</a>' for u in d['sources'])+'</p>'
        links=[x for x in related if x['language']==l]
        notes+='<h3>'+labels[4]+'</h3><ul>'+''.join('<li><a href="'+x['public_path']+'">'+html.escape(x['title'])+'</a></li>' for x in links)+'</ul>'
        nutrition=dict(**nums,estimated=True,serving_size=labels[7].format(n=d['servings']),source='USDA FoodData Central SR Legacy (2018)',source_url='https://fdc.nal.usda.gov/',method=labels[8],note=labels[9])
        r=dict(language=l,slug=t['slug'],public_path=('/' if l=='es' else '/'+l+'/')+t['slug'],title=t['title'],excerpt=t['description'],summary=t['summary'],notes=notes,content_html='<p>'+html.escape(t['summary'])+'</p>'+notes,ingredients=[dict(name=n,amount=str(a),unit=u) for n,(a,u,_,_) in zip(t['ingredients'],d['ingredients'])],steps=[dict(title=a,content=b,image_url=base+f'paso-{n:02d}.webp',image_alt=t['title']+': '+a) for n,(a,b) in enumerate(t['steps'],1)],category=CAT[d['category']][i],course=CAT[d['category']][i],cuisine=t.get('cuisine',labels[6]),difficulty=labels[5],prep_time_minutes=d['prep'],cook_time_minutes=d['cook'],total_time_minutes=d['prep']+d['cook']+d['rest'],servings=d['servings'],image_url=base+'portada.webp',gallery=[dict(url=base+'portada.webp',alt=t['title'])],video_urls=[],keywords=t['keywords'],nutrition=nutrition,seo=dict(title=t['seo_title'],description=t['description'],image_alt=t['title'],image_variants=[base+'portada-'+a+'.webp' for a in ['1x1','4x3','16x9']],faq=[dict(q=q,a=a) for q,a in t['faq']],rest_time_minutes=d['rest']),published=False,editorial_status='draft',source_url=None,source_post_id=None)
        assert len(r['ingredients'])==len(d['ingredients']) and len(r['steps'])==8 and len(t['faq'])>=3 and len(t['keywords'])>=4
        scale=.45 if l=='ja' else 1
        assert 40*scale<=len(t['seo_title'])<=65*scale,(l,'title',len(t['seo_title']))
        assert 110*scale<=len(t['description'])<=165*scale,(l,'description',len(t['description']))
        assert all(len(s['content'])>=35 for s in r['steps'])
        records.append(r)
    b=dict(slug=d['slug'],key=key,date='2026-10-29',target='https://manualdecocina.com',origin_market=d['market'],languages=LANGS,category_slug=d['category_slug'],physical_kitchen_test=False,native_speaker_review=False,sources=d['sources'],pantry_slugs=[x[2] for x in d['ingredients']],nutrition_calculation=evidence,records=records)
    dest=ROOT/f'{key}-bundle.json';dest.write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n')
    compact=lambda a:json.dumps(a,ensure_ascii=False,separators=(',',':'))
    template=(ROOT/'scripts/stage-arepa-huevo-20261024.sql').read_text();tail=template[template.index('x jsonb;'):template.index('SELECT recipe_group_id,language,public_path,published FROM')]
    aliases=[dict(alias=n,slug=s) for n,(_,_,s,_) in zip(d['locales']['es']['ingredients'],d['ingredients']) if s]
    sql='DO $stage$ DECLARE j jsonb := $payload$'+compact(records)+'$payload$::jsonb; aliases jsonb := $aliases$'+compact(aliases)+'$aliases$::jsonb;\n'+tail
    sql+='SELECT id,recipe_group_id,language,public_path,published FROM public.recipes WHERE public_path IN ('+','.join("'"+r['public_path']+"'" for r in records)+') ORDER BY language;\n'
    (ROOT/f'{key}-stage.sql').write_text(sql)
    print(json.dumps(dict(key=key,records=len(records),nutrition=nums,metadata=[dict(language=r['language'],title=len(r['seo']['title']),description=len(r['excerpt'])) for r in records])))
if __name__=='__main__':build(sys.argv[1])
