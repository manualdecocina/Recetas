# MANUAL DE COCINA — SISTEMA VISUAL v0.9
## FASE 1F.5 · TOKENS, TIPOGRAFÍA Y LENGUAJE UI
Fecha: 2026-09-25
Estado: PROPUESTA DE IMPLEMENTACIÓN — pendiente de validación visual final

## 1. Principio rector

Manual de Cocina debe sentirse como un buen libro de cocina convertido en una herramienta digital.

La identidad visual será editorial, pero la interfaz no será una revista: la lectura, búsqueda, filtros y ejecución de recetas tienen prioridad sobre la decoración.

Reglas:
- menos decoración, más criterio;
- fotografía real y apetecible;
- serif para identidad/editorial;
- sans para interfaz e instrucciones;
- superficies limpias;
- bordes y divisiones sutiles;
- sombras mínimas;
- sin estética de supermercado;
- sin estética de aplicación médica/nutricional;
- sin estética de blog de 2012;
- sin exceso de rojo/verde;
- sin iconografía culinaria literal innecesaria.

## 2. Paleta base

### Ink
--color-ink: #171614
Uso: texto principal, logotipo, títulos.

### Ivory
--color-ivory: #F7F4EE
Uso: fondo principal editorial.

### White
--color-white: #FFFFFF
Uso: tarjetas, formularios, superficies de lectura.

### Stone
--color-stone: #D9D4CA
Uso: bordes, separadores, estados neutros.

### Sand
--color-sand: #EAE4D9
Uso: superficies secundarias, bloques editoriales.

### Olive
--color-olive: #59633E
Uso: acción secundaria, estados seleccionados, detalles funcionales.

Regla de contraste:
- el texto principal será Ink;
- Olive no sustituye a Ink para texto pequeño si el contraste no es suficiente;
- no se usará color para comunicar una información que también deba estar disponible por texto, icono o estructura.

## 3. Tipografía

### Display / editorial
Primera opción: Cormorant Garamond.

Uso:
- títulos principales;
- títulos de recetas;
- titulares editoriales;
- nombres de colecciones;
- frases de identidad.

Características buscadas:
- elegante;
- gastronómica sin parecer clásica de restaurante;
- personalidad visible;
- buena lectura en tamaños grandes.

### UI / funcional
Primera opción: Inter.

Uso:
- navegación;
- búsqueda;
- filtros;
- botones;
- metadatos;
- ingredientes;
- instrucciones;
- estados;
- formularios.

Regla:
SERIF = identidad y jerarquía editorial.
SANS = acción, datos y ejecución.

## 4. Escala tipográfica inicial

Desktop:
- Display XL: clamp(3rem, 7vw, 6.5rem)
- H1: clamp(2.6rem, 5vw, 4.5rem)
- H2: clamp(2rem, 3.5vw, 3rem)
- H3: clamp(1.45rem, 2vw, 2rem)
- Body large: 1.125rem
- Body: 1rem
- Small: .875rem
- Micro/meta: .75rem

Mobile:
- Display XL: clamp(2.6rem, 15vw, 4.2rem)
- H1: clamp(2.25rem, 11vw, 3.4rem)
- H2: clamp(1.8rem, 8vw, 2.5rem)
- H3: 1.4rem
- Body large: 1.05rem
- Body: 1rem
- Small: .875rem
- Micro/meta: .75rem

No se fijará una escala definitiva hasta probar Home, listado y receta reales.

## 5. Espaciado

Sistema base de 4 px, con preferencia por múltiplos de 8 para grandes bloques.

Tokens iniciales:
- 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.

Regla editorial:
- mucho aire alrededor de titulares y fotografía;
- densidad mayor en herramientas de búsqueda, filtros e ingredientes;
- no usar espacios enormes solo para hacer que una página parezca "premium".

## 6. Contenedores y layout

- ancho máximo editorial: 1200–1280 px;
- lectura larga: 680–760 px;
- contenido de receta: 760–900 px según sección;
- grids de tarjetas: 2–4 columnas según viewport;
- gutters fluidos;
- mobile-first.

El sistema deberá responder a cambios de ancho sin depender de un número fijo de dispositivos.

## 7. Formas

- radios pequeños o medios;
- preferencia inicial: 8–14 px;
- evitar tarjetas excesivamente redondeadas;
- evitar sombras fuertes;
- bordes de 1 px;
- superficies diferenciadas por tono, no por efectos.

## 8. Botones

Primario:
- fondo Ink;
- texto White;
- altura cómoda;
- radio moderado.

Secundario:
- fondo transparente/White;
- borde Stone;
- texto Ink.

Acción destacada contextual:
- Olive solo cuando aporte significado funcional.

No habrá botones tipo "pill" por defecto.

## 9. Campos y búsqueda

La búsqueda es un elemento central del producto.

Debe:
- tener alta visibilidad;
- aceptar lenguaje natural sencillo;
- mostrar sugerencias/autocompletado cuando exista información suficiente;
- diferenciar consulta de filtros;
- conservar la consulta al volver desde un resultado;
- tener estado vacío útil.

