import json
from pathlib import Path
L={}
def add(l,slug,title,summary,notes,ing,steps,faq,serving):L[l]=dict(slug=slug,title=title,summary=summary,notes=notes,ingredients=ing.split('|'),steps=[s.split('::',1) for s in steps.strip().split('\n')],faq=[s.split('::',1) for s in faq.strip().split('\n')],serving_size=serving)
add('en','no-knead-rosemary-focaccia','No-knead rosemary focaccia with an overnight rise','Airy rosemary focaccia with a golden base, made with two sets of folds and an overnight refrigerator rise. No traditional kneading, with all proving time included.',
'This wet dough is sticky: use damp hands and avoid extra flour. Resting includes 40 minutes for the folds, 12 hours in the refrigerator, 90 minutes in the pan and 10 minutes cooling. Growth depends on temperature. Use a 25 × 35 cm metal pan with parchment rated for 220 °C. Contains wheat. Store without moist toppings in a closed container for up to 2 days, or freeze portions for longer storage.',
'bread flour|cold water|olive oil|salt|instant dry baker’s yeast|dried rosemary',
'''Mix without kneading::Mix 500 g flour, 3 g yeast and 10 g salt. Add 400 ml cold water and 15 g olive oil. Stir with a spatula until no dry flour remains.
Make two sets of folds::Cover and rest for 20 minutes. With a wet hand, lift one dough edge and fold it into the centre; repeat on all 4 sides. Cover, wait another 20 minutes and repeat the 4 folds.
Prove in the refrigerator::Cover tightly and refrigerate at 4 °C or below for 12 hours. The dough should look airy and bubbly afterwards; volume varies with refrigerator temperature.
Transfer to the pan::Line a 25 × 35 cm metal pan with baking parchment and spread with 20 g oil. Gently tip in the dough and stretch towards the corners, keeping the bubbles.
Let it puff up::Cover and rest for about 90 minutes at room temperature until puffy and jiggly when the pan moves. If it springs back, wait 20 minutes before finishing the stretching; this is part of the resting time.
Dimple the dough::Preheat the oven to 220 °C, conventional heat. Add the remaining 25 g oil and 2 g rosemary. Press damp fingertips over the surface to make dimples without tearing the dough.
Bake until golden::Bake on the lower-middle shelf for 25–30 minutes, until the top and base are golden. Lift a corner with a spatula to check that the underside is cooked.
Cool and serve::Transfer to a rack and cool for 10 minutes. Cut into 12 pieces and serve warm to enjoy the airy crumb and crisp edges.''',
'''Does no-knead mean not touching the dough?::There is no traditional kneading, but two brief sets of folds strengthen the wet dough.
Can I skip the 12-hour refrigeration?::This formulation is designed for an overnight rise. Shortening it changes development and flavour; it does not promise the same result in an hour.
Why is it so sticky?::400 ml water to 500 g flour makes a highly hydrated dough. Use a spatula and damp hands rather than lots of extra flour.''','1 of 12 pieces')
add('de','rosmarin-focaccia-ohne-kneten','Rosmarin-Focaccia ohne Kneten mit kalter Übernachtgare','Luftige Rosmarin-Focaccia mit goldbraunem Boden: zwei Faltvorgänge und eine Nacht im Kühlschrank. Ohne herkömmliches Kneten, alle Gehzeiten eingerechnet.',
'Der wasserreiche Teig klebt: mit feuchten Händen arbeiten und kein zusätzliches Mehl einarbeiten. Die Ruhezeit umfasst 40 Minuten für das Falten, 12 Stunden im Kühlschrank, 90 Minuten auf dem Blech und 10 Minuten Abkühlen. Das Wachstum ist temperaturabhängig. Ein Metallblech von 25 × 35 cm mit für 220 °C geeignetem Backpapier verwenden. Enthält Weizen. Ohne feuchte Beläge bis zu 2 Tage verschlossen aufbewahren, für längere Lagerung portionsweise einfrieren.',
'backstarkes Weizenmehl|kaltes Wasser|Olivenöl|Salz|Instant-Trockenhefe zum Brotbacken|getrockneter Rosmarin',
'''Ohne Kneten mischen::500 g Mehl, 3 g Hefe und 10 g Salz mischen. 400 ml kaltes Wasser und 15 g Olivenöl zugeben. Mit einem Teigschaber verrühren, bis kein trockenes Mehl bleibt.
Zweimal falten::Abdecken und 20 Minuten ruhen lassen. Mit feuchter Hand einen Teigrand hochziehen und zur Mitte falten; an allen 4 Seiten wiederholen. Abdecken, weitere 20 Minuten warten und erneut 4-mal falten.
Kalt gehen lassen::Die Schüssel gut abdecken und 12 Stunden bei höchstens 4 °C kühlen. Der Teig soll danach luftig und blasig aussehen; das Volumen hängt von der Kühlschranktemperatur ab.
Auf das Blech geben::Ein Metallblech von 25 × 35 cm mit Backpapier auslegen und 20 g Öl darauf verteilen. Den Teig vorsichtig hineingeben und unter Erhalt der Blasen zu den Ecken ziehen.
Aufgehen lassen::Abgedeckt bei Zimmertemperatur etwa 90 Minuten ruhen lassen, bis der Teig aufgegangen ist und beim Bewegen wackelt. Zieht er sich zusammen, vor dem weiteren Dehnen 20 Minuten warten; diese sind in der Ruhezeit enthalten.
Mulden drücken::Den Ofen auf 220 °C Ober-/Unterhitze vorheizen. Die übrigen 25 g Öl und 2 g Rosmarin verteilen. Mit feuchten Fingerspitzen überall Mulden drücken, ohne den Teig zu zerreißen.
Goldbraun backen::Auf der unteren mittleren Schiene 25–30 Minuten backen, bis Oberfläche und Boden goldbraun sind. Eine Ecke mit einem Pfannenwender anheben und den gegarten Boden prüfen.
Abkühlen und servieren::Auf ein Gitter legen und 10 Minuten abkühlen lassen. In 12 Stücke schneiden und lauwarm mit luftiger Krume und knusprigen Rändern servieren.''',
'''Wird der Teig gar nicht angefasst?::Herkömmliches Kneten entfällt, aber zwei kurze Faltvorgänge geben dem feuchten Teig Struktur.
Kann ich die 12 Stunden im Kühlschrank weglassen?::Die Rezeptur ist für eine Übernachtgare gedacht. Eine Verkürzung verändert Entwicklung und Geschmack; dasselbe Ergebnis in einer Stunde wird nicht versprochen.
Warum klebt der Teig so stark?::400 ml Wasser auf 500 g Mehl ergeben einen sehr feuchten Teig. Teigschaber und feuchte Hände verwenden, statt viel Mehl nachzugeben.''','1 von 12 Stücken')
add('fr','focaccia-romarin-sans-petrissage','Focaccia au romarin sans pétrissage, levée au froid','Une focaccia au romarin à la mie aérée et au fond doré, avec deux séries de rabats et une nuit au réfrigérateur. Sans pétrissage classique, temps de levée inclus.',
'La pâte très hydratée colle : travaillez avec les mains humides sans ajouter de farine. Le repos comprend 40 minutes pour les rabats, 12 heures au réfrigérateur, 90 minutes dans la plaque et 10 minutes de refroidissement. La pousse dépend de la température. Utilisez une plaque métallique de 25 × 35 cm et du papier cuisson supportant 220 °C. Contient du blé. Conservez sans garniture humide dans une boîte fermée jusqu’à 2 jours, ou congelez en portions.',
'farine de blé de force|eau froide|huile d’olive|sel|levure boulangère sèche instantanée|romarin séché',
'''Mélangez sans pétrir::Mélangez 500 g de farine, 3 g de levure et 10 g de sel. Ajoutez 400 ml d’eau froide et 15 g d’huile. Remuez à la spatule jusqu’à disparition de la farine sèche.
Faites deux séries de rabats::Couvrez et attendez 20 minutes. Avec la main humide, étirez un bord et rabattez-le au centre ; répétez sur les 4 côtés. Couvrez, attendez encore 20 minutes et refaites les 4 rabats.
Laissez lever au froid::Couvrez bien le bol et réfrigérez 12 heures à 4 °C maximum. La pâte doit devenir aérée et présenter des bulles ; son volume varie selon la température du réfrigérateur.
Transférez dans la plaque::Chemisez une plaque métallique de 25 × 35 cm avec du papier cuisson et répartissez 20 g d’huile. Versez délicatement la pâte et étirez-la vers les angles sans écraser les bulles.
Laissez gonfler::Couvrez et laissez reposer environ 90 minutes à température ambiante, jusqu’à une pâte gonflée et tremblotante. Si elle se rétracte, attendez 20 minutes avant de finir de l’étendre ; ce délai fait partie du repos.
Formez les creux::Préchauffez le four à 220 °C, chaleur traditionnelle. Répartissez les 25 g d’huile restants et 2 g de romarin. Pressez le bout des doigts humides pour creuser toute la surface sans déchirer la pâte.
Faites dorer::Faites cuire 25–30 minutes dans le tiers inférieur-milieu du four, jusqu’à une surface et un fond dorés. Soulevez un angle à la spatule pour vérifier la cuisson dessous.
Refroidissez et servez::Posez sur une grille et laissez refroidir 10 minutes. Coupez en 12 morceaux et servez tiède pour apprécier la mie aérée et les bords croustillants.''',
'''Sans pétrissage signifie-t-il ne pas toucher la pâte ?::Il n’y a pas de pétrissage classique, mais deux courtes séries de rabats renforcent la pâte humide.
Peut-on supprimer les 12 heures au froid ?::Cette formulation est prévue pour une levée nocturne. La raccourcir change le développement et le goût ; elle ne promet pas le même résultat en une heure.
Pourquoi la pâte colle-t-elle autant ?::400 ml d’eau pour 500 g de farine donnent une pâte très hydratée. Utilisez spatule et mains humides plutôt que beaucoup de farine supplémentaire.''','1 des 12 morceaux')
add('it','focaccia-rosmarino-senza-impasto','Focaccia al rosmarino senza impasto, con lievitazione in frigo','Focaccia al rosmarino con mollica ariosa e fondo dorato, preparata con due giri di pieghe e una notte in frigorifero. Senza impastare a lungo, con tutte le lievitazioni incluse.',
'L’impasto molto idratato è appiccicoso: usa mani umide e non aggiungere farina. Il riposo comprende 40 minuti per le pieghe, 12 ore in frigorifero, 90 minuti in teglia e 10 di raffreddamento. La crescita dipende dalla temperatura. Usa una teglia metallica di 25 × 35 cm con carta forno adatta a 220 °C. Contiene frumento. Conserva senza guarnizioni umide in contenitore chiuso per massimo 2 giorni, oppure congela in porzioni.',
'farina di frumento forte|acqua fredda|olio d’oliva|sale|lievito di birra secco istantaneo|rosmarino essiccato',
'''Mescola senza impastare::Mescola 500 g di farina, 3 g di lievito e 10 g di sale. Aggiungi 400 ml d’acqua fredda e 15 g d’olio. Mescola con una spatola fino a eliminare la farina asciutta.
Fai due giri di pieghe::Copri e riposa 20 minuti. Con la mano umida tira un bordo e ripiegalo al centro; ripeti sui 4 lati. Copri, aspetta altri 20 minuti e ripeti le 4 pieghe.
Fai lievitare in frigorifero::Copri bene la ciotola e lascia in frigorifero a non più di 4 °C per 12 ore. L’impasto deve risultare arioso e pieno di bolle; il volume dipende dalla temperatura del frigorifero.
Trasferisci in teglia::Rivesti una teglia metallica di 25 × 35 cm con carta forno e distribuisci 20 g d’olio. Versa delicatamente l’impasto e allargalo verso gli angoli senza eliminare le bolle.
Lascia gonfiare::Copri e riposa circa 90 minuti a temperatura ambiente, fino a un impasto gonfio e tremolante. Se si ritira, aspetta 20 minuti prima di finire di stenderlo; questo tempo rientra nel riposo.
Forma le fossette::Scalda il forno statico a 220 °C. Distribuisci i 25 g d’olio rimasti e 2 g di rosmarino. Premi con i polpastrelli umidi su tutta la superficie senza strappare l’impasto.
Cuoci fino a doratura::Inforna nella zona medio-bassa per 25–30 minuti, fino a dorare superficie e fondo. Solleva un angolo con una spatola e verifica che la base sia cotta.
Raffredda e servi::Trasferisci su una griglia e lascia raffreddare 10 minuti. Taglia in 12 pezzi e servi tiepida, con mollica ariosa e bordi croccanti.''',
'''Senza impasto significa non toccare la massa?::Non serve impastare in modo tradizionale, ma due brevi giri di pieghe danno forza all’impasto umido.
Posso saltare le 12 ore in frigorifero?::La formulazione è pensata per una lievitazione notturna. Accorciarla cambia sviluppo e sapore; non promette lo stesso risultato in un’ora.
Perché è tanto appiccicosa?::400 ml d’acqua per 500 g di farina danno un impasto molto idratato. Usa spatola e mani umide, senza correggere con molta farina extra.''','1 dei 12 pezzi')
add('pt','focaccia-alecrim-sem-sovar','Focaccia de alecrim sem sovar, com fermentação na geladeira','Focaccia de alecrim com miolo aerado e base dourada, feita com duas séries de dobras e uma noite na geladeira. Sem sova tradicional, com todos os descansos incluídos.',
'A massa tem muita água e fica grudenta: use as mãos úmidas e evite farinha extra. O descanso inclui 40 minutos para as dobras, 12 horas na geladeira, 90 minutos na assadeira e 10 para esfriar. O crescimento depende da temperatura. Use assadeira metálica de 25 × 35 cm e papel-manteiga próprio para 220 °C. Contém trigo. Guarde sem coberturas úmidas em recipiente fechado por até 2 dias; congele em porções para guardar por mais tempo.',
'farinha de trigo forte para pão|água fria|azeite de oliva|sal|fermento biológico seco instantâneo|alecrim seco',
'''Misture sem sovar::Misture 500 g de farinha, 3 g de fermento e 10 g de sal. Junte 400 ml de água fria e 15 g de azeite. Mexa com espátula até não restar farinha seca.
Faça duas séries de dobras::Cubra e descanse por 20 minutos. Com a mão úmida, puxe uma borda e dobre até o centro; repita nos 4 lados. Cubra, espere mais 20 minutos e repita as 4 dobras.
Fermente na geladeira::Tampe bem a tigela e leve à geladeira a 4 °C ou menos por 12 horas. A massa deve ficar aerada e com bolhas; o volume varia conforme a temperatura da geladeira.
Passe para a assadeira::Forre uma assadeira metálica de 25 × 35 cm com papel-manteiga e distribua 20 g de azeite. Despeje a massa delicadamente e estique até os cantos, preservando as bolhas.
Deixe crescer::Cubra e descanse cerca de 90 minutos em temperatura ambiente, até inflar e balançar ao mover a assadeira. Se encolher, espere 20 minutos antes de terminar de abrir; esse tempo faz parte do descanso.
Marque as covinhas::Preaqueça o forno a 220 °C, calor superior e inferior. Espalhe os 25 g de azeite restantes e 2 g de alecrim. Pressione com as pontas dos dedos úmidas pela superfície sem rasgar a massa.
Asse até dourar::Asse na região média-baixa por 25–30 minutos, até dourar em cima e embaixo. Levante um canto com uma espátula para verificar se o fundo está assado.
Esfrie e sirva::Passe para uma grade e deixe esfriar por 10 minutos. Corte em 12 pedaços e sirva morna para aproveitar o miolo aerado e as bordas crocantes.''',
'''Sem sovar significa não tocar na massa?::Não precisa de sova tradicional, mas duas séries curtas de dobras fortalecem a massa úmida.
Posso pular as 12 horas de geladeira?::A formulação foi pensada para fermentação noturna. Encurtar esse tempo muda o desenvolvimento e o sabor; não promete o mesmo resultado em uma hora.
Por que a massa gruda tanto?::400 ml de água para 500 g de farinha formam uma massa muito hidratada. Use espátula e mãos úmidas, sem colocar farinha extra em excesso.''','1 dos 12 pedaços')
add('ja','no-knead-rosemary-focaccia','こねないローズマリーフォカッチャ：冷蔵庫で一晩発酵','2回の折りたたみと一晩の冷蔵発酵で、気泡のある生地とこんがりした底に仕上げます。通常のこね作業なしで作るローズマリーフォカッチャです。発酵時間も含めて紹介します。',
'水分が多くべたつく生地です。手を湿らせ、打ち粉は増やさないでください。休ませる時間には折りたたみ用の40分、冷蔵12時間、天板で90分、冷ます10分が含まれます。ふくらみは温度によって変わります。25 × 35 cmの金属製天板と、220 °Cに対応するオーブンシートを使います。小麦を含みます。水気のある具をのせず密閉容器で最長2日保存し、それ以上は切り分けて冷凍してください。',
'強力粉|冷水|オリーブオイル|塩|インスタントドライイースト（パン用）|乾燥ローズマリー',
'''こねずに混ぜる::強力粉500 g、イースト3 g、塩10 gを混ぜます。冷水400 mlとオイル15 gを加え、粉っぽさがなくなるまでへらで混ぜます。
2回折りたたむ::覆って20分休ませます。濡らした手で生地の端を伸ばして中央へ折り、4辺すべてで繰り返します。覆ってさらに20分待ち、もう一度4辺を折ります。
冷蔵庫で発酵させる::ボウルをしっかり覆い、4 °C以下の冷蔵庫に12時間入れます。生地に空気と気泡が入るのが目安です。体積は冷蔵庫の温度で変わります。
天板へ移す::25 × 35 cmの金属製天板にオーブンシートを敷き、オイル20 gを広げます。生地をそっと移し、気泡を残しながら角へやさしく伸ばします。
ふくらませる::覆って室温で約90分、ふくらんで天板を動かすと揺れるまで休ませます。縮む場合は20分待ってから伸ばし終えます。この20分は休ませる時間に含まれます。
くぼみをつける::オーブンを上下加熱220 °Cに予熱します。残りのオイル25 gとローズマリー2 gを広げ、濡らした指先で生地を破らずに全体へくぼみをつけます。
こんがり焼く::オーブンの中段よりやや下で25〜30分、表面と底がきつね色になるまで焼きます。へらで角を持ち上げ、底まで焼けたことを確認します。
冷まして出す::網へ移して10分冷まします。12切れに切り、気泡のある生地とカリッとした縁を楽しめるよう温かいうちに出します。''',
'''こねないなら生地には触らないのですか？::通常のこね作業はありませんが、水分の多い生地に強さをつけるため、短い折りたたみを2回行います。
冷蔵12時間を省けますか？::一晩発酵させる配合です。短くすると生地の発達や風味が変わるため、1時間で同じ結果になるとはしていません。
なぜこんなにべたつくのですか？::粉500 gに水400 mlを使う高加水の生地だからです。へらと濡れた手を使い、余分な粉を大量に加えないでください。''','12切れのうち1切れ')
for l,r in L.items():assert len(r['steps'])==8 and len(r['ingredients'])==6 and len(r['faq'])==3,l
p=Path(__file__).resolve().parents[1]/'editorial/lote-cinco-20261024/focaccia-sin-amasado-romero-locales.json';p.write_text(json.dumps(L,ensure_ascii=False,indent=2)+'\n');print('Focaccia: six complete translations')
