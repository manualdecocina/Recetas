import Link from 'next/link';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

/** Existing language-aware 404 route should pass the resolved locale. */
export default function LocalizedNotFound({ lang }: { lang: MdLanguage }) {
  const t = getMdCopy(lang);
  return (
    <div className="md-site" lang={lang}>
      <SiteHeader lang={lang} />
      <main className="md-container md-404" id="md-main">
        <p className="md-eyebrow">404</p><h1 className="md-display">{t.notFoundTitle}</h1>
        <p className="md-lead" style={{ marginInline: 'auto' }}>{t.notFoundBody}</p>
        <Link className="md-button" href={`/${lang}`}>{t.backHome}</Link>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
