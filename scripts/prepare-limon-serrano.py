"""Build the original Spanish recipe and traceable USDA calculation (batch 02)."""
import csv
import hashlib
import html
import io
import json
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = 'como-preparar-limon-serrano-la-receta-de-ensalada-mas-buscada'
TITLE = 'Limón serrano: ensalada de cítricos, huevo y embutidos'
DATE = '20261008'
NUTRIENTS = {'1008': 'calories', '1003': 'protein_g', '1005': 'carbs_g', '1004': 'fat_g', '1258': 'saturated_fat_g', '1079': 'fiber_g', '2000': 'sugar_g', '1093': 'sodium_mg'}
FOODS = [
    ('naranja pelada', 500, 169097, None),
    ('limón pelado', 100, 167746, None),
    ('huevo cocido sin cáscara', 200, 173424, None),
    ('jamón serrano', 80, 167872, 'Aproximación con jamón curado cocinado genérico: no corresponde exactamente a jamón serrano seco.'),
    ('chorizo curado listo para comer', 60, 174582, 'Aproximación con salami seco de cerdo y vacuno: no corresponde exactamente al chorizo curado utilizado.'),
    ('aceite de oliva', 25, 171413, None),
    ('ajo pelado', 3, 169230, None),
    ('vino blanco', 15, 174837, None),
]

with zipfile.ZipFile(sys.argv[1]) as archive:
    food_name = next(n for n in archive.namelist() if n.endswith('/food.csv'))
    nutrient_name = next(n for n in archive.namelist() if n.endswith('/food_nutrient.csv'))
    ids = {str(f[2]) for f in FOODS}
    descriptions = {r['fdc_id']: r['description'] for r in csv.DictReader(io.TextIOWrapper(archive.open(food_name))) if r['fdc_id'] in ids}
    values = {fdc: {} for fdc in ids}
    for row in csv.DictReader(io.TextIOWrapper(archive.open(nutrient_name))):
        if row['fdc_id'] in ids and row['nutrient_id'] in NUTRIENTS:
            values[row['fdc_id']][NUTRIENTS[row['nutrient_id']]] = float(row['amount'])

totals = dict.fromkeys(NUTRIENTS.values(), 0.0)
inputs = []
for ingredient, grams, fdc_id, proxy in FOODS:
    fdc = str(fdc_id)
    assert fdc in descriptions and set(values[fdc]) == set(totals), f'Incomplete USDA record: {fdc}'
    for nutrient, value in values[fdc].items():
        totals[nutrient] += value * grams / 100
    item = {'ingredient': ingredient, 'edible_grams': grams, 'fdc_id': fdc_id, 'fdc_description': descriptions[fdc], 'per_100g': values[fdc], 'source_url': f'https://fdc.nal.usda.gov/food-details/{fdc_id}/nutrients'}
    if proxy:
        item['proxy_note'] = proxy
    inputs.append(item)

