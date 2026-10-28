# Refuerzo editorial de cuatro recetas

Se actualizaron las cuatro recetas existentes y sus siete idiomas: Stroganoff, chorizo santarrosano, lechona colombiana y bondiola. La solicitud del propietario fue «Refuérzalas», tras revisar la exportación de Search Console del 27 de octubre.

- Stroganoff: duración de 90 minutos, incluidos 30 de reposo de la masa, coherente en descripción, instrucciones y Recipe JSON-LD. Se distingue la versión casera de una receta oficial de restaurante y se explican problemas de masa y salsa.
- Chorizo: preparación fría, formulación para ocho piezas, opción sin tripa, preguntas sobre textura, embutido y cocción. Se mantiene su identidad de chorizo fresco.
- Lechona: se identifica como adaptación casera con arroz para ocho personas. Se corrige la generalización sobre la tradición tolimense sin arroz, con referencia de la Gobernación del Tolima. Se explican planificación y tamaño de las fuentes.
- Bondiola: título y descripción centrados en horno y aluminio; se elimina la regla rígida para una pieza de 1 kg y se distingue tiempo orientativo, temperatura y terneza.

Se añadieron 49 preguntas localizadas y 56 enlaces entre recetas del mismo idioma. Se conservaron las identidades de grupo, URL históricas, fecha de publicación, ingredientes, cantidades, imágenes, variantes, nutrición y votos. No se afirma una prueba física en cocina ni un aumento de tráfico ya conseguido.

La actualización usó el RPC existente para sus campos soportados y una actualización limitada por ID para los campos editoriales que el RPC no admite. La transacción bloqueó y comprobó los 28 registros y sus marcas de actualización antes de escribir. La lectura posterior coincidió con el contenido esperado en todos los campos salvo updated_at.

La comprobación pública pasó 28/28, con presencia de las 28 URL en sitemap, metadatos, un H1, FAQ visible, enlaces internos, Recipe JSON-LD, instrucciones, nutrición, canonical e idiomas recíprocos. Se actualizó la caché protegida antes de verificar. Evidencia: [GitHub Actions 40606296986](https://github.com/manualdecocina/Recetas/actions/runs/40606296986) y `editorial/refuerzo-cuatro-20261027/verified-production-qa.json`.

Los archivos before.json, after.json y patches.json conservan el estado anterior, el resultado previsto y las diferencias. El SQL tiene una guarda de concurrencia y no debe repetirse sobre recetas editadas después. La auditoría reproducible está en `scripts/audit-refuerzo-cuatro-20261027.py`.
