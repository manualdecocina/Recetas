"""Register one original intact and create real WebP publication derivatives."""
import sys,json,hashlib,shutil
from pathlib import Path
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[1];D=ROOT/"editorial/siete-mercados-20261028"
def register(key,n,source):
 r=next(json.loads(p.read_text()) for p in D.glob("*-es.json") if json.loads(p.read_text())["key"]==key)
 original=D/"originales"/r["slug"]/f"paso-{n:02}.png";original.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source,original)
 im=Image.open(original).convert("RGB");assert abs(im.width/im.height-4/3)<.02,(source,im.size)
 out=ROOT/"public/recetas"/r["slug"];out.mkdir(parents=True,exist_ok=True)
 targets=[(f"paso-{n:02}.webp",(1600,1200))]
 if n==8:targets += [("portada.webp",(1600,1200)),("portada-4x3.webp",(1600,1200)),("portada-1x1.webp",(1200,1200)),("portada-16x9.webp",(1600,900))]
 entries=[]
 for name,size in targets:
  dest=out/name
  if n==8 and name in ("portada.webp","portada-4x3.webp"):shutil.copyfile(out/"paso-08.webp",dest)
  else:ImageOps.fit(im,size,method=Image.Resampling.LANCZOS).save(dest,"WEBP",quality=86,method=6)
  data=dest.read_bytes();assert data[:4]==b"RIFF" and data[8:12]==b"WEBP"
  entries.append(dict(path=dest.relative_to(ROOT).as_posix(),public_path="https://eqbdtctxbpepbeickhqi.supabase.co/storage/v1/object/public/recetas/"+r["slug"]+"/"+name,bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),width=size[0],height=size[1],step=n,original_sha256=hashlib.sha256(original.read_bytes()).hexdigest()))
 meta=dict(key=key,slug=r["slug"],step=n,original=original.relative_to(ROOT).as_posix(),images=entries)
 (D/f"image-source-{key}-{n}.json").write_text(json.dumps(meta,ensure_ascii=False,indent=2)+"\n")
 return key,n
if __name__=="__main__":
 if len(sys.argv)==4:print(register(sys.argv[1],int(sys.argv[2]),Path(sys.argv[3])))
 else:
  from concurrent.futures import ThreadPoolExecutor
  data=json.loads((D/"recovered-image-sources.json").read_text())
  tasks=[(k,int(n),Path("/workspace/scratch/3d57ee625155/generated_images")/("exec-"+v+".png")) for k,rows in data.items() for n,v in rows.items()]
  with ThreadPoolExecutor(max_workers=4) as pool:print("Recovered",len(list(pool.map(lambda x:register(*x),tasks))),"originals")

