/** Reviewed crops of existing covers. Exact source matching prevents stale crops
 * being attached to a replacement photograph. Explicit editorial variants win. */
const reviewed: Record<string, string[]> = {
  "/recetas/arroz-pilaf/portada.webp": [
    "/recetas/audit-20261103/arroz-pilaf/portada-1x1.webp",
    "/recetas/audit-20261103/arroz-pilaf/portada-4x3.webp",
    "/recetas/audit-20261103/arroz-pilaf/portada-16x9.webp"
  ],
  "/recetas/barquitos-de-berenjena-al-horno/portada.webp": [
    "/recetas/audit-20261103/barquitos-de-berenjena-al-horno/portada-1x1.webp",
    "/recetas/audit-20261103/barquitos-de-berenjena-al-horno/portada-4x3.webp",
    "/recetas/audit-20261103/barquitos-de-berenjena-al-horno/portada-16x9.webp"
  ],
  "/recetas/batido-grimace-mcdonalds/portada.webp": [
    "/recetas/audit-20261103/batido-grimace-mcdonalds/portada-1x1.webp",
    "/recetas/audit-20261103/batido-grimace-mcdonalds/portada-4x3.webp",
    "/recetas/audit-20261103/batido-grimace-mcdonalds/portada-16x9.webp"
  ],
  "/recetas/bowl-quinoa-garbanzos-tahini-verduras-asadas/portada.webp": [
    "/recetas/audit-20261103/bowl-quinoa-garbanzos-tahini-verduras-asadas/portada-1x1.webp",
    "/recetas/audit-20261103/bowl-quinoa-garbanzos-tahini-verduras-asadas/portada-4x3.webp",
    "/recetas/audit-20261103/bowl-quinoa-garbanzos-tahini-verduras-asadas/portada-16x9.webp"
  ],
  "/recetas/camarones-al-ajillo/portada.webp": [
    "/recetas/audit-20261103/camarones-al-ajillo/portada-1x1.webp",
    "/recetas/audit-20261103/camarones-al-ajillo/portada-4x3.webp",
    "/recetas/audit-20261103/camarones-al-ajillo/portada-16x9.webp"
  ],
  "/recetas/canelones-carne-pina/portada.webp": [
    "/recetas/audit-20261103/canelones-carne-pina/portada-1x1.webp",
    "/recetas/audit-20261103/canelones-carne-pina/portada-4x3.webp",
    "/recetas/audit-20261103/canelones-carne-pina/portada-16x9.webp"
  ],
  "/recetas/frijoles-colombianos/portada.webp": [
    "/recetas/audit-20261103/frijoles-colombianos/portada-1x1.webp",
    "/recetas/audit-20261103/frijoles-colombianos/portada-4x3.webp",
    "/recetas/audit-20261103/frijoles-colombianos/portada-16x9.webp"
  ],
  "/recetas/creep-stroganoff/portada.webp": [
    "/recetas/audit-20261103/creep-stroganoff/portada-1x1.webp",
    "/recetas/audit-20261103/creep-stroganoff/portada-4x3.webp",
    "/recetas/audit-20261103/creep-stroganoff/portada-16x9.webp"
  ],
  "/recetas/arepa-con-todo/portada.webp": [
    "/recetas/audit-20261103/arepa-con-todo/portada-1x1.webp",
    "/recetas/audit-20261103/arepa-con-todo/portada-4x3.webp",
    "/recetas/audit-20261103/arepa-con-todo/portada-16x9.webp"
  ],
  "/recetas/batido-de-frutas-con-crema/portada.webp": [
    "/recetas/audit-20261103/batido-de-frutas-con-crema/portada-1x1.webp",
    "/recetas/audit-20261103/batido-de-frutas-con-crema/portada-4x3.webp",
    "/recetas/audit-20261103/batido-de-frutas-con-crema/portada-16x9.webp"
  ],
  "/recetas/bondiola-de-cerdo/portada.webp": [
    "/recetas/audit-20261103/bondiola-de-cerdo/portada-1x1.webp",
    "/recetas/audit-20261103/bondiola-de-cerdo/portada-4x3.webp",
    "/recetas/audit-20261103/bondiola-de-cerdo/portada-16x9.webp"
  ],
  "/recetas/buddha-bowl/portada.webp": [
    "/recetas/audit-20261103/buddha-bowl/portada-1x1.webp",
    "/recetas/audit-20261103/buddha-bowl/portada-4x3.webp",
    "/recetas/audit-20261103/buddha-bowl/portada-16x9.webp"
  ],
  "/recetas/ajiaco-colombiano/portada.webp": [
    "/recetas/audit-20261103/ajiaco-colombiano/portada-1x1.webp",
    "/recetas/audit-20261103/ajiaco-colombiano/portada-4x3.webp",
    "/recetas/audit-20261103/ajiaco-colombiano/portada-16x9.webp"
  ],
  "/recetas/burrito/portada.webp": [
    "/recetas/audit-20261103/burrito/portada-1x1.webp",
    "/recetas/audit-20261103/burrito/portada-4x3.webp",
    "/recetas/audit-20261103/burrito/portada-16x9.webp"
  ],
  "/recetas/lechona/portada.webp": [
    "/recetas/audit-20261103/lechona/portada-1x1.webp",
    "/recetas/audit-20261103/lechona/portada-4x3.webp",
    "/recetas/audit-20261103/lechona/portada-16x9.webp"
  ],
  "/recetas/pie-de-maracuya/portada.webp": [
    "/recetas/audit-20261103/pie-de-maracuya/portada-1x1.webp",
    "/recetas/audit-20261103/pie-de-maracuya/portada-4x3.webp",
    "/recetas/audit-20261103/pie-de-maracuya/portada-16x9.webp"
  ],
  "/recetas/pollo-teriyaki/portada.webp": [
    "/recetas/audit-20261103/pollo-teriyaki/portada-1x1.webp",
    "/recetas/audit-20261103/pollo-teriyaki/portada-4x3.webp",
    "/recetas/audit-20261103/pollo-teriyaki/portada-16x9.webp"
  ],
  "/recetas/rollo-de-carne/portada.webp": [
    "/recetas/audit-20261103/rollo-de-carne/portada-1x1.webp",
    "/recetas/audit-20261103/rollo-de-carne/portada-4x3.webp",
    "/recetas/audit-20261103/rollo-de-carne/portada-16x9.webp"
  ],
  "/recetas/salsa-ajo/portada.webp": [
    "/recetas/audit-20261103/salsa-ajo/portada-1x1.webp",
    "/recetas/audit-20261103/salsa-ajo/portada-4x3.webp",
    "/recetas/audit-20261103/salsa-ajo/portada-16x9.webp"
  ],
  "/recetas/batido-energizante-frutas-vegetales/portada.webp": [
    "/recetas/audit-20261103/batido-energizante-frutas-vegetales/portada-1x1.webp",
    "/recetas/audit-20261103/batido-energizante-frutas-vegetales/portada-4x3.webp",
    "/recetas/audit-20261103/batido-energizante-frutas-vegetales/portada-16x9.webp"
  ]
};
export function recipeCoverVariants(imageUrl: string | null, provided: unknown): string[] {
  const explicit = Array.isArray(provided) ? provided.filter((v): v is string => typeof v === 'string' && !!v.trim()) : [];
  return explicit.length >= 3 ? explicit : [...new Set([...explicit, ...(imageUrl ? reviewed[imageUrl] ?? [] : [])])];
}
