# Impresión editorial y base del recetario

4 de noviembre de 2026. Plantilla `recipe-v1`.

## Contrato

La impresión conserva una ficha de receta: marca, portada, título, descripción,
autor, tiempos (incluido reposo), raciones, ingredientes, preparación completa,
notas y nutrición con su fuente. No imprime la página web completa.

Quedan fuera publicidad y sus contenedores, menús, botones, casillas,
valoraciones, consentimiento, recomendaciones, vídeos, FAQ, llamadas a otras
herramientas y descripciones repetidas. Las fotos de cada paso se omiten; se
conserva una portada para identificar la receta sin multiplicar las páginas.

No se cambian recetas, URLs, schema, indexación ni configuración publicitaria.

## Fuente única y ciclo de impresión

- `src/lib/recipe-print.ts` separa el modelo `PrintableRecipe`, la lectura de la
  receta visible y el generador `renderPrintableRecipe`.
- La proyección selecciona solo campos conocidos, elimina contenido ajeno y
  escapa todo texto. No clona HTML activo ni publicidad de terceros.
- Los ingredientes, pasos y raciones proceden de lo que se muestra en pantalla.
  Al integrar controles de cantidades, conservar esos selectores y comprobar
  que la impresión refleja el estado elegido.
- Las notas admiten texto plano y bloques editoriales. Las filas de tablas se
  convierten en líneas de texto conservando sus valores.
- `SharePrintActions` prepara una hoja fuera del árbol de pantalla y espera la
  portada y el logotipo antes de abrir el diálogo. `beforeprint` permite usar
  también el comando del navegador; `afterprint` retira la hoja y restaura los
  controles. Desmontar el componente también limpia la hoja.
- Una CMP puede marcar el sitio como `aria-hidden` mientras muestra un diálogo.
  Esa marca externa no elimina el contenido de la receta que se quiere imprimir.
- `src/app/recipe-print.css` deja únicamente la hoja en el flujo impreso. Así
  tampoco ocupan espacio los contenedores publicitarios desconocidos añadidos
  después de cargar la página.

## Maquetación

A4, márgenes de 12/14 mm, cuerpo de 10 puntos, colores de la marca y fondo blanco
incluso desde el tema oscuro. Los ingredientes se distribuyen en dos columnas;
los pasos siguen una columna continua. Las notas pueden pasar a otra página.
No se fuerzan alturas de pantalla ni bloques grandes indivisibles para llenar
una página. Las recetas largas ocupan las páginas necesarias sin cortar texto.

El crédito impreso utiliza un enlace corto a `manualdecocina.com`; no expande
URLs históricas o codificadas en japonés en largas tiras de texto.

Al guardar como PDF en el navegador, usar A4 y escala 100 %, desactivar sus
**Encabezados y pies de página** y activar los gráficos de fondo si se quieren
conservar los fondos suaves. La web no puede cambiar las preferencias de
impresión del usuario. Los PDF de QA se exportan con esos encabezados automáticos
desactivados. Referencia: https://developer.chrome.com/blog/print-margins.

## Verificación reproducible

1. `npm run typecheck` y `npm run test:logic`.
2. `npm run build`, arrancar el servidor y ejecutar
   `node tests/e2e/recipe-print.cjs` con Playwright y Chromium disponibles.
3. Antes de la prueba aislada, `python3 scripts/prepare-print-qa-assets.py`
   obtiene las tres portadas publicadas, sin crear ni publicar imágenes. El
   navegador de pruebas recibe esos mismos bytes a través de sus peticiones
   de imagen. El medio editorial no forma parte del checkout de Git.
4. El entorno de QA necesita Poppler y una fuente japonesa (por ejemplo
   `fonts-noto-cjk`). Esto pertenece al exportador de pruebas y no añade una
   descarga de fuentes a la web.
5. Revisar `recipe-print-qa/report.json` y renderizar los PDF con Poppler para
   comprobar portada, legibilidad, saltos, espaciado y ausencia de contenido ajeno.

La prueba cubre las siete versiones del tiramisú, guacamole y tamal tolimense;
inyecta publicidad dentro y fuera del artículo, incluido un contenedor de nombre
desconocido y anuncios dentro de las notas. Compara ingredientes, pasos y notas
completos con el texto del PDF. Comprueba portada, tema oscuro, ausencia de páginas
vacías, restauración de la vista y la impresión directa del navegador.

La comprobación anterior `scripts/test-print-no-ads.sh` se conserva como prueba
del CSS de respaldo. La batería de PDFs reales está en el flujo
`.github/workflows/audit-repairs-20261103.yml` y conserva los PDF como artefactos.

## Futuro libro de 200 recetas

Reutilizar `PrintableRecipe`, `renderPrintableRecipe` y los estilos con un
adaptador desde los datos editoriales, manteniendo los mismos formateadores
localizados. Crear una composición del libro con paginación continua, índice,
orden editorial y tamaño final definidos. No depender exclusivamente de unir
PDFs individuales con numeraciones ya reiniciadas.

Esta entrega prepara la ficha uniforme; no declara terminados la selección,
maquetación final, cubierta, índice ni archivos de imprenta del futuro libro.

Bitácora de análisis, cambios y cierre:
https://docs.google.com/document/d/1cuqzhK-rwH9Ux35b9AUEpxhRYAlf9R9avs1V8HZWXnc/edit?usp=drivesdk
