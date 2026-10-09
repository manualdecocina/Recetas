# Consentimiento y valoraciones — 2026-10-09

El pie de página ofrece Preferencias de cookies en los siete idiomas. El botón usa la cola CONSENT_API_READY de Google y showRevocationMessage, sin guardar consentimiento propio. Si Google no está disponible, informa del fallo y permite reintentar; una respuesta tardía no abre un diálogo tras ese aviso.

El mensaje inicial se configura y publica en AdSense → Privacidad y mensajes → Normativas europeas, para manualdecocina.com. NEXT_PUBLIC_GOOGLE_CMP_READY=true es una declaración de configuración, no publica ese mensaje por sí misma. La API está documentada en https://developers.google.com/funding-choices/fc-api-docs.

Las estrellas ya existen, traducidas, junto a los datos de cada receta. La producción respondió 404 «Valoraciones no disponibles» al POST con JSON vacío, que no registra ningún voto. Activarlas requiere guardar NEXT_PUBLIC_RATINGS_ENABLED=true antes de compilar, y configurar SUPABASE_SECRET_KEY (o SUPABASE_SERVICE_ROLE_KEY) y RATINGS_HASH_SECRET únicamente en el servidor. RATINGS_HASH_SECRET debe ser un secreto aleatorio de alta entropía, persistente; nunca poner estas llaves en NEXT_PUBLIC ni en el repositorio.

La interfaz confirma y guarda el voto local únicamente tras recibir un resultado válido del servidor. Los fallos de red, servidor o datos permiten reintentar. Durante el envío se bloquean los clics duplicados. El promedio y el JSON-LD se basan exclusivamente en votos reales.

Verificación: typecheck, pruebas de lógica, compilación con valoraciones activas y pruebas de componentes (errores 503, red sin conexión, respuesta inválida, voto aceptado, doble clic, duplicado 409, siete idiomas y apertura asíncrona de Google). En Supabase se comprobó rate_recipe_once como service_role, incluyendo actualización de contadores y rechazo de duplicados, en transacción revertida: no se dejó ningún voto de prueba.
