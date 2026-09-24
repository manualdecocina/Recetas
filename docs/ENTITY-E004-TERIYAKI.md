# E004 — Pollo teriyaki con verduras al wok — consolidación de control

Fecha: 2026-09-24
Estado: CONTROL / sin cambios de producción

## Evidencia histórica

- IT /it/teriyaki-ricetta-pollo/ — 219 clics
- ES /receta-de-pollo-teriyaki/ — 34 clics

## Estado actual Supabase

Existe Recipe ES:
- slug: `receta-de-pollo-teriyaki`
- title: Receta de Pollo Teriyaki con Verduras al Wok
- source_url: `https://manualdecocina.com/receta-de-pollo-teriyaki/`
- recipe_group_id: `6ccc032c-74f2-456f-98a6-4890e3afeaec`

No se encontró redirect actual para la URL IT histórica.

## Decisión

Una sola entidad editorial: **E004**.

ES se mantiene como candidata principal y la URL IT histórica pasa a KEEP candidate de alto valor.

## Supabase objetivo

- Recipe ES existente;
- nueva Recipe IT solo cuando se publique contenido localizado;
- mismo `recipe_group_id`;
- source_url documentado;
- canonical self + hreflang cuando ambas estén publicadas.

## Gate

No crear la traducción IT ni tocar redirects hasta el cierre del URL Master y del routing.
