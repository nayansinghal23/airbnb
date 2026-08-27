import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

const base =
  'block w-full rounded-lg border px-3 py-2.5 text-slate-900 placeholder:text-slate-400 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:border-rose-500'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

/** Reusable text input primitive. Native props are forwarded. */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className = '', ...rest },
  ref,
) {
  const border = invalid ? 'border-rose-400' : 'border-slate-300'
  return <input ref={ref} className={`${base} ${border} ${className}`} {...rest} />
})

export default Input
