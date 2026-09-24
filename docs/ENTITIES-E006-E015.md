# E006–E015 — consolidación de control

Fecha: 2026-09-24
Estado: CONTROL / sin cambios de producción

## E006 — Porra Antequerana

Histórico:
- FR /fr/recette-porra-antequerana/ — 130 clics
- IT /it/porra-antequerana-ricetta/ — 59 clics
- relaciones históricas adicionales DE/JA/EN documentadas en TranslatePress.

Estado actual:
No hay una Recipe/ContentPage actual equivalente por los slugs históricos auditados.

Decisión:
Una sola entidad E006. Las URLs FR/IT pasan a KEEP candidates. Las demás relaciones no generan páginas hasta que exista decisión editorial y contenido localizado nuevo.

---

## E007 — Pandebono casero

Histórico:
- JA /ja/パンデボノ自家製/ — 109 clics.

Estado actual:
Recipe ES `/pandebono-casero/` existe en Supabase y tiene source_url histórico.

Decisión:
Una sola entidad E007. URL ES existente + URL JA histórica como candidata de localización.

---

## E008 — Pan Matzá casero

Histórico:
- JA /ja/マッツォパンのレシピ/ — 74 clics
- DE /de/matza-brot-rezept/ — 64 clics

Estado actual:
Recipe ES `/receta-de-pan-matza/` existe en Supabase con source_url histórico.

Decisión:
Una sola entidad E008. No crear duplicados ES.

---

## E009 — Pie de limón

Histórico:
- JA /ja/レモンパイのレシピ/ — 70 clics.

Estado actual:
La entidad ES existe como Recipe `/receta-pie-de-limon/`.

Decisión:
Una sola entidad E009. JA es KEEP candidate.

---

## E010 — Batido Grimace

Histórico:
- FR /fr/milkshake-grimace-mcdonalds/ — 69 clics
- DE /de/milchshake-grimaze-mcdonalds/ — 63 clics

Estado actual:
Existe Recipe ES `/batido-grimace-mcdonalds/`.

Decisión:
REVIEW antes de fijar publicación multilingüe. La existencia de tráfico histórico no obliga a conservar la entidad. Si se conserva, se reconstruye como receta/editorial válida sin copiar automáticamente el contenido histórico.

---

## E011 — Horchata casera

Histórico:
- JA /ja/オルチャータのレシピ/ — 69 clics
- TranslatePress documenta DE/IT/FR/EN históricamente.

Estado actual:
No se localizó una Recipe/ContentPage actual por los slugs auditados.

Decisión:
Una sola entidad E011. JA KEEP candidate. Otras traducciones solo si se decide publicarlas.

---

## E012 — Pollo Alfredo a la Florentina

Histórico:
- JA /ja/フィレンツェ風チキンアルフレッド/ — 67 clics.

Estado actual:
ContentPage ES `/pollo-alfredo-a-la-florentina/` existe en Supabase.

Decisión:
Modelar como Recipe si el contenido nuevo confirma que es una receta. No mantener una ContentPage genérica paralela.

---

## E013 — Pulpo a la Gallega

Histórico:
- DE /de/oktopus-rezept-nach-galizischer-art/ — 66 clics, posición histórica ~28.

Estado actual:
No hay entidad actual localizada por slug equivalente en el cruce realizado.

Decisión:
KEEP candidate, con revisión editorial antes de publicar.

---

## E014 — Ajiaco colombiano

Histórico:
- IT /it/ajiaco-ricetta/ — 60 clics.

Estado actual:
Recipe ES `/receta-de-ajiaco/` existe en Supabase y tiene source_url histórico.

Decisión:
Una sola entidad E014. IT KEEP candidate.

---

## E015 — Empanada peruana de pollo

Histórico:
- IT /it/empanada-pollo-peruviana/ — 52 clics
- ES /empanada-peruana-de-pollo/ — 66 clics.

Estado actual:
Hay ContentPage ES histórica y Recipe ES NEW_SEED con el mismo slug.

Decisión:
Consolidar en una sola entidad E015. El modelo final debe ser Recipe ES + Recipe IT cuando la traducción nueva esté lista. No publicar simultáneamente ContentPage y Recipe con la misma intención.

---

## Regla común E006–E015

1. Una entidad culinaria = un grupo.
2. Las URLs históricas de alto valor son candidatas a conservar.
3. No se crean traducciones hasta que exista contenido localizado completo.
4. No se crean redirects nuevos mientras el routing histórico no esté resuelto.
5. Las ContentPage que representan recetas deben migrar al modelo Recipe cuando corresponda.
6. REVIEW no significa borrar; significa decidir antes de publicar.

## Próximo paso

Cerrar la segunda tanda de entidades españolas P1/P2 que ya tienen Recipe/ContentPage en Supabase y clasificar qué contenido nuevo es realmente válido para el catálogo final.
