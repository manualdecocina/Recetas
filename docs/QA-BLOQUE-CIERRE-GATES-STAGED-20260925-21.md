# QA — Bloque cierre de gates STAGED — 2026-09-25

## Alcance
Bloque 21: primeras 30 entidades de la cola Recipe STAGED/UNPUBLISHED.

## Acciones ejecutadas
- Verificación de Recipe/ContentPage por slug y lenguaje.
- Verificación de contenido, imagen, ingredientes y pasos.
- Revisión de metadatos temporales abiertos para detectar evidencia explícita en los pasos.
- Actualización de cook_time_minutes únicamente donde la evidencia estructurada permite usar el extremo superior de un rango o la suma explícita por lado:
  - receta-de-souffle-de-queso-esponjoso → 25 min.
  - empanadas-argentinas → 25 min.
  - lasana-de-sarten → 45 min.
  - hamburguesas-caseras → 10 min (4–5 min por lado).
- Verificación posterior de los cuatro valores.

## Bloqueos mantenidos
- la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto: sin imagen válida y con bloqueo editorial/origen; no se inventaron entidad, imagen ni metadatos.
- irresistible-salmon-en-air-fryer-con-costra-de-hierbas-y-limon: sin imagen propia/evidencia válida en el proyecto; no se incorporó una imagen externa como sustituto.
- Los demás campos de tiempo/porciones permanecen nulos cuando la evidencia disponible no permite cerrarlos sin inventar.

## Estado
STAGED / UNPUBLISHED. No se publicó ninguna receta ni se retiró ninguna ContentPage en este bloque.
