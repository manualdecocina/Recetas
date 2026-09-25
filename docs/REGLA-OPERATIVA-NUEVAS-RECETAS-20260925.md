# REGLA OPERATIVA — Alta y publicación de nuevas recetas

**Fecha:** 2026-09-25  
**Estado:** REGLA OPERATIVA — APLICABLE A TODA RECETA NUEVA

Esta lista acompaña a la regla específica de ingredientes. Su objetivo es que una receta nueva no entre al sistema con datos incompletos, inconsistentes o incompatibles con la arquitectura ya definida.

## 1. Identidad y contenido editorial

Antes de publicar:
- título definitivo, natural y claro;
- slug estable y limpio;
- resumen/excerpt útil;
- descripción/contenido editorial cuando corresponda;
- ingredientes originales completos;
- pasos completos y ordenados;
- notas, consejos y sustituciones solo cuando estén realmente respaldados por la receta;
- idioma correcto;
- relación con el grupo de receta cuando exista;
- fuente/origen conservado cuando proceda.

No se deben rellenar datos inventando información.

## 2. Imagen y medios

Toda receta publicada debe tener una imagen principal válida.

Comprobar:
- URL/asset válido;
- imagen realmente correspondiente a la receta;
- encuadre adecuado para tarjetas y página;
- texto alternativo descriptivo;
- galería solo si existe material útil;
- vídeo solo si existe y corresponde a la receta.

No se deben crear galerías, vídeos o información visual ficticia para completar campos.

## 3. Taxonomía

Cada receta nueva debe revisarse contra la arquitectura vigente.

Cuando la información lo permite:
- categoría culinaria: una de las categorías canónicas existentes;
- ingredientes: resolver contra el catálogo canónico cuando sea inequívoco;
- cocina: normalizar a un valor existente cuando corresponda;
- curso/momento: utilizar solo cuando esté claro;
- dificultad: utilizar los valores normalizados del sistema.

No crear una nueva categoría, cocina, curso o etiqueta simplemente porque una receta nueva no encaje inmediatamente. Si realmente hace falta un nuevo valor, pasa a revisión del sistema.

## 4. Tiempo y rendimiento

Cuando la receta proporcione la información:
- tiempo de preparación;
- tiempo de cocción;
- tiempo total coherente;
- número de raciones/rendimiento.

No estimar silenciosamente tiempos o raciones.

El sistema debe mantener separados preparación, cocción y total. Estos campos forman parte de la representación estructurada de una receta. citeturn0search1turn0search8turn0search11

## 5. Ingredientes — regla específica

Se aplica íntegramente la regla de ingredientes para nuevas recetas.

En resumen:
- conservar siempre el texto editorial original;
- separar cantidad, unidad, preparación y nota cuando sea posible;
- buscar primero coincidencia canónica;
- usar alias existente si la coincidencia es inequívoca;
- ingrediente desconocido → pendiente;
- no inventar equivalencias;
- no convertir automáticamente un ingrediente nuevo en página SEO;
- no bloquear la receta por una normalización pendiente.

La representación estructurada de ingredientes es compatible con Schema.org, que permite texto libre o valores estructurados. citeturn0search0

## 6. Pasos de preparación

Antes de publicar:
- comprobar que están todos los pasos;
- mantener el orden;
- evitar pasos duplicados;
- evitar referencias a elementos inexistentes;
- comprobar que cantidades y acciones coinciden con los ingredientes;
- comprobar que temperaturas y tiempos de los pasos no contradicen los datos generales;
- conservar secciones cuando la receta tenga componentes distintos.

La estructura de instrucciones puede representarse como lista ordenada/HowToStep cuando corresponda. citeturn0search1

## 7. SEO y URL

Cada receta nueva debe revisar:
- slug;
- title;
- description/excerpt;
- canonical/public path;
- datos estructurados Recipe;
- BreadcrumbList cuando corresponda;
- imagen válida;
- categoría;
- cocina;
- ingredientes;
- rendimiento;
- tiempos;
- instrucciones.

No generar páginas adicionales por combinaciones arbitrarias de filtros o ingredientes.

Schema.org contempla específicamente categoría, cocina, ingrediente, rendimiento, tiempos e instrucciones dentro de Recipe. citeturn0search1

## 8. Keywords y descubrimiento

Las keywords deben describir realmente la receta.

No:
- rellenar keywords por SEO;
- repetir sinónimos artificialmente;
- añadir búsquedas que la receta no satisface;
- convertir cada keyword en una taxonomía nueva.

Las keywords son apoyo al descubrimiento, no sustituyen la taxonomía.

## 9. Nutrición

La nutrición solo se publica cuando los datos sean fiables.

Nunca inventar calorías, proteínas, grasas, carbohidratos, micronutrientes o información dietética.

Si no existe información fiable, se deja vacía.

## 10. Publicación y estado

Antes de marcar una receta como publicada:
1. contenido completo;
2. imagen válida;
3. categoría revisada;
4. ingredientes procesados según la regla;
5. tiempos revisados;
6. raciones revisadas;
7. dificultad revisada;
8. cocina/curso revisados cuando existan;
9. SEO básico revisado;
10. URL estable;
11. datos estructurados compatibles;
12. página renderizada y comprobada.

Una receta no debe publicarse únicamente porque técnicamente pueda guardarse en Supabase.

## 11. Lo que NO debe hacerse automáticamente

Queda prohibido como comportamiento por defecto:
- inventar datos faltantes;
- inventar categorías;
- inventar cocinas;
- inventar aliases de ingredientes;
- fusionar ingredientes ambiguos;
- crear páginas SEO de cada combinación;
- modificar el texto original de una receta para adaptarlo al modelo;
- eliminar información editorial para conseguir una estructura más limpia;
- añadir nutrición estimada como si fuera factual;
- crear medios inexistentes.

## 12. Principio rector

**La nueva receta debe entrar en el sistema con la misma lógica de producto, contenido, taxonomía, SEO y datos estructurados que las recetas existentes.**

Si aparece una necesidad que la arquitectura actual no contempla, primero se registra como decisión de producto y después se modifica el sistema. No se crea una excepción silenciosa dentro de una receta.

## Decisiones

**D-063:** toda receta nueva pasa por una checklist editorial, taxonómica, técnica y SEO antes de publicarse.

**D-064:** los campos faltantes no se rellenan mediante invención.

**D-065:** las nuevas dimensiones de taxonomía requieren revisión antes de incorporarse.

**D-066:** la receta nueva debe seguir el modelo de producto vigente; no se permiten excepciones silenciosas.

**D-067:** la publicación diaria seguirá este procedimiento como regla permanente del proyecto.
