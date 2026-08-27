import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

const base =
  'block w-full rounded-lg border px-3 py-2.5 text-slate-900 bg-white ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:border-rose-500'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean
}

/** Reusable select primitive. Native props are forwarded. */
const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid = false, className = '', children, ...rest },
  ref,
) {
  const border = invalid ? 'border-rose-400' : 'border-slate-300'
  return (
    <select ref={ref} className={`${base} ${border} ${className}`} {...rest}>
      {children}
    </select>
  )
})

export default Select
