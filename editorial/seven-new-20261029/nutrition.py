import csv,io,zipfile,hashlib
from pathlib import Path
ARCHIVE=Path(__file__).parent/'usda-sr-legacy.zip'
MAP={'1008':'calories','1003':'protein_g','1005':'carbs_g','1004':'fat_g','1258':'saturated_fat_g','1079':'fiber_g','2000':'sugar_g','1093':'sodium_mg'}
def calculate(foods,servings):
    assert hashlib.sha256(ARCHIVE.read_bytes()).hexdigest()=='b80817294b8850530aaedf2e515c02593b1824f763a0ff356e5c2081643e6fd0'
    ids={str(x[2]) for x in foods};values={i:{} for i in ids}
    with zipfile.ZipFile(ARCHIVE) as z:
        p=next(n for n in z.namelist() if n.endswith('/food.csv'))
        names={r['fdc_id']:r['description'] for r in csv.DictReader(io.TextIOWrapper(z.open(p))) if r['fdc_id'] in ids}
        p=next(n for n in z.namelist() if n.endswith('/food_nutrient.csv'))
        for r in csv.DictReader(io.TextIOWrapper(z.open(p))):
            if r['fdc_id'] in ids and r['nutrient_id'] in MAP:values[r['fdc_id']][MAP[r['nutrient_id']]]=float(r['amount'])
    evidence=[dict(ingredient=n,grams=g,fdc_id=i,description=names[str(i)],per_100g=values[str(i)],source_url=f'https://fdc.nal.usda.gov/food-details/{i}/nutrients') for n,g,i in foods]
    complete=[n for n in MAP.values() if all(n in v['per_100g'] for v in evidence)]
    result={n:(round(sum(e['per_100g'][n]*e['grams']/100 for e in evidence)/servings/10)*10 if n=='calories' else round(sum(e['per_100g'][n]*e['grams']/100 for e in evidence)/servings)) for n in complete}
    return result,dict(archive_url='https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip',archive_sha256=hashlib.sha256(ARCHIVE.read_bytes()).hexdigest(),foods=evidence,servings=servings,per_serving=result)
