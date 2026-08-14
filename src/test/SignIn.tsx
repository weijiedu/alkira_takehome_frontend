import { useEffect, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'

export function SignIn({
  email,
  password,
  children,
}: {
  email: string
  password: string
  children: ReactNode
}) {
  const { user, pendingUser, login, verifyMfa } = useAuth()

  useEffect(() => {
    if (user === null && pendingUser === null) {
      login(email, password)
    }
  }, [email, login, password, pendingUser, user])

  useEffect(() => {
    if (pendingUser !== null && user === null) {
      verifyMfa('123456')
    }
  }, [pendingUser, user, verifyMfa])

  if (user === null) {
    return null
  }

  return children
}
