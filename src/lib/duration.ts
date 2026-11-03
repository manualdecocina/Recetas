import type { MdLanguage } from '@/components/md/md-types';
export function formatRecipeDuration(minutes: number, lang: MdLanguage): string {
  const total = Math.max(0, Math.round(minutes));
  const units = [Math.floor(total / 1440), Math.floor(total % 1440 / 60), total % 60];
  const names = ['day', 'hour', 'minute'] as const;
  return units.flatMap((value, i) => value ? [new Intl.NumberFormat(lang, { style: 'unit', unit: names[i], unitDisplay: 'short' }).format(value)] : []).join(' ') || new Intl.NumberFormat(lang, { style: 'unit', unit: 'minute', unitDisplay: 'short' }).format(0);
}
export const durationLabels = {
 es: ['Preparación', 'Cocción', 'Reposo / espera'], en: ['Preparation', 'Cooking', 'Rest / waiting'], de: ['Vorbereitung', 'Garzeit', 'Ruhezeit'], fr: ['Préparation', 'Cuisson', 'Repos / attente'], it: ['Preparazione', 'Cottura', 'Riposo / attesa'], ja: ['下準備', '調理', '休ませる時間'], pt: ['Preparo', 'Cozimento', 'Descanso / espera'],
} satisfies Record<MdLanguage, string[]>;
