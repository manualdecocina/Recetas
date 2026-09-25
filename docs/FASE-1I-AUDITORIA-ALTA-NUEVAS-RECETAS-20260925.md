# AUDITORÍA — Preparación del sistema para nuevas recetas

**Fecha:** 2026-09-25  
**Estado:** diagnóstico operativo

## Objetivo

Comprobar qué campos del catálogo actual pueden utilizarse como controles obligatorios o condicionales al publicar recetas nuevas, sin confundir deuda histórica con requisitos futuros.

## Estado actual de 134 recetas ES publicadas

| Campo | Falta |
|---|---:|
| título | 0 |
| slug | 0 |
| excerpt | 0 |
| imagen principal | 0 |
| categoría | 1 |
| dificultad | 3 |
| cocina | 2 |
| curso | 125 |
| tiempo total | 110 |
| raciones | 110 |

## Interpretación

La ausencia de curso, tiempos y raciones es deuda del catálogo existente. **No significa que debamos copiar esa incompletitud a las recetas nuevas.**

A partir de esta fecha, la regla de alta debe distinguir:

- **obligatorio:** identidad, contenido, imagen principal y estructura mínima de la receta;
- **obligatorio cuando la fuente/receta lo proporciona:** tiempos, raciones, dificultad, cocina, curso y otros metadatos;
- **pendiente de normalización:** ingredientes o valores que no puedan resolverse con seguridad;
- **no inventar:** cualquier dato que no esté respaldado.

## Decisión operativa

Las recetas históricas se corregirán mediante auditorías específicas y no mediante la relajación de los controles de las recetas nuevas.

La publicación diaria utilizará la checklist de REGLA-OPERATIVA-NUEVAS-RECETAS-20260925.md.

## Próximo bloque

Antes de seguir con interfaces de ingredientes, revisar el **modelo de alta de receta** y determinar si faltan campos estructurales para que la publicación futura sea realmente completa: autoría, fuente, estado editorial, revisión, metadatos de preparación y control de calidad.

**D-068:** la deuda histórica no rebaja el estándar de las recetas nuevas.