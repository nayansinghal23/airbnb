import { useNavigate } from 'react-router-dom'
import Button from './ui/Button'
import Container from './ui/Container'
import Logo from './ui/Logo'
import { useAuthDialog } from '../context/AuthDialogContext'
import { useAuth } from '../context/AuthContext'

/** Top navigation with brand and auth actions. */
export default function Navbar() {
  const { openLogin, openRegister } = useAuthDialog()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <Container>
        <nav
          aria-label="Primary"
          className="flex h-16 items-center justify-between gap-4"
        >
          <a
            href="/"
            className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            aria-label="StayEase home"
          >
            <Logo />
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Button onClick={() => navigate('/admin')} variant="ghost" size="sm">
                    Dashboard
                  </Button>
                )}
                <Button onClick={logout} variant="secondary" size="sm">
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button onClick={openLogin} variant="ghost" size="sm">
                  Log in
                </Button>
                <Button onClick={openRegister} variant="primary" size="sm">
                  Register
                </Button>
              </>
            )}
          </div>
        </nav>
      </Container>
    </header>
  )
}
