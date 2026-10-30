import hashlib,io,json,os,sys
from pathlib import Path
from PIL import Image,ImageOps
ROOT=Path(__file__).parent
def read_verified(x):
 p=Path(x['file']);data=p.read_bytes()
 if hashlib.sha256(data).hexdigest()==x['sha256']:return data
 assert len(data)==0,'Non-empty unexpected asset; do not replace'
 source=Path(x['original']);assert hashlib.sha256(source.read_bytes()).hexdigest()==x['original_sha256']
 frame=ImageOps.fit(Image.open(source).convert('RGB'),(x['width'],x['height']),method=Image.Resampling.LANCZOS)
 for q in range(88,59,-4):
  b=io.BytesIO();frame.save(b,'WEBP',quality=q,method=6);data=b.getvalue()
  if hashlib.sha256(data).hexdigest()==x['sha256']:
   pending=p.with_suffix('.pending')
   with pending.open('wb') as h:h.write(data);h.flush();os.fsync(h.fileno())
   os.replace(pending,p);return data
 raise RuntimeError('Could not reproduce accepted bytes')
if __name__=='__main__':
 a=json.loads((ROOT/f'{sys.argv[1]}-media.json').read_text())
 for x in a:read_verified(x)
 print('Verified accepted bytes for',len(a),'assets')
