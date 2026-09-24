import { z } from 'zod'
import { getAllowedImageHosts } from '@/lib/image-hosts'
import type { RecipeIngredient, RecipeStep } from '@/types/recipe'

export const languageSchema = z.enum(['es', 'de', 'ja', 'it', 'fr', 'en'])

// Slug: minúsculas, números y guiones. Admite letras no latinas (japonés) porque el
// sitio anterior ya tiene URLs indexadas en japonés que conviene conservar.
const slugSchema = z
  .string()
  .trim()
  .min(1, 'El slug es obligatorio')
  .max(120, 'Máximo 120 caracteres')
  .regex(
    /^[\p{Ll}\p{Lo}\p{Lm}\p{M}\p{N}]+(?:-[\p{Ll}\p{Lo}\p{Lm}\p{M}\p{N}]+)*$/u,
    'Solo minúsculas, números y guiones (sin espacios ni guiones al inicio/fin)'
  )

const publicPathSchema = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
  z.string()
    .trim()
    .max(300, 'Máximo 300 caracteres')
    .regex(/^\/(?!\/)[^\\s?#]+$/u, 'La URL pública debe empezar por / y no contener espacios, ? o #')
    .optional()
)

const ingredientSchema = z.object({
  amount: z.string().trim().min(1).max(50),
  unit: z.string().trim().max(30).optional(),
  name: z.string().trim().min(1).max(200),
})

const stepSchema = z.object({
  title: z.string().trim().min(1).max(150),
  content: z.string().trim().min(1).max(5000),
})

// Campo vacío del formulario → undefined (evita que "" se convierta en 0).
function optionalInt(max: number) {
  return z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : v),
    z.coerce.number().int('Debe ser un número entero').min(0).max(max).optional()
  )
}

function optionalText(max: number) {
  return z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().trim().max(max).optional()
  )
}

const imageUrlSchema = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
  z
    .string()
    .trim()
    .url('URL no válida')
    .refine((value) => value.startsWith('https://'), 'La imagen debe usar https')
    .refine(
      (value) => getAllowedImageHosts().includes(new URL(value).hostname),
      'Dominio de imagen no permitido (ver NEXT_PUBLIC_IMAGE_HOSTS)'
    )
    .optional()
)

export const recipeFieldsSchema = z.object({
  slug: slugSchema,
  public_path: publicPathSchema,
  title: z.string().trim().min(3, 'Mínimo 3 caracteres').max(120, 'Máximo 120 caracteres'),
  excerpt: optionalText(300),
  category: optionalText(60),
  prep_time_minutes: optionalInt(1440),
  cook_time_minutes: optionalInt(2880),
  servings: optionalInt(500),
  image_url: imageUrlSchema,
  published: z.boolean(),
  ingredients: z.array(ingredientSchema).min(1, 'Al menos un ingrediente').max(100),
  steps: z.array(stepSchema).min(1, 'Al menos un paso').max(50),
})

export type RecipeFields = z.infer<typeof recipeFieldsSchema>

// Ingredientes: una línea por ingrediente.
//   "200 | g | harina de trigo"  → cantidad | unidad | nombre
//   "2 | huevos"                 → cantidad | nombre
export function parseIngredients(raw: string): Partial<RecipeIngredient>[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('|').map((p) => p.trim())
      if (parts.length >= 3) return { amount: parts[0], unit: parts[1] || undefined, name: parts.slice(2).join(' ') }
      if (parts.length === 2) return { amount: parts[0], name: parts[1] }
      return { amount: '', name: parts[0] } // falla la validación: falta cantidad
    })
}

// Pasos: bloques separados por una línea en blanco. Primera línea = título, resto = contenido.
// Un bloque de una sola línea se titula "Paso N".
export function parseSteps(raw: string): Partial<RecipeStep>[] {
  return raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const [first, ...rest] = block.split('\n')
      if (rest.length === 0) return { title: `Paso ${index + 1}`, content: first.trim() }
      return { title: first.trim(), content: rest.join('\n').trim() }
    })
}

export function ingredientsToText(ingredients: RecipeIngredient[]): string {
  return ingredients
    .map((i) => (i.unit ? `${i.amount} | ${i.unit} | ${i.name}` : `${i.amount} | ${i.name}`))
    .join('\n')
}

export function stepsToText(steps: RecipeStep[]): string {
  return steps.map((s) => `${s.title}\n${s.content}`).join('\n\n')
}

export function readRecipeForm(formData: FormData) {
  return recipeFieldsSchema.safeParse({
    slug: formData.get('slug'),
    public_path: formData.get('public_path'),
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    category: formData.get('category'),
    prep_time_minutes: formData.get('prep_time_minutes'),
    cook_time_minutes: formData.get('cook_time_minutes'),
    servings: formData.get('servings'),
    image_url: formData.get('image_url'),
    published: formData.get('published') === 'on',
    ingredients: parseIngredients(String(formData.get('ingredients') ?? '')),
    steps: parseSteps(String(formData.get('steps') ?? '')),
  })
}

export const uuidSchema = z.string().uuid()
