# QA — CONSOLIDACIÓN CONTENTPAGE → RECIPE — 2026-09-25

## Bloque

Se revisaron conjuntamente los 5 pares staged restantes:

1. `bowl-de-carne-con-miel-picante-y-queso-cottage`
2. `receta-de-pan-de-platano-clasico`
3. `receta-facil-de-pasta-al-pesto-casera`
4. `souffle-de-queso` → Recipe `receta-de-souffle-de-queso-esponjoso`
5. `vasitos-de-mousse-de-aguacate-y-cacao`

## Resultado

Los 5 tienen representación Recipe staged y ContentPage staged. Ninguno está publicado actualmente.

Los cuatro primeros comparten exactamente la URL pública entre Recipe y ContentPage. El quinto mantiene la ruta Recipe `/es/receta/vasitos-de-mousse-de-aguacate-y-cacao` frente a la ContentPage `/vasitos-de-mousse-de-aguacate-y-cacao`; por tanto no se debe retirar ni redirigir automáticamente hasta cerrar la decisión de URL pública.

El caso Soufflé queda explícitamente consolidado a nivel editorial: la Recipe `receta-de-souffle-de-queso-esponjoso` ya tiene `public_path=/souffle-de-queso`, por lo que no se crea una segunda URL.

## Acción ejecutada

**No se publicaron ni retiraron registros en este bloque.**

Motivo: el contrato vigente exige publicar primero la Recipe, verificar routing/SEO/despliegue y solo después retirar la ContentPage equivalente. Las cinco entidades permanecen staged hasta superar ese gate.

## Verificación

Consulta directa a Supabase confirmó para los pares con URL idéntica:
- Recipe: `published=false`
- ContentPage: `published=false`

No existe por tanto un conflicto de dos páginas publicadas en estas URLs.

## Próximo gate

El bloque queda **CONSOLIDATION READY / PUBLICATION GATE PENDING**.

Para cerrar la consolidación habrá que ejecutar, en lote:
1. publicación de las Recipes aprobadas;
2. verificación de respuesta/canonical/schema/sitemap;
3. retirada de las ContentPages equivalentes;
4. resolución específica de la URL de mousse antes de cualquier retiro.
