# Reconciliación integral de categorías — 2026-10-05

Alcance: preview.manualdecocina.com y manualdecocina/Recetas. No se publica ninguna receta nueva. El catálogo inicial/final de esta corrección es de 43 recetas ES / 301 versiones publicadas, 43 grupos, siete idiomas.

## Taxonomía pública

Once categorías cerradas, derivadas de una sola fuente en src/lib/categories.ts. Las diez categorías aprobadas previamente se conservan; Pastas se incorpora por instrucción explícita del usuario.

| Nombre ES | Slug | Recetas ES |
| --- | --- | --- |
| Platos principales | platos-principales | 19 |
| Pastas | pastas | 2 |
| Entrantes y aperitivos | entrantes-y-aperitivos | 2 |
| Sopas y cremas | sopas-y-cremas | 3 |
| Ensaladas | ensaladas | 2 |
| Guarniciones | guarniciones | 1 |
| Salsas y aderezos | salsas-y-aderezos | 1 |
| Panes y masas | panes-y-masas | 4 |
| Postres | postres | 3 |
| Desayunos y brunch | desayunos-y-brunch | 1 |
| Bebidas | bebidas | 5 |

## Evidencia editorial y decisiones

- Lentejas: el snapshot anterior en editorial/espagueti-lentejas-20261005.json contiene Sopas y cremas; se restaura esa categoría en sus traducciones. No existe categoría independiente Sopas.
- Espagueti y Canelones: conservan Pastas; se integra en navegación, índices, filtros, conteos y etiquetas de los siete idiomas.
- Tostadas: Desayunos y brunch estaba previsto en la taxonomía V1, en FASE-1G y en el snapshot anterior de editorial/cinco-recetas-20261005.json. Se restaura el nombre completo, no se crea una categoría paralela Desayunos.
- Lumpias: el snapshot anterior de editorial/cinco-recetas-20261005.json especifica Entrantes y aperitivos. Se conserva esa clasificación documentada y se corrige la abreviación Entrantes y sus traducciones. No se reasigna por inferencia.
- Las otras 39 recetas ES conservan su clasificación. La revisión de las 43 recetas y sus siete versiones comprueba pertenencia a un único slug coherente por grupo; los nombres traducidos se normalizan sin cambiar de tipo de plato.

## Integridad y prevención

29 etiquetas abreviadas/variantes se normalizan en registros publicados. No se cambia published, published_at, ready_at, URL, grupo, texto editorial, imágenes ni ingredientes. El snapshot público antes del cambio y el detalle de las 29 correcciones están en CATEGORIAS-RECONCILIACION-20261005-BEFORE.json.

El índice y la home muestran todas las categorías previstas, incluso cuando estén vacías. Las tarjetas usan nombres exactos de la fuente canónica y enlazan a su categoría. Una categoría de filtro desconocida devuelve 404; antes ignoraba el filtro y mostraba todo el catálogo.

El panel usa un selector cerrado en el idioma de cada receta, con validación del servidor. Un CHECK en recipes bloquea toda publicación con categoría desconocida, vacía o de otro idioma, incluidas RPC y SQL directo. La publicación no crea categorías: la lista no se obtiene de DISTINCT category.

Se conservaron los 166 borradores sin publicarlos. Sus etiquetas históricas pendientes no son categorías públicas; deberán reconciliarse antes de publicar y el CHECK impide saltarse ese requisito. La excepción histórica Cómo preparar Queso conserva su decisión editorial pendiente; no se fuerza ninguna nueva clasificación.

## Validación

- TypeScript y build de producción: PASS.
- Pruebas de lógica existentes y nueva suite de taxonomía/validación: PASS.
- Prueba real en base de datos de rechazos de categoría desconocida, nula y de otro idioma: PASS; las escrituras fallidas se revierten por subtransacción.
- Total publicado después de la migración: 301.
- Advisories: ningún nuevo aviso de esquema/RLS. Advertencia previa de protección de contraseñas filtradas sin cambios, fuera de este alcance.
- Verificación HTTP integral sobre preview: pendiente de despliegue; no se declara el cierre hasta completar esta comprobación.
