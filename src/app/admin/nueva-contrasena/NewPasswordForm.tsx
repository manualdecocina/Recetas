'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { updatePasswordAction } from '../recuperar/actions'
import { initialFormState } from '../form-state'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="adm-btn adm-btn-primary adm-auth-submit">
      {pending ? 'Guardando…' : 'Guardar contraseña'}
    </button>
  )
}

export function NewPasswordForm() {
  const [state, formAction] = useFormState(updatePasswordAction, initialFormState)

  return (
    <form action={formAction} className="adm-auth-form">
      <label htmlFor="password">Contraseña nueva</label>
      <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      {state.fieldErrors?.password && <p role="alert" className="adm-field-error">{state.fieldErrors.password[0]}</p>}

      <label htmlFor="confirm">Repite la contraseña</label>
      <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
      {state.fieldErrors?.confirm && <p role="alert" className="adm-field-error">{state.fieldErrors.confirm[0]}</p>}

      {state.message && <p role="alert" className="adm-notice adm-notice-error">{state.message}</p>}
      <SubmitButton />
    </form>
  )
}
