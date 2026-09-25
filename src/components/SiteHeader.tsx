import Link from 'next/link'
import Image from 'next/image'
const links = [['Inicio','/'],['Quiénes somos','/quienes-somos/'],['Recetas','/recetas/'],['Aprender Técnicas','/aprender-tecnicas/'],['Contáctanos','/contacto/']]
export function SiteHeader({ lang }: { lang: string }) {
  return <header className="reference-header"><div className="reference-header__inner"><Link className="reference-header__brand" href={'/' + lang} aria-label="Manual de Cocina, inicio"><Image src="/brand/manual-master.svg" alt="Manual de Cocina" width={160} height={154} priority /></Link><nav className="reference-header__nav" aria-label="Principal">{links.map(([label,href])=><Link key={href} href={'/' + lang + href}>{label}</Link>)}</nav><Link className="reference-header__search" href={'/' + lang + '/recetas/'} aria-label="Buscar recetas">⌕</Link><details className="reference-header__menu"><summary>Menú</summary><nav aria-label="Menú móvil">{links.map(([label,href])=><Link key={href} href={'/' + lang + href}>{label}</Link>)}</nav></details></div></header>
}
