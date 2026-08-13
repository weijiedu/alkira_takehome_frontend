export type Role = 'read-only' | 'read-write'

export interface User {
  id: string
  email: string
  password: string
  role: Role
}
