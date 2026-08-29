import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
import FormField from '../ui/FormField'
import Input from '../ui/Input'
import { isValid, required } from '../../lib/validators'

export interface HotelValues {
  name: string
  address: string
  location: string
}

type Errors = Partial<Record<keyof HotelValues, string>>

const initial: HotelValues = { name: '', address: '', location: '' }

function validate(values: HotelValues): Errors {
  return {
    name: required(values.name, 'Name'),
    address: required(values.address, 'Address'),
    location: required(values.location, 'Location'),
  }
}

interface CreateHotelFormProps {
  onSubmit: (values: HotelValues) => void | Promise<void>
}

/** Form to create a hotel: name, address, location — all required. */
export default function CreateHotelForm({ onSubmit }: CreateHotelFormProps) {
  const [values, setValues] = useState<HotelValues>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  function update(field: keyof HotelValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  function reset() {
    setValues(initial)
    setErrors({})
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (!isValid(nextErrors as Record<string, string>)) return

    setSubmitting(true)
    try {
      await onSubmit(values)
      reset() // clear only on success
    } catch {
      // Parent surfaces the error (toast); keep values so the user can retry.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField id="hotel-name" label="Name" error={errors.name}>
        {(field) => (
          <Input
            {...field}
            type="text"
            placeholder="Radisson Blu"
            invalid={field['aria-invalid']}
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
          />
        )}
      </FormField>

      <FormField id="hotel-address" label="Address" error={errors.address}>
        {(field) => (
          <Input
            {...field}
            type="text"
            placeholder="Dwarka, New Delhi"
            invalid={field['aria-invalid']}
            value={values.address}
            onChange={(e) => update('address', e.target.value)}
          />
        )}
      </FormField>

      <FormField id="hotel-location" label="Location" error={errors.location}>
        {(field) => (
          <Input
            {...field}
            type="text"
            placeholder="New Delhi"
            invalid={field['aria-invalid']}
            value={values.location}
            onChange={(e) => update('location', e.target.value)}
          />
        )}
      </FormField>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
        {submitting ? 'Adding hotel…' : 'Add hotel'}
      </Button>
    </form>
  )
}
