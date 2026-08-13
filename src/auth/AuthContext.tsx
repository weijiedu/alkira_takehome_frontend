import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AuthenticatedUser } from './types'
import { verifyCredentials } from './verifyCredentials'

const MOCK_MFA_CODE = '123456'

interface AuthContextValue {
  user: AuthenticatedUser | null
  pendingUser: AuthenticatedUser | null
  login: (email: string, password: string) => boolean
  verifyMfa: (code: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [pendingUser, setPendingUser] = useState<AuthenticatedUser | null>(null)

  function login(email: string, password: string): boolean {
    const matchedUser = verifyCredentials(email, password)

    if (!matchedUser) {
      setUser(null)
      setPendingUser(null)
      return false
    }

    setPendingUser(matchedUser)
    setUser(null)
    return true
  }

  function verifyMfa(code: string): boolean {
    if (pendingUser === null) {
      return false
    }

    if (code !== MOCK_MFA_CODE) {
      return false
    }

    setUser(pendingUser)
    setPendingUser(null)
    return true
  }

  function logout() {
    setUser(null)
    setPendingUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, pendingUser, login, verifyMfa, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// useAuth is the public API for this context; colocating it is intentional.
// oxlint-disable-next-line only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
