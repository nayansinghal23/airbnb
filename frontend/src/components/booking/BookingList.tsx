import Button from '../ui/Button'
import type { Booking, BookingStatus } from '../../lib/bookingApi'

interface BookingListProps {
  bookings: Booking[]
  loading: boolean
  error: string | null
  /** Called when a PENDING booking's Confirm CTA is clicked. */
  onConfirm: (booking: Booking) => void
}

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const statusStyles: Record<BookingStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-slate-200 text-slate-600',
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const style = statusStyles[status] ?? 'bg-slate-100 text-slate-600'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {status}
    </span>
  )
}

/** Presentational list of a user's bookings with all UI states. */
export default function BookingList({ bookings, loading, error, onConfirm }: BookingListProps) {
  if (loading) {
    return (
      <p className="text-sm text-slate-500" role="status">
        Loading your bookings…
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-rose-600" role="alert">
        {error}
      </p>
    )
  }

  if (bookings.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        You have no bookings yet. Browse hotels and book your first stay.
      </p>
    )
  }

  return (
    <ul className="space-y-4">
      {bookings.map((booking) => (
        <li
          key={booking.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">Hotel #{booking.hotelId}</h3>
                <StatusBadge status={booking.status} />
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
                <span className="text-slate-400">
                  {' '}
                  · {booking.totalGuests} guest{booking.totalGuests > 1 ? 's' : ''}
                </span>
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {priceFormatter.format(booking.amount)}
              </p>
            </div>

            {booking.status === 'PENDING' && (
              <Button
                onClick={() => onConfirm(booking)}
                size="sm"
                className="shrink-0"
              >
                Confirm booking
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
