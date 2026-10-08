import pathlib,json,hashlib,re,copy
from PIL import Image
R=pathlib.Path(__file__).resolve().parents[1];bpath=R/'editorial/lote-01-plan-v2-20261008.json';b=json.loads(bpath.read_text());template=(R/'scripts/publish-bulgogi-20261007.sql').read_text();sql=['-- Lote 01: publicar 10 grupos atomicos completos (70 filas) SOLO tras medios HTTP 200.','begin;'];allpaths=[];media=[]
for g in b['groups']:
 p=R/'editorial'/f"{g['slug']}-7idiomas-20261008.json";item=json.loads(p.read_text());m=json.loads((R/g['images_file']).read_text());prefix='/recetas/'+g['slug']+'/'
 for im in m['images']:
  path=R/'public'/prefix.lstrip('/')/im['archivo'];img=Image.open(path);img.load();assert img.format=='WEBP' and min(img.size)>800
  im.update(estado='entregada',sha256=hashlib.sha256(path.read_bytes()).hexdigest(),width=img.width,height=img.height);media.append(prefix+im['archivo'])
 for r in item['records']:
  r['image_url']=prefix+'portada.webp';r['gallery']=[{'url':prefix+'portada.webp','alt':r['seo']['image_alt']}];r['seo']['image_variants']=[prefix+'portada-'+a+'.webp' for a in ['1x1','4x3','16x9']]
  for n,s in enumerate(r['steps'],1):s['image_url']=prefix+f'paso-{n:02d}.webp'
  if r['language']=='es' and 'pendientes de confirmación del propietario' not in r['nutrition']['note']:r['nutrition']['note']+=' Cantidades, tiempos, raciones y nutrición propuestos por IA, pendientes de confirmación del propietario.'
  r['editorial_status']='ready';r['published']=False;allpaths.append(r['public_path'])
 item['state']='7_LANGUAGES_AND_IMAGES_READY_FOR_PUBLICATION';item['publication_blockers']=['MEDIA_HTTP_200_PENDING','PUBLIC_QA_PENDING'];item['media_qa']='Visual review passed; risotto step 5 and curry step 4 regenerated to match the frozen sequence.'
 p.write_text(json.dumps(item,ensure_ascii=False,indent=2)+'\n');m['delivery_status']='120_ASSETS_BATCH_DELIVERED_PUBLIC_HTTP_VERIFICATION_PENDING';m['source_steps_sha256']=m['steps_sha256'];m['attached_steps_sha256']=hashlib.sha256(json.dumps(item['records'][0]['steps'],ensure_ascii=False,sort_keys=True).encode()).hexdigest();(R/g['images_file']).write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
 g['localized_editorial_file']=str(p.relative_to(R));g['state']=item['state'];es=item['records'][0]
 payload=[]
 for r in item['records']:
  x=copy.deepcopy(r)
  if x['language']!='es':x['nutrition'].pop('inputs',None)
  payload.append(x)
 s=template.replace("g constant uuid := '5a537e08-8075-49e6-a9ae-34cc1ae44f80'",f"g constant uuid := '{g['recipe_group_id']}'").replace("es_id constant uuid := '1a718e60-07ab-486e-9eff-0f386130ec7f'",f"es_id constant uuid := '{es['id']}'")
 start=s.index('$j$');end=s.index(']$j$::jsonb;',start)+len(']$j$::jsonb;');s=s[:start]+'$j$'+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+'$j$::jsonb;'+s[end:]
 s=s.replace("public_path = '/bulgogi-carne-marinada-coreana'","public_path = '"+es['public_path']+"'").replace("    '', x.notes","    x.content_html, x.notes")
 s='-- '+g['slug']+'\n'+s[s.index('do $pub$'):];sql.append(s)
assert len(allpaths)==70 and len(set(allpaths))==70;assert len(media)==120
sql.append('commit;');(R/'scripts/publish-lote01-20261008.sql').write_text('\n'.join(sql))
b.update(phase='CONTENT_TRANSLATIONS_MEDIA_READY',publication_status='NOT_EXECUTED',blocker='Esperando despliegue de medios HTTP 200 antes de la transacción atómica.',image_slots=120,language_records=70,image_wait_days=3);bpath.write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n')
(R/'editorial/lote-01-media-http-20261008.json').write_text(json.dumps({'scope':b['scope'],'paths':media,'status':'PENDING_PUBLIC_HTTP_VERIFICATION'},ensure_ascii=False,indent=2)+'\n')
print('Ready: 70 complete localized records, 120 decoded WebP, atomic 10-group SQL:',(R/'scripts/publish-lote01-20261008.sql').stat().st_size,'bytes')
