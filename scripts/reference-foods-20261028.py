"""Extract a small, attributable set of food references; calculate no missing values."""
import csv,io,json,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'editorial/siete-mercados-20261028'
IDS=dict(chestnut=170575,chickpea=173801,onion=170000,olive=171413,garlic=169230,sundried=169384,tomatopaste=170459,stock=171583,cream=170859,spinach=168462,parmesan=170848,oregano=171328,flour=169761,milk=172217,yeast=175043,sugar=169655,butter=173430,bacon=168277,sourcream=171257,egg=171287,caraway=170918,lentil=172420,carrot=170393,shallot=170499,walnut=170187,mustard=172234,vinegar=173469,parsley=170416,darkchoc=170273,cocoa=169593,cornstarch=169698,sweetpotato=168482,oil=171025,soy=174277,sesame=170150,plantain=169130,chives=169994,pepper=170931,salt=173468)
N={'1008':'calories','1003':'protein_g','1005':'carbs_g','1004':'fat_g','1258':'saturated_fat_g','1079':'fiber_g','2000':'sugar_g','1093':'sodium_mg'}
z=zipfile.ZipFile(ROOT.parent/'usda-sr-2018.zip');wanted={str(v) for v in IDS.values()}
read=lambda suffix:csv.DictReader(io.TextIOWrapper(z.open(next(p for p in z.namelist() if p.endswith('/'+suffix)))))
desc={r['fdc_id']:r['description'] for r in read('food.csv') if r['fdc_id'] in wanted};values={k:{} for k in wanted}
for row in read('food_nutrient.csv'):
 if row['fdc_id'] in wanted and row['nutrient_id'] in N:values[row['fdc_id']][N[row['nutrient_id']]]=float(row['amount'])
refs={k:dict(fdc_id=v,description=desc[str(v)],source_url=f'https://fdc.nal.usda.gov/food-details/{v}/nutrients',per_100g=values[str(v)]) for k,v in IDS.items()}
refs['water']=dict(description='Added water, zero energy/macronutrients; trace minerals not modelled',source_url='https://fdc.nal.usda.gov/',per_100g={k:0 for k in N.values()})
refs['cassavaflour']=dict(reference_id='TBCA BRC0088B',description='Farinha de mandioca torrada — TBCA',source_url='https://www.tbca.net.br/base-dados-en/int_statistical_composition.php?cod_produto=BRC0088B',per_100g=dict(calories=351,protein_g=1.23,carbs_g=89.2,fat_g=.29,fiber_g=6.54,saturated_fat_g=.10,sodium_mg=10.3))
(D/'reference-foods.json').write_text(json.dumps(refs,ensure_ascii=False,indent=2)+'\n')
for k,r in refs.items():print(k,r['description'],sorted(set(N.values())-r['per_100g'].keys()))
