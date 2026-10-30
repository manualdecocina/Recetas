'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { requestPasswordResetAction } from './actions'
import { initialFormState } from '../form-state'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="adm-btn adm-btn-primary adm-auth-submit">
      {pending ? 'Enviando…' : 'Enviar enlace'}
    </button>
  )
}

export function RecoverForm() {
  const [state, formAction] = useFormState(requestPasswordResetAction, initialFormState)
  if (state.ok && state.message) return <p className="adm-notice adm-notice-ok" role="status">{state.message}</p>

  return (
    <form action={formAction} className="adm-auth-form">
      <label htmlFor="email">Correo</label>
      <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required />
      {state.fieldErrors?.email && <p role="alert" className="adm-field-error">{state.fieldErrors.email[0]}</p>}
      <SubmitButton />
    </form>
  )
}
