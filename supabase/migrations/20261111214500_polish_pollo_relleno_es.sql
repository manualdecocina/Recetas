-- Pollo relleno navideño (es): limpieza de texto, sin cambiar ingredientes, cantidades ni técnica.
--  1) Ingredientes: la preparación ya no repite el nombre ni duplica la nota
--     (antes se veía "…de referencia1,8 kg…" y "Pan rallado, pan rallado sin condimentar").
--  2) Pasos y notas: las palabras en MAYÚSCULAS sostenidas pasan a minúsculas.
--  3) Paso 1: frase sobre el carnicero redactada con claridad.
-- Idempotente: se puede volver a ejecutar sin efecto adicional.

with target as (
  select id from public.recipes where language = 'es' and slug = 'pollo-relleno-navideno'
),
m(pos, prep) as (values
  (0,'entero, crudo, con piel; sin carcasa ni fémures de los contramuslos, con jamoncitos y puntas de alas, y alas y patas adheridas'),
  (1,'cruda'),(2,'cruda'),(3,'sin condimentar'),(4,'sin semillas'),
  (5,'cocidas y escurridas'),(6,'en cubitos, precocida y escurrida'),(7,'cabezona, picada'),
  (8,'rojo dulce, picado'),(9,'picado'),(10,'batido, sin cáscara (1 unidad grande)'),
  (11,'vegetal o de oliva'),(12,'fresco, picado'),(13,'fina, repartida entre pollo y relleno'),
  (14,'molida'),(15,'molido'),(16,'molido')
),
u_ing as (
  update public.recipes r set ingredients = (
    select jsonb_agg(
      case when t.ord = 1 then (t.e - 'note') || jsonb_build_object('preparation', m.prep)
           else t.e || jsonb_build_object('preparation', m.prep) end
      order by t.ord)
    from jsonb_array_elements(r.ingredients) with ordinality as t(e, ord)
    join m on m.pos = t.ord - 1)
  where r.id in (select id from target) and jsonb_array_length(r.ingredients) = 17
  returning r.id
)
update public.recipe_ingredients ri set
  preparation = m.prep,
  note = case when ri.position = 0 then null else ri.note end
from m
where ri.recipe_id in (select id from target) and ri.position = m.pos;

update public.recipes r set
  steps = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
    r.steps::text,
    'pero CONSERVA LOS HUESOS DE LAS PUNTAS de las alas', 'pero conserva los huesos de las puntas de las alas'),
    'Deshuesa SOLO los contramuslos', 'Deshuesa solo los contramuslos'),
    'hueso del CONTRAMUSLO', 'hueso del contramuslo'),
    'DEJA dentro de cada', 'Deja dentro de cada'),
    'los DOS huecos', 'los dos huecos'),
    'SIN rellenar', 'sin rellenar'),
    'NO los retires', 'no los retires'),
    'la MISMA refractaria', 'la misma refractaria'),
    'como TODOS los centros', 'como todos los centros'),
    'cuidadosamente TODO el hilo', 'cuidadosamente todo el hilo'),
    'pide al carnicero que conserve la forma del ave y siga las instrucciones de los pasos 2 y 3',
    'pide al carnicero que lo deshuese como se describe en los pasos 2 y 3, conservando la forma del ave')::jsonb,
  notes = replace(replace(replace(
    r.notes,
    'RETIRADOS', 'retirados'),
    'CONSERVADOS', 'conservados'),
    'TANTO el cuerpo COMO LOS DOS CONTRAMUSLOS', 'tanto el cuerpo como los dos contramuslos')
where r.language = 'es' and r.slug = 'pollo-relleno-navideno';
