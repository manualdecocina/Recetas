# Relevo de recetas: lotes de 15

## Autorización y alcance
El propietario autoriza el 2026-10-08 la elaboración, imágenes, localización, PR, merge con CI verde, despliegue y publicación sin confirmaciones humanas repetidas, con relevos cada hora. Esta orden sustituye el tamaño de 10 y la asignación de merge/despliegue manual del plan v2. El proyecto es exclusivamente Manual de Cocina, repositorio manualdecocina/Recetas y preview.manualdecocina.com. No ejecutar el cambio de dominio, DNS ni retirada de noindex: el trabajo solicitado termina antes de migrar.

La tarea NO está creada ni activa. Falta la conexión de despliegue del hosting Node.js existente. Se han probado lecturas de GitHub, Supabase y Drive; no hay acción de hosting disponible. La interfaz de creación de automatizaciones tampoco expone parámetros de modelo o razonamiento. Sol 6.1 / Alto es la configuración solicitada, aún no verificada.

## Fuentes y continuidad
- Plan vigente: https://docs.google.com/document/d/1lYktUuF4y_8nqMhLBaGpOo5ueTucR66h0Z5B8CzdN9c/edit
- Cola anterior: https://docs.google.com/document/d/1_nDCKj-OIE5pIajNSx4e6LpLESMsalFg7CK9eBSfxmg/edit
- Handoff: https://docs.google.com/document/d/11Qk_yXnD5UXMrVWFmP3F0AhIOqyUvYeldkKnPulTFt4/edit
- GSC: https://docs.google.com/spreadsheets/d/1NlPii18f5lBVYu57E7bNpre7wzX57M05RSx9I05HI8g/edit
- Contrato: docs/CONTRATO-PRESERVACION-BASE-Y-CLASIFICACION-20261004.md; URL Master y decisiones posteriores; docs/FLUJO-RECETAS.md; categorías de src/lib/categories.ts.
- Estado durable: editorial/automation-progress.json; cola: editorial/automation-queue.json. Leer la versión remota más reciente. No depender de rutas scratch o archivos locales de un chat anterior.

Recuento comprobado: 109 grupos publicados 7/7 y 100 filas ES sin publicar. La cola separa 52 candidatos y 48 registros retenidos por archivo o revisión. Son candidatos para validar, no 52 publicaciones ya aprobadas. No revivir descartes, duplicados ni REVIEW para llenar un lote. Si otra receta tiene una decisión previa restrictiva, pasarla a held con evidencia antes de reservarla. No borrar registros.

## Instrucción preparada para la tarea
Continúa el cierre previo a migración de Manual de Cocina conforme a este relevo y al plan v2. Trabaja con el estado remoto, sin intervención humana rutinaria y sin desviarte a otros proyectos ni mejoras posteriores.

