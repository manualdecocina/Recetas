import json
from pathlib import Path
p = Path(__file__).resolve().parents[1] / 'editorial/receta-jugo-arcoiris-localizaciones-20261008.json'
data = json.loads(p.read_text())
new = {
 'it': {
  'path': '/it/ricetta-succo-arcobaleno', 'historical_path': True,
  'title': 'Succo arcobaleno alla frutta in quattro strati',
  'seo_title': 'Succo arcobaleno: quattro strati di frutta',
  'excerpt': 'Prepara un succo arcobaleno denso con mirtilli, fragole, kiwi e mango. Quattro strati, dosi precise e istruzioni per versarli senza mescolarli.',
  'summary': 'Questo succo arcobaleno conserva tutta la polpa della frutta e ha la consistenza di uno smoothie. I quattro colori naturali sono viola, rosa, verde e dorato, dal fondo del bicchiere verso l’alto.\n\nLa banana addensa ogni miscela; il raffreddamento e poca acqua aiutano a sovrapporre gli strati. Quantità e tempi sono una proposta editoriale, ancora da confermare con una prova in cucina. I bordi possono sfumare.',
  'difficulty': 'Facile', 'course': 'Bevanda', 'cuisine': 'Internazionale',
  'ingredients': ['Mirtilli', 'Fragole senza picciolo', 'Kiwi verde sbucciato', 'Mango senza buccia e nocciolo', 'Banana sbucciata', 'Acqua potabile fredda'],
  'groups': {'Frutas': 'Frutta', 'Para triturar': 'Per frullare'},
  'steps': [
   ['Lavare, tagliare e dividere la frutta', 'Lava le mani, poi sciacqua tutta la frutta sotto acqua corrente prima di sbucciarla, senza sapone. Elimina parti rovinate, piccioli delle fragole, bucce di kiwi e banana, buccia e nocciolo del mango. Pesa 200 g commestibili di ciascuno dei cinque frutti. Taglia mango, kiwi, fragole e banana in pezzi di circa 2 cm. Dividi la banana in quattro porzioni da 50 g e abbina ciascuna a un frutto diverso, in quattro contenitori separati.'],
   ['Congelare le quattro miscele', 'Distribuisci separatamente mirtilli con 50 g di banana, fragole con 50 g, kiwi con 50 g e mango con gli ultimi 50 g in contenitori bassi adatti al congelatore. Copri e congela per circa 60 minuti, finché i pezzi sono sodi ma separabili. Se sono morbidi, prolunga il tempo; evita un blocco spesso. Raffredda quattro bicchieri da almeno 350 ml in frigorifero.'],
   ['Frullare lo strato viola', 'Metti 200 g di mirtilli, i loro 50 g di banana fredda e 20 ml d’acqua in un frullatore adatto alla frutta congelata. Frulla per 40–60 secondi fino a ottenere una purea densa e uniforme. Se la frutta non si muove, spegni e scollega la spina prima di raccoglierla con una spatola; lasciala ammorbidire per 2 minuti invece di aggiungere troppa acqua. Trasferisci in una ciotola, copri e metti in frigorifero.'],
   ['Frullare lo strato di fragola', 'Lava e asciuga il boccale per non colorare la miscela successiva. Frulla 200 g di fragole con i loro 50 g di banana e 20 ml d’acqua per 40–60 secondi. La purea deve essere rosa e densa, non liquida. Tienila in un’altra ciotola coperta in frigorifero mentre procedi.'],
   ['Frullare lo strato verde', 'Lava e asciuga di nuovo il boccale. Frulla 200 g di kiwi con i loro 50 g di banana e 20 ml d’acqua per 40–60 secondi. Conserva i piccoli semi del kiwi e tutta la polpa, senza filtrare. Copri la miscela verde e mettila in frigorifero.'],
   ['Frullare lo strato dorato', 'Lava e asciuga ancora il boccale. Frulla 200 g di mango con gli ultimi 50 g di banana e 20 ml d’acqua per 40–60 secondi, ottenendo una crema dorata uniforme. La consistenza deve essere simile agli altri strati; raffredda in frigorifero una miscela troppo riscaldata prima del montaggio.'],
   ['Versare lentamente gli strati', 'Dividi la purea viola fra i quattro bicchieri freddi. Aggiungi in ciascuno un quarto della miscela di fragole, lentamente sul dorso di un cucchiaio tenuto appena sopra lo strato precedente. Ripeti con il kiwi e termina con il mango. Non mescolare e non versare dall’alto: ogni bicchiere riceve un quarto di tutte e quattro le miscele.'],
   ['Servire appena assemblato', 'Servi subito con un cucchiaio lungo, finché gli strati mantengono la forma. Per conservare, copri e metti in frigorifero a non più di 4 °C; consuma entro 24 ore. Colore e separazione cambieranno. Se gli strati si mescolano, gira e servi come smoothie. Non lasciare a temperatura ambiente per più di 2 ore.']
  ],
  'notes': 'La frutta matura bilancia l’acidità del kiwi. Congelamento e poca acqua aiutano il montaggio, senza garantire linee perfette. Con frutta già congelata mantieni gli stessi pesi commestibili e controlla se la confezione richiede la cottura; in quel caso non usarla cruda. Adatta il tempo totale se salti il congelamento iniziale. Se il frullatore non è adatto alla frutta congelata, lasciala ammorbidire abbastanza da frullarla senza danneggiare l’apparecchio; gli strati saranno meno distinti.',
  'faq': [['Perché i colori si mescolano?', 'Mantieni tutte le puree fredde e dense. Versa ogni strato lentamente su un cucchiaio, appena sopra la superficie, e servi subito. I bordi delle puree di frutta possono sfumare.'], ['È un succo filtrato?', 'No. Si conserva tutta la polpa, quindi la consistenza è quella di uno smoothie. Filtrare o aggiungere molto liquido rende difficile formare gli strati.'], ['Posso prepararlo il giorno prima?', 'Conserva le quattro miscele separatamente, coperte, a non più di 4 °C per un massimo di 24 ore e assembla al momento di servire. Colore e consistenza cambieranno, soprattutto quelli della banana.']],
  'keywords': ['succo arcobaleno', 'smoothie alla frutta a strati', 'bevanda mango kiwi fragola mirtillo'],
  'cover_alt': 'Quattro bicchieri di succo arcobaleno con strati di frutta viola, rosa, verde e dorati',
  'nutrition': {'serving_size': '1 dei 4 bicchieri, circa 270 g', 'method': 'Valori USDA verificati per 100 g, ponderati con i pesi commestibili della frutta prima del congelamento e 80 g d’acqua, poi divisi per 4. Gli 80 ml d’acqua sono approssimati a 80 g. Senza zucchero aggiunto, latte o decorazioni.', 'note': 'Stima indicativa, non analisi della bevanda preparata. Maturazione della frutta, acqua e residui nel frullatore cambiano il risultato. Nulla viene filtrato: si conteggia tutta la polpa delle quantità indicate.'}
 },
 'ja': {
  'path': '/ja/rainbow-fruit-juice', 'historical_path': False,
  'title': '4色のフルーツ・レインボージュース',
  'seo_title': 'レインボージュースの作り方｜フルーツの4層仕立て',
  'excerpt': 'ブルーベリー、いちご、キウイ、マンゴーを4層に重ねるレインボージュース。分量と冷やし方、色を混ぜずに注ぐ手順を紹介します。',
  'summary': '果肉をこさずに使う、スムージーのように濃厚なレインボージュースです。グラスの底から、ブルーベリーの紫、いちごのピンク、キウイの緑、マンゴーの黄色を重ねます。\n\n各色にバナナを加えてとろみをつけ、少量の水と冷却で層を作りやすくします。分量と時間は編集上の提案で、調理試験による確認はまだ行っていません。層の境目が少し混ざることもあります。',
  'difficulty': '簡単', 'course': '飲み物', 'cuisine': '各国料理',
  'ingredients': ['ブルーベリー', 'へたを取ったいちご', '皮をむいたグリーンキウイ', '皮と種を除いたマンゴー', '皮をむいたバナナ', '冷たい飲用水'],
  'groups': {'Frutas': '果物', 'Para triturar': '攪拌用'},
  'steps': [
   ['果物を洗い、切り分ける', '手を洗い、すべての果物を皮をむく前に流水で洗います。石けんは使いません。傷んだ部分、いちごのへた、キウイとバナナの皮、マンゴーの皮と種を除きます。5種類の果物を可食部でそれぞれ200 g量ります。マンゴー、キウイ、いちご、バナナを約2 cmに切ります。バナナを50 gずつ4等分し、4種類の果物それぞれと別々の容器に分けます。'],
   ['4種類を別々に冷凍する', 'ブルーベリーとバナナ50 g、いちごとバナナ50 g、キウイとバナナ50 g、マンゴーと残りのバナナ50 gを、それぞれ浅い冷凍対応容器に広げます。ふたをして約60分冷凍し、硬くても一つずつ離せる状態にします。柔らかければ延長し、厚い塊に凍らせないようにします。容量350 ml以上のグラス4個を冷蔵庫で冷やします。'],
   ['紫の層を攪拌する', '冷凍果物に対応したミキサーにブルーベリー200 g、その容器の冷たいバナナ50 g、水20 mlを入れ、40〜60秒攪拌して均一で濃厚なピューレにします。果物が動かない場合は停止し、電源プラグを抜いてからへらで寄せます。水を増やしすぎず、2分ほど置いて柔らかくします。ボウルに移し、ふたをして冷蔵庫に入れます。'],
   ['いちごの層を攪拌する', '次の色に影響しないようミキサー容器を洗って乾かします。いちご200 g、その容器のバナナ50 g、水20 mlを40〜60秒攪拌します。流れる液体ではなく、濃厚なピンク色のピューレにします。別のボウルに移してふたをし、次の作業中は冷蔵庫に入れます。'],
   ['緑の層を攪拌する', '容器をもう一度洗って乾かします。キウイ200 g、その容器のバナナ50 g、水20 mlを40〜60秒攪拌します。キウイの小さな種と果肉はそのまま残し、こしません。緑のピューレにふたをして冷蔵庫に入れます。'],
   ['黄色の層を攪拌する', '容器を再び洗って乾かします。マンゴー200 g、最後のバナナ50 g、水20 mlを40〜60秒攪拌し、均一で濃厚な黄色のピューレにします。他の層と同じくらいのとろみに整えます。攪拌で温まった場合は、盛り付け前に冷蔵庫で冷やします。'],
   ['ゆっくり4層に重ねる', '紫のピューレを冷たいグラス4個に等分します。各グラスにいちごのピューレを全量の4分の1ずつ加えます。下の層のすぐ上にスプーンを置き、その背を伝わせてゆっくり注ぎます。同様にキウイを加え、最後にマンゴーを重ねます。混ぜたり高い位置から注いだりせず、各グラスに4種類すべてを4分の1ずつ入れます。'],
   ['盛り付けたらすぐに出す', '層が形を保っているうちに、長いスプーンを添えてすぐに出します。保存する場合はふたをし、4 °C以下で冷蔵して24時間以内に飲みます。色と層の状態は変化します。混ざったら全体を混ぜ、スムージーとして出します。室温で2時間を超えて放置しないでください。']
  ],
  'notes': '熟した果物を使うとキウイの酸味とのバランスが取りやすくなります。冷凍と少量の水は層作りを助けますが、境目が完全に分かれるとは限りません。冷凍済みの果物を使う場合も同じ可食部の重量を使い、包装の加熱指示を確認します。加熱が必要な製品は生で使いません。最初の冷凍を省く場合は合計時間も調整します。ミキサーが冷凍果物に対応していなければ、機器を傷めずに攪拌できる硬さまで戻してください。層は分かれにくくなります。',
  'faq': [['色が混ざってしまうのはなぜですか？', '各ピューレを冷たく濃厚に保ち、下の層のすぐ上でスプーンの背を伝わせてゆっくり注ぎ、すぐに出してください。果物のピューレなので境目が少し混ざることはあります。'], ['果肉をこしたジュースですか？', 'いいえ。果肉をすべて残すため、スムージーのような食感です。こしたり水分を多く加えたりすると、層を作りにくくなります。'], ['前日に作れますか？', '4種類のピューレを別々にふたをして4 °C以下で最大24時間保存し、飲む直前に重ねます。特にバナナは色や食感が変化します。']],
  'keywords': ['レインボージュース', 'フルーツの層状スムージー', 'マンゴー キウイ いちご ブルーベリー'],
  'cover_alt': '紫、ピンク、緑、黄色の果物の層を重ねたレインボージュース4杯',
  'nutrition': {'serving_size': '4杯のうち1杯、約270 g', 'method': '確認したUSDAの100 g当たりの数値を、冷凍前の果物の可食部重量と水80 gで加重計算し、4で割っています。水80 mlは約80 gとして計算しています。追加の砂糖、乳製品、飾りは含みません。', 'note': '参考用の推定値で、完成した飲み物の実測値ではありません。果物の熟度、水、ミキサーに残った量で変わります。こさずに使用するため、指定量の果肉をすべて計上しています。'}
 },
 'pt': {
  'path': '/pt/suco-arco-iris', 'historical_path': False,
  'title': 'Suco arco-íris de frutas em quatro camadas',
  'seo_title': 'Suco arco-íris: quatro camadas de frutas',
  'excerpt': 'Faça um suco arco-íris cremoso com mirtilo, morango, kiwi e manga. Veja as quantidades e como montar quatro camadas de frutas sem misturar as cores.',
  'summary': 'Este suco arco-íris mantém toda a polpa das frutas e tem textura de smoothie. As quatro cores naturais aparecem de baixo para cima: roxo do mirtilo, rosa do morango, verde do kiwi e dourado da manga.\n\nA banana engrossa cada mistura; o resfriamento e pouca água ajudam a formar as camadas. Quantidades e tempos são uma proposta editorial, ainda pendente de teste na cozinha. As bordas podem se misturar um pouco.',
  'difficulty': 'Fácil', 'course': 'Bebida', 'cuisine': 'Internacional',
  'ingredients': ['Mirtilos', 'Morangos sem folhas e talos', 'Kiwi verde descascado', 'Manga sem casca e caroço', 'Banana descascada', 'Água potável fria'],
  'groups': {'Frutas': 'Frutas', 'Para triturar': 'Para bater'},
  'steps': [
   ['Lavar, cortar e dividir as frutas', 'Lave as mãos e enxágue todas as frutas em água corrente antes de descascar, sem sabão. Retire partes estragadas, folhas e talos dos morangos, cascas dos kiwis e das bananas, casca e caroço da manga. Pese 200 g da parte comestível de cada uma das cinco frutas. Corte manga, kiwi, morango e banana em pedaços de cerca de 2 cm. Divida a banana em quatro porções de 50 g e coloque cada uma com uma das quatro frutas coloridas em recipientes separados.'],
   ['Congelar as quatro misturas', 'Espalhe separadamente os mirtilos com 50 g de banana, os morangos com 50 g, o kiwi com 50 g e a manga com os últimos 50 g em recipientes rasos próprios para o congelador. Tampe e congele por cerca de 60 minutos, até os pedaços ficarem firmes, mas ainda separáveis. Se estiverem moles, deixe mais tempo; evite formar um bloco grosso. Esfrie quatro copos de pelo menos 350 ml na geladeira.'],
   ['Bater a camada roxa', 'Coloque 200 g de mirtilos, seus 50 g de banana fria e 20 ml de água em um liquidificador adequado para frutas congeladas. Bata por 40–60 segundos até obter um purê espesso e uniforme. Se as frutas não se moverem, desligue e tire da tomada antes de raspar com uma espátula; deixe amolecer por 2 minutos em vez de acrescentar muita água. Transfira para uma tigela, tampe e leve à geladeira.'],
   ['Bater a camada de morango', 'Lave e seque o copo do liquidificador para não tingir a próxima mistura. Bata 200 g de morangos com seus 50 g de banana e 20 ml de água por 40–60 segundos. O purê deve ficar rosa e espesso, não líquido. Reserve em outra tigela tampada na geladeira enquanto continua o preparo.'],
   ['Bater a camada verde', 'Lave e seque novamente o copo. Bata 200 g de kiwi com seus 50 g de banana e 20 ml de água por 40–60 segundos. Mantenha as sementinhas do kiwi e toda a polpa, sem coar. Tampe a mistura verde e leve à geladeira.'],
   ['Bater a camada dourada', 'Lave e seque o copo mais uma vez. Bata 200 g de manga com os últimos 50 g de banana e 20 ml de água por 40–60 segundos, até formar um creme dourado uniforme. A consistência deve ser parecida com a das outras camadas; se alguma mistura estiver aquecida, esfrie na geladeira antes de montar.'],
   ['Montar as camadas devagar', 'Divida o purê roxo entre os quatro copos frios. Acrescente um quarto da mistura de morango a cada copo, devagar, sobre as costas de uma colher posicionada logo acima da camada anterior. Repita com o kiwi e termine com a manga. Não mexa nem despeje de uma altura grande: cada copo recebe um quarto de cada uma das quatro misturas.'],
   ['Servir logo após a montagem', 'Sirva imediatamente com uma colher longa enquanto as camadas mantêm o formato. Para guardar, tampe e leve à geladeira a no máximo 4 °C; consuma em até 24 horas. A cor e a separação vão mudar. Se tudo se misturar, mexa e sirva como smoothie. Não deixe por mais de 2 horas em temperatura ambiente.']
  ],
  'notes': 'Frutas maduras equilibram a acidez do kiwi. Congelar e usar pouca água ajuda na montagem, sem garantir linhas perfeitas. Com frutas já congeladas, mantenha os mesmos pesos comestíveis e confira se a embalagem exige cozimento; nesse caso, não use cruas. Ajuste o tempo total se pular o congelamento inicial. Se o liquidificador não aceitar frutas congeladas, deixe amolecer até poder bater sem danificar o aparelho; as camadas ficarão menos definidas.',
  'faq': [['Por que as cores se misturam?', 'Mantenha todos os purês frios e espessos. Despeje cada camada devagar sobre uma colher, bem perto da superfície, e sirva na hora. As bordas dos purês de frutas podem se misturar.'], ['É um suco coado?', 'Não. Toda a polpa é mantida, por isso a textura é de smoothie. Coar ou adicionar muito líquido dificulta a formação das camadas.'], ['Posso preparar no dia anterior?', 'Guarde as quatro misturas separadas e tampadas, a no máximo 4 °C por até 24 horas, e monte na hora de servir. Cor e textura vão mudar, principalmente as da banana.']],
  'keywords': ['suco arco-íris', 'smoothie de frutas em camadas', 'bebida de manga kiwi morango mirtilo'],
  'cover_alt': 'Quatro copos de suco arco-íris com camadas de frutas roxas, rosas, verdes e douradas',
  'nutrition': {'serving_size': '1 dos 4 copos, cerca de 270 g', 'method': 'Valores USDA verificados por 100 g, ponderados pelos pesos comestíveis das frutas antes do congelamento e 80 g de água, depois divididos por 4. Os 80 ml de água são aproximados para 80 g. Sem açúcar adicionado, leite ou decoração.', 'note': 'Estimativa indicativa, não uma análise da bebida pronta. Maturação das frutas, água e resíduos no liquidificador mudam o resultado. Nada é coado: toda a polpa das quantidades indicadas entra no cálculo.'}
 }
}
assert set(data) == {'en','de','fr'}, 'Refusing to overwrite accepted localizations'
data.update(new)
p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
