# Publicación de cinco recetas — tendencias 2026

Se publicaron cinco grupos nuevos en los siete idiomas: 35 páginas. La auditoría de producción terminó correctamente en la ejecución [40065414430](https://github.com/manualdecocina/Recetas/actions/runs/40065414430): 35 páginas, 60 WebP con SHA256 exacto, canonical autorreferente, hreflang recíproco, ocho pasos, FAQ, nutrición estimada, Recipe JSON-LD, portada, catálogo y sitemap. Los 105 enlaces contextuales apuntan a 84 destinos únicos, todos HTTP 200 y sin redirección inesperada.

La ejecución de calidad [40065414402](https://github.com/manualdecocina/Recetas/actions/runs/40065414402) también pasó: typecheck, pruebas de lógica, prueba de componentes y build. Los cinco optimizadores de portada devolvieron HTTP 200 en la comprobación local previa.

Las recomendaciones contextuales se incluyen en el bloque de notas que la plantilla existente muestra. Los ingredientes, pasos, cantidades y tiempos se mantienen idénticos entre idiomas. No se cambió código de la aplicación ni el esquema de datos.

Medios: 40 fotografías originales seleccionadas, portada igual al paso 8, 60 WebP públicos en el bucket existente `recetas`, con copia de los WebP en Git. El importador de este lote quedó sellado con HTTP 410 y JWT activo. Los cinco ZIP guardados incluyen los originales, los WebP, los textos completos en siete idiomas y los prompts. El informe de selección se entregó como archivo independiente.

Semrush devolvió `no_api_units`; no se obtuvieron ni inventaron métricas. GSC Wizard devolvió `payment_required`. La selección se basa en la revisión de las 221 entidades anteriores y evidencia pública, con las limitaciones descritas en `docs/ANALISIS-TENDENCIAS-20261023.md`. No se compró nada.

PR de contenido: [#182](https://github.com/manualdecocina/Recetas/pull/182). Fuente de medios fijada: `6521aae410a1b15a2b651fd1341184c71410e95e`. Fuente final auditada: `1ec1e5bb543559bbbf062929bfdc9d1648933c9f`. Las recetas fueron revisadas editorialmente; no se afirma una prueba física en cocina.
