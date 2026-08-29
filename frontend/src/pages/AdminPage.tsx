import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Logo from '../components/ui/Logo'
import CreateHotelForm from '../components/hotel/CreateHotelForm'
import HotelList from '../components/hotel/HotelList'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { createHotel, listHotelsByOwner, softDeleteHotel } from '../lib/hotelApi'
import type { Hotel } from '../lib/hotelApi'

/** Extract a human-readable message from an API response body, if present. */
function messageFrom(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'message' in data) {
    const m = (data as { message?: unknown }).message
    if (typeof m === 'string' && m.trim()) return m
  }
  return fallback
}

/** Admin dashboard. Access is guarded by RequireAdmin in the router. */
export default function AdminPage() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const ownerId = user?.userId

  const [hotels, setHotels] = useState<Hotel[]>([])
  const [hotelsLoading, setHotelsLoading] = useState(true)
  const [hotelsError, setHotelsError] = useState<string | null>(null)

  const loadHotels = useCallback(async () => {
    if (ownerId === undefined) return
    setHotelsLoading(true)
    setHotelsError(null)
    try {
      const result = await listHotelsByOwner(ownerId)
      if (result.ok && result.data?.success) {
        setHotels(result.data.data ?? [])
      } else {
        setHotelsError(
          messageFrom(result.data, `Could not load hotels (status ${result.status}).`),
        )
      }
    } catch (err) {
      console.error('[hotel] list error →', err)
      setHotelsError('Could not reach the server. Please try again.')
    } finally {
      setHotelsLoading(false)
    }
  }, [ownerId])

  useEffect(() => {
    void loadHotels()
  }, [loadHotels])

  const handleDeleteHotel = useCallback(
    async (hotel: Hotel) => {
      try {
        const result = await softDeleteHotel(hotel.id)
        if (result.ok) {
          showToast('success', messageFrom(result.data, `"${hotel.name}" deleted.`))
          // Optimistically drop it, then re-sync with the server.
          setHotels((list) => list.filter((h) => h.id !== hotel.id))
          void loadHotels()
        } else {
          showToast(
            'error',
            messageFrom(result.data, `Could not delete hotel (status ${result.status}).`),
          )
        }
      } catch (err) {
        console.error('[hotel] delete error →', err)
        showToast('error', 'Could not reach the server. Please try again.')
      }
    },
    [showToast, loadHotels],
  )

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
          <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
            Role: {user?.role ?? 'admin'}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Admin dashboard</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Welcome back. You are signed in as an administrator of StayEase.
          </p>

          <section
            aria-labelledby="add-hotel-heading"
            className="mt-8 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 id="add-hotel-heading" className="text-xl font-semibold text-slate-900">
              Add a hotel
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Create a new hotel listing. All fields are required.
            </p>

            <div className="mt-6">
              <CreateHotelForm
                onSubmit={async (values) => {
                  if (!user) throw new Error('Not authenticated')
                  try {
                    // ownerId comes from the auth context (the logged-in admin).
                    const result = await createHotel({ ...values, ownerId: user.userId })
                    if (result.ok) {
                      showToast(
                        'success',
                        messageFrom(result.data, `Hotel "${values.name}" created.`),
                      )
                      void loadHotels() // refresh the list
                    } else {
                      showToast(
                        'error',
                        messageFrom(
                          result.data,
                          `Could not create hotel (status ${result.status}).`,
                        ),
                      )
                      // Rethrow so the form keeps the entered values for retry.
                      throw new Error('create hotel failed')
                    }
                  } catch (err) {
                    console.error('[hotel] request error →', err)
                    showToast('error', 'Could not reach the server. Please try again.')
                    throw err
                  }
                }}
              />
            </div>
          </section>

          <section
            aria-labelledby="your-hotels-heading"
            className="mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id="your-hotels-heading"
                className="text-xl font-semibold text-slate-900"
              >
                Your hotels
              </h2>
              <Button
                onClick={() => void loadHotels()}
                variant="ghost"
                size="sm"
                disabled={hotelsLoading}
              >
                {hotelsLoading ? 'Refreshing…' : 'Refresh'}
              </Button>
            </div>

            <div className="mt-6">
              <HotelList
                hotels={hotels}
                loading={hotelsLoading}
                error={hotelsError}
                onDelete={handleDeleteHotel}
              />
            </div>
          </section>
        </Container>
      </main>
    </div>
  )
}
