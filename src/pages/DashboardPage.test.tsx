import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../auth/AuthContext'
import { SignIn } from '../test/SignIn'
import { DashboardPage } from './DashboardPage'

function renderDashboard(email: string) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <SignIn email={email} password="password123">
          <DashboardPage />
        </SignIn>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('Dashboard authorization', () => {
  it('disables Edit for read-only users', async () => {
    renderDashboard('readonly@alkira.test')

    const editButtons = await screen.findAllByRole('button', { name: 'Edit' })

    expect(editButtons.length).toBeGreaterThan(0)
    for (const button of editButtons) {
      expect(button).toBeDisabled()
    }
  })

  it('enables Edit for read-write users', async () => {
    renderDashboard('editor@alkira.test')

    const editButtons = await screen.findAllByRole('button', { name: 'Edit' })

    expect(editButtons.length).toBeGreaterThan(0)
    for (const button of editButtons) {
      expect(button).toBeEnabled()
    }
  })
})
