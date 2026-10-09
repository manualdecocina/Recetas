"""Convert one visually inspected generated phase to persistent project media."""
import json,hashlib,io,sys,shutil
from pathlib import Path
from PIL import Image,ImageOps
R=Path(__file__).resolve().parents[1];slug,phase,source=sys.argv[1:];phase=int(phase);p=R/'editorial'/f'{slug}-20261009.json';j=json.loads(p.read_text());last=len(j['records'][0]['steps']);assert j['steps_frozen'];assert 0<=phase<last
D=R/'public'/'recetas'/slug;O=D/'originals';O.mkdir(parents=True,exist_ok=True);mp=R/'editorial'/f'{slug}-imagenes.json';m=json.loads(mp.read_text()) if mp.exists() else {'slug':slug,'directory':str(D.relative_to(R)),'steps_sha256':j['steps_sha256'],'originals':[],'images':[],'assets':[]};assert m['steps_sha256']==j['steps_sha256'];name='portada' if phase==0 else f'paso-{phase:02d}';dest=O/(name+'.png');assert not dest.exists();raw=Path(source).read_bytes();im=Image.open(io.BytesIO(raw));assert im.format=='PNG';im.load();im=im.convert('RGB');dest.write_bytes(raw);m['originals'].append({'path':str(dest.relative_to(R)),'asset':dest.name,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'width':im.width,'height':im.height,'phase':last if phase==0 else phase,'visual_qa':'PASS','source':'built-in ImageGen'})
outs=[(name+'.webp',(1280,960))];
if phase==0:outs += [('portada-1x1.webp',(960,960)),('portada-4x3.webp',(1280,960)),('portada-16x9.webp',(1280,720)),(f'paso-{last:02d}.webp',(1280,960))]
for fn,sz in outs:
 dest=D/fn;assert not dest.exists();out=ImageOps.fit(im,sz,method=Image.Resampling.LANCZOS);out.save(dest,'WEBP',quality=88,method=6);data=dest.read_bytes();check=Image.open(dest);assert check.format=='WEBP' and check.size==sz;check.verify();m['images'].append({'asset':fn,'path':str(dest.relative_to(R)),'public_path':f'/recetas/{slug}/{fn}','sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),'width':sz[0],'height':sz[1],'original':name+'.png','visual_qa':'PASS'})
m['state']='ALL_IMAGES_READY' if len(m['images'])==last+4 else 'IMAGES_IN_PROGRESS';mp.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print({'slug':slug,'phase':phase,'webp':len(m['images'])})
