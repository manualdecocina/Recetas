"""Original seven-language recipe sources; no WordPress material."""
import json, html
from pathlib import Path
D=Path(__file__).resolve().parent
BASE='https://manualdecocina.com'
LANGS=['es','en','de','fr','it','ja','pt']
CATEGORIES={
'Entradas':['Entrantes y aperitivos','Starters & appetizers','Vorspeisen','Entrées et apéritifs','Antipasti','前菜・おつまみ','Entradas e aperitivos'],
'Platos principales':['Platos principales','Main dishes','Hauptgerichte','Plats principaux','Secondi piatti','主菜','Pratos principais'],
'Guarniciones':['Guarniciones','Side dishes','Beilagen','Accompagnements','Contorni','付け合わせ','Acompanhamentos'],
'Postres':['Postres','Desserts','Desserts','Desserts','Dolci','デザート','Sobremesas']}
LABEL={
'es':['Sobre esta receta','Consejos y conservación','Fuentes','Fácil','Internacional','Estimación por ración; los productos y el rendimiento pueden cambiar los valores.'],
'en':['About this recipe','Tips and storage','Sources','Easy','International','Estimated per serving; products and yield can change these values.'],
'de':['Über dieses Rezept','Tipps und Aufbewahrung','Quellen','Einfach','International','Schätzwerte pro Portion; Produkte und Ausbeute können die Werte verändern.'],
'fr':['À propos de cette recette','Conseils et conservation','Sources','Facile','Internationale','Estimation par portion ; les produits et le rendement peuvent modifier ces valeurs.'],
'it':['Informazioni sulla ricetta','Consigli e conservazione','Fonti','Facile','Internazionale','Stima per porzione; prodotti e resa possono modificare questi valori.'],
'ja':['このレシピについて','コツと保存方法','参考資料','簡単','インターナショナル','1人分の推定値です。使用する製品や出来上がり量によって変わります。'],
'pt':['Sobre esta receita','Dicas e conservação','Fontes','Fácil','Internacional','Estimativa por porção; os produtos e o rendimento podem alterar os valores.']}

def build(key, specs, amounts, units, prep, cook, wait, servings, profiles, sources, canonical, newfoods=None):
    """Profiles: ingredient grams + generic nutrient profile kcal/P/C/F per 100g."""
    media=f'{BASE}/recetas/{key}'
    totals=[round(sum(g/100*p[j] for g,p in profiles)/servings,1) for j in range(4)]
    records=[]
    for lang in LANGS:
        x=specs[lang]; labels=LABEL[lang]
        names=x['ingredients'].split('|'); steps=x['steps'].strip().split('\n')
        assert len(names)==len(amounts)==len(units)==len(canonical)
        assert len(steps)==8
        record=dict(language=lang,slug=x['slug'],public_path=('/' if lang=='es' else f'/{lang}/')+x['slug'],title=x['title'],excerpt=x['excerpt'],summary=x['summary'],content_html=f'<h2>{labels[0]}</h2><p>{html.escape(x["summary"])}</p>',notes=f'<h3>{labels[1]}</h3><p>{html.escape(x["notes"])}</p><h3>{labels[2]}</h3><ul>'+''.join(f'<li><a href="{url}">{html.escape(name)}</a></li>' for name,url in sources)+'</ul>',ingredients=[dict(name=n,amount=str(a),unit=u) for n,a,u in zip(names,amounts,units)],steps=[],category=x['category'],course=x['category'],cuisine=labels[4],difficulty=labels[3],prep_time_minutes=prep,cook_time_minutes=cook,total_time_minutes=prep+cook+wait,servings=servings,image_url=media+'/portada.webp',gallery=[dict(url=media+'/portada.webp',alt=x['alt'])],video_urls=[],keywords=x['keywords'].split('|'),nutrition=dict(zip(['calories','protein_g','carbs_g','fat_g'],totals)),seo={},published=False,editorial_status='draft')
        for i,line in enumerate(steps,1):
            title,content=line.split('::',1)
            record['steps'].append(dict(title=title,content=content,image_url=f'{media}/paso-{i:02}.webp',image_alt=title+' — '+x['title']))
        record['category']=CATEGORIES[specs['es']['category']][LANGS.index(lang)]
        record['nutrition'].update(estimated=True,serving_size=x['portion'],note=labels[5],source='Generic food composition profiles; editorial estimate, not laboratory analysis',method='Sum ingredient edible weights × generic per-100-g profiles; divide by recipe servings. See source JSON nutrition_calculation.')
        record['seo']=dict(title=x['title'],description=x['excerpt'],author='Néstor Bastidas',image_alt=x['alt'],image_variants=[media+'/portada-'+a+'.webp' for a in ['1x1','4x3','16x9']],faq=[dict(q=q,a=a) for q,a in x['faq']],additional_time_minutes=wait)
        records.append(record)
    out=dict(key=key,created='2026-11-04',kind='standalone-recipe',editorial_origin='Original formulation and original generated photographs; not adapted from WordPress. Not kitchen-tested.',records=records,sources=[dict(name=n,url=u) for n,u in sources],nutrition_calculation=dict(servings=servings,ingredient_order=specs['es']['ingredients'].split('|'),grams_and_generic_profiles=profiles,profile_order=['kcal','protein_g','carbs_g','fat_g'],per_serving=totals,limitations='Generic profiles, brands and water loss vary. Optional accompaniments excluded unless explicitly included. Not a nutrient database extraction.'),canonical=canonical,newfoods=newfoods or [])
    (D/(key+'.json')).write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
    print(key, '7 languages / 8 steps /',len(amounts),'ingredients',totals)

if __name__=='__main__':
    import runpy,sys
    runpy.run_path(str(D/('author-'+sys.argv[1]+'.py')),run_name='__main__')
