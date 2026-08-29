import type { RoomCategory } from '../../lib/hotelApi'

interface RoomCategoryListProps {
  categories: RoomCategory[]
  loading: boolean
  error: string | null
  /** Optional handler; when provided each row gets an "Add rooms" action. */
  onAddRooms?: (category: RoomCategory) => void
}

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function titleCase(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase()
}

/** Presentational table of a hotel's room categories with all UI states. */
export default function RoomCategoryList({
  categories,
  loading,
  error,
  onAddRooms,
}: RoomCategoryListProps) {
  if (loading) {
    return (
      <p className="text-sm text-slate-500" role="status">
        Loading room categories…
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

  if (categories.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No room categories found for this hotel.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <caption className="sr-only">Room categories</caption>
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Room type
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Price / night
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Rooms
            </th>
            {onAddRooms && (
              <th scope="col" className="px-4 py-3 text-right font-medium">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {categories.map((category) => (
            <tr key={category.id}>
              <th scope="row" className="px-4 py-3 font-medium text-slate-900">
                <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">
                  {titleCase(category.roomType)}
                </span>
              </th>
              <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                {priceFormatter.format(category.price)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                {category.roomCount}
              </td>
              {onAddRooms && (
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onAddRooms(category)}
                    aria-label={`Add rooms to ${titleCase(category.roomType)} category`}
                    className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                  >
                    Add rooms
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
