import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Modal from '../components/ui/Modal'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

type DialogType = 'login' | 'register' | null

interface AuthDialogContextValue {
  openLogin: () => void
  openRegister: () => void
}

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null)

/** Access the auth dialog controls (open login / register). */
export function useAuthDialog(): AuthDialogContextValue {
  const ctx = useContext(AuthDialogContext)
  if (!ctx) throw new Error('useAuthDialog must be used within an AuthDialogProvider')
  return ctx
}

/**
 * Holds which auth dialog is open and renders the Login / Register modals so
 * any button in the tree can trigger them via useAuthDialog().
 */
export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogType>(null)

  const openLogin = useCallback(() => setDialog('login'), [])
  const openRegister = useCallback(() => setDialog('register'), [])
  const close = useCallback(() => setDialog(null), [])

  const value = useMemo(() => ({ openLogin, openRegister }), [openLogin, openRegister])

  return (
    <AuthDialogContext.Provider value={value}>
      {children}

      <Modal isOpen={dialog === 'login'} onClose={close} title="Log in to StayEase">
        <LoginForm
          onSuccess={(values) => {
            // No API yet — wire up the login request here later.
            console.log('login submit', values)
            close()
          }}
        />
      </Modal>

      <Modal isOpen={dialog === 'register'} onClose={close} title="Create your account">
        <RegisterForm
          onSuccess={(values) => {
            // No API yet — wire up the register request here later.
            console.log('register submit', values)
            close()
          }}
        />
      </Modal>
    </AuthDialogContext.Provider>
  )
}
