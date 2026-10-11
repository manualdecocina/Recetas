/**
 * A cuisine assignment may exist only on a recipe's source-language row.
 * Filter translated catalog rows by their shared group instead of row IDs.
 */
export function uniqueCuisineGroupIds(rows: readonly { recipe_group_id: string | null }[]): string[] {
  return [...new Set(
    rows.map(({ recipe_group_id }) => recipe_group_id)
      .filter((id): id is string => typeof id === 'string' && id.length > 0),
  )]
}
