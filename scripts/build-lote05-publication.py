"""Reproduce a guarded five-group transaction using the proven batch04 guard template."""
import argparse,hashlib,json,re
from pathlib import Path
R=Path(__file__).resolve().parents[1];a=argparse.ArgumentParser();a.add_argument('--check',action='store_true');args=a.parse_args();plan=json.loads((R/'editorial/lote-05-plan-20261009.json').read_text());assert len(plan['groups'])==5 and len(plan['media'])==56
template=(R/'scripts/publish-recetas-de-trufas-de-chocolate-20261009.sql').read_text();blocks=[]
for i,g in enumerate(plan['groups']):
 j=json.loads((R/g['editorial_file']).read_text());assert len(j['records'])==7 and hashlib.sha256((R/g['editorial_file']).read_bytes()).hexdigest()==g['package_sha256'];block=re.sub(r'\$records\$[\s\S]*?\$records\$',lambda _: '$records$'+json.dumps(j['records'],ensure_ascii=False)+'$records$',template);block=re.sub(r'\$before\$[\s\S]*?\$before\$',lambda _: '$before$'+json.dumps(g['expected_before'],ensure_ascii=False)+'$before$',block);block=block.replace('b5dc3c62-05ba-4ce6-8748-39570d2271a9',g['recipe_group_id']).replace('chocolate_truffles','lote05_group_'+str(i+1)).replace('Chocolate truffles',g['slug']).replace('chocolate_truffles',g['slug']).replace('batch04_gate','batch05_gate').replace('ready15_deployed','ready5_deployed').replace('Full15recipe lote04','Full5recipe lote05').replace('atomic15recipe lote04','atomic5recipe lote05').replace('all15ready','all5ready').replace('lote04 transaction','lote05 transaction');blocks.append(block)
 groups=','.join("'"+g['recipe_group_id']+"'::uuid"for g in plan['groups']);initial="""-- Atomic lote05: exactly five groups /35 language records. No DDL.
-- Run ONLY after green CI, merged media deployment and observed exact56WebP hashes.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='120s';
SELECT pg_advisory_xact_lock(hashtextextended('manualdecocina:lote-05-20261009',0));
SET LOCAL manualdecocina.batch05_gate='ready5_deployed';
DO $lote05_initial$
DECLARE gs uuid[]:=ARRAY["""+groups+"""];n int;
BEGIN
 PERFORM id FROM public.recipes WHERE recipe_group_id=ANY(gs) ORDER BY id FOR UPDATE;
 SELECT count(*) INTO n FROM public.recipes WHERE recipe_group_id=ANY(gs);
 IF n NOT IN(5,35) THEN RAISE EXCEPTION 'Partial/divergent lote05 state: % rows',n;END IF;
 IF (SELECT count(*) FROM public.recipes WHERE language='es' AND published)<>(CASE WHEN n=5 THEN 154 ELSE 159 END) THEN RAISE EXCEPTION 'Catalog changed; reconcile before publishing';END IF;
 PERFORM set_config('manualdecocina.lote05_outside_hash',(SELECT md5(coalesce(string_agg(md5(to_jsonb(r)::text),'' ORDER BY r.id),'')) FROM public.recipes r WHERE NOT(r.recipe_group_id=ANY(gs))),true);
END $lote05_initial$;
""";final="""DO $lote05_final$
DECLARE gs uuid[]:=ARRAY["""+groups+"""];
BEGIN
 IF(SELECT count(*) FROM public.recipes WHERE recipe_group_id=ANY(gs))<>35 OR EXISTS(SELECT recipe_group_id FROM public.recipes WHERE recipe_group_id=ANY(gs) GROUP BY recipe_group_id HAVING count(*)<>7 OR count(DISTINCT language)<>7 OR count(*)FILTER(WHERE published AND editorial_status='published')<>7) THEN RAISE EXCEPTION 'Five groups not complete7/7';END IF;
 IF(SELECT count(*) FROM public.recipes WHERE language='es' AND published)<>159 THEN RAISE EXCEPTION 'Final catalog diverged';END IF;
 IF current_setting('manualdecocina.lote05_outside_hash') IS DISTINCT FROM(SELECT md5(coalesce(string_agg(md5(to_jsonb(r)::text),'' ORDER BY r.id),'')) FROM public.recipes r WHERE NOT(r.recipe_group_id=ANY(gs))) THEN RAISE EXCEPTION 'Unrelated recipe mutation; rollback';END IF;
END $lote05_final$;
COMMIT;
""";sql=initial+'\n'.join(blocks)+final;out=R/'scripts/publish-lote05-20261009.sql'
if args.check:assert out.read_text()==sql,'SQL differs from frozen sources'
else:out.write_text(sql)
print({'status':'PASS','groups':5,'records':35,'bytes':len(sql.encode()),'sha256':hashlib.sha256(sql.encode()).hexdigest()})
