import type { Hotel } from '../../lib/hotelApi'

interface HotelListProps {
  hotels: Hotel[]
  loading: boolean
  error: string | null
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Presentational list of an owner's hotels with loading / empty / error states. */
export default function HotelList({ hotels, loading, error }: HotelListProps) {
  if (loading) {
    return (
      <p className="text-sm text-slate-500" role="status">
        Loading hotels…
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

  if (hotels.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No hotels yet. Add your first hotel using the form above.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
      {hotels.map((hotel) => (
        <li key={hotel.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{hotel.name}</p>
            <p className="truncate text-sm text-slate-600">
              {hotel.address}
              <span className="text-slate-400"> · {hotel.location}</span>
            </p>
          </div>
          <p className="shrink-0 text-xs text-slate-400">
            Added {formatDate(hotel.createdAt)}
          </p>
        </li>
      ))}
    </ul>
  )
}
