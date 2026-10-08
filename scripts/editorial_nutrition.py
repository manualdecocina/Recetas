"""Read verified SR Legacy CSV records; never fabricate missing nutrient values."""
import csv
import io
import zipfile

NUTRIENTS = {'1008': 'calories', '1003': 'protein_g', '1005': 'carbs_g', '1004': 'fat_g', '1258': 'saturated_fat_g', '1079': 'fiber_g', '2000': 'sugar_g', '1093': 'sodium_mg'}

def calculate(archive_path, foods, servings):
    ids = {str(food[2]) for food in foods}
    with zipfile.ZipFile(archive_path) as archive:
        name = next(n for n in archive.namelist() if n.endswith('/food.csv'))
        descriptions = {r['fdc_id']: r['description'] for r in csv.DictReader(io.TextIOWrapper(archive.open(name))) if r['fdc_id'] in ids}
        name = next(n for n in archive.namelist() if n.endswith('/food_nutrient.csv'))
        values = {i: {} for i in ids}
        for row in csv.DictReader(io.TextIOWrapper(archive.open(name))):
            if row['fdc_id'] in ids and row['nutrient_id'] in NUTRIENTS:
                values[row['fdc_id']][NUTRIENTS[row['nutrient_id']]] = float(row['amount'])
    totals = dict.fromkeys(NUTRIENTS.values(), 0.0)
    inputs = []
    for ingredient, grams, food_id in foods:
        food_id_string = str(food_id)
        assert set(values[food_id_string]) == set(totals), f'Incomplete FDC nutrient record: {food_id}'
        for nutrient, amount in values[food_id_string].items():
            totals[nutrient] += amount * grams / 100
        inputs.append({'ingredient': ingredient, 'edible_grams': grams, 'fdc_id': food_id, 'fdc_description': descriptions[food_id_string], 'per_100g': values[food_id_string], 'source_url': f'https://fdc.nal.usda.gov/food-details/{food_id}/nutrients'})
    result = {key: round(value / servings, 0 if key == 'sodium_mg' else 1) for key, value in totals.items()}
    result.update(estimated=True, source='USDA FoodData Central — SR Legacy (abril de 2018)', source_url='https://fdc.nal.usda.gov/download-datasets/', inputs=inputs)
    return result