1. Lee main y los dos JSON de continuidad; consulta las identidades y publicaciones actuales en Supabase. Comprueba conectores necesarios antes de reservar trabajo. Si sigue faltando el despliegue, conserva estado y bloqueo exactos: no acumules un nuevo lote que no puedas publicar.
2. Reanuda primero la deuda y el lote abierto. No saltes una receta bloqueada ya reservada ni abras las próximas 15 hasta publicar y validar todo el lote. Al resolverlo, selecciona las siguientes 15 entidades elegibles en orden de la cola. El último lote puede contener menos si ya no quedan entidades elegibles; no inventes recetas para completarlo.
3. Valida URL Master, equivalencia y ausencia de duplicados antes de escribir. Aprovecha borradores NUEVOS existentes. No leas ni copies cuerpos, traducciones o imágenes WordPress como fuente editorial. Conserva id, recipe_group_id, slug, public_path, source_url y fechas históricas según contrato. Comprueba todas las colisiones, incluidas content_pages.
4. Cierra ES con todos los campos del plan: ingredientes agrupados, pasos concretos y cocinables, tiempos, porciones, notas, seguridad, 3 FAQ, SEO y nutrición por ración trazable con fichas USDA verificadas. Marca las cifras propuestas por IA como estimadas y pendientes de confirmación, sin fingir prueba de cocina ni confirmación humana. Usa únicamente categorías canónicas.
5. Congela ES y hash de sus pasos. Escribe ficha y brief de imágenes. Genera imágenes nuevas con ImageGen conforme al paso exacto y al método del lote 01. Verifica visualmente portada, pasos y coherencia de ingredientes/utensilios/estado. Conserva originales y WEBP persistentes, variantes de portada 1x1/4x3/16x9 y SHA-256. No regeneres imágenes correctas al relevar ni uses rutas inexistentes o fotos de otra receta.
6. Localiza DE, EN, FR, IT, JA y PT-BR: mismos datos numéricos y medios, SEO/FAQ/alt propios. Respeta rutas históricas aprobadas y define nuevas solo donde falten, sin colisiones. /pt usa hreflang pt-BR, sin x-default en recetas.
7. Guarda paquete editorial completo, fichas, medios y SQL en el repositorio. SQL transaccional: verifica estado inicial, actualiza ES por id, inserta seis traducciones con UUID determinista, comprueba 7/7 y aborta ante estado divergente. Si ya se ejecutó, verificar evidencia en lugar de insertar otra vez. No reemplazar grupos publicados ajenos al lote.
8. PR desde main actualizado con contenido, imágenes y auditoría ajustada al recuento real. Ejecuta las validaciones pertinentes, typecheck, lógica y build; corrige fallos. Merge solo con CI verde y SHA esperado. Despliega mediante la conexión del hosting existente; no usar AI Builder, cambiar de proveedor ni crear servicios con coste.
9. Comprueba despliegue real: cada medio HTTP 200 y hash exacto. Entonces ejecuta el SQL de publicación. Revalida con el mecanismo autenticado disponible; si el secreto no está accesible, conserva la deuda y espera/reintenta el TTL mediante el siguiente relevo, sin eludir la autenticación.
10. Gate final: las 7 URLs de cada grupo responden 200; datos visibles, Recipe y BreadcrumbList, canonical exacta, hreflang recíproco, selector, imágenes y QA visual correctos; catálogo/home/sitemap muestran los cambios y mantienen noindex. Una auditoría global por lote, con EXPECTED_ES_RECIPES obtenido de la base. Corrige y verifica; published=true o un despliegue verde no equivalen a lote terminado.
11. Solo al superar todo lo anterior marca las 15 como publicadas/verificadas, registra evidencias y abre otro lote. Continúa hasta terminar las entidades elegibles y el cierre técnico previo a migración: enlaces de ingredientes del plan, variantes antiguas pendientes, mapa histórico 200/redirect aprobado, sitemap/SEO y preparación de respaldo/reversión. No activar el dominio principal ni modificar restricciones de Search Console.
12. Al completar el alcance, registra informe breve y desactiva la propia tarea por su id. Si falta una decisión de propietario previamente reservada (por ejemplo REVIEW), contabilízala como retenida y no la conviertas en autorización automática.

## Checkpoint por receta y relevo
Guardar inmediatamente en GitHub, antes de agotar contexto, la rama/commit/PR y el lote reservado; por receta: etapa, hash ES, archivos y hashes de medios, localizaciones completas, SQL/hash, merge, deploy, resultado DB, QA, error exacto y siguiente acción. Etapas: identidad → ES → imágenes → localización → PR/CI → merge → deploy → DB → cache/QA → cerrada.

Cada relevo retoma la primera etapa pendiente utilizando los archivos remotos correctos. Un fallo no consume el puesto ni reinicia las recetas terminadas. Conservar deudas por código y evidencia; reintentar únicamente el paso fallido. No afirmar 15 publicadas si alguna sigue pendiente.

Evitar ejecuciones superpuestas: adquirir una reserva identificada en el estado mediante commit/ref con SHA esperado antes de mutar. Si hay otra ejecución viva, no empezar otra tanda. Si la reserva queda huérfana, inspeccionar PR/deploy/DB y renovar con SHA esperado antes de recuperar, sin duplicar publicaciones. Guardar estado y liberar al terminar el relevo.

## Activación pendiente
Antes de crear la tarea, realizar una lectura inocua exitosa del hosting real, además de los conectores necesarios, y verificar que puede desplegar. Crear una única tarea con RRULE:FREQ=HOURLY y registrar su id. Verificar Sol 6.1 / Alto en la configuración guardada de la tarea; escribirlo en el prompt no cambia el modelo. La cadencia es un relevo cada hora, no una garantía de terminar 15 recetas en sesenta minutos. No crear una automatización dependiente de una conexión que todavía falta.
