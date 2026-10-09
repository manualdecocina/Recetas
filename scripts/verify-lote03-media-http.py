"""Observe the actual preview deployment before any database publication."""
import concurrent.futures,datetime,hashlib,json,pathlib,urllib.request
root=pathlib.Path(__file__).resolve().parents[1]
plan=json.loads((root/'editorial/lote-03-plan-20261008.json').read_text())
base='https://preview.manualdecocina.com'
def check(asset):
 try:
  request=urllib.request.Request(base+asset['path'],headers={'Cache-Control':'no-cache','User-Agent':'ManualDeCocina-Lote03-QA'})
  with urllib.request.urlopen(request,timeout=45) as response:
   data=response.read();status=response.status;kind=response.headers.get('Content-Type','')
  digest=hashlib.sha256(data).hexdigest()
  return {'path':asset['path'],'http':status,'bytes':len(data),'sha256':digest,'ok':status==200 and digest==asset['sha256'] and 'image/webp' in kind}
 except Exception as error:
  return {'path':asset['path'],'ok':False,'error':str(error)}
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:rows=list(pool.map(check,plan['media']))
report={'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'base':base,'assets':len(rows),'passed':sum(r['ok'] for r in rows),'errors':[r for r in rows if not r['ok']],'results':rows}
(root/'lote03-media-deployment-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'checked_at':report['checked_at'],'assets':len(rows),'passed':report['passed'],'error_count':len(report['errors']),'first_errors':report['errors'][:3]},ensure_ascii=False))
raise SystemExit(0 if report['passed']==len(plan['media']) and not report['errors'] else 1)
