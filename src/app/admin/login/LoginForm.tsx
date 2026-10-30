'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { signInAction } from '../actions'
import { initialFormState } from '../form-state'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="adm-btn adm-btn-primary adm-auth-submit">
      {pending ? 'Entrando…' : 'Entrar'}
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useFormState(signInAction, initialFormState)

  return (
    <form action={formAction} className="adm-auth-form">
      <label htmlFor="email">Correo</label>
      <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required />
      {state.fieldErrors?.email && <p role="alert" className="adm-field-error">{state.fieldErrors.email[0]}</p>}

      <label htmlFor="password">Contraseña</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required />
      {state.fieldErrors?.password && <p role="alert" className="adm-field-error">{state.fieldErrors.password[0]}</p>}

      {state.message && <p role="alert" className="adm-notice adm-notice-error">{state.message}</p>}
      <SubmitButton />
    </form>
  )
}
