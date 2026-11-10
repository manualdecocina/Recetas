"""Confirm the actual deployment before expiring caches and checking seven locales."""
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import time
from urllib.parse import quote
from urllib.request import Request, urlopen

BASE = 'https://manualdecocina.com'
SLUGS = {'es':'pollo-relleno-navideno','en':'christmas-stuffed-whole-chicken','de':'gefuelltes-weihnachtshuhn','fr':'poulet-entier-farci-de-noel','it':'pollo-intero-ripieno-di-natale','ja':'クリスマスの丸鶏詰め','pt':'frango-inteiro-recheado-de-natal'}

def fetch(path):
    req = Request(BASE + quote(path, safe='/?=&%:-'), headers={'User-Agent':'ManualDeCocina-PublicationQA/20261110','Cache-Control':'no-cache'})
    with urlopen(req, timeout=35) as response:
        assert response.status == 200
        return response.read().decode('utf-8')

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.steps=0; self.photos=0; self.dialogs=0; self.canonical=''; self.hreflang={}
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='li' and a.get('id','').startswith('paso-'): self.steps+=1
        if tag=='button' and 'md-step-photo' in a.get('class','').split(): self.photos+=1
        if tag=='dialog' and 'md-lightbox' in a.get('class','').split(): self.dialogs+=1
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
        if tag=='link' and a.get('hreflang'): self.hreflang[a['hreflang']]=a.get('href')

def check(item):
    lang,slug=item;html=fetch(f'/{lang}/receta/{slug}');p=Page();p.feed(html)
    assert p.steps==10 and p.photos==10 and p.dialogs==0, (lang,p.steps,p.photos,p.dialogs)
    assert len(p.hreflang)==7 and p.canonical
    if lang=='es': assert 'no afirmar prueba de cocina propia' not in html
    return {'language':lang,'steps':p.steps,'step_photos':p.photos,'hidden_dialogs':p.dialogs,'hreflang':len(p.hreflang),'canonical':p.canonical}

if __name__=='__main__':
    for attempt in range(25):
        try:
            check(('es',SLUGS['es']));break
        except Exception as exc:
            print('Deployment pending',attempt+1,type(exc).__name__,str(exc)[:120],flush=True)
            if attempt==24: raise
            time.sleep(20)
    secret=os.getenv('REVALIDATE_SECRET','').strip()
    if secret:
        req=Request(BASE+'/api/revalidate',data=b'{}',headers={'x-revalidate-secret':secret,'Content-Type':'application/json'})
        with urlopen(req,timeout=35) as response: assert json.load(response).get('revalidated') is True
    with ThreadPoolExecutor(max_workers=4) as pool: pages=list(pool.map(check,SLUGS.items()))
    recipe_path='/es/receta/pollo-relleno-navideno'
    # ISR may serve its previous document once while regenerating after expiry.
    # Invalidate once above, then wait for the actual links to propagate.
    for attempt in range(12):
        home=fetch('/es');catalogue=fetch('/es/recetas')
        collection=fetch('/es/colecciones/recetas-navidad-colombiana')
        visible={name:f'href="{recipe_path}"' in html for name,html in [('home',home),('catalogue',catalogue),('collection',collection)]}
        if all(visible.values()): break
        print('Discovery cache pending',attempt+1,visible,flush=True)
        if attempt==11: raise AssertionError(visible)
        time.sleep(2)
    pantry=fetch('/es/que-puedo-cocinar');sitemap=fetch('/sitemap.xml')
    assert 'Albahaca fresca' in pantry and 'Albahaca seca' in pantry
    assert 'pollo-relleno-navideno' in sitemap and '<h1' in home
    result={'pages':pages,'home':True,'home_chicken_visible':True,'catalogue_first_page_chicken_visible':True,'christmas_collection_chicken_visible':True,'distinct_fresh_dried_basil':True,'sitemap':True,'cache_revalidated':bool(secret)}
    Path('site-optimization-publication.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(result,ensure_ascii=False,indent=2))
