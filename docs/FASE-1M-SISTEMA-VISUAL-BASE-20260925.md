# FASE 1M — SISTEMA VISUAL BASE
## Manual de Cocina — 2026-09-25

Estado: **PROPUESTA DE DISEÑO BASE — PENDIENTE DE CIERRE VISUAL**

### Concepto
**Editorial culinaria:** un buen libro de cocina convertido en una herramienta digital.

### Personalidad
Claro · experto sin elitismo · cálido · curioso · práctico.

### Principios
1. El contenido manda.
2. La fotografía abre el apetito; no decora por decorar.
3. La tipografía aporta carácter editorial sin sacrificar lectura.
4. La interfaz debe sentirse herramienta, no blog.
5. Nada de estética de supermercado.
6. Nada de chef elitista.
7. Nada de decoración culinaria literal.
8. Nada de exceso de rojo/verde.
9. Nada de sombras pesadas ni tarjetas genéricas.
10. Mobile-first.

### Paleta base
- Carbón: #171614
- Marfil: #F7F4EE
- Blanco: #FFFFFF
- Piedra: #D9D4CA
- Arena: #EAE4D9
- Oliva: #59633E

Roles:
- fondo principal: marfil
- superficie: blanco
- texto principal: carbón
- texto secundario: carbón con reducción de contraste controlada
- bordes: piedra
- superficies editoriales secundarias: arena
- acento funcional/editorial: oliva

### Tipografía
Primera prueba:
- Display/editorial: Cormorant Garamond
- UI/cuerpo: Inter

Regla:
- serif para identidad, títulos editoriales y momentos de lectura;
- sans para navegación, controles, metadatos, ingredientes, pasos y acciones.

No usar más familias tipográficas salvo necesidad demostrada.

### Geometría
- base de espaciado: 4px
- contenedor: máximo aproximado 1200–1280px
- columna de lectura: 680–760px
- radios: 8–14px
- bordes finos
- sombras mínimas o inexistentes

### Header
Desktop:
LOGO | RECETAS | CATEGORÍAS | COLECCIONES | GUÍAS | BUSCAR

Mobile:
LOGO | BUSCAR | MENÚ

Header limpio, con jerarquía tipográfica y espacio. No usar mega-menú en V1.

### Búsqueda
La búsqueda es elemento central del producto.
Debe ser visualmente prominente sin parecer un buscador de e-commerce.
Ejemplo de intención:
“pollo rápido”
“qué puedo hacer con garbanzos”
“sopa para 4 personas”

### Tarjeta de receta
Imagen + categoría/microcontexto + título + resumen corto + tiempo cuando exista.
No sobrecargar con badges.

### Página de receta
Debe parecer una página de libro de cocina contemporáneo y, al mismo tiempo, una herramienta:
- título fuerte;
- resumen;
- fotografía protagonista;
- datos rápidos;
- ingredientes claros;
- pasos numerados;
- notas/consejos;
- acciones;
- modo cocina;
- relacionados.

### Publicidad
Espacios propios del sistema visual.
Nunca insertar anuncios de forma que parezcan contenido editorial.
No se implementa AdSense hasta cerrar consentimiento y proveedor.

### Footer
Bloque editorial + navegación institucional + legal + preferencias de privacidad.

### Accesibilidad visual
- contraste suficiente;
- foco visible;
- targets táctiles cómodos;
- texto real, no texto incrustado en imágenes;
- no depender únicamente del color;
- jerarquía semántica consistente.

### Criterio de cierre
Este sistema no se declara definitivo hasta probar:
- logo real;
- home;
- listado;
- receta;
- móvil;
- escritorio;
- estados vacíos;
- formularios;
- consentimiento;
- publicidad.
