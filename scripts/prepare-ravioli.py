"""Prepare and freeze the original Spanish ricotta-spinach ravioli package."""
import hashlib
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "receta-raviolis-caseros"
OUT = ROOT / "editorial" / f"{SLUG}-20261008.json"
MANIFEST = ROOT / "editorial" / f"{SLUG}-imagenes.json"
assert not OUT.exists(), f"Refusing to overwrite {OUT}"

base = json.loads((ROOT / "editorial/lote-01-usda-sr-legacy-20261008.json").read_text())
foods = {x["fdc_id"]: x for x in base["foods"]}
foods.update({
    170851: {"fdc_id": 170851, "description": "Cheese, ricotta, whole milk", "per_100g": {"calories": 174.0, "protein_g": 11.26, "carbs_g": 3.04, "fat_g": 12.98, "saturated_fat_g": 8.295, "fiber_g": 0.0, "sugar_g": 0.27, "sodium_mg": 84.0}},
    168462: {"fdc_id": 168462, "description": "Spinach, raw", "per_100g": {"calories": 23.0, "protein_g": 2.86, "carbs_g": 3.63, "fat_g": 0.39, "saturated_fat_g": 0.063, "fiber_g": 2.2, "sugar_g": 0.42, "sodium_mg": 79.0}},
    170848: {"fdc_id": 170848, "description": "Cheese, parmesan, hard", "per_100g": {"calories": 392.0, "protein_g": 35.75, "carbs_g": 3.22, "fat_g": 25.0, "saturated_fat_g": 16.41, "fiber_g": 0.0, "sugar_g": 0.8, "sodium_mg": 1184.0}},
})

nutrition_inputs = [
    ("harina de trigo", 320, 168936),
    ("huevo entero crudo sin cáscara", 150, 171287),
    ("ricotta de leche entera", 300, 170851),
    ("espinaca cruda", 200, 168462),
    ("queso parmesano duro", 40, 170848),
    ("mantequilla sin sal", 40, 173430),
    ("nuez moscada", 0.5, 171326),
    ("sal de mesa", 5, 173468),
]
keys = ["calories", "protein_g", "carbs_g", "fat_g", "saturated_fat_g", "fiber_g", "sugar_g", "sodium_mg"]
totals = {k: 0.0 for k in keys}
inputs = []
for ingredient, grams, fdc_id in nutrition_inputs:
    food = foods[fdc_id]
    for key in keys:
        totals[key] += food["per_100g"][key] * grams / 100
    inputs.append({"ingredient": ingredient, "edible_grams": grams, "fdc_id": fdc_id, "fdc_description": food["description"], "per_100g": food["per_100g"], "source_url": f"https://fdc.nal.usda.gov/food-details/{fdc_id}/nutrients"})
nutrition = {k: round(v / 4, 0 if k == "sodium_mg" else 1) for k, v in totals.items()}
nutrition.update({
    "estimated": True,
    "serving_size": "6 raviolis de un total propuesto de 24, con una cuarta parte de la salsa",
    "source": "USDA FoodData Central — SR Legacy (abril de 2018)",
    "source_url": "https://fdc.nal.usda.gov/download-datasets/",
    "method": "Ocho fichas SR Legacy verificadas; pesos comestibles propuestos sumados y divididos entre 4. Se cuentan los 320 g de harina y los 40 g de mantequilla completos, aunque en cocina pueda quedar harina de trabajo o salsa en el recipiente.",
    "note": "Estimación informativa, no análisis del plato terminado. Marca y humedad de ricotta, tamaño real de los huevos, harina no incorporada, agua absorbida, queso y mantequilla que queden en utensilios cambian el resultado. Cantidades y rendimiento están pendientes de prueba de cocina.",
    "inputs": inputs,
})

ingredients = [
    {"name": "harina de trigo de uso común", "amount": "320", "unit": "g", "group": "Masa"},
    {"name": "huevos grandes, sin cáscara", "amount": "3", "unit": "unidades (aprox. 150 g)", "group": "Masa"},
    {"name": "agua", "amount": "15", "unit": "ml, solo si hace falta", "group": "Masa"},
    {"name": "ricotta de leche entera", "amount": "300", "unit": "g", "group": "Relleno"},
    {"name": "espinaca fresca", "amount": "200", "unit": "g", "group": "Relleno"},
    {"name": "queso parmesano finamente rallado", "amount": "40", "unit": "g", "group": "Relleno"},
    {"name": "nuez moscada molida", "amount": "0.5", "unit": "g", "group": "Relleno"},
    {"name": "sal fina", "amount": "5", "unit": "g, dividida", "group": "Relleno y cocción"},
    {"name": "mantequilla sin sal", "amount": "40", "unit": "g", "group": "Acabado"},
    {"name": "hojas de salvia fresca", "amount": "6", "unit": "g", "group": "Acabado"},
    {"name": "agua para cocer", "amount": "3000", "unit": "ml", "group": "Cocción"},
]

