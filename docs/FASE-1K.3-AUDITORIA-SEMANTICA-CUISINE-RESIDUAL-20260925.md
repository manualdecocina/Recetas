# FASE 1K.3 — AUDITORÍA SEMÁNTICA DE CUISINE RESIDUAL — 20260925

## Estado
AUDITADA — SIN MIGRACIÓN AUTOMÁTICA

Se revisaron los valores residuales con sus recetas ES publicadas para determinar qué dimensión expresan realmente.

## 1. Claramente NO son cocina

### Categoría / tipo de contenido
- Bebidas / bebidas → categoría Bebidas
- Postres / postres → categoría Postres
- Ensaladas / Ensalada → categoría Ensaladas
- Sopas → categoría Sopas y cremas
- Salsas → categoría Salsas y aderezos
- Pastas / Pasta → categoría de pasta o categoría culinaria correspondiente; no cocina
- Desayunos / Desayuno → categoría Desayunos y brunch
- Guarnición / Guarniciones → categoría Guarniciones

La evidencia de las recetas asociadas confirma que estos valores describen el tipo de preparación, no una tradición culinaria.

### Protagonista / familia de ingrediente
- Carnes / carnes
- Aves
- De Mar / De  Mar

Las recetas asociadas son preparaciones de carne, pollo/aves y productos del mar respectivamente. Son candidatos para una futura dimensión de ingrediente/protagonista o tipo de proteína, no para cocina geográfica.

### Dieta
- Vegetariano
- Vegetariana
- vegetariano
- Veterariana

Las recetas asociadas muestran que el dato pretende expresar orientación vegetariana. Veterariana queda marcado como error histórico a revisar, no como una cocina.

## 2. Estilo / alcance

### Internacional
11 recetas. El valor funciona como etiqueta de alcance muy general, mientras las recetas individuales incluyen preparaciones de varias tradiciones: colombiana, indonesia, francesa, árabe, japonesa, tailandesa, etc.

Destino provisional: ESTILO/ALCANCE. No crear cocina internacional.

### Fusión
5 recetas. El valor describe un enfoque de combinación/adaptación y no una cocina geográfica única.

Destino provisional: ESTILO/ALCANCE. No crear cocina fusión.

## 3. Caso especial

### Lacteos
1 receta: Cómo preparar Queso.

No hay evidencia suficiente para convertirlo en cocina. El valor parece relacionado con ingrediente/familia de producto o con el tipo de contenido.

Destino: REVIEW.

## 4. Resultado

| Valor histórico | Destino propuesto | Confianza |
|---|---|---|
| Bebidas / bebidas | Categoría | Alta |
| Postres / postres | Categoría | Alta |
| Ensaladas / Ensalada | Categoría | Alta |
| Sopas | Categoría | Alta |
| Salsas | Categoría | Alta |
| Pastas / Pasta | Categoría | Alta |
| Desayunos / Desayuno | Categoría | Alta |
| Guarnición / Guarniciones | Categoría | Alta |
| Carnes / carnes | Protagonista/proteína | Alta |
| Aves | Protagonista/proteína | Alta |
| De Mar / De  Mar | Protagonista/proteína | Alta |
| Vegetariano / variantes | Dieta/enfoque | Alta |
| Internacional | Estilo/alcance | Media-alta |
| Fusión | Estilo/alcance | Alta |
| Lacteos | Review | Baja |

## 5. No hacer todavía

No crear tablas nuevas para estilos, dietas, proteínas o tipos de plato hasta revisar cómo encajan con la arquitectura general de filtros.

La taxonomía no debe crecer por cada campo histórico.

## Decisiones
- D-129 — Los valores residuales de tipo de plato se corrigen conceptualmente hacia la taxonomía de categoría.
- D-130 — Carnes/Aves/De Mar quedan fuera de cocina y se consideran candidatos a dimensión de protagonista/proteína.
- D-131 — Las variantes vegetarianas quedan fuera de cocina y son candidatas a dieta/enfoque.
- D-132 — Internacional no se convierte en cocina.
- D-133 — Fusión no se convierte en cocina geográfica.
- D-134 — Lacteos queda en revisión.
- D-135 — No se crean nuevas taxonomías hasta cerrar su función dentro del sistema de filtros.

## Siguiente fase

Auditar la relación entre estos destinos y los campos existentes category, course, difficulty, cuisine, keywords y los datos canónicos de ingredientes, para evitar duplicar dimensiones antes de migrar nada.
