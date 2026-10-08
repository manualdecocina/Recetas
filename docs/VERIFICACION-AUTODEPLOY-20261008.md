# Verificación de despliegue automático y caché

2026-10-08. Corrige el bloqueo de despliegue del relevo: no es imprescindible el conector directo de Hostinger si el hosting existente despliega automáticamente los cambios de GitHub/main. Esta alternativa está documentada por Hostinger y aún debe comprobarse en la aplicación real.

Fuente oficial: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/

Se integra un marcador público de texto en public/.well-known/manualdecocina-deploy.txt. El gate es HTTP 200 y cuerpo exacto en https://preview.manualdecocina.com/.well-known/manualdecocina-deploy.txt después del merge, sin acción manual en Hostinger. El marcador no contiene secretos y no altera páginas, recetas ni indexación. Si no llega a publicarse, la conexión automática sigue sin verificar; no atribuir un despliegue verde al commit nuevo sin evidencia.

REVALIDATE_SECRET ya funciona desde GitHub: run 37715732019, artefacto 11523627032, 936 URLs HTTP 200, 763 Recipe válidos (109 × 7), 857 BreadcrumbList válidos, 1.132 imágenes verificadas, 0 errores, 0 huérfanas, robots y noindex/nofollow mantenidos. PR #85 integrada. La deuda de cache/QA del lote 01 queda cerrada.

Para próximos lotes, ejecutar la revalidación desde un workflow GitHub autorizado con el secreto ya existente, quitando solamente CR/LF finales al leerlo. No exponerlo ni descargarlo al chat. Ajustar el gate al lote actual y al recuento real; no reutilizar 109 como un valor fijo después de publicar más recetas.

Si el marcador confirma despliegue automático, el futuro relevo puede publicar mediante GitHub → despliegue automático → comprobación HTTP/hash → Supabase → revalidación/QA, sin herramientas del panel Hostinger. Probar lecturas de los conectores realmente requeridos antes de crear la tarea. Mantener la configuración Sol 6.1/Alto solicitada como no verificada hasta disponer de evidencia de la configuración guardada de la tarea.
