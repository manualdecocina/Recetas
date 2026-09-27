# Estándar de receta — Manual de Cocina

Reglas cerradas para publicar una receta. La referencia viva es la lechona (`/receta-de-lechona-colombiana`).
La puntuación se calcula en Supabase con la vista `public.recipe_quality` (solo lectura, service role o SQL).

```sql
select language, public_path, score_10, failures
from public.recipe_quality
where published order by score;
```

## Niveles

| Nivel | Cuándo | Puntuación mínima para publicar |
|---|---|---|
| Esencial | Recetas antiguas migradas | 6,5 / 10 |
| Completa | Recetas nuevas y las destacadas | 9,0 / 10 |

Una receta publicada en varios idiomas debe alcanzar el mismo nivel en **todos** sus idiomas.
Nunca se publica un idioma a medias: mismos bloques, mismos números, mismas fotos.

## Bloques (orden fijo)

1. Cabecera: categoría, título (H1), extracto, autor y fecha, datos (tiempo total, porciones, dificultad, cocina), acciones.
2. Foto principal.
3. Ingredientes (con casillas) y, si existe, información nutricional.
4. Preparación (pasos numerados, con foto en el nivel Completa).
5. Video (solo si es de esta misma receta).
6. Sobre esta receta (resumen, nivel Completa).
7. Notas: Consejos, Sustituciones, Conservación y Fuentes.
8. Preguntas frecuentes (nivel Completa).
9. Recetas relacionadas.

No se incluyen historia larga ni beneficios para la salud en las recetas del nivel Esencial.

## Reglas de contenido

- **Ingredientes**: cantidad + unidad + nombre; agrupados ("Para el adobo…") si hay más de 10; nada de "al gusto" sin criterio.
- **Decimales**: coma en es, de, fr, it; punto en en y ja. Sistema métrico; en inglés se añaden °F.
- **Pasos**: entre 4 y 14; título descriptivo (verbo + objeto) y detalle real con tiempos y temperaturas.
- **Seguridad alimentaria** (temperaturas, huevo crudo, conservación): siempre con fuente en Notas. Referencia por defecto: USDA FSIS.
  Carne molida 71 °C, aves 74 °C, cortes enteros de cerdo 63 °C con 3 min de reposo, rellenos que tocan carne cruda 74 °C, sobras 3–4 días y recalentar a 74 °C.
- **Tiempos**: `prep + cook <= total`; el total incluye reposos y marinados.
- **Notas** en HTML: `<h3>Consejos</h3><ul>…</ul><h3>Sustituciones</h3><ul>…</ul><h3>Conservación</h3><p>…</p><p class="md-sources">Fuentes: …</p>`.
- **Firma**: Néstor Bastidas (la biografía vive en Quiénes somos, no en la receta).

## Imágenes

- Formato WebP, 1200 × 800 px para pasos y 1440 × 960 para la portada; ≤ 150 KB cada una.
- Ruta `/recetas/<slug>/portada.webp` y `/recetas/<slug>/paso-NN.webp`.
- `image_alt` descriptivo en cada paso y en cada idioma.
- Las fotos de los pasos pueden ser ilustrativas (la página lo indica). La portada, cuando sea posible, es foto real del plato.
- Prohibido: miniaturas de WordPress (`-300x200.jpg`).

## Traducciones

- Misma estructura: mismo número de ingredientes, grupos, pasos, fotos, preguntas frecuentes.
- Los números (cantidades, minutos, temperaturas) deben coincidir con la versión en español.
- Textos de interfaz de de/it/fr/ja se revisan con hablante nativo antes de abrir el idioma.
- hreflang recíproco con URL completas; canonical propia en cada versión.

## SEO

- `seo.title` 40–65 caracteres y `seo.description` 110–165 (en japonés, escala 0,45).
- `keywords` ≥ 4, `seo.faq` ≥ 3 preguntas (sin marcado FAQPage: Google lo limita a sitios oficiales).
- JSON-LD Recipe con autor, fechas, tiempos, `recipeYield`, categorías, pasos con imagen y url, nutrición y video cuando existan.
- Ruta limpia en minúsculas, sin espacios; `published_at` obligatorio.

## Puntuación (100 puntos = 10)

| Bloque | Punto | Control |
|---|---|---|
| Datos (20) | 5 | foto original (no miniatura) |
| | 4 | tiempos coherentes |
| | 2 | porciones · 2 dificultad · 2 categoría · 1 cocina |
| | 2 + 2 | extracto 100–170 · título 30–75 |
| Ingredientes y pasos (30) | 8 + 2 | ≥ 5 ingredientes completos · agrupados si > 10 |
| | 4 + 8 | 4–14 pasos · todos con título |
| | 4 + 4 | detalle medio ≥ 60 caracteres · tiempos o temperaturas |
| Notas (15) | 9 | 3 bloques (Consejos, Sustituciones, Conservación) |
| | 3 + 3 | ≥ 300 caracteres · fuentes si hay carne o huevo |
| Enriquecimiento (15) | 4 + 4 | resumen ≥ 400 · ≥ 3 preguntas frecuentes |
| | 3 + 4 | ≥ 4 palabras clave · nutrición |
| Multimedia (10) | 6 | foto en todos los pasos |
| | 2 + 2 | video · imagen propia optimizada |
| SEO técnico (10) | 3 + 3 | título SEO · descripción SEO |
| | 2 + 2 | ruta limpia · fecha de publicación |

La puntuación mide que el formato esté completo. No mide sabor, precisión de cantidades ni calidad de la foto: eso lo valida el chef.

## Puerta de publicación

1. Puntuación ≥ mínimo del nivel.
2. Revisión del chef (cantidades y tiempos).
3. En cada idioma: revisión nativa de textos.
4. Impresión de prueba (A4) y vista en móvil a 390 px.
