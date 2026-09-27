import type { Metadata } from 'next'
import Image from 'next/image'
import { InstitutionalPage } from '@/components/InstitutionalPage'
import { getSiteUrl, normalizePublicPath } from '@/lib/site'

const TITLE = 'Quiénes somos'
const DESCRIPTION =
  'Manual de Cocina está dirigido por Néstor Bastidas, chef colombiano con más de 15 años de experiencia en cocina profesional en Latinoamérica, Estados Unidos y España.'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: `${TITLE} — Néstor Bastidas | Manual de Cocina`,
    description: DESCRIPTION,
    alternates: { canonical: `${getSiteUrl()}${normalizePublicPath(`/${lang}/quienes-somos`)}` },
  }
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <InstitutionalPage
      lang={lang}
      eyebrow="Manual de Cocina"
      title={TITLE}
      intro="Un proyecto editorial gastronómico para cocinar mejor, con recetas claras y herramientas útiles."
    >
      <div className="md-author">
        <figure className="md-author-photo">
          <Image
            src="/autor/nestor-bastidas.webp"
            alt="Néstor Bastidas, chef y responsable editorial de Manual de Cocina, en una cocina profesional"
            width={900}
            height={1200}
            sizes="(max-width: 780px) 60vw, 300px"
            priority
          />
        </figure>
        <div className="md-author-bio">
          <h2>Néstor Bastidas</h2>
          <p className="md-author-role">Chef · responsable editorial de Manual de Cocina</p>
          <p>
            Néstor Bastidas es chef colombiano con más de 15 años de experiencia en cocina
            profesional. Se graduó como Tecnólogo en Gastronomía en el SENA (Colombia) en 2010 y,
            en 2013, completó su formación como profesional en gastronomía en el instituto Mausi
            Sebess, en Argentina.
          </p>
          <p>
            Ha trabajado en cocinas de restaurantes de cocina fusión, italiana, mediterránea y
            asiática en Buenos Aires, Bogotá, Cali, Medellín, Nueva York, Barcelona y Ciudad de
            Panamá.
          </p>
          <ul className="md-author-credentials">
            <li>Tecnólogo en Gastronomía — SENA, Colombia (2010)</li>
            <li>Profesional en Gastronomía — Instituto Mausi Sebess, Argentina (2013)</li>
            <li>Más de 15 años de experiencia profesional en cocina</li>
            <li>Experiencia en Buenos Aires, Bogotá, Cali, Medellín, Nueva York, Barcelona y Ciudad de Panamá</li>
          </ul>
        </div>
      </div>
      <p>
        Desde hace más de dos años, Néstor dirige Manual de Cocina: un proyecto editorial
        gastronómico digital, hecho con dedicación para las familias que buscan una receta clara
        o una idea para preparar una cena especial. Reunimos recetas, categorías, ingredientes y
        recursos de cocina en una experiencia pensada para descubrir qué cocinar y hacerlo con
        confianza.
      </p>
      <p>El proyecto no es un restaurante, no presta servicios profesionales y no mantiene una tienda de productos.</p>
    </InstitutionalPage>
  )
}
