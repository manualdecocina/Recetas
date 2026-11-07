import { kitchenCopy } from '@/lib/kitchen-copy';
import Link from 'next/link';
import { favoritesCopy } from '@/lib/favorites-copy';
import ConsentPreferences from './ConsentPreferences';
import Image from 'next/image';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';

export default function SiteFooter({ lang }: { lang: MdLanguage }) {
  const t = getMdCopy(lang);
  const base = `/${lang}`;
  const institutional = [
    { slug: 'lista-de-compra', label: kitchenCopy(lang).shopping },
    { slug: 'favoritos', label: favoritesCopy[lang].title },
    { slug: 'quienes-somos', label: t.about },
    { slug: 'contacto', label: t.contact },
    { slug: 'politica-editorial', label: t.editorialPolicy },
  ];
  const legal = [
    { slug: 'privacidad', label: t.privacy },
    { slug: 'cookies', label: t.cookies },
    { slug: 'terminos', label: t.terms },
    { slug: 'aviso-legal', label: t.legalNotice },
    { slug: 'propiedad-intelectual', label: t.intellectualProperty },
  ];
  return (
    <footer className="md-footer">
      <div className="md-container">
        <div className="md-footer-grid">
          <div>
            <Link href={base} aria-label="Manual de Cocina">
              <Image className="md-footer-mark" src="/brand/logo-manual-de-cocina.webp" alt="" width={640} height={188} unoptimized />
            </Link>
            <p className="md-footer-intro">{t.footerIntro}</p>
          </div>
          <nav className="md-footer-links" aria-label={t.institutional}>
            <strong className="md-footer-heading">{t.institutional}</strong>
            {institutional.map((item) => (
              <Link key={item.slug} href={item.slug === 'quienes-somos' && lang === 'es' ? '/about' : `${base}/${item.slug}`}
                rel={item.slug === 'quienes-somos' ? 'about' : undefined}
                title={item.slug === 'quienes-somos' ? 'About us — Manual de Cocina' : undefined}>
                {item.slug === 'quienes-somos' && lang === 'es' ? `${item.label} (About us)` : item.label}
              </Link>
            ))}
            <a href="mailto:hola@manualdecocina.com">hola@manualdecocina.com</a>
          </nav>
          <nav className="md-footer-links" aria-label={t.legal}>
            <strong className="md-footer-heading">{t.legal}</strong>
            <ConsentPreferences lang={lang} />
            {legal.map((item) => <Link key={item.slug} href={`${base}/${item.slug}`}>{item.label}</Link>)}
          </nav>
        </div>
        <div className="md-footer-bottom">
          <span>© {new Date().getFullYear()} Manual de Cocina</span>
        </div>
      </div>
    </footer>
  );
}
