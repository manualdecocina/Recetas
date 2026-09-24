# Duplicados de recetas fuera de recipe-cards — 2026-09-24

## Resultado

Sobre las 153 URLs candidatas a receta del inventario, excluyendo `wpzoom_rcb` / `recipe-cards`, no se encontraron grupos con títulos normalizados idénticos bajo el criterio de auditoría aplicado.

Por tanto, el problema de duplicación detectado anteriormente está concentrado principalmente en el nivel técnico `recipe-cards`, no en duplicados editoriales evidentes entre las restantes URLs de receta.

## Importante

Esto no demuestra que no existan duplicados semánticos. Un duplicado semántico puede usar títulos diferentes. Antes de crear entidades nuevas se seguirá comprobando intención, contenido, fuente histórica y relaciones multilingües.

## Regla

No se crea una nueva entidad solamente por una URL distinta. La entidad se determina por intención y contenido, no por el slug.

## Siguiente control

Cruzar las recetas candidatas con los grupos históricos multilingües y con las entidades ya existentes en Supabase para evitar crear una segunda entidad para la misma receta.
