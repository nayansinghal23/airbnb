import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Logo from '../components/ui/Logo'
import CreateHotelForm from '../components/hotel/CreateHotelForm'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { createHotel } from '../lib/hotelApi'

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
        </Container>
      </main>
    </div>
  )
}
