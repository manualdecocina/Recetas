import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'editorial/siete-mercados-20261027';compact=lambda v:json.dumps(v,ensure_ascii=False,separators=(',',':'))
groups=json.loads((D/'groups.json').read_text()) if (D/'groups.json').exists() else {}
for p in D.glob('*.json'):
 b=json.loads(p.read_text())
 if not isinstance(b,dict) or not b.get('records'):continue
 if len(sys.argv)==1:
  template=(ROOT/'scripts/stage-arepa-huevo-20261024.sql').read_text();tail=template[template.index('x jsonb;'):template.index('SELECT recipe_group_id,language,public_path,published FROM')]
  aliases=[dict(alias=i['name'],slug=s) for i,s in zip(b['records'][0]['ingredients'],b['pantry_slugs']) if s]
  sql='DO $stage$ DECLARE j jsonb := $payload$'+compact(b['records'])+'$payload$::jsonb; aliases jsonb := $aliases$'+compact(aliases)+'$aliases$::jsonb;\n'+tail
  sql+='SELECT recipe_group_id,language,public_path,published FROM public.recipes WHERE public_path IN ('+','.join("'"+r['public_path']+"'" for r in b['records'])+') ORDER BY language;\n';name='stage-'+b['slug']+'.sql'
 else:
  group=groups[b['slug']];b['recipe_group_id']=group
  for r in b['records']:r['recipe_group_id']=group
  p.write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n')
  template=(ROOT/'scripts/publish-arepa-huevo-20261024.sql').read_text();tail=template[template.index('x jsonb;'):template.index('SELECT language,public_path,published FROM')].replace('2026-10-24','2026-10-27').replace('arepa de huevo','siete mercados')
  sql='DO $publish$ DECLARE j jsonb := $expected$'+compact(b['records'])+'$expected$::jsonb; '+tail
  sql+="SELECT language,public_path,published FROM public.recipes WHERE recipe_group_id='"+group+"' ORDER BY language;\n";name='publish-'+b['slug']+'.sql'
 (D/name).write_text(sql)
 print(name)
