import { fireEvent, render, screen } from '@testing-library/react'
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
  it('hides Edit for read-only users', async () => {
    renderDashboard('readonly@alkira.test')

    expect(
      await screen.findByText('Production Network'),
    ).toBeInTheDocument()
    expect(screen.getByText('Staging Network')).toBeInTheDocument()
    expect(screen.getByText('Development Network')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Edit' }),
    ).not.toBeInTheDocument()
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

describe('Dashboard editing', () => {
  it('saves name, status, and region locally', async () => {
    renderDashboard('editor@alkira.test')

    const editButtons = await screen.findAllByRole('button', { name: 'Edit' })
    fireEvent.click(editButtons[0])

    fireEvent.change(screen.getByLabelText('Connection name'), {
      target: { value: 'Prod Core' },
    })
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'Inactive' },
    })
    fireEvent.change(screen.getByLabelText('Region'), {
      target: { value: 'Asia East (asia-east-1)' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    const savedCard = screen.getByText('Prod Core').closest('li')

    expect(savedCard).toHaveTextContent('Status: Inactive')
    expect(savedCard).toHaveTextContent('Region: Asia East (asia-east-1)')
  })

  it('restores original values on cancel', async () => {
    renderDashboard('editor@alkira.test')

    const editButtons = await screen.findAllByRole('button', { name: 'Edit' })
    fireEvent.click(editButtons[0])

    fireEvent.change(screen.getByLabelText('Connection name'), {
      target: { value: 'Temporary Name' },
    })
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'Inactive' },
    })
    fireEvent.change(screen.getByLabelText('Region'), {
      target: { value: 'Asia East (asia-east-1)' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.getByText('Production Network')).toBeInTheDocument()
    expect(screen.queryByText('Temporary Name')).not.toBeInTheDocument()
    expect(
      screen.getByText('Region: US West (us-west-2)'),
    ).toBeInTheDocument()
  })
})
