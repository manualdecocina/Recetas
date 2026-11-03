import Link from 'next/link';
import { getMdCopy } from '@/lib/copy';
import type { MdLanguage } from './md-types';
import { breadcrumbJsonLd, type BreadcrumbItem } from '@/lib/breadcrumbs';

/** Miga de pan visible + su BreadcrumbList JSON-LD, generados de la misma lista
 * para que el dato estructurado nunca difiera de la navegación que ve la persona.
 * Usa el estilo existente .md-crumbs (el mismo de las recetas). */
export default function Breadcrumbs({ items, lang }: { items: BreadcrumbItem[]; lang: MdLanguage }) {
  const ld = breadcrumbJsonLd(items);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <nav className="md-crumbs" aria-label={getMdCopy(lang).breadcrumbLabel}>
        {items.map((item, index) => (
          <span key={item.path} style={{ display: 'contents' }}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {index < items.length - 1
              ? <Link href={item.path}>{item.name}</Link>
              : <span aria-current="page">{item.name}</span>}
          </span>
        ))}
      </nav>
    </>
  );
}
