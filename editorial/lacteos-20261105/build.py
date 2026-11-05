"""Build one reviewed dairy recipe and its seven localized records."""
import json,sys,hashlib,html
from pathlib import Path
from PIL import Image,ImageOps
D=Path(__file__).resolve().parent; ROOT=D.parents[1]
LANGS=['es','en','de','fr','it','ja','pt']
COMMON={
'es': ['Básicos','Fácil','Internacional','Consejos y conservación','Contiene leche. Usa utensilios limpios y desinfectados y conserva a 4 °C o menos. No es una conserva para guardar a temperatura ambiente.','Estimación por porción; el rendimiento, la humedad y la marca cambian los valores.'],
'en': ['Basics','Easy','International','Tips and storage','Contains milk. Use clean, sanitized equipment and refrigerate at 4 °C or below. This is not a shelf-stable canned product.','Estimated per serving; yield, moisture and brands affect the values.'],
'de': ['Grundrezepte','Einfach','International','Tipps und Aufbewahrung','Enthält Milch. Saubere, desinfizierte Geräte verwenden und bei höchstens 4 °C lagern. Dies ist keine ungekühlt haltbare Konserve.','Schätzung pro Portion; Ausbeute, Feuchtigkeit und Produkte beeinflussen die Werte.'],
'fr': ['Bases','Facile','Internationale','Conseils et conservation','Contient du lait. Utilisez du matériel propre et désinfecté et conservez à 4 °C maximum. Cette préparation ne se conserve pas à température ambiante.','Estimation par portion ; rendement, humidité et marques modifient les valeurs.'],
'it': ['Preparazioni di base','Facile','Internazionale','Consigli e conservazione','Contiene latte. Usa utensili puliti e igienizzati e conserva a 4 °C o meno. Non è una conserva da tenere a temperatura ambiente.','Stima per porzione; resa, umidità e prodotti possono cambiare i valori.'],
'ja': ['基本のレシピ','簡単','各国料理','コツと保存','乳を含みます。清潔に洗浄・消毒した器具を使い、4 ℃以下で冷蔵してください。常温保存用の瓶詰めではありません。','1食分の推定値です。出来上がり量、水分、製品により異なります。'],
'pt': ['Preparações básicas','Fácil','Internacional','Dicas e conservação','Contém leite. Use utensílios limpos e higienizados e conserve a 4 °C ou menos. Não é uma conserva para guardar à temperatura ambiente.','Estimativa por porção; rendimento, umidade e marcas alteram os valores.']}

def build(key):
 c=json.loads((D/f'{key}.source.json').read_text()); records=[]
 assert list(c['text'])==LANGS
 for lang,t in c['text'].items():
  cat,diff,cuisine,heading,safety,nn=COMMON[lang]
  cat={'es':'Postres','en':'Desserts','de':'Desserts','fr':'Desserts','it':'Dolci','ja':'デザート','pt':'Sobremesas'}[lang] if c.get('sweet',True) else {'es':'Guarniciones','en':'Side dishes','de':'Beilagen','fr':'Accompagnements','it':'Contorni','ja':'付け合わせ','pt':'Acompanhamentos'}[lang]
  base=f'https://manualdecocina.com/recetas/{key}'
  assert len(t['steps'])==len(c['scenes'])
  ingredients=[dict(name=name,amount=str(spec[0]),unit=spec[1]) for name,spec in zip(t['ingredients'],c['ingredients'],strict=True)]
  steps=[]
  for i,s in enumerate(t['steps'],1):
   title,content=s.split('::',1)
   step=dict(title=title,content=content,image_url=f'{base}/paso-{i:02}.webp',image_alt=title+' — '+t['title'])
   if str(i) in c.get('timers',{}):step['timer_seconds']=c['timers'][str(i)]
   steps.append(step)
  nutrition=dict(c['nutrition'],serving_size=t['yield'],estimated=True,note=nn,source=c['nutrition_source'],method=c['nutrition_method'])
  notes=f'<h3>{heading}</h3><p>{html.escape(t["notes"]+" "+safety)}</p>'
  notes+='<ul>'+''.join(f'<li><a href="{html.escape(u)}">{html.escape(n)}</a></li>' for n,u in c['sources'])+'</ul>'
  record=dict(language=lang,slug=t['slug'],public_path=('/' if lang=='es' else f'/{lang}/')+t['slug'],title=t['title'],excerpt=t['description'],summary=t['intro'],content_html='<p>'+html.escape(t['intro'])+'</p>',notes=notes,ingredients=ingredients,steps=steps,category=cat,course=cat,cuisine=cuisine,difficulty=diff,prep_time_minutes=c['prep'],cook_time_minutes=c['cook'],total_time_minutes=c['total'],servings=c['servings'],image_url=f'{base}/portada.webp',gallery=[dict(url=f'{base}/portada.webp',alt=t['title'])],video_urls=[],keywords=[t['title']],nutrition=nutrition,seo=dict(title=t['title'],description=t['description'],author='Néstor Bastidas',image_alt=t['title'],image_variants=[f'{base}/portada-{r}.webp' for r in ['1x1','4x3','16x9']],faq=[dict(q=q,a=a) for q,a in t['faq']],additional_time_minutes=c['total']-c['prep']-c['cook']),published=False,editorial_status='ready')
  assert 10<=len(t['title'])<=100 and 50<=len(t['description'])<=300
  records.append(record)
 out=dict(key=key,records=records,sources=c['sources'],nutrition_calculation=c['nutrition_method'],scenes=c['scenes'])
 (D/f'{key}.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
 return out

def save_media(key,paths):
 c=json.loads((D/f'{key}.source.json').read_text()); dest=ROOT/'public'/'recetas'/key;dest.mkdir(parents=True,exist_ok=True)
 assert len(paths)==len(c['scenes'])
 for i,path in enumerate(paths,1):
  im=Image.open(path).convert('RGB'); im=ImageOps.fit(im,(1200,900))
  im.save(dest/f'paso-{i:02}.webp','WEBP',quality=84,method=6)
  if i==len(paths):
   for name,size in [('portada.webp',(1200,900)),('portada-4x3.webp',(1200,900)),('portada-1x1.webp',(1024,1024)),('portada-16x9.webp',(1280,720))]:
    ImageOps.fit(Image.open(path).convert('RGB'),size).save(dest/name,'WEBP',quality=84,method=6)
 media=[dict(path=str(p.relative_to(ROOT)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest()) for p in sorted(dest.glob('*.webp'))]
 (D/f'{key}.media.json').write_text(json.dumps(dict(images=media,originals=paths),indent=2)+'\n')

if __name__=='__main__':
 build(sys.argv[1])
 if len(sys.argv)>2: save_media(sys.argv[1],sys.argv[2:])
 print(sys.argv[1]+': seven localized records ready')
