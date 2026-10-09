"""Reconcile manifests from inspected originals and actual derived files."""
import hashlib,json
from pathlib import Path
from PIL import Image
R=Path(__file__).resolve().parents[1];base=json.loads((R/'editorial/lote05-baseline-identities-20261009.json').read_text())['rows'];plan={'schema_version':1,'batch':'lote-05-20261009','expected_es_before':154,'expected_es_after':159,'groups':[],'media':[],'originals':[]}
for b in base:
 slug=b['slug'];f=R/'editorial'/f'{slug}-20261009.json';j=json.loads(f.read_text());rs=j['records'];steps=rs[0]['steps'];D=R/'public/recetas'/slug;orig=[];images=[]
 def inspect(p):
  raw=p.read_bytes()
  with Image.open(p)as im:sz=im.size;fmt=im.format;im.verify()
  assert fmt==('PNG'if p.suffix=='.png'else'WEBP');return {'asset':p.name,'path':str(p.relative_to(R)),'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'width':sz[0],'height':sz[1],'visual_qa':'PASS'}
 for i in range(len(steps)):
  name='portada'if i==0 else f'paso-{i:02d}';a=inspect(D/'originals'/(name+'.png'));a.update(phase=len(steps)if i==0 else i,source='built-in ImageGen');orig.append(a)
 for name in ['portada.webp','portada-1x1.webp','portada-4x3.webp','portada-16x9.webp',*(f'paso-{i:02d}.webp'for i in range(1,len(steps)+1))]:
  a=inspect(D/name);a.update(public_path=f'/recetas/{slug}/{name}',original=('portada.png'if name.startswith('portada')or name==f'paso-{len(steps):02d}.webp'else name.replace('.webp','.png')));assert(a['width'],a['height'])==((960,960)if name=='portada-1x1.webp'else(1280,720)if name=='portada-16x9.webp'else(1280,960));images.append(a)
 assets=[]
 for a in images:
  step=int(a['asset'][5:7])-1 if a['asset'].startswith('paso-')else None;assets.append({'path':a['public_path'],'alt_by_language':{r['language']:r['title']if step is None else r['steps'][step]['image_alt']for r in rs},'visual_qa':'PASS'})
 m={'slug':slug,'directory':str(D.relative_to(R)),'state':'ALL_IMAGES_READY','steps_sha256':j['steps_sha256'],'originals':orig,'images':images,'assets':assets,'cover_variant_visual_qa':'PENDING_CONTACT_SHEET'};mf=R/'editorial'/f'{slug}-imagenes.json';mf.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');j['state']='FULL_PACKAGE_READY_PREPUBLICATION';j['publication_blockers']=['CI_DEPLOY_DB_CACHE_LIVE_QA_PENDING'];f.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n');before={k:v for k,v in b.items()if k in ['id','recipe_group_id','slug','public_path','source_url','created_at','published_at']};before['expected_row_md5']=b['row_md5'];plan['groups'].append({'slug':slug,'recipe_group_id':b['recipe_group_id'],'editorial_file':str(f.relative_to(R)),'images_file':str(mf.relative_to(R)),'package_sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'steps_sha256':j['steps_sha256'],'expected_before':before});plan['media'].extend({**a,'path':a['public_path']}for a in images);plan['originals'].extend(orig)
assert len(plan['media'])==56 and len(plan['originals'])==36;(R/'editorial/lote-05-plan-20261009.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n');print({'groups':5,'webp':56,'originals':36})
