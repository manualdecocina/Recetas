import Link from 'next/link';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';
import SiteHeaderView from './SiteHeaderView';
import SiteFooter from './SiteFooter';
import { languageTag } from '@/lib/site';

/** Existing language-aware 404 route should pass the resolved locale. */
export default function LocalizedNotFound({ lang }: { lang: MdLanguage }) {
  const t = getMdCopy(lang);
  return (
    <div className="md-site" lang={languageTag(lang)}>
      <SiteHeaderView lang={lang} available={[lang]} />
      <main className="md-container md-404" id="md-main">
        <p className="md-eyebrow">404</p><h1 className="md-display">{t.notFoundTitle}</h1>
        <p className="md-lead" style={{ marginInline: 'auto' }}>{t.notFoundBody}</p>
        <Link className="md-button" href={`/${lang}`}>{t.backHome}</Link>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
