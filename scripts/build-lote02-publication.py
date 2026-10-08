"""Build the one atomic publication transaction from the15 durable sources."""
import argparse,json,hashlib
from pathlib import Path
R=Path(__file__).resolve().parents[1];ap=argparse.ArgumentParser();ap.add_argument('--check',action='store_true');args=ap.parse_args()
plan=json.loads((R/'editorial/lote-02-plan-20261008.json').read_text())
records=[r for g in plan['groups'] for r in json.loads((R/g['editorial_file']).read_text())['records']]
expected=[g['expected_before'] for g in plan['groups']]
assert len(records)==105 and len(expected)==15
fields=['title','excerpt','summary','ingredients','steps','category','prep_time_minutes','cook_time_minutes','total_time_minutes','servings','image_url','content_html','notes','difficulty','course','cuisine','keywords','nutrition','gallery','seo']
assign=', '.join(k+'=x.'+k for k in fields)
cols=['id','recipe_group_id','language','slug','public_path','source_url']+fields+['editorial_status','ready_at','published']
values=['x.id','x.recipe_group_id','x.language','x.slug','x.public_path','null']+['x.'+k for k in fields]+["'published'",'now()','true']
data=json.dumps(records,ensure_ascii=False,separators=(',',':'));before=json.dumps(expected,ensure_ascii=False,separators=(',',':'))
sql="""-- Publish all15 batch02 groups /105rows only AFTER deployment media hashes pass.
-- No schema changes or disabled triggers; any exception rolls back the entire batch.
begin;
set local lock_timeout='10s';
set local statement_timeout='120s';
select pg_advisory_xact_lock(hashtextextended('manualdecocina:lote-02-20261008',0));
do $batch$
declare
  j constant jsonb := $records$"""+data+"""$records$::jsonb;
  e constant jsonb := $expected$"""+before+"""$expected$::jsonb;
  groups uuid[];
  baseline_checksum text;
  es_count_before int;
  n int;
begin
  select array_agg((x->>'recipe_group_id')::uuid) into groups from jsonb_array_elements(e) x;
  perform r.id from public.recipes r where r.recipe_group_id=any(groups) order by r.id for update;
  if (select count(*) from jsonb_array_elements(j))<>105
    or (select count(distinct x->>'id') from jsonb_array_elements(j) x)<>105
    or (select count(distinct x->>'public_path') from jsonb_array_elements(j) x)<>105 then
    raise exception 'Invalid publication payload';
  end if;
  -- A completed matching transaction is verified and left untouched.
  if (select count(*) from public.recipes where recipe_group_id=any(groups))=105
     and not exists(
       select1 from jsonb_populate_recordset(null::public.recipes,j) x
       left join public.recipes r on r.id=x.id
       where r.id is null or not r.published or r.editorial_status<>'published'
          or r.recipe_group_id<>x.recipe_group_id or r.language<>x.language
          or r.public_path<>x.public_path or r.slug<>x.slug
          or r.title is distinct from x.title or r.steps is distinct from x.steps
          or r.ingredients is distinct from x.ingredients or r.nutrition is distinct from x.nutrition
          or r.seo is distinct from x.seo or r.notes is distinct from x.notes
          or r.summary is distinct from x.summary or r.content_html is distinct from x.content_html) then
    raise notice 'Batch02 already published with matching content; no mutation';
    return;
  end if;
  if (select count(*) from public.recipes where recipe_group_id=any(groups))<>15 then
    raise exception 'Batch group state diverged; reconcile before retry';
  end if;
  if exists(
    select1 from jsonb_array_elements(e) b left join public.recipes r on r.id=(b->>'id')::uuid
    where r.id is null or r.published or r.language<>'es'
       or md5(to_jsonb(r)::text)<>b->>'expected_row_md5') then
    raise exception 'Reserved ES row changed after baseline capture';
  end if;
  if exists(
    select1 from public.recipes r join jsonb_populate_recordset(null::public.recipes,j) x
      on r.id=x.id or r.public_path=x.public_path or (r.language=x.language and r.slug=x.slug)
    where r.id<>x.id or r.recipe_group_id<>x.recipe_group_id or r.language<>x.language) then
    raise exception 'Recipe identity or route collision';
  end if;
  if exists(
    select1 from public.content_pages c join jsonb_populate_recordset(null::public.recipes,j) x
      on c.public_path=x.public_path or (c.language=x.language and c.slug=x.slug)) then
    raise exception 'Content-page route collision';
  end if;
  select md5(coalesce(string_agg(md5(to_jsonb(r)::text),'' order by r.id),''))
    into baseline_checksum from public.recipes r where not(r.recipe_group_id=any(groups));
  select count(*) into es_count_before from public.recipes where language='es' and published;
  update public.recipes r set """+assign+""",editorial_status='published',ready_at=now(),published=true
    from jsonb_populate_recordset(null::public.recipes,j) x where r.id=x.id and x.language='es';
  get diagnostics n=row_count;
  if n<>15 then raise exception 'Expected15 ES updates, got%',n;end if;
  insert into public.recipes ("""+','.join(cols)+""")
    select """+','.join(values)+""" from jsonb_populate_recordset(null::public.recipes,j) x where x.language<>'es';
  get diagnostics n=row_count;
  if n<>90 then raise exception 'Expected90 new translations, got%',n;end if;
  if exists(
    select recipe_group_id from public.recipes where recipe_group_id=any(groups)
    group by recipe_group_id having count(*)<>7 or count(distinct language)<>7
      or count(*)filter(where published and editorial_status='published')<>7) then
    raise exception 'Incomplete7/7 group after publication';
  end if;
  if exists(
    select1 from jsonb_populate_recordset(null::public.recipes,j) x left join public.recipes r on r.id=x.id
    where r.id is null or not r.published or r.recipe_group_id<>x.recipe_group_id
      or r.language<>x.language or r.slug<>x.slug or r.public_path<>x.public_path
      or r.title is distinct from x.title or r.ingredients is distinct from x.ingredients
      or r.steps is distinct from x.steps or r.nutrition is distinct from x.nutrition
      or r.seo is distinct from x.seo or r.summary is distinct from x.summary
      or r.notes is distinct from x.notes or r.content_html is distinct from x.content_html) then
    raise exception 'Published records differ from frozen package';
  end if;
  if exists(
    select1 from jsonb_array_elements(e) b join public.recipes r on r.id=(b->>'id')::uuid
    where r.recipe_group_id<>(b->>'recipe_group_id')::uuid or r.slug<>b->>'slug'
      or r.public_path<>b->>'public_path' or r.source_url is distinct from b->>'source_url'
      or r.created_at<>(b->>'created_at')::timestamptz
      or r.published_at is distinct from (b->>'published_at')::timestamptz) then
    raise exception 'Historical identity/date preservation failed';
  end if;
  if baseline_checksum is distinct from(
    select md5(coalesce(string_agg(md5(to_jsonb(r)::text),'' order by r.id),''))
    from public.recipes r where not(r.recipe_group_id=any(groups))) then
    raise exception 'An unrelated recipe changed; rollback batch';
  end if;
  if (select count(*) from public.recipes where language='es' and published)<>es_count_before+15 then
    raise exception 'Published ES count did not increase by15';
  end if;
  raise notice 'Batch02 committed:15 groups,105 published rows; unrelated recipes preserved';
end
$batch$;
commit;
"""
sql=sql.replace('select1','select 1')
out=R/'scripts/publish-lote02-20261008.sql'
if args.check:
 assert out.read_text()==sql,'Committed SQL does not reproduce from the15 frozen packages and baseline'
else:out.write_text(sql)
print(json.dumps({'status':'PASS','records':105,'groups':15,'bytes':len(sql.encode()),'sha256':hashlib.sha256(sql.encode()).hexdigest()}))
