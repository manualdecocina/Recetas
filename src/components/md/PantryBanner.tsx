import Link from 'next/link';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';

/** Icono decorativo (bol con "vapor"), 100% inline: sin foto que inventar, solo para
 * que el banner no se vea como un bloque de texto plano. Hereda el color por currentColor. */
function PantryIcon() {
  return (
    <span className="md-pantry-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 11h16c0 4.97-3.58 9-8 9s-8-4.03-8-9Z" fill="currentColor" />
        <path d="M9 6c0-1.1.9-2 2-2M15 6c0-1.1-.9-2-2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * CTA de "¿Qué puedo cocinar?", compartido entre home, catálogo de ingredientes y páginas
 * de receta (antes estaba triplicado a mano en cada archivo y así se desincronizaba el CSS).
 * `card`: variante tarjeta redondeada dentro de una página, en vez de banda a todo el ancho.
 * `container`: añade la clase md-container al contenido interno (úsalo solo cuando el
 * elemento padre no aporte ya un `.md-container`, como en la home).
 */
export default function PantryBanner({ lang, headingId, card = false, container = false }: {
  lang: MdLanguage;
  headingId: string;
  card?: boolean;
  container?: boolean;
}) {
  const t = getMdCopy(lang);
  return (
    <section className={`md-pantry-banner${card ? ' md-pantry-banner-card' : ''}`} aria-labelledby={headingId}>
      <div className={`md-pantry-banner-inner${container ? ' md-container' : ''}`}>
        <div className="md-pantry-banner-copy">
          <PantryIcon />
          <div className="md-pantry-banner-text">
            <p className="md-eyebrow">{t.pantryEyebrow}</p>
            <h2 className="md-title" id={headingId}>{t.pantryBannerTitle}</h2>
            <p className="md-lead">{t.pantryBannerBody}</p>
          </div>
        </div>
        <Link className="md-button" href="/es/que-puedo-cocinar">{t.pantryBannerCta}</Link>
      </div>
    </section>
  );
}
