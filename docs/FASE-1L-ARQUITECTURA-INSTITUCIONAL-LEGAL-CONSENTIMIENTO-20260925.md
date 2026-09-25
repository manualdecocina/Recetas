# FASE 1L — ARQUITECTURA INSTITUCIONAL, LEGAL Y CONSENTIMIENTO
## Manual de Cocina — 2026-09-25

Estado: **DEFINIDO A NIVEL DE PRODUCTO / TEXTO LEGAL FINAL PENDIENTE DE IMPLEMENTACIÓN TÉCNICA**

## 1. Identidad operativa

- Marca pública: **Manual de Cocina**
- Dominio: **manualdecocina.com**
- Responsable: **Néstor Bastidas**
- Dirección declarable: **Cali, Valle del Cauca, Colombia**
- Teléfono reservado para información legal: **302 815 0839**
- Email principal: **hola@manualdecocina.com**
- Hosting: **Hostinger**
- Naturaleza: proyecto editorial gastronómico digital.
- No es restaurante, oficina abierta al público ni prestación de servicios profesionales.
- No existe tienda ni venta directa de productos.
- No se prevén afiliaciones comerciales.
- Monetización prevista: publicidad.
- Proveedor publicitario previsto: Google AdSense.
- Identificadores fiscales NIF/VAT: no disponibles/no declarar hasta disponer de datos reales.

## 2. Páginas institucionales previstas

Arquitectura obligatoria:

- /[lang]/quienes-somos/
- /[lang]/contacto/
- /[lang]/aviso-legal/
- /[lang]/privacidad/
- /[lang]/cookies/
- /[lang]/terminos/
- /[lang]/propiedad-intelectual/
- /[lang]/politica-editorial/

El nombre y las rutas definitivas pueden adaptarse al sistema de routing final, pero estas funciones forman parte del producto.

## 3. Consentimiento y privacidad

Actualmente no se considera existente una implementación de cookies/CMP.

La nueva implementación partirá de cero y deberá:

1. distinguir tecnologías estrictamente necesarias de tecnologías que requieran consentimiento;
2. impedir que analítica/publicidad se carguen antes del consentimiento cuando corresponda;
3. ofrecer aceptación y rechazo con una fricción comparable;
4. permitir configurar categorías;
5. permitir retirar/cambiar el consentimiento posteriormente;
6. mantener una página o mecanismo persistente de preferencias;
7. documentar proveedores y finalidades reales;
8. no declarar cookies o servicios que no estén realmente instalados.

## 4. Analítica

No se fija todavía Google Analytics como decisión técnica definitiva.

Google Search Console se tratará como herramienta de administración/SEO y no como sustituto de analítica de uso.

Antes de activar cualquier analítica se documentarán:
- proveedor;
- finalidad;
- eventos/datos recogidos;
- cookies o tecnologías usadas;
- base jurídica/consentimiento aplicable;
- configuración de privacidad;
- retención;
- integración con el CMP.

## 5. Publicidad

Modelo previsto:
- Google AdSense.
- Sin afiliación.
- Sin tienda.
- Sin venta directa.

La interfaz publicitaria será propia: espacios definidos por el sistema de diseño, sin contaminar la navegación ni convertir la web en un catálogo publicitario.

AdSense no se considerará instalado hasta completar su integración técnica y de consentimiento.

## 6. Formularios

Contacto y cualquier futuro formulario deberán minimizar datos.

No se solicitarán datos que no sean necesarios para la finalidad declarada.

El formulario no se implementará como simple captura de correo: deberá contemplar validación, protección anti-spam, tratamiento del mensaje y política de privacidad.

## 7. Datos que NO deben inventarse

No completar con valores ficticios:
- NIF/VAT;
- domicilio postal detallado;
- entidad societaria;
- teléfono comercial adicional;
- DPO;
- proveedores de analítica no elegidos;
- proveedores de correo no confirmados;
- cookies no instaladas;
- servicios de terceros no instalados;
- plazos de conservación no definidos;
- bases jurídicas concretas sin revisar el tratamiento real.

## 8. Criterio editorial

Manual de Cocina se presentará como proyecto editorial gastronómico, no como servicio médico, nutricional, restauración, asesoría profesional ni comercio.

Las páginas legales deben reflejar la actividad real y las tecnologías efectivamente utilizadas.

## 9. Relación con el diseño

El bloque institucional/legal forma parte del producto desde V1. No será un añadido posterior.

Footer previsto:
- Manual de Cocina
- Quiénes somos
- Contacto
- Aviso legal
- Privacidad
- Cookies / Preferencias
- Términos
- Propiedad intelectual
- Política editorial

## 10. Criterio de cierre

Este bloque podrá marcarse como **cerrado para diseño** cuando:
- rutas y jerarquía estén integradas;
- footer esté definido;
- consentimiento esté diseñado;
- inventario real de terceros esté cerrado;
- analítica elegida esté definida;
- publicidad esté preparada;
- textos legales finales se redacten sobre la implementación real.

El texto legal definitivo no se considera cerrado en esta fase porque todavía faltan decisiones técnicas sobre analítica, CMP y servicios de terceros.
