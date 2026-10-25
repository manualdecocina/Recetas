import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'editorial/lote-cinco-20261024';slug=sys.argv[1];b=json.loads((D/(slug+'.json')).read_text());compact=lambda x:json.dumps(x,ensure_ascii=False,separators=(',',':'))
if len(sys.argv)<3:
 old=(ROOT/'scripts/stage-arepa-huevo-20261024.sql').read_text();a=old.index('x jsonb; a jsonb;');tail=old[a:old.index('SELECT recipe_group_id,language,public_path,published FROM',a)];aliases=[dict(alias=i['name'],slug=k) for i,k in zip(b['records'][0]['ingredients'],b['pantry_slugs']) if k]
 sql='DO $stage$ DECLARE j jsonb := $payload$'+compact(b['records'])+'$payload$::jsonb; aliases jsonb := $aliases$'+compact(aliases)+'$aliases$::jsonb;\n'+tail+"SELECT recipe_group_id,language,public_path,published FROM recipes WHERE public_path IN ("+','.join("'"+r['public_path']+"'" for r in b['records'])+") ORDER BY language;\n";name='stage-'+slug+'.sql'
else:
 group=sys.argv[2];b['recipe_group_id']=group
 for r in b['records']:r['recipe_group_id']=group
 (D/(slug+'.json')).write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n');old=(ROOT/'scripts/publish-arepa-huevo-20261024.sql').read_text();tail=old[old.index('x jsonb;'):old.index('SELECT language,public_path,published FROM')].replace('arepa de huevo',slug);sql='DO $publish$ DECLARE j jsonb := $expected$'+compact(b['records'])+'$expected$::jsonb; '+tail+"SELECT language,public_path,published FROM recipes WHERE recipe_group_id='"+group+"' ORDER BY language;\n";name='publish-'+slug+'.sql'
(D/name).write_text(sql);print(name)
