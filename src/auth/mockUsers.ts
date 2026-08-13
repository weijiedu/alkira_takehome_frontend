import type { User } from './types'

export const mockUsers: User[] = [
  {
    id: 'user-readonly',
    email: 'readonly@alkira.test',
    password: 'password123',
    role: 'read-only',
  },
  {
    id: 'user-editor',
    email: 'editor@alkira.test',
    password: 'password123',
    role: 'read-write',
  },
]
