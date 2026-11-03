export const FAVORITES_KEY = 'manualdecocina:favorites';
export const FAVORITES_CHANGED = 'manualdecocina:favorites-changed';
export function parseFavoriteIds(raw: string | null): string[] {
  const value: unknown = JSON.parse(raw ?? '[]');
  if (!Array.isArray(value) || !value.every(v => typeof v === 'string')) throw new Error('Invalid favorites');
  return [...new Set(value)];
}
