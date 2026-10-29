import json,hashlib,shutil,sys
from pathlib import Path
from PIL import Image,ImageOps
ROOT=Path(__file__).parent
key,slug=sys.argv[1:3]
data=json.loads((ROOT/f'{key}-image-inputs.json').read_text())
out=ROOT/'public'/'recetas'/slug;out.mkdir(parents=True,exist_ok=True)
originals=ROOT/'originals'/slug;originals.mkdir(parents=True,exist_ok=True)
manifest=[]
for name,src in data['images'].items():
    source=Path(src);shutil.copy2(source,originals/f'{name}.png')
    im=Image.open(source).convert('RGB')
    sizes=[(name+'.webp',(1600,1200) if name=='portada' else (1200,900))]
    if name=='portada':sizes += [('portada-4x3.webp',(1600,1200)),('portada-1x1.webp',(1200,1200)),('portada-16x9.webp',(1600,900)),('paso-08.webp',(1200,900))]
    for filename,size in sizes:
        p=out/filename;assert not p.exists(),p
        frame=ImageOps.fit(im,size,method=Image.Resampling.LANCZOS)
        quality=88
        while True:
            frame.save(p,'WEBP',quality=quality,method=6)
            if p.stat().st_size<=150000 or quality<=60:break
            quality-=4
        assert p.stat().st_size<=150000
        manifest.append(dict(path=f'{slug}/{filename}',file=str(p),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),bytes=p.stat().st_size,width=size[0],height=size[1],original=str(originals/f'{name}.png'),original_sha256=hashlib.sha256(source.read_bytes()).hexdigest()))
(ROOT/f'{key}-media.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'slug':slug,'files':len(manifest),'bytes':sum(x['bytes'] for x in manifest)}))
