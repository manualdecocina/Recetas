"""Persist each completed photo sequence and make the twelve real WebP files."""
import json,hashlib,shutil
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
paths=json.loads((ROOT/'editorial/navidad-20261022-generated-paths.json').read_text())
plan=json.loads((ROOT/'editorial/navidad-20261022-plan.json').read_text())
keys=['pistacho','arbol','brie','turron','datiles']
for key,recipe in zip(keys,plan['recipes']):
 found=paths.get(key,{})
 if len(found)!=8:
  print(key,'in progress',len(found));continue
 slug=recipe['slug'];folder=ROOT/'public/recetas'/slug;orig=folder/'originals';orig.mkdir(parents=True,exist_ok=True)
 manifest={'slug':slug,'originals':[],'images':[],'visual_qa':'PENDING_FINAL_CONTACT_SHEET_REVIEW'}
 sheet=Image.new('RGB',(1280,520),'white');draw=ImageDraw.Draw(sheet)
 for n in range(1,9):
  source=Path(found[str(n)]);name=f'paso-{n:02}.png' if n<8 else 'portada.png';target=orig/name
  shutil.copy2(source,target)
  im=Image.open(target).convert('RGB');assert im.width*3==im.height*4,(slug,n,im.size)
  manifest['originals'].append({'asset':name,'width':im.width,'height':im.height,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'bytes':target.stat().st_size})
  out=im.resize((1280,960),Image.Resampling.LANCZOS);out.save(folder/f'paso-{n:02}.webp','WEBP',quality=88,method=6)
  thumb=im.resize((320,240));sheet.paste(thumb,(((n-1)%4)*320,((n-1)//4)*260));draw.text((((n-1)%4)*320+8,((n-1)//4)*260+242),f'{key} - {n}',fill='black')
  if n==8:
   for filename,size in [('portada.webp',(1280,960)),('portada-4x3.webp',(1280,960)),('portada-1x1.webp',(960,960)),('portada-16x9.webp',(1280,720))]:
    ImageOps.fit(out,size,method=Image.Resampling.LANCZOS,centering=(.5,.5)).save(folder/filename,'WEBP',quality=88,method=6)
 for file in sorted(folder.glob('*.webp')):
  im=Image.open(file);assert im.format=='WEBP'
  manifest['images'].append({'asset':file.name,'public_path':f'/recetas/{slug}/{file.name}','width':im.width,'height':im.height,'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'bytes':file.stat().st_size})
 assert len(manifest['images'])==12
 assert (folder/'portada.webp').read_bytes()==(folder/'paso-08.webp').read_bytes()
 (ROOT/'editorial'/f'{slug}-imagenes-20261022.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 review=ROOT.parent/'qa-navidad';review.mkdir(exist_ok=True);sheet.save(review/f'{key}-contact.jpg',quality=90)
 print(slug,'8 originals + 12 WebP ready')
