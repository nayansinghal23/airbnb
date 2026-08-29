import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
import FormField from '../ui/FormField'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { isValid, required } from '../../lib/validators'
import { listRoomCategories } from '../../lib/hotelApi'
import type { RoomCategory } from '../../lib/hotelApi'

export interface BookingSubmit {
  totalGuests: number
  amount: number
  checkInDate: string // yyyy-mm-dd
  checkOutDate: string // yyyy-mm-dd
  roomCategoryId: number
}

interface FormValues {
  totalGuests: string
  checkInDate: string
  checkOutDate: string
  roomCategoryId: string
}

type Errors = Partial<Record<keyof FormValues, string>>

const initial: FormValues = {
  totalGuests: '',
  checkInDate: '',
  checkOutDate: '',
  roomCategoryId: '',
}

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function titleCase(v: string): string {
  return v.charAt(0) + v.slice(1).toLowerCase()
}

/** Nights between two yyyy-mm-dd dates (0 if invalid or non-positive). */
function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const inMs = Date.parse(`${checkIn}T00:00:00Z`)
  const outMs = Date.parse(`${checkOut}T00:00:00Z`)
  if (Number.isNaN(inMs) || Number.isNaN(outMs)) return 0
  const diff = Math.round((outMs - inMs) / 86_400_000)
  return diff > 0 ? diff : 0
}

interface BookNowFormProps {
  hotelId: number
  onSubmit: (values: BookingSubmit) => void | Promise<void>
}

/**
 * Booking form for a hotel. Fetches the hotel's room categories to populate the
 * dropdown and to price the stay. `amount` is computed as
 * price × guests × nights. All fields are required; hotelId is supplied by the parent.
 */
export default function BookNowForm({ hotelId, onSubmit }: BookNowFormProps) {
  const [categories, setCategories] = useState<RoomCategory[]>([])
  const [catLoading, setCatLoading] = useState(true)
  const [catError, setCatError] = useState<string | null>(null)

  const [values, setValues] = useState<FormValues>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    setCatLoading(true)
    setCatError(null)
    listRoomCategories(hotelId)
      .then((res) => {
        if (!active) return
        if (res.ok && res.data?.success) setCategories(res.data.data ?? [])
        else setCatError('Could not load room categories.')
      })
      .catch(() => active && setCatError('Could not load room categories.'))
      .finally(() => active && setCatLoading(false))
    return () => {
      active = false
    }
  }, [hotelId])

  const selectedCategory = useMemo(
    () => categories.find((c) => String(c.id) === values.roomCategoryId) ?? null,
    [categories, values.roomCategoryId],
  )

  const guests = Number(values.totalGuests)
  const nights = nightsBetween(values.checkInDate, values.checkOutDate)
  const amount =
    selectedCategory && Number.isInteger(guests) && guests > 0 && nights > 0
      ? selectedCategory.price * guests * nights
      : 0

  function update(field: keyof FormValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  function validate(): Errors {
    const next: Errors = {
      totalGuests: required(values.totalGuests, 'Total guests'),
      checkInDate: required(values.checkInDate, 'Check-in date'),
      checkOutDate: required(values.checkOutDate, 'Check-out date'),
      roomCategoryId: values.roomCategoryId ? '' : 'Room category is required.',
    }
    if (!next.totalGuests && (!Number.isInteger(guests) || guests < 1)) {
      next.totalGuests = 'Enter a valid number of guests (at least 1).'
    }
    if (!next.checkInDate && !next.checkOutDate && nights < 1) {
      next.checkOutDate = 'Check-out must be after check-in.'
    }
    return next
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (!isValid(nextErrors as Record<string, string>)) return
    if (!selectedCategory) return

    setSubmitting(true)
    try {
      await onSubmit({
        totalGuests: guests,
        amount,
        checkInDate: values.checkInDate,
        checkOutDate: values.checkOutDate,
        roomCategoryId: selectedCategory.id,
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (catLoading) {
    return (
      <p className="text-sm text-slate-500" role="status">
        Loading room options…
      </p>
    )
  }

  if (catError) {
    return (
      <p className="text-sm text-rose-600" role="alert">
        {catError}
      </p>
    )
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        This hotel has no room categories available to book.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField id="booking-room-category" label="Room category" error={errors.roomCategoryId}>
        {(field) => (
          <Select
            {...field}
            invalid={field['aria-invalid']}
            value={values.roomCategoryId}
            onChange={(e) => update('roomCategoryId', e.target.value)}
          >
            <option value="" disabled>
              Select a room category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {titleCase(c.roomType)} — {priceFormatter.format(c.price)}/night
              </option>
            ))}
          </Select>
        )}
      </FormField>

      <FormField id="booking-guests" label="Total guests" error={errors.totalGuests}>
        {(field) => (
          <Input
            {...field}
            type="number"
            min={1}
            step={1}
            placeholder="2"
            invalid={field['aria-invalid']}
            value={values.totalGuests}
            onChange={(e) => update('totalGuests', e.target.value)}
          />
        )}
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id="booking-checkin" label="Check-in" error={errors.checkInDate}>
          {(field) => (
            <Input
              {...field}
              type="date"
              invalid={field['aria-invalid']}
              value={values.checkInDate}
              onChange={(e) => update('checkInDate', e.target.value)}
            />
          )}
        </FormField>

        <FormField id="booking-checkout" label="Check-out" error={errors.checkOutDate}>
          {(field) => (
            <Input
              {...field}
              type="date"
              invalid={field['aria-invalid']}
              value={values.checkOutDate}
              onChange={(e) => update('checkOutDate', e.target.value)}
            />
          )}
        </FormField>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
        <span className="text-sm text-slate-600">
          Total amount
          {nights > 0 && (
            <span className="text-slate-400">
              {' '}
              ({nights} night{nights > 1 ? 's' : ''})
            </span>
          )}
        </span>
        <span className="text-lg font-semibold text-slate-900">
          {amount > 0 ? priceFormatter.format(amount) : '—'}
        </span>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? 'Booking…' : 'Save booking'}
      </Button>
    </form>
  )
}
