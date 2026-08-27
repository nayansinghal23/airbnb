import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Modal from '../components/ui/Modal'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import { registerUser } from '../lib/authApi'
import { useToast } from './ToastContext'

type DialogType = 'login' | 'register' | null

/** Pull a human-readable message out of an API response body, if present. */
function messageFrom(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'message' in data) {
    const m = (data as { message?: unknown }).message
    if (typeof m === 'string' && m.trim()) return m
  }
  return fallback
}

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
  const { showToast } = useToast()

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
          onSuccess={async (values) => {
            console.log('[register] submitting →', values)
            try {
              const result = await registerUser(values)
              if (result.ok) {
                console.log(
                  `[register] success (status ${result.status}) →`,
                  result.data,
                )
                showToast(
                  'success',
                  messageFrom(result.data, 'Account created successfully!'),
                )
                close()
              } else {
                console.warn(
                  `[register] failed (status ${result.status}) →`,
                  result.data,
                )
                showToast(
                  'error',
                  messageFrom(result.data, `Registration failed (status ${result.status}).`),
                )
              }
            } catch (err) {
              console.error('[register] network/request error →', err)
              showToast(
                'error',
                'Could not reach the server. Please try again.',
              )
            }
          }}
        />
      </Modal>
    </AuthDialogContext.Provider>
  )
}
