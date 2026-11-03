# Correcciones de auditoría — 3 de noviembre de 2026

## Publicación funcional

PR #234, merge 61d4fac3ff3a0db46794512ca04d82f9fd2b470a.

- Cajón global de privacidad en siete idiomas; no depende de la región de Google. Aceptar, rechazar y configurar; preferencias siempre accesibles. Persistencia limitada a 180 días. El script de anuncios espera una autorización explícita y la integración CMP habilitada; retirar permiso recarga el documento. No se fabrica una cadena TCF ni se sustituye la plataforma certificada de Google.
- Favoritos guardados, recuperables y eliminables, incluidos sus equivalentes publicados en otros idiomas. La API de consulta solo lee tarjetas publicadas, valida identificadores e idioma y devuelve respuestas no almacenables.
- Alias culinarios revisados: papa genérica, tamaños/preparaciones y la alternativa de papas harinosas del puré. Las variedades concretas y los productos procesados conservan identidades distintas.
- Duraciones localizadas, con preparación, cocción y espera calculada cuando los tres datos están disponibles. No se alteraron tiempos SEO, cantidades ni instrucciones.
- Búsquedas/filtros noindex; paginación mantiene canonical propio. Sin cambios de slugs o rutas históricas.
- Cookies y publicidad descritas según la operación actual, en siete idiomas. Cifras de nutrición localizadas.

Quality, impresión y recorridos de navegador: SUCCESS. Run de recorridos 41585711226: móvil 390 px y escritorio 1366 px; rechazo, recarga, reapertura, aceptación y retirada; guardar, recargar, cambiar idioma y quitar favoritos; Papa encuentra puré; siete idiomas; sin errores de página ni desbordamiento horizontal en las pantallas examinadas. El transporte de anuncios se simuló en CI para no realizar solicitudes publicitarias de prueba.

Producción: cajón abierto desde el pie y capturado; cerveza muestra 30 d 3 h, con 30 d de espera. Las pruebas de CI no equivalen a datos de experiencia de usuarios reales.

## Portadas y protección del HTML

60 recortes de las fotografías existentes para 20 familias, revisados en 1:1, 4:3 y 16:9. Se incorporan como archivos WebP al repositorio, con manifiesto de dimensiones y SHA256. El adaptador los declara tanto en Recipe.image como en Open Graph. Las variantes editoriales explícitas tienen prioridad y el respaldo solo coincide con la URL exacta de la fotografía de origen.

El saneamiento de Notas usa un analizador HTML y una lista explícita de etiquetas, atributos y protocolos permitidos. Las pruebas cubren eventos sin comillas, SVG, iframe, script y protocolos codificados, conservando enlaces editoriales relativos. Es endurecimiento preventivo; no se afirmó una explotación en producción.

## Base de datos

Migración aplicada por Supabase `20261103054533_harden_private_editorial_search_paths`: fija search_path vacío en los 14 auxiliares privados revisados. Se conserva la firma, cuerpo y autorización de cada función. Verificados escapes, generación de párrafos y separación de frases después del cambio; asesores ya no reportan search_path mutable. No se ampliaron permisos ni políticas RLS.

Los avisos restantes de funciones administrativas reflejan RPC deliberadas con comprobación is_admin. Las tablas de respaldo con RLS sin políticas no se abrieron. Protección contra contraseñas filtradas permanece como configuración opcional de la cuenta, no como defecto de una receta pública.

## Rectificaciones y límites editoriales

La consulta precisa de pasos CON imagen pero SIN alt devuelve cero versiones. El recuento anterior de 18 grupos mezclaba pasos sin imagen con imágenes sin alternativa: era un falso positivo. Tampoco se confirmó pérdida de Notas ni diferencias de ingredientes en las dos traducciones señaladas inicialmente.

Se revisaron los archivos antiguos no referenciados: varios muestran acciones distintas al paso actual, por ejemplo horneado en un paso de mezcla. No se insertaron para reducir artificialmente el número de faltantes. La cobertura adicional de fotos en las 19 familias continúa siendo trabajo editorial, con prioridad en las fases útiles; no es un requisito de que cada microacción de precalentado o espera tenga foto. La presentación de la portada ya describe fotografías de las fases principales.

No se inventa una nota 10/10. El cierre funcional exige pruebas de comportamiento, disponibilidad y publicación. Las posiciones e indexación actuales de Google y los Core Web Vitals de campo requieren datos externos que no estaban disponibles en esta sesión.
