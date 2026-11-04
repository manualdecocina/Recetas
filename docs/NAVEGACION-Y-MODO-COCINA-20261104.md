# Navegación y modo cocina — 4 de noviembre de 2026

## Problemas reproducidos

- Cambiar de paso sustituía el texto pero conservaba el desplazamiento del paso anterior. El lector podía quedar mirando los temporizadores sin ver el nuevo título ni las instrucciones.
- Cada temporizador iniciado seguía ocupando un bloque completo al pasar a otro paso. Un temporizador manual sin configurar mostraba 0:00 junto al temporizador que seguía contando.
- El ajuste previo de desplazamiento suave no forzaba el inicio en cambios de página del catálogo: la ruta es la misma y solo cambia `?page=`. Abrir otra ruta tampoco garantizaba volver al principio.

## Corrección

- El modo cocina tiene cabecera y controles inferiores fuera de la zona desplazable. Solo se desplazan las instrucciones y herramientas del paso.
- Abrir el modo, avanzar, retroceder o seleccionar el temporizador de otro paso vuelve al inicio del contenido y enfoca su título sin desplazar el documento de fondo.
- El temporizador manual se presenta plegado y no muestra una cuenta 0:00 sin configurar. El paso actual tiene los controles completos; los temporizadores iniciados de otros pasos se convierten en indicadores compactos que permiten volver a su paso. Se conservan claves, duración y vencimiento guardados; los avisos de finalización siguen disponibles.
- Un componente de navegación común observa tanto la ruta como los parámetros de consulta. Restablece el desplazamiento en el cambio y en el siguiente fotograma, después del manejo de Next. La restauración de historial es manual para empezar también arriba al volver a otra página. Los enlaces con fragmentos conservan su destino.
- El componente de navegación está dentro de Suspense para mantener el contenido prerenderizado. No cambia URLs, indexación, datos de recetas ni cantidades.

## Validación

- TypeScript y lógica existente de herramientas de cocina.
- Navegador con los componentes reales: pasos largos, desplazamiento desde abajo, controles dentro del viewport, temporizador manual plegado, temporizador anterior compacto, vencimiento y restablecimiento.
- Navegación SPA con desplazamiento automático de Link desactivado para reproducir el fallo: cambio de consulta, cambio de ruta, volver atrás y salto explícito a una sección.
- Siete idiomas a 320/390/1366 px; capturas de temas claro/oscuro y sin errores de JavaScript.
- Catálogo real: cambio a la página 2 desde la paginación inferior y apertura de la última receta del listado, ambos desde el inicio. Receta comprobada: Sloppy Joes caseros.
- La prueba permanente `tests/e2e/kitchen-tools.cjs` comprueba ahora el reinicio del paso, los controles dentro de pantalla, el temporizador compacto, la apertura del temporizador manual y la navegación real desde el catálogo.
- Las rutas locales de prueba y sus tipos generados se retiraron antes de publicar.

## Fotos dentro del modo cocina

El paso activo muestra su imagen existente debajo de las instrucciones, con texto alternativo localizado y el mismo tratamiento de URLs que las fotos de la receta. Solo se monta la imagen del paso visible al abrir el modo cocina. Al avanzar o retroceder cambia la foto; no se añade un hueco cuando el paso no tiene imagen.

La foto conserva sus proporciones y se limita en altura para dejar espacio a las instrucciones y los controles. La comprobación en navegador usó fotos reales del sabajón mediante el optimizador de producción: carga correcta, cambio de foto al avanzar y retroceder, inicio del contenido después de cargar, texto alternativo y ausencia de desbordamiento a 320/390/1366 px. Se revisaron ambos temas. La prueba permanente de herramientas de cocina también comprueba que aparece una sola foto y cambia con el paso.
