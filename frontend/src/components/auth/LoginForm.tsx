import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
import FormField from '../ui/FormField'
import Input from '../ui/Input'
import { email as validateEmail, isValid, minLength } from '../../lib/validators'

interface LoginValues {
  email: string
  password: string
}

type Errors = Partial<Record<keyof LoginValues, string>>

const initial: LoginValues = { email: '', password: '' }

function validate(values: LoginValues): Errors {
  return {
    email: validateEmail(values.email),
    password: minLength(values.password, 6, 'Password'),
  }
}

interface LoginFormProps {
  onSuccess: (values: LoginValues) => void
}

/** Login form: email + password, all required, validated client-side. No API yet. */
export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [values, setValues] = useState<LoginValues>(initial)
  const [errors, setErrors] = useState<Errors>({})

  function update(field: keyof LoginValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (isValid(nextErrors as Record<string, string>)) onSuccess(values)
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormField id="login-email" label="Email" error={errors.email}>
        {(field) => (
          <Input
            {...field}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            invalid={field['aria-invalid']}
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
          />
        )}
      </FormField>

      <FormField id="login-password" label="Password" error={errors.password}>
        {(field) => (
          <Input
            {...field}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            invalid={field['aria-invalid']}
            value={values.password}
            onChange={(e) => update('password', e.target.value)}
          />
        )}
      </FormField>

      <Button type="submit" size="lg" className="w-full">
        Log in
      </Button>
    </form>
  )
}
