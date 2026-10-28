"""Upload only digest-locked new WebP assets, then verify their public bytes."""
import json,hashlib,time,urllib.request,urllib.error
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'editorial/siete-mercados-20261028'
token=json.loads((ROOT.parent/'seven-markets-upload-credential.json').read_text())['token']
manifest=json.loads((D/'media-upload-manifest.json').read_text())
def upload(item):
 path,expected=item;data=(ROOT/'public/recetas'/path).read_bytes();assert hashlib.sha256(data).hexdigest()==expected['sha256']
 req=urllib.request.Request('https://eqbdtctxbpepbeickhqi.supabase.co/functions/v1/editorial-media-seven-20261028',data=data,headers={'Authorization':'Bearer '+token,'x-asset-path':path,'Content-Type':'image/webp'})
 for attempt in range(3):
  try:
   with urllib.request.urlopen(req,timeout=45) as response:result=json.load(response)
   break
  except (urllib.error.URLError,TimeoutError):
   if attempt==2:raise
   time.sleep(2)
 url='https://eqbdtctxbpepbeickhqi.supabase.co/storage/v1/object/public/recetas/'+path
 with urllib.request.urlopen(url,timeout=45) as response:remote=response.read();mime=response.headers.get('Content-Type')
 assert len(remote)==expected['bytes'] and hashlib.sha256(remote).hexdigest()==expected['sha256'],path
 return dict(path=path,url=url,status=200,mime=mime,bytes=len(remote),sha256=expected['sha256'])
with ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(upload,manifest.items()))
(D/'media-upload-verification.json').write_text(json.dumps(dict(verified=len(results),assets=results),indent=2)+'\n')
print('Uploaded and verified:',len(results),'assets')
