import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
import FormField from '../ui/FormField'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { isValid, oneOf, required } from '../../lib/validators'
import { SCHEDULE_TYPES } from '../../lib/roomApi'
import type { ScheduleType } from '../../lib/roomApi'
import type { RoomCategory } from '../../lib/hotelApi'

export interface AddRoomsSubmit {
  startDate: string // ISO datetime
  endDate: string // ISO datetime
  scheduleType: ScheduleType
}

interface FormValues {
  startDate: string // yyyy-mm-dd
  endDate: string // yyyy-mm-dd
  scheduleType: ScheduleType | ''
}

type Errors = Partial<Record<keyof FormValues, string>>

const initial: FormValues = { startDate: '', endDate: '', scheduleType: '' }

/** Convert a yyyy-mm-dd date input into a UTC-midnight ISO string. */
function toIso(date: string): string {
  return `${date}T00:00:00.000Z`
}

function validate(values: FormValues): Errors {
  const errors: Errors = {
    startDate: required(values.startDate, 'Start date'),
    endDate: required(values.endDate, 'End date'),
    scheduleType: oneOf(values.scheduleType, SCHEDULE_TYPES, 'Schedule type'),
  }
  // End date must not precede start date.
  if (!errors.startDate && !errors.endDate && values.endDate < values.startDate) {
    errors.endDate = 'End date must be on or after the start date.'
  }
  return errors
}

interface AddRoomsFormProps {
  category: RoomCategory
  onSubmit: (values: AddRoomsSubmit) => void | Promise<void>
}

/** Form to add rooms to a category: start date, end date, schedule type (all required). */
export default function AddRoomsForm({ category, onSubmit }: AddRoomsFormProps) {
  const [values, setValues] = useState<FormValues>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  function update(field: keyof FormValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (!isValid(nextErrors as Record<string, string>)) return

    setSubmitting(true)
    try {
      await onSubmit({
        startDate: toIso(values.startDate),
        endDate: toIso(values.endDate),
        scheduleType: values.scheduleType as ScheduleType,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <span className="block text-sm font-medium text-slate-700">Room category</span>
        <p className="mt-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
          #{category.id} · {category.roomType}
        </p>
      </div>

      <FormField id="room-start-date" label="Start date" error={errors.startDate}>
        {(field) => (
          <Input
            {...field}
            type="date"
            invalid={field['aria-invalid']}
            value={values.startDate}
            onChange={(e) => update('startDate', e.target.value)}
          />
        )}
      </FormField>

      <FormField id="room-end-date" label="End date" error={errors.endDate}>
        {(field) => (
          <Input
            {...field}
            type="date"
            invalid={field['aria-invalid']}
            value={values.endDate}
            onChange={(e) => update('endDate', e.target.value)}
          />
        )}
      </FormField>

      <FormField id="room-schedule-type" label="Schedule type" error={errors.scheduleType}>
        {(field) => (
          <Select
            {...field}
            invalid={field['aria-invalid']}
            value={values.scheduleType}
            onChange={(e) => update('scheduleType', e.target.value)}
          >
            <option value="" disabled>
              Select a schedule type
            </option>
            <option value="immediate">Immediate</option>
            <option value="scheduled">Scheduled</option>
          </Select>
        )}
      </FormField>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? 'Adding rooms…' : 'Add rooms'}
      </Button>
    </form>
  )
}
