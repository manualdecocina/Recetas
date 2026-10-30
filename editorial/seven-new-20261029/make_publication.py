import json,sys,uuid
from pathlib import Path
ROOT=Path(__file__).parent
key,group=sys.argv[1:3];uuid.UUID(group)
b=json.loads((ROOT/f'{key}-bundle.json').read_text());assert len(b['records'])==7
media=json.loads((ROOT/f'{key}-upload.json').read_text());assert len(media)==12 and all(x['public_verified'] for x in media)
b['recipe_group_id']=group
for r in b['records']:r['recipe_group_id']=group
(ROOT/f'{key}-bundle.json').write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n')
sql="""DO $$ DECLARE r public.recipes; n int:=0; BEGIN
PERFORM set_config('request.jwt.claim.sub','2caf0bab-d7e8-4d52-9910-d79799c27072',true);
IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin required'; END IF;
FOR r IN SELECT * FROM public.recipes WHERE recipe_group_id='GROUP' AND NOT published AND editorial_status='draft' FOR UPDATE LOOP
IF jsonb_array_length(r.steps)<>8 OR r.image_url IS NULL THEN RAISE EXCEPTION 'Incomplete draft'; END IF;
UPDATE public.recipes SET editorial_status='ready',ready_at=now(),reviewed_at=now(),reviewed_by='Codex owner-authorized editorial QA 2026-10-29; no physical kitchen test' WHERE id=r.id;
PERFORM public.update_recipe(r.id,r.slug,r.title,r.excerpt,r.ingredients,r.steps,r.category,r.prep_time_minutes,r.cook_time_minutes,r.servings,r.image_url,true);
n:=n+1;
END LOOP;
IF n<>7 THEN RAISE EXCEPTION 'Expected seven drafts'; END IF;
END $$;
SELECT language,public_path,published,editorial_status FROM public.recipes WHERE recipe_group_id='GROUP' ORDER BY language;
""".replace('GROUP',group)
(ROOT/f'{key}-publish-short.sql').write_text(sql)
print(sql)
