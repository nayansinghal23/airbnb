import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
import FormField from '../ui/FormField'
import Input from '../ui/Input'
import Select from '../ui/Select'
import {
  email as validateEmail,
  isValid,
  minLength,
  oneOf,
  required,
} from '../../lib/validators'

export const ROLES = ['user', 'admin'] as const
export type Role = (typeof ROLES)[number]

interface RegisterValues {
  username: string
  email: string
  password: string
  role: Role | ''
}

type Errors = Partial<Record<keyof RegisterValues, string>>

const initial: RegisterValues = { username: '', email: '', password: '', role: '' }

function validate(values: RegisterValues): Errors {
  return {
    username: required(values.username, 'Username'),
    email: validateEmail(values.email),
    password: minLength(values.password, 6, 'Password'),
    role: oneOf(values.role, ROLES, 'Role'),
  }
}

interface RegisterFormProps {
  onSuccess: (values: RegisterValues) => void | Promise<void>
}

/**
 * Register form: username, email, password (min 6), and role (user | admin).
 * All required, validated client-side. No API integration yet.
 */
export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [values, setValues] = useState<RegisterValues>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  function update(field: keyof RegisterValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (!isValid(nextErrors as Record<string, string>)) return

    setSubmitting(true)
    try {
      await onSuccess(values)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormField id="register-username" label="Username" error={errors.username}>
        {(field) => (
          <Input
            {...field}
            type="text"
            autoComplete="username"
            placeholder="janedoe"
            invalid={field['aria-invalid']}
            value={values.username}
            onChange={(e) => update('username', e.target.value)}
          />
        )}
      </FormField>

      <FormField id="register-email" label="Email" error={errors.email}>
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

      <FormField
        id="register-password"
        label="Password"
        error={errors.password}
      >
        {(field) => (
          <Input
            {...field}
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            invalid={field['aria-invalid']}
            value={values.password}
            onChange={(e) => update('password', e.target.value)}
          />
        )}
      </FormField>

      <FormField id="register-role" label="Role" error={errors.role}>
        {(field) => (
          <Select
            {...field}
            invalid={field['aria-invalid']}
            value={values.role}
            onChange={(e) => update('role', e.target.value)}
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Select>
        )}
      </FormField>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
