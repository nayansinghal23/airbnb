import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Logo from '../components/ui/Logo'
import { useAuth } from '../context/AuthContext'

/** Admin dashboard. Access is guarded by RequireAdmin in the router. */
export default function AdminPage() {
  const { user, logout } = useAuth()
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
        </Container>
      </main>
    </div>
  )
}
