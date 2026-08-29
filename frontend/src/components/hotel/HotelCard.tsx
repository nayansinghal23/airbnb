import type { Hotel } from '../../lib/hotelApi'

/** Presentational browse card for a single hotel (user-facing). */
export default function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 truncate text-lg font-semibold text-slate-900">
          {hotel.name}
        </h3>
        {hotel.rating != null && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            ★ {hotel.rating}
          </span>
        )}
      </div>

      <p className="mt-2 flex-1 text-sm text-slate-600">{hotel.address}</p>

      <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-rose-600">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {hotel.location}
      </p>
    </article>
  )
}
