/** Small, reusable field validators. Each returns an error string, or '' when valid. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function required(value: string, label = 'This field'): string {
  return value.trim() ? '' : `${label} is required.`
}

export function email(value: string): string {
  if (!value.trim()) return 'Email is required.'
  return EMAIL_RE.test(value.trim()) ? '' : 'Enter a valid email address.'
}

export function minLength(value: string, min: number, label = 'This field'): string {
  if (!value) return `${label} is required.`
  return value.length >= min ? '' : `${label} must be at least ${min} characters.`
}

export function oneOf(value: string, options: readonly string[], label = 'This field'): string {
  if (!value) return `${label} is required.`
  return options.includes(value) ? '' : `Select a valid ${label.toLowerCase()}.`
}

/** True when every value in an errors object is an empty string. */
export function isValid(errors: Record<string, string>): boolean {
  return Object.values(errors).every((e) => !e)
}
