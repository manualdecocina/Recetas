"""Copy eight reviewed originals and produce twelve verified, real WebP images."""
import json,hashlib,shutil,sys
from pathlib import Path
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'editorial/lote-cinco-20261024';slug=sys.argv[1];paths=json.loads((D/(slug+'-generated-paths.json')).read_text());folder=ROOT/'public/recetas'/slug;originals=folder/'originals';originals.mkdir(parents=True,exist_ok=True);m=dict(slug=slug,originals=[],images=[],visual_qa='Reviewed individual generated images; coherent props, actions and finished dish.')
for n in range(1,9):
 src=Path(paths[str(n)]);name='portada.png' if n==8 else f'paso-{n:02}.png';dest=originals/name;shutil.copyfile(src,dest);im=Image.open(dest).convert('RGB');source_size=im.size
 if im.width*3!=im.height*4:
  assert abs(im.width/im.height-4/3)<0.01,source_size
  scale=min(im.width//4,im.height//3);im=ImageOps.fit(im,(4*scale,3*scale),method=Image.Resampling.LANCZOS);im.save(dest,'PNG')
 assert im.width*3==im.height*4
 m['originals'].append(dict(asset=name,width=im.width,height=im.height,generated_width=source_size[0],generated_height=source_size[1],format_normalized=source_size!=im.size,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
 out=im.resize((1600,1200),Image.Resampling.LANCZOS);out.save(folder/f'paso-{n:02}.webp','WEBP',quality=86,method=4)
 if n==8:
  shutil.copyfile(folder/'paso-08.webp',folder/'portada.webp')
  for aspect,size in [('4x3',(1600,1200)),('1x1',(1200,1200)),('16x9',(1600,900))]:ImageOps.fit(out,size,method=Image.Resampling.LANCZOS).save(folder/f'portada-{aspect}.webp','WEBP',quality=86,method=4)
for p in sorted(folder.glob('*.webp')):
 data=p.read_bytes();im=Image.open(p);assert im.format=='WEBP' and len(data)>1000
 m['images'].append(dict(asset=p.name,path=str(p.relative_to(ROOT)),public_path=f'https://eqbdtctxbpepbeickhqi.supabase.co/storage/v1/object/public/recetas/{slug}/{p.name}',width=im.width,height=im.height,bytes=len(data),sha256=hashlib.sha256(data).hexdigest()))
assert len(m['images'])==12 and (folder/'portada.webp').read_bytes()==(folder/'paso-08.webp').read_bytes()
(D/(slug+'-images.json')).write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print(slug,'8 originals + 12 WebP verified')
