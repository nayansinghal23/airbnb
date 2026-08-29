import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { logoutUser } from '../lib/authApi'

export interface AuthUser {
  userId: number
  email: string
  token: string
  role?: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  /** Persist a signed-in user (after login). */
  setSession: (user: AuthUser) => void
  /** Update just the role once it has been fetched. */
  setRole: (role: string) => void
  /** Clear local session and best-effort clear the server cookie. */
  logout: () => void
}

const STORAGE_KEY = 'stayease.auth'

const AuthContext = createContext<AuthContextValue | null>(null)

/** Access the persisted auth session. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

function readStored(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

/** Holds the current user and persists it to localStorage across reloads. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStored())

  // Keep localStorage in sync with the in-memory session.
  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* storage unavailable — ignore */
    }
  }, [user])

  const setSession = useCallback((next: AuthUser) => setUser(next), [])

  const setRole = useCallback(
    (role: string) => setUser((u) => (u ? { ...u, role } : u)),
    [],
  )

  const logout = useCallback(() => {
    setUser(null)
    // Best-effort: clear the httpOnly cookie on the server. Ignore failures.
    void logoutUser().catch(() => undefined)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: Boolean(user), setSession, setRole, logout }),
    [user, setSession, setRole, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
