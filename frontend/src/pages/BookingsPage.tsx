import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Logo from '../components/ui/Logo'
import BookingList from '../components/booking/BookingList'
import { useAuth } from '../context/AuthContext'
import { listUserBookings } from '../lib/bookingApi'
import type { Booking } from '../lib/bookingApi'

/** Extract a human-readable message from an API response body, if present. */
function messageFrom(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'message' in data) {
    const m = (data as { message?: unknown }).message
    if (typeof m === 'string' && m.trim()) return m
  }
  return fallback
}

/** User-facing page: the signed-in user's bookings (route: /bookings). */
export default function BookingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const userId = user?.userId

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (userId === undefined) return
    setLoading(true)
    setError(null)
    try {
      const result = await listUserBookings(userId)
      if (result.ok && result.data?.success) {
        setBookings(result.data.data ?? [])
      } else {
        setError(
          messageFrom(result.data, `Could not load bookings (status ${result.status}).`),
        )
      }
    } catch (err) {
      console.error('[bookings] list error →', err)
      setError('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [userId])

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
            <Logo />
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-600 sm:inline">
                {user?.email}
              </span>
              <Button onClick={handleLogout} variant="secondary" size="sm">
                Log out
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <main className="flex-1">
        <Container className="py-10">
          <Link
            to="/hotels"
            className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">←</span> Browse hotels
          </Link>

          <div className="mt-6 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">My bookings</h1>
            <Button
              onClick={() => void load()}
              variant="ghost"
              size="sm"
              disabled={loading}
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>

          <div className="mt-8 max-w-3xl">
            <BookingList
              bookings={bookings}
              loading={loading}
              error={error}
              onConfirm={(booking) => {
                // No confirm API yet — just log for now.
                console.log('[booking] confirm clicked →', booking)
              }}
            />
          </div>
        </Container>
      </main>
    </div>
  )
}
