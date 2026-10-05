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

Se detectaron 43 versiones publicadas sin correspondencia con la taxonomía previa: 29 etiquetas abreviadas/variantes y 14 versiones de las dos recetas de Pastas. Las 29 etiquetas se normalizan; las 14 versiones de Pastas quedan integradas al incorporar explícitamente esa categoría. No se cambia published, published_at, ready_at, URL, grupo, texto editorial, imágenes ni ingredientes. El snapshot público antes del cambio y el detalle de las 29 correcciones están en CATEGORIAS-RECONCILIACION-20261005-BEFORE.json.

El índice y la home muestran todas las categorías previstas, incluso cuando estén vacías. Las tarjetas usan nombres exactos de la fuente canónica y enlazan a su categoría. Una categoría de filtro desconocida devuelve 404; antes ignoraba el filtro y mostraba todo el catálogo.

El panel usa un selector cerrado en el idioma de cada receta, con validación del servidor. Un CHECK en recipes bloquea toda publicación con categoría desconocida, vacía o de otro idioma, incluidas RPC y SQL directo. La publicación no crea categorías: la lista no se obtiene de DISTINCT category.

Se conservaron los 166 borradores sin publicarlos. Sus etiquetas históricas pendientes no son categorías públicas; deberán reconciliarse antes de publicar y el CHECK impide saltarse ese requisito. La excepción histórica Cómo preparar Queso conserva su decisión editorial pendiente; no se fuerza ninguna nueva clasificación.

## Validación

- TypeScript y build de producción: PASS.
- Pruebas de lógica existentes y nueva suite de taxonomía/validación: PASS.
- Prueba real en base de datos de rechazos de categoría desconocida, nula y de otro idioma: PASS; las escrituras fallidas se revierten por subtransacción.
- Total publicado después de la migración: 301.
- Advisories: ningún nuevo aviso de esquema/RLS. Advertencia previa de protección de contraseñas filtradas sin cambios, fuera de este alcance.
- Verificación HTTP integral sobre preview: PASS — 490/490 comprobaciones, cero errores. Se recorrieron las 301 páginas de recetas, 77 páginas de categoría, 77 filtros, siete homes, siete índices de categoría, catorce páginas de catálogo y siete pruebas de filtro inválido.
- Las 301 fichas coinciden con su categoría/breadcrumb y Recipe JSON-LD; todas las tarjetas, incluidas relacionadas, muestran y enlazan el nombre canónico.
- Los listados contienen exactamente las 43 recetas por idioma, sin duplicados ni omisiones. Las 77 categorías y sus 77 filtros contienen exactamente las recetas correspondientes, con conteos reales.
- Pastas y Desayunos y brunch aparecen en índices/home en los siete idiomas. Lentejas, Espagueti, Canelones, Tostadas y Lumpias verificadas específicamente.
- CI de la implementación 5cfb0baea4c62546b4c24dc83a15f80e102efb00: quality PASS (typecheck, tests y build); implementación inicial 82df2c3: quality y lighthouse PASS.
- Base de datos final: 301 versiones publicadas, 166 borradores, cero altas o bajas de publicación. La corrección no ejecuta el siguiente lote de recetas.
- Evidencia por ruta: CATEGORIAS-RECONCILIACION-20261005-HTTP-QA.json.

Estado: COMPLETADO Y VERIFICADO EN PREVIEW.