step_data = [
    ("Escurre la ricotta", "Pon los 300 g de ricotta en un colador fino sobre un cuenco, tapa y deja escurrir 30 minutos en la nevera. No la dejes a temperatura ambiente. Presiona suavemente al final, sin convertirla en una pasta seca. Esta espera está incluida en los 70 minutos de preparación y puede solaparse con la masa y la espinaca."),
    ("Cocina y seca la espinaca", "Lava los 200 g de espinaca y pásala a una sartén amplia aún húmeda. Cocina a fuego medio 2–3 minutos, moviendo, hasta que se marchite. Extiéndela en un plato limpio para que pierda calor; cuando se pueda manipular, exprímela con las manos limpias o un paño limpio hasta retirar la mayor cantidad de agua posible y pícala fina. La espinaca húmeda puede abrir los raviolis."),
    ("Mezcla la masa", "Forma un hueco en 300 g de la harina y añade los 3 huevos, aproximadamente 150 g sin cáscara. Bate los huevos con tenedor y ve incorporando harina desde el borde. Amasa hasta reunir una masa firme; añade el agua de 5 en 5 ml solo si quedan partes secas después de varios minutos. Reserva los 20 g restantes de harina para la mesa y la bandeja. La absorción varía: no añadas toda el agua por obligación."),
    ("Amasa y deja reposar", "Amasa 8–10 minutos sobre una superficie limpia hasta que la masa se vea lisa y recupere lentamente la forma al presionarla. Envuelve bien para que no se seque y deja reposar 30 minutos a temperatura ambiente fresca. Limpia la mesa y los utensilios que tocaron huevo crudo antes de preparar el relleno o manipular raviolis cocidos."),
    ("Prepara un relleno seco", "Mezcla la ricotta escurrida, la espinaca picada, los 40 g de parmesano, 0,5 g de nuez moscada y 2 g de la sal. Debe quedar espeso y mantener la forma de una cucharadita. Divide visualmente en 24 porciones de unos 20 g; si se extiende o suelta líquido, refrigera 10 minutos y vuelve a comprobar. No añadas huevo al relleno de esta propuesta."),
    ("Estira, rellena y sella", "Divide la masa en 4 partes y mantén 3 envueltas. Estira una parte con máquina o rodillo hasta una lámina fina de aproximadamente 1 mm; evita agujeros. Coloca 6 porciones de relleno separadas, humedece apenas el contorno con agua y cubre con otra mitad de la lámina. Expulsa el aire desde el relleno hacia fuera y presiona para sellar. Corta 6 raviolis y revisa cada borde. Repite hasta obtener 24; ponlos en bandeja con parte de la harina reservada, sin apilar. Cocina enseguida o refrigera tapados un máximo propuesto de 2 horas antes de cocer."),
    ("Cuece los raviolis por tandas", "Hierve los 3 litros de agua con los 3 g de sal restantes. Mientras, derrite los 40 g de mantequilla a fuego medio-bajo con las hojas de salvia hasta que la mantequilla huela a avellana y los sólidos estén dorados, no negros; retira del fuego. Cuece los raviolis en 2 tandas para que no se peguen: remueve con suavidad y cuenta 3–5 minutos desde que el agua recupere un hervor moderado. Abre uno de prueba de la primera tanda: la pasta debe estar tierna, el sello cocido y el centro alcanzar al menos 71 °C. Si no, prolonga y vuelve a comprobar con un ravioli nuevo."),
    ("Termina, sirve y guarda", "Saca los raviolis con espumadera, deja escurrir unos segundos y pásalos a la sartén de mantequilla y salvia. Mueve con cuidado 30–60 segundos para cubrirlos sin romperlos. Reparte 6 raviolis por persona y sirve de inmediato. Refrigera las sobras en recipientes bajos a 4 °C o menos dentro de 2 horas, o 1 hora si el ambiente supera 32 °C; se propone consumirlas en 2 días. Recalienta solo una vez hasta 74 °C en el centro. No guardes sobrante de huevo crudo que haya tocado harina o utensilios sin higienizar."),
]
steps = [{"title": title, "content": content, "image_url": "", "image_alt": f"Raviolis caseros: {title.lower()}"} for title, content in step_data]
steps_sha256 = hashlib.sha256(json.dumps(steps, ensure_ascii=False, sort_keys=True).encode()).hexdigest()

