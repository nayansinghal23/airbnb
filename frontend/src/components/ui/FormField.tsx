import type { ReactNode } from 'react'

interface FormFieldProps {
  id: string
  label: string
  /** Error message to display; when present the field is styled/marked invalid. */
  error?: string
  /** Render-prop receiving the wiring the control needs for accessibility. */
  children: (field: {
    id: string
    'aria-invalid': boolean
    'aria-describedby'?: string
  }) => ReactNode
}

/**
 * Labels a form control and shows its validation error, wiring up
 * `aria-invalid` and `aria-describedby` for screen readers.
 */
export default function FormField({ id, label, error, children }: FormFieldProps) {
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="mt-1.5">
        {children({
          id,
          'aria-invalid': Boolean(error),
          'aria-describedby': error ? errorId : undefined,
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
}
