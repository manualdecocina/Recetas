import Link from 'next/link';
import { breadcrumbJsonLd, type BreadcrumbItem } from '@/lib/breadcrumbs';

/** Miga de pan visible + su BreadcrumbList JSON-LD, generados de la misma lista
 * para que el dato estructurado nunca difiera de la navegación que ve la persona.
 * Usa el estilo existente .md-crumbs (el mismo de las recetas). */
export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const ld = breadcrumbJsonLd(items);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <nav className="md-crumbs" aria-label="Breadcrumb">
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
