export type Role = 'read-only' | 'read-write'

export interface AuthenticatedUser {
  id: string
  email: string
  role: Role
}

export interface MockUser extends AuthenticatedUser {
  password: string
}
