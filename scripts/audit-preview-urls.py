import concurrent.futures, json, urllib.request, urllib.error, urllib.parse
from html.parser import HTMLParser

BASE="https://preview.manualdecocina.com"
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

class HeadParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical=[]
        self.alternates={}
        self.recipe=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=="link" and a.get("rel")=="canonical":
            self.canonical.append(a.get("href"))
        if tag=="link" and a.get("hreflang"):
            self.alternates[a["hreflang"]]=a.get("href")

def check(path):
    url=BASE+urllib.parse.quote(path, safe="/%")
    chain=[]
    try:
        for _ in range(5):
            req=urllib.request.Request(url, headers={"User-Agent":"ManualDeCocina-Preview-QA/1.0"})
            try: response=urllib.request.build_opener(NoRedirect).open(req,timeout=25)
            except urllib.error.HTTPError as e: response=e
            status=response.code
            chain.append({"url":url,"status":status})
            body=response.read().decode("utf-8","replace")
            if status in (301,302,303,307,308):
                url=urllib.parse.urljoin(url,response.headers["Location"])
                if not url.startswith(BASE+"/"):
                    return {"path":path,"chain":chain,"external_redirect":url}
                continue
            parser=HeadParser()
            parser.feed(body)
            return {"path":path,"chain":chain,"canonical":parser.canonical,"hreflang":parser.alternates,"recipe_schema":'"@type":"Recipe"' in body or '"@type": "Recipe"' in body, "sitemap_locations":body.count("<loc>") if path=="/sitemap.xml" else None}
        return {"path":path,"chain":chain,"error":"redirect loop"}
    except Exception as exc:
        return {"path":path,"chain":chain,"error":str(exc)}
rows=json.load(open("docs/audits/preview-url-evidence-20261005.json"))
paths=sorted(set([r["public_path"] for r in rows]+[urllib.parse.urlsplit(r["historical_url"]).path for r in rows if r["historical_url"]]+["/sitemap.xml"]))
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    results=list(pool.map(check,paths))
for r in results:
    print("URL_AUDIT "+json.dumps(r,ensure_ascii=False),flush=True)
with open("preview-url-http-audit.json","w") as f:
    json.dump(results,f,ensure_ascii=False,indent=2)