summary = "Estos raviolis caseros combinan una masa fresca de huevo con un relleno espeso de ricotta, espinaca y parmesano. Se sellan en 24 unidades y se sirven con mantequilla avellanada y salvia, sin ocultar la técnica con una salsa pesada.\n\nLa propuesta rinde 4 porciones de 6 raviolis. Calcula 70 minutos de preparación y 20 de cocción, 90 en total; el escurrido, el reposo y parte de la preparación se solapan. Cantidades, espesor de la masa, tiempos y rendimiento están pendientes de una prueba de cocina."
excerpt = "Raviolis caseros de ricotta y espinaca para 4: masa fresca de huevo, sellado paso a paso y acabado de mantequilla con salvia."
notes = "La masa y el relleno contienen trigo, huevo y lácteos. No se propone una sustitución sin gluten, sin huevo o sin lácteos dentro de esta ficha porque cambiaría hidratación, estructura y nutrición. La ricotta debe escurrirse en frío; la espinaca debe exprimirse bien. Si un ravioli tiene un borde abierto, reséllalo antes de cocer y no lo apiles. El espesor de 1 mm, el rendimiento de 24 unidades y los tiempos son objetivos editoriales pendientes de confirmación en cocina. Para congelar, coloca los raviolis crudos separados en bandeja hasta que estén firmes y pásalos a un recipiente; cocina desde congelados añadiendo tiempo y verifica al menos 71 °C en el centro. No descongeles a temperatura ambiente."
record = {
    "id": "82997c99-0b32-42e0-8e22-1617a936c949",
    "recipe_group_id": "e8238258-5fe1-4344-8851-917fa546f20b",
    "slug": SLUG,
    "public_path": "/receta-raviolis-caseros",
    "source_url": "https://manualdecocina.com/receta-raviolis-caseros/",
    "language": "es",
    "title": "Raviolis caseros de ricotta y espinaca",
    "excerpt": excerpt,
    "summary": summary,
    "category": "Pastas",
    "category_slug": "pastas",
    "difficulty": "Media",
    "course": "Plato principal",
    "cuisine": "Italiana, propuesta casera",
    "prep_time_minutes": 70,
    "cook_time_minutes": 20,
    "total_time_minutes": 90,
    "servings": 4,
    "ingredients": ingredients,
    "steps": steps,
    "notes": notes,
    "nutrition": nutrition,
    "keywords": ["raviolis caseros", "raviolis de ricotta y espinaca", "masa fresca para ravioli"],
    "image_url": None,
    "gallery": [],
    "seo": {
        "title": "Raviolis caseros de ricotta y espinaca",
        "description": excerpt,
        "image_alt": "Raviolis caseros rellenos de ricotta y espinaca con mantequilla dorada y hojas de salvia",
        "image_variants": [],
        "faq": [
            {"q": "¿Por qué se abren los raviolis al cocer?", "a": "Suelen abrirse por relleno húmedo, aire atrapado, bordes con harina o un sellado débil. Escurre la ricotta, exprime la espinaca, expulsa el aire y humedece apenas el contorno antes de presionar."},
            {"q": "¿Puedo hacerlos sin máquina de pasta?", "a": "Sí, con rodillo y porciones pequeñas. Busca una lámina uniforme de alrededor de 1 mm y mantén cubierta la masa que no estés estirando. El tiempo puede aumentar respecto de los 90 minutos propuestos."},
            {"q": "¿Se pueden congelar antes de cocer?", "a": "Sí. Congélalos crudos y separados en bandeja, luego pásalos a un recipiente. Cuécelos desde congelados, amplía el tiempo según sea necesario y verifica que el centro alcance al menos 71 °C."},
        ],
    },
    "published": False,
    "editorial_status": "draft",
    "content_html": "".join(f"<p>{html.escape(p)}</p>" for p in summary.split("\n\n")),
}

