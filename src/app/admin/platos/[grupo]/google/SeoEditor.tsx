'use client'

import { useState } from 'react'
import { descriptionStatus, measuresLength, SEO_LIMITS, titleStatus, visibleLength, type LengthStatus } from '@/lib/admin/seo-checks'

interface LanguageSeo {
  language: string
  name: string
  title: string
  description: string
  displayUrl: string
  published: boolean
}

const STATUS_TEXT: Record<LengthStatus, string> = { ok: 'bien', corto: 'corto', largo: 'Google lo corta' }

function Counter({ value, min, max, status, measured }: { value: string; min: number; max: number; status: LengthStatus; measured: boolean }) {
  const n = visibleLength(value)
  if (!measured) return <span className="adm-counter">{n} caracteres</span>
  return <span className={`adm-counter adm-len-${status}`}>{n} / {min}–{max} · {STATUS_TEXT[status]}</span>
}

function LanguageFields({ item }: { item: LanguageSeo }) {
  const [title, setTitle] = useState(item.title)
  const [description, setDescription] = useState(item.description)
  const measured = measuresLength(item.language)
  const changed = title.trim() !== item.title || description.trim() !== item.description

  return (
    <fieldset className={`adm-seo-lang${changed ? ' adm-changed' : ''}`}>
      <legend>{item.name}{item.published ? '' : ' (sin publicar)'}{changed ? ' · cambiado' : ''}</legend>

      <div className="adm-serp adm-serp-live" aria-label="Vista previa en Google">
        <span className="adm-serp-url">{item.displayUrl}</span>
        <strong className="adm-serp-title">{title.trim() || '(sin título)'} | Manual de Cocina</strong>
        <span className="adm-serp-desc">{description.trim() || '(sin descripción)'}</span>
      </div>

      <label htmlFor={`title_${item.language}`}>
        Título <Counter value={title} min={SEO_LIMITS.titleMin} max={SEO_LIMITS.titleMax} status={titleStatus(title)} measured={measured} />
      </label>
      <input id={`title_${item.language}`} name={`title_${item.language}`} value={title} onChange={(e) => setTitle(e.target.value)}
        maxLength={SEO_LIMITS.titleHardMax} required />

      <label htmlFor={`description_${item.language}`}>
        Descripción <Counter value={description} min={SEO_LIMITS.descriptionMin} max={SEO_LIMITS.descriptionMax} status={descriptionStatus(description)} measured={measured} />
      </label>
      <textarea id={`description_${item.language}`} name={`description_${item.language}`} value={description} rows={3}
        onChange={(e) => setDescription(e.target.value)} maxLength={SEO_LIMITS.descriptionHardMax} required />
    </fieldset>
  )
}

export function SeoEditor({ group, languages, action }: { group: string; languages: LanguageSeo[]; action: (formData: FormData) => void | Promise<void> }) {
  return (
    <form action={action} className="adm-form adm-seo-form">
      <input type="hidden" name="group" value={group} />
      {languages.map((item) => <LanguageFields key={item.language} item={item} />)}
      <div className="adm-sticky-save">
        <button type="submit" className="adm-btn adm-btn-primary">Guardar cambios</button>
        <span className="adm-hint">Solo se guardan los idiomas que cambiaste. La web lo muestra en uno o dos minutos; Google, cuando vuelva a pasar por la receta.</span>
      </div>
    </form>
  )
}
