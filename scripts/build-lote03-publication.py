"""Reproduce one guarded transaction from fifteen immutable seven-language packages."""
import argparse,hashlib,json,re
from pathlib import Path
R=Path(__file__).resolve().parents[1];a=argparse.ArgumentParser();a.add_argument('--check',action='store_true');args=a.parse_args();plan=json.loads((R/'editorial/lote-03-plan-20261008.json').read_text())
assert len(plan['groups'])==15
template=(R/'scripts/publish-receta-de-pizza-casera-20261008.sql').read_text()
groups=','.join("'"+g['recipe_group_id']+"'::uuid"for g in plan['groups'])
sql="""-- Atomic lote03 publication:15 groups /105 rows. No DDL. Rollback on any divergence.
-- Execute ONLY after green CI and exact observed preview media hashes.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='120s';
SELECT pg_advisory_xact_lock(hashtextextended('manualdecocina:lote-03-20261008',0));
SET LOCAL manualdecocina.batch03_gate='ready15_deployed';
DO $lote03_initial$
DECLARE gs uuid[]:=ARRAY["""+groups+"""]; n int;
BEGIN
 PERFORM id FROM public.recipes WHERE recipe_group_id=ANY(gs) ORDER BY id FOR UPDATE;
 SELECT count(*) INTO n FROM public.recipes WHERE recipe_group_id=ANY(gs);
 IF n NOT IN (15,105) THEN RAISE EXCEPTION 'Batch03 partial/divergent state: % rows',n;END IF;
 IF (SELECT count(*) FROM public.recipes WHERE language='es' AND published)<>
    (CASE WHEN n=15 THEN """+str(plan['expected_es_before'])+""" ELSE """+str(plan['expected_es_after'])+""" END) THEN
  RAISE EXCEPTION 'Catalog changed after prepublication baseline; reconcile';END IF;
 PERFORM set_config('manualdecocina.lote03_outside_hash',
  (SELECT md5(coalesce(string_agg(md5(to_jsonb(r)::text),'' ORDER BY r.id),'')) FROM public.recipes r WHERE NOT(r.recipe_group_id=ANY(gs))),true);
END $lote03_initial$;
"""
records=[]
for i,g in enumerate(plan['groups']):
 p=json.loads((R/g['editorial_file']).read_text());assert len(p['records'])==7
 b={k:g['expected_before'][k]for k in ['id','recipe_group_id','slug','public_path','source_url','created_at','published_at','expected_row_md5']}
 block=template.replace('$pizza$',f'$group{i:02d}$').replace('Pizza',g['slug']).replace('pizza ',g['slug']+' ').replace('31a06fe5-2ae5-4451-8ee8-e53376013609',g['recipe_group_id'])
 # Include explicit category slug in mutation/comparison; preserve all historical source URLs.
 block=block.replace('category=x.category,','category=x.category, category_slug=x.category_slug,')
 block=block.replace('steps,category,prep_time_minutes','steps,category,category_slug,prep_time_minutes').replace('x.steps,x.category,x.prep_time_minutes','x.steps,x.category,x.category_slug,x.prep_time_minutes')
 block=block.replace('r.category IS DISTINCT FROM x.category OR','r.category IS DISTINCT FROM x.category OR r.category_slug IS DISTINCT FROM x.category_slug OR')
 block=re.sub(r'\$records\$[\s\S]*?\$records\$',lambda m:'$records$'+json.dumps(p['records'],ensure_ascii=False,separators=(',',':'))+'$records$',block)
 block=re.sub(r'\$before\$[\s\S]*?\$before\$',lambda m:'$before$'+json.dumps(b,ensure_ascii=False,separators=(',',':'))+'$before$',block)
 sql+=block+'\n';records+=p['records']
assert len(records)==len({r['id']for r in records})==len({r['public_path']for r in records})==105
sql+="""DO $lote03_final$
DECLARE gs uuid[]:=ARRAY["""+groups+"""];
BEGIN
 IF (SELECT count(*) FROM public.recipes WHERE recipe_group_id=ANY(gs))<>105
 OR EXISTS(SELECT recipe_group_id FROM public.recipes WHERE recipe_group_id=ANY(gs) GROUP BY recipe_group_id
 HAVING count(*)<>7 OR count(DISTINCT language)<>7 OR count(*)FILTER(WHERE published AND editorial_status='published')<>7) THEN
  RAISE EXCEPTION 'Final batch03 is not fifteen complete7/7 groups';END IF;
 IF (SELECT count(*) FROM public.recipes WHERE language='es' AND published)<>"""+str(plan['expected_es_after'])+""" THEN
  RAISE EXCEPTION 'Final catalog count diverged';END IF;
 IF current_setting('manualdecocina.lote03_outside_hash') IS DISTINCT FROM
  (SELECT md5(coalesce(string_agg(md5(to_jsonb(r)::text),'' ORDER BY r.id),'')) FROM public.recipes r WHERE NOT(r.recipe_group_id=ANY(gs))) THEN
  RAISE EXCEPTION 'Unrelated recipe changed; rollback';END IF;
END $lote03_final$;
COMMIT;
"""
out=R/'scripts/publish-lote03-20261008.sql'
if args.check:assert out.read_text()==sql,'Committed SQL does not reproduce from frozen sources'
else:out.write_text(sql)
print(json.dumps({'status':'PASS','groups':15,'records':105,'bytes':len(sql.encode()),'sha256':hashlib.sha256(sql.encode()).hexdigest()}))
