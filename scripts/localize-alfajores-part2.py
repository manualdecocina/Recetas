import json
from pathlib import Path
p=Path(__file__).resolve().parents[1]/'editorial/receta-de-alfajores-de-maicena-localizaciones-20261008.json'
data=json.loads(p.read_text())
assert set(data)=={'en','de','fr'}
data.update({
 'it':{
  'path':'/it/amido-di-mais-alfajores-ricetta','historical_path':True,
  'title':'Alfajores all’amido di mais con dulce de leche e cocco',
  'seo_title':'Alfajores all’amido di mais con dulce de leche',
  'excerpt':'Prepara 20 alfajores con amido di mais, dulce de leche e cocco. Dosi precise, impasto con tuorli da raffreddare e biscotti chiari in due infornate.',
  'summary':'Questi alfajores uniscono due biscotti teneri di amido di mais e farina di frumento, un ripieno di dulce de leche e cocco solo sul bordo. Vaniglia e scorza di limone aromatizzano l’impasto con tuorli.\n\nLa proposta produce 20 alfajores di circa 5 cm: 40 dischi spessi 6 mm, cotti in due infornate. I 130 minuti stimati comprendono 30 minuti in frigorifero e 30 di raffreddamento. Dosi, resa e tempi devono ancora essere confermati con una prova in cucina.',
  'difficulty':'Media','course':'Dolce','cuisine':'Argentina',
  'ingredients':['Amido di mais','Farina di frumento per tutti gli usi','Burro non salato','Zucchero bianco','Tuorli, circa 3 grandi; pesare 51 g','Lievito per dolci a doppia azione','Estratto di vaniglia','Scorza di limone grattugiata','Dulce de leche','Cocco grattugiato essiccato non zuccherato'],
  'groups':{'Masa':'Impasto','Relleno y acabado':'Ripieno e finitura'},
  'steps':[
   ['Pesa e setaccia gli ingredienti secchi','Lava le mani e pulisci il piano di lavoro. Pesa tutti gli ingredienti; i 3 tuorli devono pesare complessivamente circa 51 g. Setaccia insieme 200 g di amido, 100 g di farina e 6 g di lievito in una ciotola. Lava il limone prima di grattugiare solo la parte gialla fino a ottenere 3 g. Tieni dulce de leche e cocco separati dagli utensili che toccheranno l’impasto crudo.'],
   ['Lavora il burro e aggiungi i tuorli','Usa 100 g di burro morbido al tatto, ma non sciolto. Sbatti con gli 80 g di zucchero per 2–3 minuti fino a ottenere una crema. Aggiungi i tuorli in tre riprese, incorporando ciascuno prima del successivo. Unisci 5 g di vaniglia e 3 g di scorza; raccogli l’impasto dalle pareti con una spatola.'],
   ['Forma e raffredda l’impasto','Aggiungi gli ingredienti secchi in due riprese. Mescola con una spatola e poi riunisci delicatamente con le mani, solo finché non restano zone polverose; non lavorare come un impasto da pane. Appiattisci in un disco, avvolgi e metti in frigorifero per 30 minuti a non più di 4 °C. Non assaggiare l’impasto crudo: contiene farina e uovo non cotti. Lava poi mani, ciotola e piano di lavoro.'],
   ['Stendi e ritaglia quaranta dischi','Preriscalda il forno a 180 °C statico o 160 °C ventilato. Rivesti due teglie di circa 30 × 40 cm con carta forno. Stendi l’impasto tra due fogli fino a circa 6 mm. Ritaglia cerchi di 5 cm; riunisci gli scarti senza lavorarli troppo e stendi ancora. Cerca di ottenere 40 dischi simili, di circa 13–14 g ciascuno, per 20 coppie. Distribuiscine 20 per teglia, distanti circa 2 cm. Se l’impasto si ammorbidisce, raffredda 10 minuti e aggiungi l’attesa al tempo totale.'],
   ['Cuoci i biscotti in due infornate','Cuoci una teglia alla volta al centro del forno per 12–15 minuti: superficie opaca e soda, base appena dorata e nessun centro umido. Controlla da 12 minuti; spessore e forno possono cambiare il tempo. Estrai con guanti e cuoci allo stesso modo la seconda teglia. La stima di cottura riserva 30 minuti per entrambe; non cercare una doratura intensa.'],
   ['Lascia raffreddare completamente','Lascia i biscotti 5 minuti sulla teglia perché sono ancora fragili. Trasferisci con una spatola larga su una griglia e fai raffreddare per altri 25 minuti circa, finché sono del tutto freddi. Non farcire biscotti tiepidi: il dulce de leche si ammorbidirebbe e i biscotti si romperebbero più facilmente.'],
   ['Farcisci e ricopri i bordi di cocco','Abbina i 40 biscotti per dimensione e gira una base per coppia con il fondo verso l’alto. Distribuisci 350 g di dulce de leche denso sulle 20 basi, circa 17–18 g per alfajor, con un cucchiaio o una tasca pulita. Copri con il secondo biscotto e premi piano finché il ripieno appare appena sul bordo. Metti 30 g di cocco in un piatto e rotola solo il bordo di ogni alfajor per farlo aderire al ripieno.'],
   ['Servi e conserva','Servi i 20 alfajores quando il ripieno è assestato, maneggiandoli delicatamente. Conserva in un contenitore chiuso con carta tra gli strati, in frigorifero a non più di 4 °C, e consuma entro 3 giorni o prima se richiesto dalla confezione del dulce de leche. Per congelare, avvolgi singolarmente fino a 1 mese e scongela in frigorifero. Sono durate proposte prudenti, non prove di conservabilità; cocco e biscotti si ammorbidiranno nel tempo.']
  ],
  'notes':'Usa amido di mais bianco, non farina di mais gialla. Il dulce de leche deve essere denso, preferibilmente da pasticceria; uno liquido uscirà dai bordi. Puoi omettere il cocco, ma finitura e nutrizione cambiano. Non si propone una sostituzione senza glutine non provata: l’impasto contiene frumento. Se si crepa mentre lo stendi, lascialo scaldare leggermente per qualche minuto e premi delicatamente tra i fogli; non aggiungere farina senza pesarla. Contiene frumento, uovo e latte. Non assaggiare impasto crudo e pulisci prima di toccare i biscotti cotti.',
  'faq':[['Perché i biscotti si rompono?','Sono fragili appena sfornati. Lasciali 5 minuti sulla teglia, spostali con una spatola larga e raffreddali completamente prima di farcire. Lavorare troppo o stendere troppo sottile modifica anche la consistenza.'],['Posso usare farina di mais al posto dell’amido?','Non direttamente. Questa ricetta usa amido bianco; la farina di mais gialla ha composizione e consistenza diverse. La ricetta contiene anche farina di frumento.'],['Cosa fare se il dulce de leche è troppo liquido?','Usa un dulce de leche denso da pasticceria per sostenere i biscotti. Non farcire quando sono caldi. Cambiare ripieno può modificare consistenza, conservazione e nutrizione.']],
  'keywords':['alfajores amido di mais','biscotti con dulce de leche','alfajores al cocco'],
  'cover_alt':'Alfajores chiari con dulce de leche e cocco sui bordi, uno aperto con il ripieno visibile',
  'nutrition':{'serving_size':'1 dei 20 alfajores','method':'Dieci schede USDA verificate per 100 g sono ponderate con tutti i pesi degli ingredienti e divise per 20. Si include tutto il ripieno e il cocco previsto; la perdita d’acqua in cottura non si sottrae dall’apporto totale.','note':'Stima informativa, non analisi dell’alfajor preparato. Le marche di dulce de leche, burro e lievito modificano il risultato. Si suppone il consumo di tutto l’impasto, il ripieno e il cocco; residui sugli utensili ridurrebbero l’apporto reale.'}
 },
 'ja':{
  'path':'/ja/cornstarch-alfajores','historical_path':False,
  'title':'ドゥルセ・デ・レチェとココナッツのアルファホーレス',
  'seo_title':'コーンスターチのアルファホーレス｜ドゥルセ・デ・レチェ入り',
  'excerpt':'コーンスターチを使ったアルファホーレス20個分。卵黄入り生地の分量、冷やす時間、2回に分ける焼き方とドゥルセ・デ・レチェの詰め方を紹介します。',
  'summary':'コーンスターチと小麦粉のほろっとしたクッキー2枚で、濃厚なドゥルセ・デ・レチェを挟みます。ココナッツは側面だけにつけ、卵黄入り生地をレモンの皮とバニラで香りづけします。\n\n直径約5 cmのアルファホーレス20個を想定した提案です。厚さ6 mmの生地を40枚抜き、2回に分けて焼きます。推定合計130分には冷蔵30分と冷却30分を含みます。分量、出来上がり数、時間は調理試験でまだ確認していません。',
  'difficulty':'中級','course':'デザート','cuisine':'アルゼンチン料理',
  'ingredients':['コーンスターチ','中力タイプの小麦粉','無塩バター','白砂糖','卵黄、大きめ約3個分；51 g量る','ダブルアクティング・ベーキングパウダー','バニラエクストラクト','レモンの皮のすりおろし','ドゥルセ・デ・レチェ','無糖の乾燥ココナッツ'],
  'groups':{'Masa':'生地','Relleno y acabado':'詰め物と仕上げ'},
  'steps':[
   ['粉類を量ってふるう','手を洗い、作業台を清潔にします。材料をすべて量り、卵黄3個分が合計約51 gになるようにします。コーンスターチ200 g、小麦粉100 g、ベーキングパウダー6 gを一緒にボウルへふるいます。レモンを洗い、黄色い皮だけを3 gすりおろします。ドゥルセ・デ・レチェとココナッツは、生の生地に触れる器具から分けておきます。'],
   ['バターに卵黄を加える','バター100 gは押すとへこむ柔らかさにし、溶かしません。砂糖80 gと2〜3分泡立て、クリーム状にします。卵黄を3回に分け、毎回なじませてから次を加えます。バニラ5 gとレモンの皮3 gを混ぜ、へらでボウルの側面をこそげます。'],
   ['生地をまとめて冷やす','粉類を2回に分けて加え、へらで混ぜます。最後は手でそっとまとめ、粉っぽい部分がなくなったら止めます。パン生地のようにこねません。円盤状に平らにし、包んで4 °C以下の冷蔵庫で30分冷やします。生の生地は未加熱の小麦粉と卵を含むため味見しません。扱った後は手、ボウル、作業台を洗います。'],
   ['生地をのばして40枚抜く','オーブンを上下加熱180 °C、ファン付きなら160 °Cに予熱します。約30 × 40 cmの天板2枚にオーブンシートを敷きます。生地を2枚のシートで挟み、約6 mm厚にのばします。直径5 cmの丸型で抜き、余りをこねすぎずにまとめて再びのばします。20組分として、大きさのそろった約13〜14 gの円を40枚目指します。天板1枚に20枚ずつ、約2 cm間隔で置きます。柔らかくなったら10分冷やし、その待ち時間を合計に加えます。'],
   ['2回に分けて焼く','天板1枚ずつオーブン中央で12〜15分焼きます。表面がつやを失って固まり、底がごく薄いきつね色になり、中心が湿っていない状態を目安にします。12分から確認し、厚さやオーブンで時間が変わることを考慮します。ミトンで取り出し、2枚目も同様に焼きます。調理時間は2回で30分を見込んでいます。濃い焼き色はつけません。'],
   ['完全に冷ます','焼きたては崩れやすいため、天板に5分置きます。幅の広いへらで網に移し、さらに約25分、完全に冷めるまで置きます。温かいまま詰めるとドゥルセ・デ・レチェが柔らかくなり、クッキーも割れやすくなります。'],
   ['詰めて側面にココナッツをつける','40枚を大きさで組み合わせ、各組の1枚を底面が上になるよう置きます。濃厚なドゥルセ・デ・レチェ350 gを清潔なスプーンか絞り袋で20枚に分け、1個当たり約17〜18 gのせます。もう1枚を重ね、詰め物が端にわずかに見えるまで優しく押します。ココナッツ30 gを皿に入れ、各アルファホーレスの側面だけを転がして詰め物に付着させます。'],
   ['盛り付けて保存する','詰め物が落ち着いたら20個をそっと扱って盛り付けます。紙を挟んで密閉容器に入れ、4 °C以下で冷蔵し、3日以内、またはドゥルセ・デ・レチェの表示が求めるより早い期限で食べます。冷凍は個別に包んで最長1か月とし、冷蔵庫で解凍します。これらは控えめな保存期間の提案で、保存試験の結果ではありません。ココナッツとクッキーは時間とともに柔らかくなります。']
  ],
  'notes':'白いコーンスターチを使い、黄色いコーンフラワーは使いません。ドゥルセ・デ・レチェは濃厚な製菓用が適し、液状では側面から流れます。ココナッツを省くと仕上がりと栄養値が変わります。この生地は小麦を含み、未検証のグルテンフリー置き換えは提案しません。のばす際に割れたら数分置いて少し冷たさを和らげ、シートの間で優しく押します。量らずに粉を足さないでください。小麦、卵、乳を含みます。生地を味見せず、焼いたクッキーを扱う前に清掃します。',
  'faq':[['クッキーが割れるのはなぜですか？','焼きたては崩れやすいので天板に5分置き、幅広いへらで動かし、完全に冷めてから詰めます。こねすぎや薄くのばしすぎも食感を変えます。'],['コーンスターチをコーンフラワーに替えられますか？','そのままの置き換えはできません。白いコーンスターチと黄色いコーンフラワーは成分と食感が異なります。このレシピには小麦粉も入っています。'],['ドゥルセ・デ・レチェが緩い場合は？','クッキーを支えられる濃厚な製菓用を使い、温かいクッキーには詰めません。詰め物を替えると食感、保存、栄養値が変わる場合があります。']],
  'keywords':['コーンスターチ アルファホーレス','ドゥルセ・デ・レチェ クッキー','ココナッツのサンドクッキー'],
  'cover_alt':'淡い色のアルファホーレス、ドゥルセ・デ・レチェの断面と側面のココナッツ',
  'nutrition':{'serving_size':'20個のうち1個','method':'確認したUSDAの10項目の100 g当たりの数値を全材料の重量で加重計算し、20で割っています。予定した詰め物とココナッツはすべて含め、焼成中の水分損失は総栄養量から差し引きません。','note':'参考用の推定値で、完成品の実測値ではありません。ドゥルセ・デ・レチェ、バター、ベーキングパウダーの製品により変わります。生地、詰め物、ココナッツをすべて食べる想定で、器具に残る分があれば実際の摂取量は減ります。'}
 },
 'pt':{
  'path':'/pt/alfajores-de-amido-de-milho','historical_path':False,
  'title':'Alfajores de amido de milho com doce de leite e coco',
  'seo_title':'Alfajores de amido de milho com doce de leite',
  'excerpt':'Prepare 20 alfajores de amido de milho com doce de leite e coco. Veja medidas, massa com gemas, descanso na geladeira e biscoitos em duas fornadas.',
  'summary':'Estes alfajores combinam dois biscoitos delicados de amido de milho e farinha de trigo, recheio de doce de leite e coco apenas na borda. Raspas de limão e baunilha perfumam a massa com gemas.\n\nA proposta rende 20 alfajores de cerca de 5 cm: 40 discos com 6 mm de espessura, assados em duas fornadas. Os 130 minutos estimados incluem 30 minutos na geladeira e 30 de resfriamento. Quantidades, rendimento e tempos ainda precisam de confirmação em teste na cozinha.',
  'difficulty':'Média','course':'Sobremesa','cuisine':'Argentina',
  'ingredients':['Amido de milho','Farinha de trigo de uso geral','Manteiga sem sal','Açúcar branco','Gemas, cerca de 3 grandes; pesar 51 g','Fermento químico de dupla ação','Extrato de baunilha','Raspas de limão','Doce de leite','Coco ralado seco sem açúcar'],
  'groups':{'Masa':'Massa','Relleno y acabado':'Recheio e acabamento'},
  'steps':[
   ['Pese e peneire os ingredientes secos','Lave as mãos e limpe a bancada. Pese todos os ingredientes; as 3 gemas devem somar cerca de 51 g. Peneire juntos os 200 g de amido, 100 g de farinha e 6 g de fermento em uma tigela. Lave o limão antes de raspar só a parte amarela até obter 3 g. Mantenha doce de leite e coco separados dos utensílios que vão tocar a massa crua.'],
   ['Bata a manteiga e acrescente as gemas','Use 100 g de manteiga macia ao pressionar, mas não derretida. Bata com os 80 g de açúcar por 2–3 minutos, até ficar cremosa. Acrescente as gemas em três adições, incorporando cada uma antes da próxima. Junte os 5 g de baunilha e 3 g de raspas; raspe as laterais da tigela com uma espátula.'],
   ['Junte a massa e leve à geladeira','Adicione os ingredientes secos em duas etapas. Misture com espátula e termine juntando delicadamente com as mãos, só até não restarem partes com pó; não sove como pão. Achate em um disco, embrulhe e leve à geladeira por 30 minutos a no máximo 4 °C. Não prove a massa crua: contém farinha e ovo sem cozinhar. Lave mãos, tigela e bancada depois de manusear.'],
   ['Abra e corte quarenta discos','Preaqueça o forno a 180 °C com calor convencional ou 160 °C com ventilação. Forre duas assadeiras de cerca de 30 × 40 cm com papel próprio para forno. Abra a massa entre duas folhas até cerca de 6 mm. Corte círculos de 5 cm; junte as sobras sem sovar muito e abra novamente. Procure obter 40 discos parecidos, com cerca de 13–14 g cada, formando 20 pares. Distribua 20 por assadeira com cerca de 2 cm de espaço. Se a massa amolecer, leve à geladeira por 10 minutos e acrescente essa espera ao tempo total.'],
   ['Asse os biscoitos em duas fornadas','Asse uma assadeira por vez no centro do forno por 12–15 minutos: a superfície deve ficar fosca e firme, a base só levemente dourada e o centro sem umidade. Confira a partir de 12 minutos; espessura e forno podem mudar o tempo. Retire com luvas e asse a segunda da mesma forma. O cálculo de cozimento reserva 30 minutos para as duas fornadas; não procure uma cor muito tostada.'],
   ['Deixe esfriar completamente','Deixe os biscoitos 5 minutos na assadeira porque ainda estão frágeis. Transfira com uma espátula larga para uma grade e deixe esfriar por mais cerca de 25 minutos, até estarem totalmente frios. Não recheie biscoitos mornos: o doce de leite amoleceria e eles quebrariam com mais facilidade.'],
   ['Recheie e cubra a borda com coco','Junte os 40 biscoitos em pares por tamanho e coloque um de cada par com a base virada para cima. Divida os 350 g de doce de leite espesso entre as 20 bases, cerca de 17–18 g por alfajor, usando colher ou saco de confeitar limpo. Cubra com o segundo biscoito e pressione de leve até o recheio aparecer um pouco na borda. Coloque os 30 g de coco em um prato e role apenas a borda de cada alfajor para grudar no recheio.'],
   ['Sirva e guarde','Sirva os 20 alfajores depois que o recheio estiver assentado, manuseando com cuidado. Guarde em recipiente fechado, com papel entre as camadas, na geladeira a no máximo 4 °C, e consuma em até 3 dias, ou antes se a embalagem do doce de leite exigir. Para congelar, embrulhe individualmente por até 1 mês e descongele na geladeira. Esses prazos são propostas conservadoras, não resultados de teste de validade; coco e biscoitos vão amolecer com o tempo.']
  ],
  'notes':'Use amido de milho branco, não farinha de milho amarela. O doce de leite precisa ser espesso, de preferência para confeitaria; um líquido vai escapar pela borda. Você pode omitir o coco, mas acabamento e nutrição mudam. Não se propõe uma troca sem glúten sem testar: a massa contém trigo. Se rachar ao abrir, deixe perder um pouco do frio por alguns minutos e pressione com cuidado entre os papéis; não adicione farinha sem medir. Contém trigo, ovo e leite. Não prove massa crua e limpe antes de manipular os biscoitos assados.',
  'faq':[['Por que os biscoitos quebram?','São frágeis ao sair do forno. Deixe 5 minutos na assadeira, mova com uma espátula larga e espere esfriar totalmente antes de rechear. Sovar demais ou abrir muito fino também muda a textura.'],['Posso usar farinha de milho no lugar do amido?','Não como troca direta. Esta receita usa amido branco; a farinha de milho amarela tem composição e textura diferentes. A receita também contém farinha de trigo.'],['O que fazer se o doce de leite estiver muito líquido?','Use um doce de leite espesso de confeitaria para sustentar os biscoitos. Não recheie enquanto estiverem quentes. Trocar o recheio pode mudar consistência, conservação e nutrição.']],
  'keywords':['alfajores de amido de milho','biscoitos com doce de leite','alfajores com coco'],
  'cover_alt':'Alfajores claros com doce de leite e coco na borda, um partido mostrando o recheio',
  'nutrition':{'serving_size':'1 dos 20 alfajores','method':'Dez fichas USDA verificadas por 100 g são ponderadas pelos pesos de todos os ingredientes e divididas por 20. Todo o recheio e o coco previstos são incluídos; a perda de água ao assar não é descontada do aporte total.','note':'Estimativa informativa, não análise do alfajor pronto. As marcas de doce de leite, manteiga e fermento mudam o resultado. Toda a massa, o recheio e o coco são considerados consumidos; restos nos utensílios reduziriam o aporte real.'}
 }
})
p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
