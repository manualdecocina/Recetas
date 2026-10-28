/** Reviewed wording for the seven length warnings found on 28 October 2026.
 * Apply only while the captured old value remains; future editorial edits win. */
export const REVIEWED_SNIPPETS: Record<string, { before: Record<string, string>; after: Record<string, string> }> = {
  "44be30a5-fa4c-46b2-97fe-b66b07276b1e": {
    "before": {
      "title": "Morango cravejado: fragole al brigadeiro e caramello rosso"
    },
    "after": {
      "title": "Morango cravejado con brigadeiro e caramello"
    }
  },
  "a7c93b3d-0876-450c-b88b-5cde92b9ce10": {
    "before": {
      "title": "Patatas bravas in friggitrice ad aria con salsa alla paprika"
    },
    "after": {
      "title": "Patatas bravas in friggitrice ad aria"
    }
  },
  "b8b3dd12-1911-4762-84a5-b7eb3d330802": {
    "before": {
      "title": "Morango cravejado: fresas con brigadeiro y cobertura crujiente",
      "description": "Morango cravejado brasileño: fresas enteras envueltas en brigadeiro blanco y cobertura blanca con trocitos de caramelo rojo. Receta para diez unidades, con enfriados incluidos."
    },
    "after": {
      "title": "Morango cravejado con brigadeiro y caramelo",
      "description": "Morango cravejado brasileño: fresas con brigadeiro blanco y cobertura blanca con trocitos de caramelo rojo. Diez unidades, con enfriados incluidos."
    }
  },
  "bbe02232-6d43-43d9-b1fe-c4fba585a8e6": {
    "before": {
      "title": "Chorizo santarrosano maison : saucisse colombienne fraîche"
    },
    "after": {
      "title": "Chorizo santarrosano maison au porc"
    }
  },
  "ea264d1b-8a4d-4e58-8baa-d10fc5eed9d4": {
    "before": {
      "description": "Morango cravejado com fruta inteira, brigadeiro de leite em pó e cobertura branca com pedacinhos de caramelo vermelho. Dez unidades, com os tempos de resfriamento incluídos."
    },
    "after": {
      "description": "Morango cravejado com morango inteiro, brigadeiro de leite em pó e cobertura branca com pedacinhos de caramelo vermelho. Dez unidades, com resfriamento incluído."
    }
  },
  "ede9da8e-a8a2-423d-bb07-478cc8a2dbd8": {
    "before": {
      "title": "Patatas bravas aus der Heißluftfritteuse mit Paprikasauce"
    },
    "after": {
      "title": "Patatas bravas aus der Heißluftfritteuse"
    }
  }
}

export function reviewedRecipeSeo(id: string | undefined, source?: Record<string, unknown> | null): Record<string, unknown> {
  const seo = { ...(source ?? {}) }
  const change = id ? REVIEWED_SNIPPETS[id] : undefined
  if (change) for (const field of Object.keys(change.after)) {
    if (seo[field] === change.before[field]) seo[field] = change.after[field]
  }
  return seo
}
