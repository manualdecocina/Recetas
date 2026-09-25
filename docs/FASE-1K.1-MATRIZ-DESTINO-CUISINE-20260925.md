# FASE 1K.1 — MATRIZ DE DESTINO DE CUISINE — 20260925

## Estado
PROPUESTA DE MIGRACIÓN — NO APLICAR TODAVÍA

## Principio
`recipes.cuisine` histórico mezcla dimensiones. No se debe convertir cada valor textual en una entidad de cocina.

## Destinos

### A. Cocina / geografía — candidato válido
Valores que expresan una tradición o procedencia culinaria identificable:
- Cocina andaluza
- Cocina colombiana
- Cocina italiana casera
- Cocina japonesa
- Cocina mexicana
- Cocina peruana
- Gallega
- Italiana

Estos son candidatos para una futura entidad canónica `cuisines`.

### B. Categoría / tipo de plato
Valores observados:
- Postres
- Bebidas
- Carnes
- Aves
- De Mar
- Ensaladas
- Sopas
- Salsas
- Pastas
- Desayunos
- Guarnición
- Guarniciones

No deben convertirse en cocinas.

La categoría canónica existente ya cubre gran parte de esta dimensión.

### C. Dieta / enfoque
Valores observados:
- Vegetariano
- Vegetariana
- vegetariano
- Veterariana

No deben convertirse en cocinas.

Antes de normalizarlos hay que revisar receta por receta qué significa realmente el dato.

### D. Estilo / alcance
Valores observados:
- Internacional
- Fusión

No deben convertirse automáticamente en cocinas geográficas. Requieren una dimensión futura de estilo/alcance o permanecer como dato editorial si no aporta suficiente valor.

### E. Variantes textuales
- bebidas / Bebidas
- carnes / Carnes
- postres / Postres
- De Mar / De  Mar
- Desayuno / Desayunos
- Ensalada / Ensaladas
- Pasta / Pastas

No se deben fusionar automáticamente dentro de `cuisine`. Primero se asigna su dimensión semántica correcta.

### F. Casos específicos de cocina
Los valores de cocina/geografía con una o pocas recetas no se eliminan. Pueden formar parte de la futura entidad canónica aunque todavía no sean páginas indexables.

## Arquitectura propuesta

No modificar todavía `recipes.cuisine`.

Cuando la matriz sea aprobada:
1. crear entidad canónica `cuisines`;
2. crear relación receta/cocina;
3. mapear solo correspondencias inequívocas;
4. conservar `recipes.cuisine` durante la transición;
5. usar la relación canónica para filtros y páginas públicas;
6. decidir indexabilidad independientemente del número de recetas.

Supabase/Postgres permite expresar estas relaciones mediante claves foráneas y tablas de relación, y Supabase puede consultar relaciones declaradas de forma anidada. citeturn0search0turn0search1

## Decisiones

- D-119 — Los valores de categoría no se convierten en cocinas.
- D-120 — Los valores de dieta no se convierten en cocinas.
- D-121 — Internacional/Fusión quedan fuera de cocina geográfica hasta definir dimensión de estilo.
- D-122 — Las variantes ortográficas no se fusionan sin asignación semántica.
- D-123 — La entidad canónica de cocina será independiente del texto histórico.
- D-124 — La indexabilidad de una cocina será una decisión posterior e independiente.

## Siguiente paso

Crear la entidad canónica solo después de cerrar el conjunto inicial de correspondencias inequívocas. No ejecutar aún migración masiva sobre `recipes.cuisine`.
