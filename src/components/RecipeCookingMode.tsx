'use client'

import { useState } from 'react'

type Step = { title: string; content: string }

export function RecipeCookingMode({ title, steps }: { title: string; steps: Step[] }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  if (!steps.length) return null

  return (
    <section className={`cooking-mode${open ? ' is-open' : ''}`} aria-label="Modo cocina">
      {!open ? (
        <button type="button" className="button button--dark" onClick={() => setOpen(true)}>
          Empezar a cocinar
        </button>
      ) : (
        <div className="cooking-mode__panel">
          <div className="cooking-mode__top">
            <span>Modo cocina</span>
            <button type="button" onClick={() => setOpen(false)}>Cerrar</button>
          </div>
          <p className="eyebrow">Paso {step + 1} de {steps.length}</p>
          <h2>{title}</h2>
          <h3>{steps[step].title}</h3>
          <p>{steps[step].content}</p>
          <div className="cooking-mode__progress" aria-hidden="true">
            <span style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
          <div className="cooking-mode__actions">
            <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>Anterior</button>
            {step < steps.length - 1 ? (
              <button type="button" className="button button--dark" onClick={() => setStep((current) => current + 1)}>Siguiente</button>
            ) : (
              <button type="button" className="button button--dark" onClick={() => setOpen(false)}>Terminar</button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
