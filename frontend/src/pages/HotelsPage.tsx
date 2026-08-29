import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Logo from '../components/ui/Logo'
import HotelCard from '../components/hotel/HotelCard'
import Modal from '../components/ui/Modal'
import BookNowForm from '../components/booking/BookNowForm'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { listAllHotels } from '../lib/hotelApi'
import type { Hotel } from '../lib/hotelApi'
import { createBooking } from '../lib/bookingApi'

/** Extract a human-readable message from an API response body, if present. */
function messageFrom(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'message' in data) {
    const m = (data as { message?: unknown }).message
    if (typeof m === 'string' && m.trim()) return m
  }
  return fallback
}

/** User-facing page: browse all hotels (route: /hotels). */
export default function HotelsPage() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookForHotel, setBookForHotel] = useState<Hotel | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await listAllHotels()
      if (result.ok && result.data?.success) {
        setHotels(result.data.data ?? [])
      } else {
        setError(
          messageFrom(result.data, `Could not load hotels (status ${result.status}).`),
        )
      }
    } catch (err) {
      console.error('[hotels] list error →', err)
      setError('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

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
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Browse hotels</h1>
              <p className="mt-2 text-slate-600">
                Find your next stay from our list of hotels.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate('/bookings')} variant="secondary" size="sm">
                My bookings
              </Button>
              <Button
                onClick={() => void load()}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                {loading ? 'Refreshing…' : 'Refresh'}
              </Button>
            </div>
          </div>

          <div className="mt-8">
            {loading ? (
              <p className="text-sm text-slate-500" role="status">
                Loading hotels…
              </p>
            ) : error ? (
              <p className="text-sm text-rose-600" role="alert">
                {error}
              </p>
            ) : hotels.length === 0 ? (
              <p className="text-sm text-slate-500">No hotels available right now.</p>
            ) : (
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hotels.map((hotel) => (
                  <li key={hotel.id}>
                    <HotelCard hotel={hotel} onBookNow={setBookForHotel} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </main>

      <Modal
        isOpen={bookForHotel !== null}
        onClose={() => setBookForHotel(null)}
        title={bookForHotel ? `Book ${bookForHotel.name}` : 'Book now'}
      >
        {bookForHotel && (
          <BookNowForm
            hotelId={bookForHotel.id}
            onSubmit={async (values) => {
              const payload = { hotelId: bookForHotel.id, ...values }
              console.log('[booking] creating →', payload)
              try {
                const result = await createBooking(payload)
                if (result.ok) {
                  showToast('success', messageFrom(result.data, 'Booking confirmed!'))
                  setBookForHotel(null)
                } else {
                  // Keep the modal open so the user can adjust and retry.
                  showToast(
                    'error',
                    messageFrom(result.data, `Could not book (status ${result.status}).`),
                  )
                }
              } catch (err) {
                console.error('[booking] request error →', err)
                showToast('error', 'Could not reach the server. Please try again.')
              }
            }}
          />
        )}
      </Modal>
    </div>
  )
}
