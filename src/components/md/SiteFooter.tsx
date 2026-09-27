import Link from 'next/link';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';

export default function SiteFooter({ lang }: { lang: MdLanguage }) {
  const t = getMdCopy(lang);
  const base = `/${lang}`;
  const institutional = [
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
              <img className="md-footer-mark" src="/brand/logo-manual-de-cocina.png" alt="" width="640" height="188" />
            </Link>
            <p className="md-footer-intro">{t.footerIntro}</p>
          </div>
          <nav className="md-footer-links" aria-label={t.institutional}>
            <strong className="md-footer-heading">{t.institutional}</strong>
            {institutional.map((item) => <Link key={item.slug} href={`${base}/${item.slug}`}>{item.label}</Link>)}
          </nav>
          <nav className="md-footer-links" aria-label={t.legal}>
            <strong className="md-footer-heading">{t.legal}</strong>
            {legal.map((item) => <Link key={item.slug} href={`${base}/${item.slug}`}>{item.label}</Link>)}
          </nav>
        </div>
        <div className="md-footer-bottom">© {new Date().getFullYear()} Manual de Cocina</div>
      </div>
    </footer>
  );
}
