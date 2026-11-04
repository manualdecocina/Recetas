"""Upload only new, digest-verified assets through the temporary authenticated publisher."""
import concurrent.futures,hashlib,json,sys,time,urllib.request,urllib.error
from pathlib import Path
D=Path(__file__).resolve().parent;ROOT=D.parents[1];key=sys.argv[1]
assert key in ['lasana-dumplings-al-vapor','huevo-katsu','cebolla-asada-onion-boil','helado-queso-cottage-fresas']
creds=json.loads((ROOT.parent/'cinco-upload-credential.json').read_text())
media=json.loads((D/(key+'-media.json')).read_text())['images']
def upload(m):
    data=(ROOT/m['path']).read_bytes();assert len(data)==m['bytes']>1024 and hashlib.sha256(data).hexdigest()==m['sha256']
    path=key+'/'+m['path'].split('/')[-1]
    req=urllib.request.Request('https://eqbdtctxbpepbeickhqi.supabase.co/functions/v1/editorial-cinco-20261104-upload',data=data,headers={'Authorization':'Bearer '+creds['anon'],'x-editorial-token':creds['token'],'x-asset-path':path,'x-asset-sha256':m['sha256'],'Content-Type':'image/webp'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req,timeout=45) as r:result=json.load(r);assert result['sha256']==m['sha256']
            with urllib.request.urlopen(m['url'],timeout=45) as r:
                body=r.read();assert r.headers.get_content_type()=='image/webp' and len(body)==m['bytes'] and hashlib.sha256(body).hexdigest()==m['sha256']
            return dict(url=m['url'],status=200,bytes=len(body),sha256=m['sha256'])
        except (urllib.error.URLError,TimeoutError,AssertionError):
            if attempt==2:raise
            time.sleep(2)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:verified=list(pool.map(upload,media))
(D/(key+'-assets-qa.json')).write_text(json.dumps(dict(status='PASS',images=verified),indent=2)+'\n')
print('PASS:',len(verified),'new public WebP files with exact digests')
