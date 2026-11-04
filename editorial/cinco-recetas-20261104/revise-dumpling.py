"""Clarify the dish name and use the reviewed, softer wonton photographs."""
import html,json
from pathlib import Path
D=Path(__file__).resolve().parent
from build import LABEL
changes={
'es':('Dumplings en capas al vapor con cerdo y wonton','Se conoce como «lasaña de dumplings» por las capas; no lleva queso ni bechamel.','Reparte la cebolleta reservada y el sésamo. Sirve con una cuchara, recogiendo masa, relleno y jugos. Las obleas quedan blandas y algo arrugadas; no forman un bloque firme como una lasaña horneada.','Dumplings en capas con obleas de wonton blandas, cerdo, repollo y sus jugos'),
'en':('Steamed Pork Dumplings in Layers with Wonton Wrappers','Often called dumpling lasagna because of its layers, it contains no cheese or béchamel.','Scatter over the reserved scallions and sesame. Serve with a spoon, taking soft wrappers, filling and juices together. The wrappers are tender and slightly wrinkled; they do not form a rigid baked-lasagna block.','Layered steamed dumplings with soft wonton wrappers, pork, cabbage and savory juices'),
'de':('Gedämpfte Dumplings in Schichten mit Schweinehack','Wegen der Schichten heißt das Gericht auch Dumpling-Lasagne; Käse und Béchamel gehören nicht hinein.','Frühlingszwiebeln und Sesam darüberstreuen. Mit einem Löffel weiche Teigblätter, Füllung und Saft gemeinsam aufnehmen. Die Blätter sind zart und leicht faltig, kein fester Block wie eine gebackene Lasagne.','Gedämpfte Dumplings mit weichen Wan-Tan-Blättern, Schweinehack, Kohl und Garsaft'),
'fr':('Raviolis vapeur en couches au porc et feuilles wonton','Le nom dumpling lasagna fait référence aux couches ; cette préparation ne contient ni fromage ni béchamel.','Parsemez de cébettes et de sésame. Servez à la cuillère en prenant pâte, farce et jus ensemble. Les feuilles sont tendres et légèrement plissées ; elles ne forment pas un bloc ferme de lasagnes au four.','Raviolis vapeur en couches avec feuilles wonton souples, porc, chou et jus'),
'it':('Ravioli a strati al vapore con maiale e sfoglie wonton','Il nome dumpling lasagna si riferisce agli strati; questa preparazione non contiene formaggio né besciamella.','Completa con cipollotto e sesamo. Servi con un cucchiaio raccogliendo sfoglie morbide, ripieno e succhi insieme. Le sfoglie sono tenere e un po’ increspate, senza formare un blocco rigido da lasagna al forno.','Ravioli a strati con sfoglie wonton morbide, maiale, cavolo e succhi di cottura'),
'ja':('包まないワンタンの重ね蒸し｜豚ひき肉とキャベツ','重ねることからダンプリングラザニアとも呼ばれますが、チーズやベシャメルソースは使いません。','取り分けた青ねぎとごまを散らします。スプーンで柔らかい皮、肉だね、汁を一緒にすくって盛ります。皮は柔らかく少ししわが寄り、焼いたラザニアのような固い塊にはなりません。','柔らかいワンタンの皮と豚肉、キャベツを汁ごと盛る重ね蒸し'),
'pt':('Dumplings em camadas no vapor com porco e wonton','O nome dumpling lasagna se refere às camadas; esta preparação não leva queijo nem molho branco.','Espalhe a cebolinha reservada e o gergelim. Sirva de colher, pegando massa macia, recheio e sucos juntos. As folhas ficam tenras e um pouco enrugadas, sem formar um bloco firme como lasanha de forno.','Dumplings em camadas com massa wonton macia, porco, repolho e sucos')}
p=D/'lasana-dumplings-al-vapor.json';doc=json.loads(p.read_text());base=doc['records'][0]['image_url'].rsplit('/',1)[0]
for r in doc['records']:
    title,clause,last,alt=changes[r['language']]
    r['title']=title;r['seo']['title']=title
    if clause not in r['summary']:r['summary']+=' '+clause
    r['content_html']=f'<h2>{LABEL[r["language"]][0]}</h2><p>{html.escape(r["summary"])}</p>'
    r['image_url']=base+'/portada-v2.webp';r['gallery']=[dict(url=r['image_url'],alt=alt)];r['seo']['image_alt']=alt
    r['seo']['image_variants']=[base+'/portada-'+a+'-v2.webp' for a in ['1x1','4x3','16x9']]
    for n in [7,8]:r['steps'][n-1]['image_url']=base+f'/paso-{n:02}-v2.webp'
    r['steps'][7]['content']=last
    for s in r['steps']:s['image_alt']=s['title']+' — '+title
doc['visual_revision']='2026-11-04: soft, wrinkled small wonton wrappers and a loose spoonful; clear layered-dumpling name. Original illustration was too rigid.'
p.write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n')
stage=D/'lasana-dumplings-al-vapor-stage.sql'
if stage.exists():
    s=stage.read_text();a=s.index('$payload$')+len('$payload$');b=s.index('$payload$',a);stage.write_text(s[:a]+json.dumps(doc['records'],ensure_ascii=False)+s[b:])
payload=json.dumps(doc['records'],ensure_ascii=False)
sql="""DO $revise$ DECLARE payload jsonb := $data$DATA$data$::jsonb; x jsonb; v public.recipes; old public.recipes; BEGIN
PERFORM set_config('request.jwt.claim.sub','2caf0bab-d7e8-4d52-9910-d79799c27072',true); IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin context missing'; END IF;
FOR x IN SELECT value FROM jsonb_array_elements(payload) LOOP
v:=jsonb_populate_record(NULL::public.recipes,x); SELECT * INTO STRICT old FROM public.recipes WHERE recipe_group_id='ac7f78f5-e527-47df-a146-c65c112791a1' AND language=v.language;
PERFORM public.update_recipe(old.id,old.slug,v.title,v.excerpt,v.ingredients,v.steps,old.category,old.prep_time_minutes,old.cook_time_minutes,old.servings,v.image_url,true);
UPDATE public.recipes SET summary=v.summary,content_html=v.content_html,gallery=v.gallery,seo=v.seo WHERE id=old.id;
END LOOP; END $revise$;""".replace('DATA',payload)
(D/'lasana-dumplings-al-vapor-visual-fix.sql').write_text(sql)
print('Seven language names and soft-wonton presentation clarified')
