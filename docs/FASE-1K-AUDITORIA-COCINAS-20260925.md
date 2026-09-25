# FASE 1K — AUDITORÍA DE COCINAS — 20260925

## Estado
ESTUDIO ABIERTO — NO NORMALIZAR TODAVÍA

## Alcance
Auditoría del campo `recipes.cuisine` sobre las recetas ES publicadas actuales.

## Hallazgo principal

El campo `cuisine` no representa una única dimensión semántica de forma consistente.

Conviven valores que parecen pertenecer a dimensiones diferentes:
- cocinas/geografías: Cocina colombiana, Cocina andaluza, Cocina italiana casera, Cocina japonesa, Cocina mexicana, Cocina peruana, Gallega, Italiana;
- categorías/tipos de contenido: Postres, Bebidas, Carnes, Aves, Sopas, Ensaladas, Salsas, Pastas, Desayunos;
- estilos o enfoques: Internacional, Fusión, Vegetariano/Vegetariana;
- valores con diferencias ortográficas/capitalización: bebidas/Bebidas, carnes/Carnes, postres/Postres, vegetariano/Vegetariano/Vegetariana;
- errores o variantes sospechosas: Veterariana;
- inconsistencias de escritura: De Mar / De  Mar, Desayuno / Desayunos, Ensalada / Ensaladas, Pasta / Pastas, Guarnición / Guarniciones;
- recetas sin cocina: 2.

## Distribución observada

Valores con mayor volumen:
- Postres — 17
- Internacional — 11
- Bebidas — 10
- Carnes — 10
- Aves — 9
- De Mar — 9
- Ensaladas — 9
- Sopas — 8
- Salsas — 6
- Fusión — 5
- Pastas — 5

Valores menores y/o específicos:
- Desayunos — 3
- Vegetariano — 3
- bebidas — 2
- carnes — 2
- Cocina colombiana — 2
- Guarnición — 2
- Guarniciones — 2
- Vegetariana — 2
- varios valores de 1 receta.

## Conclusión

No debe aplicarse una normalización mecánica de `cuisine` basada únicamente en:
- capitalización;
- singular/plural;
- coincidencia textual;
- número de recetas.

Antes hay que separar conceptualmente:
1. cocina/geografía;
2. categoría culinaria;
3. ingrediente/protagonista;
4. dieta/enfoque;
5. tipo de plato o momento;
6. estilo culinario.

## Regla provisional

Mientras esta fase esté abierta:
- no convertir `cuisine` directamente en páginas públicas;
- no marcar automáticamente cocinas como indexables;
- no fusionar valores solo por similitud textual;
- no borrar valores históricos;
- no inventar una cocina cuando el dato no lo permite;
- conservar el valor original hasta disponer de una correspondencia aprobada.

## Propuesta de arquitectura

Crear una dimensión canónica independiente para **cocinas/geografías** únicamente cuando exista evidencia suficiente.

El campo histórico `recipes.cuisine` podrá seguir funcionando como dato editorial durante la transición.

La relación canónica debería seguir un modelo relacional explícito cuando se implemente, en lugar de depender de texto libre. Supabase/Postgres soporta relaciones mediante claves foráneas y tablas de relación, lo que permite separar la entidad canónica del valor editorial histórico. 

## Candidatos iniciales a investigar

Por ahora, solo como candidatos de estudio:
- Cocina colombiana
- Cocina andaluza
- Cocina italiana
- Cocina japonesa
- Cocina mexicana
- Cocina peruana
- Gallega

No se consideran todavía páginas indexables.

## Decisiones

- D-113 — `cuisine` histórico no se considera una taxonomía limpia.
- D-114 — No se hará normalización masiva automática.
- D-115 — Categoría, dieta, tipo de plato y cocina/geografía deben permanecer conceptualmente separados.
- D-116 — No habrá páginas públicas de cocina hasta cerrar la definición canónica.
- D-117 — El dato histórico se conserva durante la migración.
- D-118 — La futura entidad canónica de cocina deberá permitir relaciones explícitas con recetas.

## Siguiente bloque

Auditar receta por receta los valores de cocina para identificar qué registros son realmente cocina/geografía y cuáles están ocupando indebidamente el campo.
