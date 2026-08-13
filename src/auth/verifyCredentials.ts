import { mockUsers } from './mockUsers'
import type { AuthenticatedUser } from './types'

export function verifyCredentials(
  email: string,
  password: string,
): AuthenticatedUser | null {
  const match = mockUsers.find(
    (user) => user.email === email && user.password === password,
  )

  if (!match) {
    return null
  }

  return {
    id: match.id,
    email: match.email,
    role: match.role,
  }
}
