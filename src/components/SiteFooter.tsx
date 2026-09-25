import Image from 'next/image'
import Link from 'next/link'

export function SiteFooter({ lang }: { lang: string }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link className="site-footer__brand-link" href={'/' + lang} aria-label="Manual de Cocina, inicio">
            <Image className="brand__logo" src="/brand/manual-de-cocina-horizontal.svg" alt="Manual de Cocina" width={260} height={48} />
          </Link>
          <p>Un manual de cocina para descubrir, aprender y cocinar mejor.</p>
        </div>

        <nav className="site-footer__nav" aria-label="Navegación del pie">
          <div>
            <strong>Descubrir</strong>
            <Link href={'/' + lang + '/recetas/'}>Recetas</Link>
            <Link href={'/' + lang + '/categorias/'}>Categorías</Link>
            <Link href={'/' + lang + '/ingredientes/'}>Ingredientes</Link>
          </div>
          <div>
            <strong>Aprender</strong>
            <Link href={'/' + lang + '/colecciones/'}>Colecciones</Link>
            <Link href={'/' + lang + '/guias/'}>Guías</Link>
          </div>
          <div>
            <strong>Manual de Cocina</strong>
            <Link href={'/' + lang + '/quienes-somos/'}>Quiénes somos</Link>
            <Link href={'/' + lang + '/contacto/'}>Contacto</Link>
          </div>
          <div>
            <strong>Información</strong>
            <Link href={'/' + lang + '/aviso-legal/'}>Aviso legal</Link>
            <Link href={'/' + lang + '/privacidad/'}>Privacidad</Link>
            <Link href={'/' + lang + '/cookies/'}>Cookies</Link>
            <Link href={'/' + lang + '/terminos/'}>Términos de uso</Link>
            <Link href={'/' + lang + '/propiedad-intelectual/'}>Propiedad intelectual</Link>
          </div>
        </nav>
      </div>

      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Manual de Cocina</span>
        <span>Cali, Valle del Cauca, Colombia</span>
      </div>
    </footer>
  )
}
