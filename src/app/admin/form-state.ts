export interface FormState {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

export const initialFormState: FormState = { ok: true }
