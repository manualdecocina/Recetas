# Manual de Cocina — auditoría técnica y optimización

**Estado: correcciones publicadas y verificadas en el dominio público.**

Corte: 10 de noviembre de 2026. Sitio: https://manualdecocina.com. Implementación: PR [#271](https://github.com/manualdecocina/Recetas/pull/271).

## Cobertura comprobada

| Revisión | Resultado |
|---|---|
| Sitemap público completo | 2.135 de 2.135 URL responden HTTP 200 |
| Recetas publicadas | 252 recetas, 1.764 versiones en siete idiomas |
| Campos obligatorios, ingredientes, pasos, fotos, SEO y nutrición | Sin ausencias en las validaciones ejecutadas |
| Canonical, idioma HTML, hreflang recíproco, H1 y JSON-LD | Sin errores en el rastreo del sitemap |
| Rutas públicas duplicadas | 0 |
| Referencias a imágenes | 2.800; sin referencias locales ni de Supabase inexistentes |
| Archivos de imagen locales | 2.265 imágenes distintas verificadas; 0 corruptas |
| Enlaces internos adicionales fuera del sitemap | 53 de 53 responden HTTP 200 |
| Redirecciones | 242 reglas; sin ciclos ni destinos fuera del sitemap en el grafo revisado |
| Página inexistente y administración | 404 visible correcto; administración requiere acceso y conserva noindex |
| Dependencias | npm audit: 0 vulnerabilidades detectadas |

La revisión comprueba estructura, integridad y comportamiento técnico. No equivale a una prueba culinaria de cada receta ni a una garantía de indexación o posicionamiento.

## Errores corregidos

- **Fotos ampliadas:** se montaban imágenes grandes dentro de diálogos ocultos desde la carga inicial. Ahora el diálogo y su imagen se crean al abrir una foto y se retiran al cerrar. Se mantienen las miniaturas, los textos accesibles y el marcado de los pasos.
- **Temporizador:** continuaba actualizando el estado después de llegar a cero. Ahora finaliza y detiene el intervalo; también rechaza duraciones que se redondeaban a cero.
- **Identidad de ingredientes:** se conservan diferencias entre huevo crudo, cocido y de codorniz; arándano azul y rojo; albahaca fresca y seca; productos en conserva o deshidratados y sus equivalentes frescos. Panko conserva su nombre.
- **Selecciones guardadas:** los identificadores editoriales anteriores siguen resolviéndose al vincular un ingrediente con el catálogo. Desmarcar elimina también los identificadores equivalentes y la lista de compra los reconoce.
- **Catálogo:** 38 alias revisados enlazaron automáticamente 106 posiciones pendientes con ingredientes existentes, mediante el mecanismo de conciliación ya instalado. No se creó otra base de datos ni se duplicaron posiciones.
- **Inicio móvil:** se retiró una estimación de altura insuficiente aplicada a secciones completas, que provocaba geometría superpuesta en las comprobaciones de accesibilidad. Se ampliaron las áreas táctiles de categorías y enlaces del pie.
- **Contenido del pollo navideño:** se retiraron instrucciones internas de producción de las notas españolas e inglesas y se corrigió una frase del paso 8 en español.

## Peso del HTML generado

Mismo contenido de producción, compilación local antes y después. Tamaños sin compresión; no representan por sí solos el tiempo de carga de un usuario.

| Página | Antes | Después | Cambio |
|---|---:|---:|---:|
| Pollo relleno navideño | 200.422 B | 184.048 B | −8,17 % |
| Sabajón colombiano | 160.448 B | 145.877 B | −9,08 % |
| Inicio español | 152.187 B | 152.187 B | 0 % |
| Qué puedo cocinar | 476.642 B | 478.358 B | +0,36 % |

El pequeño aumento del buscador permite conservar las equivalencias de selecciones guardadas. El pollo evita diez imágenes grandes ocultas; el sabajón, ocho.

## Validación y publicación

TypeScript, pruebas de lógica y componentes y compilación de 1.920 páginas completados localmente. Las pruebas de navegador móvil/escritorio, fotos, modo cocina, temporizadores, porciones, lista de compra y siete idiomas pasaron en la ejecución [42923661249](https://github.com/manualdecocina/Recetas/actions/runs/42923661249). La compilación y pruebas generales pasaron también en [42924590851](https://github.com/manualdecocina/Recetas/actions/runs/42924590851). El comprobador de producción espera a detectar el código desplegado, renueva la caché por el endpoint protegido y revisa las siete versiones del pollo, el inicio, el sitemap y la distinción de albahacas.

Medición móvil de laboratorio (primera visita, código corregido, fotos completas):

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | CLS |
|---|---:|---:|---:|---:|---:|
| Inicio | 84 | 100 | 100 | 100 | 0 |
| Sabajón | 93 | 100 | 100 | 100 | 0 |
| Qué puedo cocinar | 94 | 100 | 100 | 100 | 0 |

La accesibilidad del inicio pasó de 93 a 100 en esta comprobación tras corregir la geometría y las áreas táctiles. El rendimiento del inicio en primera visita sigue siendo el margen principal de mejora; las medidas con imágenes ya procesadas deben interpretarse aparte.

La ejecución separada [42924590804](https://github.com/manualdecocina/Recetas/actions/runs/42924590804), que procesa las imágenes primero y conserva la primera medición posterior, obtuvo rendimiento móvil **94 en inicio, 93 en receta y 95 en el buscador**, con CLS 0 en las tres. Es una condición distinta de la primera visita; se conservan ambos resultados.

Publicación confirmada en el commit `daec737df9045e71f9e2042894a3ca8c1557f3e6`. La [verificación pública 42925149870](https://github.com/manualdecocina/Recetas/actions/runs/42925149870) pasó: caché renovada, inicio y sitemap correctos, siete versiones del pollo con diez pasos/diez fotos, siete alternancias y cero diálogos de foto montados inicialmente. En navegador real se comprobó la separación de albahaca fresca/seca y la apertura/cierre de la foto del paso 3.

También pasaron en el commit publicado las comprobaciones de calidad, rendimiento, impresión sin anuncios, despensa pública, idiomas y foto pública del pollo. Evidencia estructurada: `production-verified.json`.

## Pendientes y límites verificables

- **Search Console:** la integración devuelve `payment_required` por suscripción vencida. No fue posible medir clics, posiciones o indexación real; no se modificó su configuración.
- **Taxonomía editorial:** quedan 885 posiciones de ingredientes pendientes de vinculación. Se conservan utilizables con su identidad editorial; los casos ambiguos requieren revisión individual, no una unificación automática.
- **Cuenta Supabase:** permanece el aviso del proveedor sobre protección frente a contraseñas filtradas desactivada. Las funciones administrativas inspeccionadas ya exigen administrador y aprobación editorial; no se ampliaron privilegios.
- Las puntuaciones Lighthouse son mediciones de laboratorio y pueden variar por ejecución. Se adjuntan los resultados de las ejecuciones, sin presentarlos como datos de usuarios reales.

## Evidencia

`crawl-evidence.zip` contiene los registros del rastreo y los inventarios. Los JSON de esta carpeta resumen integridad de medios, estructura, conciliación y tamaños. El script `scripts/audit-live-20261110.py` permite repetir el rastreo público y `scripts/verify-site-optimization-20261110.py` verifica la publicación.