visuals = [
    "Ricotta escurriendo en colador fino dentro de la nevera, tapada y sobre un cuenco.",
    "Espinaca recién marchita, enfriada, exprimida y picada fina, sin líquido visible.",
    "Huevos batidos incorporándose a un volcán de harina, masa todavía irregular.",
    "Bola de masa lisa ya amasada, envuelta para reposar junto a superficie limpia.",
    "Relleno espeso de ricotta, espinaca y parmesano dividido en porciones uniformes.",
    "Lámina fina de pasta con seis porciones, aire expulsado, bordes sellados y raviolis cortados.",
    "Raviolis hirviendo en tanda moderada y mantequilla con salvia dorándose en sartén aparte.",
    "Seis raviolis servidos con mantequilla avellanada y salvia, uno cortado muestra relleno verde y blanco.",
]
base_prompt = "Use case: photorealistic-natural. Asset type: original Manual de Cocina homemade ravioli recipe photograph. One realistic 4:3 landscape photograph, soft natural light, clean neutral home kitchen, plain unbranded cookware, anatomically plausible hands only when needed and exact preparation phase. No text, labels, logos, watermark, collage, tomato sauce, cream sauce, meat, mushrooms, nuts or unlisted garnish. "
scenes = [
    "Whole-milk ricotta draining in a fine mesh strainer set over a plain bowl on a refrigerator shelf, loosely covered; cold setting visible, no spinach, eggs or dough yet.",
    "Cooked wilted spinach on a clean plate, cooled, firmly squeezed dry and finely chopped, compact with no puddle; no ricotta mixture or pasta dough yet.",
    "Three beaten raw eggs being gradually mixed by fork into a well in white all-purpose flour on a clean board; rough shaggy early dough, no green filling, no finished ravioli.",
    "Smooth kneaded pale yellow egg-pasta dough ball wrapped tightly for resting on a clean board; cleaned tools and surface, no exposed raw egg, no ravioli yet.",
    "Thick dry-looking ricotta and finely chopped spinach filling with small parmesan flecks, divided into 24 neat teaspoon portions; filling holds shape, no runny liquid and no raw egg.",
    "Thin pale pasta sheet about 1 mm with six evenly spaced green-white filling mounds, second sheet being sealed around them with air expelled; six square ravioli cut with firmly pressed edges, remaining dough covered.",
    "Two separate actions in one coherent kitchen scene, not a collage: a plain pot with one batch of square ravioli at a moderate boil and beside it a skillet with foaming golden-brown butter and whole sage leaves; no tomato sauce or cream.",
]
cover_prompt = base_prompt + "Finished serving of exactly six square homemade ravioli on a plain shallow warm-white plate, lightly glossed with golden-brown butter, a few crisp whole sage leaves, subtle parmesan flecks, one ravioli cut open to show compact white ricotta and dark-green spinach filling. Natural handmade variation and securely crimped edges, no sauce pool. Generous central margins for square, 4:3 and 16:9 responsive cover crops."
package = {
    "schema_version": 1,
    "slug": SLUG,
    "category_slug": "pastas",
    "steps_frozen": True,
    "steps_sha256": steps_sha256,
    "time_notes": "70 min preparation + 20 min cooking = 90 total; ricotta draining and dough rest overlap. Proposed, pending kitchen trial.",
    "ai_owner_confirmation": {"status": "delegated_editorial_authority", "fields_are_estimated": ["ingredients.amount", "servings", "prep_time_minutes", "cook_time_minutes", "total_time_minutes", "nutrition", "ravioli_yield", "dough_thickness"], "human_kitchen_confirmation": "not_performed"},
    "publication_blockers": ["FINAL_IMAGES_PENDING", "FULL_LOCALIZATION_PENDING", "BATCH_15_COMPLETION_PENDING", "PREVIEW_QA_PENDING"],
    "scope": "preview.manualdecocina.com",
    "state": "ES_PREPARED_IMAGES_AND_LOCALIZATIONS_PENDING",
    "provenance": "Original culinary reconstruction from the preserved ES identity; no WordPress body, translation or media used. Historical ES route preserved and six new locale routes collision-checked.",
    "sources": [
        {"url": "https://fdc.nal.usda.gov/download-datasets/", "purpose": "USDA FoodData Central SR Legacy nutrition dataset and eight ingredient records.", "accessed": "2026-10-08"},
        {"url": "https://www.fda.gov/consumers/consumer-updates/what-you-need-know-about-egg-safety", "purpose": "Separation, cleaning and thorough cooking for fresh egg pasta.", "accessed": "2026-10-08"},
        {"url": "https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures", "purpose": "71 °C for egg dishes and 74 °C for leftovers used as conservative verification targets.", "accessed": "2026-10-08"},
    ],
    "records": [record],
}
manifest = {
    "schema_version": 1,
    "slug": SLUG,
    "recipe_group_id": record["recipe_group_id"],
    "date": "2026-10-08",
    "steps_frozen": True,
    "steps_sha256": steps_sha256,
    "directory": f"public/recetas/{SLUG}/",
    "image_source": "built-in image generation; one call per distinct original; cover crops from same original",
    "prompts": [{"asset": "portada.webp", "step": 8, "prompt": cover_prompt}] + [{"asset": f"paso-{i:02d}.webp", "step": i, "prompt": base_prompt + scene} for i, scene in enumerate(scenes, 1)],
    "images": [],
    "state": "GENERATION_PENDING",
    "last_step_reuses_cover": True,
    "visual_targets": visuals,
}
OUT.write_text(json.dumps(package, ensure_ascii=False, indent=2) + "\n")
MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"slug": SLUG, "steps": len(steps), "steps_sha256": steps_sha256, "nutrition": {k: nutrition[k] for k in keys}}, ensure_ascii=False))
