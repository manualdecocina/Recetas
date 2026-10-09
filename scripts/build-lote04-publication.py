"""Reproduce one guarded transaction from fifteen immutable seven-language packages."""
import argparse,hashlib,json,re,datetime
from pathlib import Path
R=Path(__file__).resolve().parents[1];a=argparse.ArgumentParser();a.add_argument('--check',action='store_true');args=a.parse_args();plan=json.loads((R/'editorial/lote-04-plan-20261009.json').read_text())
assert len(plan['groups'])==15
groups=','.join("'"+g['recipe_group_id']+"'::uuid"for g in plan['groups'])
sql="""-- Atomic lote04 publication:15 groups /105 rows. No DDL. Rollback on any divergence.
-- Execute ONLY after green CI and exact observed preview media hashes.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='120s';
SELECT pg_advisory_xact_lock(hashtextextended('manualdecocina:lote-04-20261009',0));
SET LOCAL manualdecocina.batch04_gate='ready15_deployed';
DO $lote04_initial$
DECLARE gs uuid[]:=ARRAY["""+groups+"""]; n int;
BEGIN
 PERFORM id FROM public.recipes WHERE recipe_group_id=ANY(gs) ORDER BY id FOR UPDATE;
 SELECT count(*) INTO n FROM public.recipes WHERE recipe_group_id=ANY(gs);
 IF n NOT IN (15,105) THEN RAISE EXCEPTION 'Batch03 partial/divergent state: % rows',n;END IF;
 IF (SELECT count(*) FROM public.recipes WHERE language='es' AND published)<>
    (CASE WHEN n=15 THEN """+str(plan['expected_es_before'])+""" ELSE """+str(plan['expected_es_after'])+""" END) THEN
  RAISE EXCEPTION 'Catalog changed after prepublication baseline; reconcile';END IF;
 PERFORM set_config('manualdecocina.lote04_outside_hash',
  (SELECT md5(coalesce(string_agg(md5(to_jsonb(r)::text),'' ORDER BY r.id),'')) FROM public.recipes r WHERE NOT(r.recipe_group_id=ANY(gs))),true);
END $lote04_initial$;
"""
records=[]
for i,g in enumerate(plan['groups']):
 p=json.loads((R/g['editorial_file']).read_text());assert len(p['records'])==7
 b={k:g['expected_before'][k]for k in ['id','recipe_group_id','slug','public_path','source_url','created_at','published_at','expected_row_md5']}
 block=(R/g['sql_file']).read_text()
 assert hashlib.sha256(block.encode()).hexdigest()==g['sql_sha256']
 assert json.loads(re.search(r'\$records\$([\s\S]*?)\$records\$',block)[1])==p['records']
 actual=json.loads(re.search(r'\$before\$([\s\S]*?)\$before\$',block)[1]);actual=actual[0] if isinstance(actual,list) else actual
 for key,value in b.items():
  if key in ['created_at','published_at']:
   def date(s):return datetime.datetime.fromisoformat(s.replace('Z','+00:00'))
   assert date(actual[key])==date(value)
  else:assert actual[key]==value
 sql+=block+'\n';records+=p['records']
assert len(records)==len({r['id']for r in records})==len({r['public_path']for r in records})==105
sql+="""DO $lote04_final$
DECLARE gs uuid[]:=ARRAY["""+groups+"""];
BEGIN
 IF (SELECT count(*) FROM public.recipes WHERE recipe_group_id=ANY(gs))<>105
 OR EXISTS(SELECT recipe_group_id FROM public.recipes WHERE recipe_group_id=ANY(gs) GROUP BY recipe_group_id
 HAVING count(*)<>7 OR count(DISTINCT language)<>7 OR count(*)FILTER(WHERE published AND editorial_status='published')<>7) THEN
  RAISE EXCEPTION 'Final batch04 is not fifteen complete7/7 groups';END IF;
 IF (SELECT count(*) FROM public.recipes WHERE language='es' AND published)<>"""+str(plan['expected_es_after'])+""" THEN
  RAISE EXCEPTION 'Final catalog count diverged';END IF;
 IF current_setting('manualdecocina.lote04_outside_hash') IS DISTINCT FROM
  (SELECT md5(coalesce(string_agg(md5(to_jsonb(r)::text),'' ORDER BY r.id),'')) FROM public.recipes r WHERE NOT(r.recipe_group_id=ANY(gs))) THEN
  RAISE EXCEPTION 'Unrelated recipe changed; rollback';END IF;
END $lote04_final$;
COMMIT;
"""
out=R/'scripts/publish-lote04-20261009.sql'
if args.check:assert out.read_text()==sql,'Committed SQL does not reproduce from frozen sources'
else:out.write_text(sql)
print(json.dumps({'status':'PASS','groups':15,'records':105,'bytes':len(sql.encode()),'sha256':hashlib.sha256(sql.encode()).hexdigest()}))
