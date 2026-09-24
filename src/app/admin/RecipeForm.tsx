'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { initialFormState, type FormState } from './form-state'

type Action = (prev: FormState, formData: FormData) => Promise<FormState>

interface Defaults {
  slug?: string
  public_path?: string | null
  title?: string
  excerpt?: string | null
  category?: string | null
  prep_time_minutes?: number | null
  cook_time_minutes?: number | null
  servings?: number | null
  image_url?: string | null
  published?: boolean
  ingredientsText?: string
  stepsText?: string
}

interface Props {
  action: Action
  submitLabel: string
  // Crear / traducir: idiomas disponibles. Editar: sin selector (el idioma no cambia).
  languageOptions?: { value: string; label: string }[]
  // Campos ocultos permitidos: id de la receta (editar) o id de la receta ORIGEN (traducir).
  // Nunca recipe_group_id.
  hidden?: { name: 'id' | 'source_id'; value: string }
  defaults?: Defaults
  showPublicPath?: boolean
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Guardando…' : label}
    </button>
  )
}

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.length ? <p role="alert">{errors[0]}</p> : null
}

export function RecipeForm({ action, submitLabel, languageOptions, hidden, defaults = {}, showPublicPath = false }: Props) {
  const [state, formAction] = useFormState(action, initialFormState)
  const e = state.fieldErrors ?? {}

  return (
    <form action={formAction}>
      {hidden && <input type="hidden" name={hidden.name} value={hidden.value} />}

      {languageOptions && (
        <label>
          Idioma
          <select name="language" required defaultValue={languageOptions[0]?.value}>
            {languageOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <FieldError errors={e.language} />
        </label>
      )}

      {showPublicPath && (
        <label>
          URL pública histórica (opcional)
          <input
            name="public_path"
            defaultValue={defaults.public_path ?? ''}
            placeholder="/de/kolumbianisches-lechona-rezept/"
          />
          <FieldError errors={e.public_path} />
        </label>
      )}

      <label>
        Título
        <input name="title" required defaultValue={defaults.title} />
        <FieldError errors={e.title} />
      </label>

      <label>
        Slug (URL)
        <input name="slug" required defaultValue={defaults.slug} placeholder="lechona-colombiana" />
        <FieldError errors={e.slug} />
      </label>

      <label>
        Resumen (meta description y tarjetas)
        <textarea name="excerpt" rows={2} defaultValue={defaults.excerpt ?? ''} />
        <FieldError errors={e.excerpt} />
      </label>

      <label>
        Categoría
        <input name="category" defaultValue={defaults.category ?? ''} />
        <FieldError errors={e.category} />
      </label>

      <label>
        Preparación (min)
        <input name="prep_time_minutes" inputMode="numeric" defaultValue={defaults.prep_time_minutes ?? ''} />
        <FieldError errors={e.prep_time_minutes} />
      </label>

      <label>
        Cocción (min)
        <input name="cook_time_minutes" inputMode="numeric" defaultValue={defaults.cook_time_minutes ?? ''} />
        <FieldError errors={e.cook_time_minutes} />
      </label>

      <label>
        Porciones
        <input name="servings" inputMode="numeric" defaultValue={defaults.servings ?? ''} />
        <FieldError errors={e.servings} />
      </label>

      <label>
        URL de imagen (https, dominio permitido)
        <input name="image_url" type="url" defaultValue={defaults.image_url ?? ''} />
        <FieldError errors={e.image_url} />
      </label>

      <label>
        Ingredientes — una línea por ingrediente: cantidad | unidad | nombre
        <textarea
          name="ingredients"
          rows={8}
          required
          defaultValue={defaults.ingredientsText}
          placeholder={'200 | g | harina de trigo\n2 | huevos'}
        />
        <FieldError errors={e.ingredients} />
      </label>

      <label>
        Pasos — separados por una línea en blanco; primera línea = título del paso
        <textarea
          name="steps"
          rows={10}
          required
          defaultValue={defaults.stepsText}
          placeholder={'Preparar el adobo\nLicuar cebolla, ajo y comino.\n\nHornear\nHornear 3 horas a 180 °C.'}
        />
        <FieldError errors={e.steps} />
      </label>

      <label>
        <input name="published" type="checkbox" defaultChecked={defaults.published ?? false} />
        Publicada
      </label>

      {state.message && <p role="alert">{state.message}</p>}
      <SubmitButton label={submitLabel} />
    </form>
  )
}
