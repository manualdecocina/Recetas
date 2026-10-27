"""Only format conversion/crops and QA thumbnails; no food content synthesis."""
import json,hashlib,shutil,io,os
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'editorial/siete-mercados-20261027';sources=json.loads((D/'image-sources.json').read_text())
for p in D.glob('*-es.json'):
 r=json.loads(p.read_text());paths=sources.get(r['key'],{})
 if len(paths)!=8:continue
 manifest=D/(r['slug']+'-images.json')
 if manifest.exists():
  existing=json.loads(manifest.read_text())['images']
  hashes={i:hashlib.sha256(Path(paths[str(i)]).read_bytes()).hexdigest() for i in range(1,9)}
  if len(existing)==12 and all(x.get('original_sha256')==hashes[x['step']] and (ROOT/x['path']).exists() and hashlib.sha256((ROOT/x['path']).read_bytes()).hexdigest()==x['sha256'] and x.get('public_path') for x in existing):
   print(r['slug'],'unchanged media verified');continue
 out=ROOT/'public/recetas'/r['slug'];out.mkdir(parents=True,exist_ok=True);originals=D/'originales'/r['slug'];originals.mkdir(parents=True,exist_ok=True)
 entries=[];sheet=Image.new('RGB',(1200,510),'white');draw=ImageDraw.Draw(sheet)
 for i in range(1,9):
  src=Path(paths[str(i)]);original=originals/f'paso-{i:02}.png'
  if not original.exists() or hashlib.sha256(original.read_bytes()).digest()!=hashlib.sha256(src.read_bytes()).digest():shutil.copyfile(src,original)
  image=Image.open(original).convert('RGB');assert abs(image.width/image.height-4/3)<.01,(src,image.size)
  sizes=[(f'paso-{i:02}.webp',(1600,1200))]
  if i==8:sizes += [('portada.webp',(1600,1200)),('portada-4x3.webp',(1600,1200)),('portada-1x1.webp',(1200,1200)),('portada-16x9.webp',(1600,900))]
  for name,size in sizes:
   dest=out/name;img=ImageOps.fit(image,size,method=Image.Resampling.LANCZOS);buffer=io.BytesIO();img.save(buffer,'WEBP',quality=86,method=6);data=buffer.getvalue();pending=dest.with_suffix('.pending')
   with pending.open('wb') as f:f.write(data);f.flush();os.fsync(f.fileno())
   os.replace(pending,dest);assert dest.read_bytes()==data;assert data[:4]==b'RIFF' and data[8:12]==b'WEBP'
   entries.append(dict(path=dest.relative_to(ROOT).as_posix(),public_path='https://eqbdtctxbpepbeickhqi.supabase.co/storage/v1/object/public/recetas/'+r['slug']+'/'+name,bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),width=img.width,height=img.height,original_sha256=hashlib.sha256(original.read_bytes()).hexdigest(),step=i))
  thumb=ImageOps.fit(image,(290,217));x=((i-1)%4)*300;y=((i-1)//4)*255;sheet.paste(thumb,(x,y));draw.text((x+5,y+222),f'{i}: {r["steps"][i-1][0]}',fill='black')
 sheet.save(D/(r['slug']+'-contact-sheet.jpg'),quality=88)
 assert len(entries)==12
 (D/(r['slug']+'-images.json')).write_text(json.dumps(dict(slug=r['slug'],generated_originals=8,webp_count=12,cover_equals_step_08=True,images=entries),indent=2)+'\n')
 print(r['slug'],len(entries),'WebP files prepared')
