import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../auth/AuthContext'
import { SignIn } from '../test/SignIn'
import { ProtectedRoute } from './ProtectedRoute'

function renderProtected(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route
            path="/secret"
            element={
              <ProtectedRoute>
                <p>Protected content</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    renderProtected('/secret')

    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('shows protected content to authenticated users', async () => {
    render(
      <MemoryRouter initialEntries={['/secret']}>
        <AuthProvider>
          <SignIn email="editor@alkira.test" password="password123">
            <Routes>
              <Route path="/login" element={<p>Login page</p>} />
              <Route
                path="/secret"
                element={
                  <ProtectedRoute>
                    <p>Protected content</p>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SignIn>
        </AuthProvider>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Protected content')).toBeInTheDocument()
    expect(screen.queryByText('Login page')).not.toBeInTheDocument()
  })
})