La búsqueda y el filtrado deben formar una única experiencia de descubrimiento, no dos sistemas aislados.

## 10. Recipe Card

Estructura:
1. fotografía;
2. título serif;
3. metadatos sans;
4. información secundaria mínima.

No:
- badges excesivos;
- texto encima de la foto salvo necesidad editorial;
- sombras pesadas;
- tarjetas idénticas a ecommerce.

La tarjeta debe permitir decidir rápidamente si una receta merece abrirse.

## 11. Página de receta

La página se diseña como herramienta de cocina.

Orden conceptual:
1. breadcrumb;
2. título;
3. resumen;
4. fotografía;
5. datos rápidos;
6. acciones;
7. ingredientes;
8. pasos;
9. consejos/notas;
10. relacionados.

Durante la cocina, la interfaz debe ser más funcional que editorial.

La investigación UX específica sobre páginas de recetas trata la página como una experiencia con necesidades propias de información, imágenes, estructura, listas y ejecución; esto respalda mantener el carácter de herramienta sin perder la capa editorial. citeturn0search0turn0search2

## 12. Iconografía

- línea simple;
- grosor consistente;
- negro/Ink por defecto;
- Olive solo como estado;
- sin iconos culinarios decorativos innecesarios;
- accesibles con nombre/label cuando sean interactivos.

## 13. Fotografía

Dirección:
- comida real;
- luz natural o luz editorial controlada;
- textura visible;
- platos imperfectamente humanos;
- composición limpia;
- variedad cultural y culinaria;
- evitar stock evidente.

La fotografía debe vender la receta sin convertir la página en una galería.

## 14. Responsive

Desktop:
- logo horizontal;
- navegación completa;
- búsqueda visible;
- grids amplios.

Mobile:
- símbolo + marca compacta cuando sea posible;
- búsqueda accesible;
- menú;
- filtros en panel;
- tarjetas de una columna o grid compacto;
- controles táctiles cómodos;
- ningún contenido esencial dependiente de hover.

SVG será el formato maestro de marca para la interfaz cuando esté disponible; el SVG puede incluir información accesible como title/description y, cuando se use como imagen, debe llevar alt adecuado. citeturn0search3turn0search13

## 15. Logo responsive

La familia aprobada conceptualmente queda definida así:
- logo vertical/editorial;
- logo horizontal para header desktop;
- logo compacto para espacios reducidos;
- símbolo independiente;
- favicon.

La referencia visual aprobada por el proyecto es el símbolo de ficha/documento con esquina doblada y recipiente de cocina, acompañado de "manual" y "de cocina".

No se introducirán nuevos conceptos de símbolo salvo decisión explícita.

## 16. Header

Desktop:
[logo horizontal] [Recetas] [Categorías] [Colecciones] [Guías] [Buscar]

Mobile:
[símbolo/marca compacta] [buscar] [menú]

El header no debe competir visualmente con el contenido.

## 17. Footer

Contenido mínimo:
- marca;
- navegación principal;
- categorías;
- guías/colecciones;
- información legal;
- contacto si existe;
- enlaces sociales si existen.

## 18. Accesibilidad

Requisitos de implementación:
- foco visible;
- navegación por teclado;
- labels reales;
- botones semánticos;
- alt en imágenes;
- contraste suficiente;
- estados no dependientes solo del color;
- tamaños táctiles adecuados;
- jerarquía de headings coherente.

## 19. Decisiones

D-036 — El sistema visual seguirá Editorial culinaria.
D-037 — Paleta base propuesta: Ink, Ivory, White, Stone, Sand, Olive.
D-038 — Cormorant Garamond será la primera prueba de tipografía editorial.
D-039 — Inter será la primera prueba de tipografía funcional.
D-040 — Serif para identidad/editorial; sans para UI/ejecución.
D-041 — La búsqueda será un elemento primario del producto.
D-042 — El sistema evitará sombras fuertes, pills generalizados y decoración culinaria literal.
D-043 — El logo tendrá sistema responsive, no un único archivo.
D-044 — SVG será el formato maestro de marca cuando la vectorización final esté disponible.

## 20. Próximo bloque

Antes de declarar el diseño cerrado:
1. probar estos tokens sobre Home;
2. probar Header desktop/mobile;
3. probar Recipe Card;
4. probar /recetas/;
5. probar página de receta;
6. ajustar tipografía, escala, espaciado y color después de ver las pantallas reales;
7. integrar los assets de marca;
8. documentar el Design System v1.0.

Estado actual:
DISEÑO VISUAL — EN DESARROLLO
ARQUITECTURA — ESTUDIADA
IDENTIDAD — DIRECCIÓN APROBADA
LOGO — REFERENCIA APROBADA / ASSETS EN PREPARACIÓN
IMPLEMENTACIÓN — todavía no debe considerarse cerrada.
