import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../auth/types'
import './DashboardPage.css'

interface NetworkConnection {
  id: string
  name: string
  status: 'Active' | 'Inactive'
  region: string
}

const INITIAL_CONNECTIONS: NetworkConnection[] = [
  {
    id: 'conn-prod',
    name: 'Production Network',
    status: 'Active',
    region: 'US West',
  },
  {
    id: 'conn-staging',
    name: 'Staging Network',
    status: 'Active',
    region: 'US East',
  },
  {
    id: 'conn-dev',
    name: 'Development Network',
    status: 'Inactive',
    region: 'EU West',
  },
]

function formatRole(role: Role): string {
  switch (role) {
    case 'read-only':
      return 'Read Only'
    case 'read-write':
      return 'Read / Write'
  }
}

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')

  // ProtectedRoute already redirected; this narrows `user` for the page.
  if (user === null) {
    return null
  }

  const canEdit = user.role === 'read-write'

  function startEdit(connection: NetworkConnection) {
    setEditingId(connection.id)
    setDraftName(connection.name)
  }

  function cancelEdit() {
    setEditingId(null)
    setDraftName('')
  }

  function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (editingId === null) {
      return
    }

    const nextName = draftName.trim()

    setConnections((current) =>
      current.map((connection) =>
        connection.id === editingId
          ? { ...connection, name: nextName || connection.name }
          : connection,
      ),
    )
    cancelEdit()
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Signed in as {user.email}</p>
          <p>Role: {formatRole(user.role)}</p>
        </div>
        <button type="button" className="secondary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section>
        <h2>Network Connections</h2>

        {!canEdit ? (
          <p className="permission-note">
            Read-only access — editing is unavailable.
          </p>
        ) : null}

        <ul className="connection-list">
          {connections.map((connection) => (
            <li key={connection.id} className="connection-card">
              {editingId === connection.id ? (
                <form className="edit-form" onSubmit={saveEdit}>
                  <label htmlFor="connection-name">Connection name</label>
                  <input
                    id="connection-name"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button type="submit">Save</button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <h3>{connection.name}</h3>
                    <p>Status: {connection.status}</p>
                    <p>Region: {connection.region}</p>
                  </div>
                  <button
                    type="button"
                    className="secondary"
                    disabled={!canEdit}
                    onClick={() => startEdit(connection)}
                  >
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