summary = 'El limón serrano es una ensalada de la Sierra de Francia, en Salamanca. Esta versión combina naranja, una proporción menor de limón, huevo duro, jamón y chorizo curado, con un aliño de aceite, ajo y vino blanco. Las proporciones y el método que siguen son una propuesta propia; existen variantes locales.\n\nRinde 4 porciones de unos 245 g. Cuenta aproximadamente 40 minutos de principio a fin, incluidos 5 minutos para enfriar los huevos. Usa exclusivamente chorizo curado etiquetado como listo para comer.'
excerpt = 'Prepara limón serrano con naranja, limón, huevo duro y embutidos curados. Cantidades para 4 porciones, pasos detallados y aliño de aceite, ajo y vino.'
ingredients = [
    {'name': 'naranja, peso después de pelar', 'amount': '500', 'unit': 'g', 'group': 'Ensalada'},
    {'name': 'limón, peso después de pelar', 'amount': '100', 'unit': 'g', 'group': 'Ensalada'},
    {'name': 'huevos grandes, unos 200 g cocidos sin cáscara', 'amount': '4', 'unit': 'unidades', 'group': 'Ensalada'},
    {'name': 'jamón serrano listo para comer', 'amount': '80', 'unit': 'g', 'group': 'Ensalada'},
    {'name': 'chorizo curado listo para comer', 'amount': '60', 'unit': 'g', 'group': 'Ensalada'},
    {'name': 'aceite de oliva virgen extra', 'amount': '25', 'unit': 'g', 'group': 'Aliño'},
    {'name': 'ajo pelado', 'amount': '3', 'unit': 'g', 'group': 'Aliño'},
    {'name': 'vino blanco', 'amount': '15', 'unit': 'ml', 'group': 'Aliño'},
]
step_texts = [
    ('Reúne los ingredientes', 'Lava las naranjas y el limón antes de pelarlos. Prepara los 4 huevos, 80 g de jamón serrano, 60 g de chorizo curado, 25 g de aceite, 3 g de ajo pelado y 15 ml de vino. Comprueba que ambos embutidos estén etiquetados como listos para comer; esta preparación no cocina chorizo fresco.'),
    ('Cuece y enfría los huevos', 'Pon los huevos en un cazo y cúbrelos con agua fría, unos 2 cm por encima. Lleva a ebullición y mantén un hervor suave durante 12 minutos; la clara y la yema deben quedar firmes. Enfría en agua fría durante unos 5 minutos, pela y corta cada huevo en cuatro. Cuenta unos 15 minutos de cocción, incluido el calentamiento del agua.'),
    ('Pela y corta los cítricos', 'Retira la piel y la parte blanca de las naranjas y el limón con un cuchillo. Pesa 500 g de naranja y 100 g de limón ya pelados. Corta en rodajas o trozos de unos 5 mm, elimina las semillas y recoge el zumo que caiga en un cuenco para el aliño.'),
    ('Corta los embutidos', 'Corta los 80 g de jamón serrano en tiras cortas y los 60 g de chorizo curado en rodajas finas; retira la tripa si no es comestible. Mantén ambos fríos hasta montar la ensalada. No añadas sal: los embutidos ya aportan bastante.'),
    ('Mezcla el aliño', 'Pica muy fino o ralla los 3 g de ajo. Mézclalo con los 25 g de aceite, los 15 ml de vino blanco y todo el zumo recogido al cortar los cítricos. Bate con un tenedor hasta que se unan; el vino se añade sin cocinar y conserva alcohol.'),
    ('Monta la ensalada', 'Reparte la naranja y el limón en una fuente ancha. Distribuye el jamón y el chorizo, vierte el aliño y mueve con suavidad sin romper los cítricos. Coloca encima los 16 cuartos de huevo, con las yemas visibles.'),
    ('Reparte y sirve', 'Divide en 4 porciones procurando repartir cítricos, embutidos y un huevo por persona. Sirve recién montada. Si no se consume enseguida, tapa y refrigera; usa esta preparación dentro de 24 horas para conservar mejor su textura. No la dejes más de 2 horas a temperatura ambiente.'),
]
steps = [{'title': title, 'content': content, 'image_url': '', 'image_alt': f'Limón serrano: {title.lower()}'} for title, content in step_texts]
nutrition = {key: round(value / 4, 0 if key == 'sodium_mg' else 1) for key, value in totals.items()}
nutrition.update({'serving_size': '1 de 4 porciones, aproximadamente 245 g', 'estimated': True, 'source': 'USDA FoodData Central — SR Legacy (abril de 2018)', 'source_url': 'https://fdc.nal.usda.gov/download-datasets/', 'method': 'Valores por 100 g de cada ficha FDC verificada, multiplicados por los gramos comestibles y divididos entre 4. Se incluye todo el aceite y el vino; se aproxima 15 ml de vino a 15 g. Sin sal añadida ni acompañamientos.', 'note': 'Estimación, no análisis del plato. Jamón serrano y chorizo curado se aproximan con fichas genéricas de jamón curado cocinado y salami seco de cerdo y vacuno; especialmente sodio, grasa y energía pueden variar considerablemente según la marca. Comprueba las etiquetas para mayor precisión.', 'inputs': inputs})
record = {'id': 'e47eac88-0649-4785-baf0-43b92dd2ec2e', 'recipe_group_id': '7dcd70ca-9fa9-40cc-95b8-a6444db4a292', 'slug': SLUG, 'public_path': '/' + SLUG, 'source_url': 'https://manualdecocina.com/' + SLUG + '/', 'language': 'es', 'title': TITLE, 'excerpt': excerpt, 'summary': summary, 'category': 'Ensaladas', 'category_slug': 'ensaladas', 'difficulty': 'Fácil', 'course': 'Entrante', 'cuisine': 'Salmantina', 'prep_time_minutes': 20, 'cook_time_minutes': 15, 'total_time_minutes': 40, 'servings': 4, 'ingredients': ingredients, 'steps': steps, 'notes': 'La proporción de naranja es mayor para equilibrar el limón; retira bien la parte blanca y las semillas para reducir el amargor. Para adelantar trabajo, guarda huevos cocidos, cítricos, embutidos y aliño en recipientes separados en la nevera y mezcla al servir. El vino queda crudo: para una versión sin alcohol, sustitúyelo por 15 ml de zumo de naranja; el cálculo nutricional corresponde a la versión con vino. Contiene huevo; los embutidos y el vino pueden contener otros alérgenos o sulfitos, según sus etiquetas.', 'nutrition': nutrition, 'keywords': ['limón serrano', 'ensalada de naranja y limón', 'receta de la Sierra de Francia'], 'image_url': None, 'gallery': [], 'seo': {'title': 'Limón serrano con cítricos y huevo | Manual de Cocina', 'description': excerpt, 'image_alt': 'Limón serrano con naranja, limón, cuartos de huevo duro, jamón y chorizo curado', 'image_variants': [], 'faq': [{'q': '¿Cómo evito que el limón serrano quede amargo?', 'a': 'Retira completamente la parte blanca y las semillas. Pesa los cítricos después de pelarlos y respeta la proporción de 500 g de naranja por 100 g de limón.'}, {'q': '¿Se puede hacer sin vino?', 'a': 'Sí. Sustituye los 15 ml por la misma cantidad de zumo de naranja. Cambia ligeramente el sabor y la nutrición; la estimación publicada incluye vino.'}, {'q': '¿Puedo usar chorizo fresco?', 'a': 'Esta receta utiliza chorizo curado listo para comer. El chorizo fresco requiere una cocción completa distinta y no se debe servir crudo siguiendo estos pasos.'}]}, 'published': False, 'editorial_status': 'draft', 'content_html': ''.join('<p>' + html.escape(p) + '</p>' for p in summary.split('\n\n'))}
visuals = [
    'Ingredientes medidos antes de preparar: naranjas y limón enteros, cuatro huevos con cáscara, jamón y chorizo curados, aceite, ajo y vino separados.',
    'Huevos ya cocidos y pelados, uno cortado en cuartos con clara y yema completamente firmes; cuenco de agua fría y cazo al fondo.',
    'Naranja y limón sin piel ni parte blanca en rodajas, con sus pieles a un lado y un cuenco recogiendo el zumo; cuchillo sobre tabla.',
    'Jamón en tiras y chorizo curado en rodajas finas sobre tabla limpia, ingredientes aún separados de los cítricos.',
    'Aliño de aceite, ajo muy picado, vino y zumo de cítricos en un pequeño cuenco, removido con un tenedor.',
    'Fuente de cítricos y embutidos mientras se distribuye el aliño, antes de colocar los cuartos de huevo.',
    'Ensalada terminada con naranja, limón, jamón, chorizo y cuartos de huevo duro, lista para servir; comparte original de portada.',
]
recipe = {'category_slug': 'ensaladas', 'cover': visuals[-1], 'step_visuals': visuals, 'ai_owner_confirmation': {'status': 'delegated_editorial_authority', 'authority': 'Usuario autorizó producción y publicación autónomas de lotes completos el 2026-10-08.', 'kitchen_test_performed': False, 'reason': 'Cantidades, tiempos y rendimiento son una propuesta editorial propia, no una prueba de cocina ejecutada.'}, 'time_notes': 'Total estimado = 20 minutos de preparación + 15 de cocción + 5 de enfriado. Sin descontar tareas que puedan solaparse.', 'steps_frozen': True, 'steps_sha256': hashlib.sha256(json.dumps(steps, ensure_ascii=False, sort_keys=True).encode()).hexdigest(), 'publication_blockers': ['FULL_LOCALIZATION_PENDING', 'FINAL_IMAGES_PENDING', 'BATCH_15_COMPLETION_PENDING', 'PREVIEW_QA_PENDING'], 'image_alts_by_language': {'es': {'title': TITLE, 'cover': record['seo']['image_alt'], 'steps': [s['image_alt'] for s in steps]}}, 'scope': 'preview.manualdecocina.com', 'state': 'ES_PREPARED_IMAGES_AND_LOCALIZATIONS_PENDING', 'provenance': 'Contenido original. Se usaron únicamente identidad y URL históricas, no cuerpo, ingredientes, fotos ni traducciones de WordPress. Fuente regional consultada para resolver la entidad culinaria; proporciones y método propios. Nutrición calculada con CSV oficiales USDA y aproximaciones explícitas de embutidos. Sin prueba de cocina ejecutada.', 'sources': [{'url': 'https://turismosierradefrancia.es/gastronomia/platos-tipicos/', 'purpose': 'Entidad culinaria regional, componentes habituales y existencia de variantes locales.', 'accessed': '2026-10-08'}, {'url': 'https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures', 'purpose': 'Clara y yema completamente firmes.', 'accessed': '2026-10-08'}, {'url': 'https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip', 'purpose': 'Datos cuantitativos originales por ingrediente.', 'accessed': '2026-10-08'}], 'records': [record]}
decision = {'slug': SLUG, 'date': '2026-10-08', 'prior_decision': 'REVIEW: entidad culinaria o artículo de captura de búsqueda', 'decision': 'REBUILD_RECIPE', 'reason': 'La fuente turística regional identifica limón serrano como plato de la Sierra de Francia, con variantes locales. Corresponde a una receta culinaria y se reconstruye como tal bajo la autoridad editorial delegada por el usuario.', 'evidence_url': recipe['sources'][0]['url'], 'public_path_preserved': '/' + SLUG, 'unsupported_claim_removed': 'la receta de ensalada más buscada (solo permanece en la URL histórica)', 'archive_and_other_review_entities_unchanged': True, 'publication_requires': recipe['publication_blockers']}
def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
write(ROOT / 'editorial' / (SLUG + '-' + DATE + '.json'), recipe)
write(ROOT / 'editorial' / (SLUG + '-decision-' + DATE + '.json'), decision)
print(json.dumps({'slug': SLUG, 'steps': len(steps), 'nutrition_per_serving': {key: nutrition[key] for key in NUTRIENTS.values()}, 'state': recipe['state']}, ensure_ascii=False))
