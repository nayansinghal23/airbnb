import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Logo from '../components/ui/Logo'
import RoomCategoryList from '../components/hotel/RoomCategoryList'
import { useAuth } from '../context/AuthContext'
import { listRoomCategories } from '../lib/hotelApi'
import type { RoomCategory } from '../lib/hotelApi'

/** Extract a human-readable message from an API response body, if present. */
function messageFrom(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'message' in data) {
    const m = (data as { message?: unknown }).message
    if (typeof m === 'string' && m.trim()) return m
  }
  return fallback
}

/** Room categories for a single hotel (dynamic route: /admin/hotels/:hotelId/room-categories). */
export default function RoomCategoriesPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [categories, setCategories] = useState<RoomCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const numericHotelId = Number(hotelId)
  const validHotelId = Number.isInteger(numericHotelId) && numericHotelId > 0

  const load = useCallback(async () => {
    if (!validHotelId) {
      setError('Invalid hotel id.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await listRoomCategories(numericHotelId)
      if (result.ok && result.data?.success) {
        setCategories(result.data.data ?? [])
      } else {
        setError(
          messageFrom(
            result.data,
            `Could not load room categories (status ${result.status}).`,
          ),
        )
      }
    } catch (err) {
      console.error('[room-categories] list error →', err)
      setError('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [numericHotelId, validHotelId])

  useEffect(() => {
    void load()
  }, [load])

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Link
              to="/admin"
              className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
              aria-label="Back to admin dashboard"
            >
              <Logo />
            </Link>
            <Button onClick={handleLogout} variant="secondary" size="sm">
              Log out
            </Button>
          </div>
        </Container>
      </header>

      <main className="flex-1">
        <Container className="py-10">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">←</span> Back to hotels
          </Link>

          <section
            aria-labelledby="room-categories-heading"
            className="mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1
                  id="room-categories-heading"
                  className="text-2xl font-bold tracking-tight"
                >
                  Room categories
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {validHotelId ? `Hotel #${numericHotelId}` : 'Unknown hotel'}
                </p>
              </div>
              <Button
                onClick={() => void load()}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                {loading ? 'Refreshing…' : 'Refresh'}
              </Button>
            </div>

            <div className="mt-6">
              <RoomCategoryList categories={categories} loading={loading} error={error} />
            </div>
          </section>
        </Container>
      </main>
    </div>
  )
}
