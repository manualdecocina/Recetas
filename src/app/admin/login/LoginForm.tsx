'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { signInAction } from '../actions'
import { initialFormState } from '../form-state'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Entrando…' : 'Entrar'}
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useFormState(signInAction, initialFormState)

  return (
    <form action={formAction}>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      {state.fieldErrors?.email && <p role="alert">{state.fieldErrors.email[0]}</p>}

      <label>
        Contraseña
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state.fieldErrors?.password && <p role="alert">{state.fieldErrors.password[0]}</p>}

      {state.message && <p role="alert">{state.message}</p>}
      <SubmitButton />
    </form>
  )
}
