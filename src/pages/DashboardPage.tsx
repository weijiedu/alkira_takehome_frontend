import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../auth/types'
import './DashboardPage.css'

type ConnectionStatus = 'Active' | 'Inactive'

const CONNECTION_STATUSES: ConnectionStatus[] = ['Active', 'Inactive']

const CONNECTION_REGIONS = [
  'US East',
  'US West',
  'Europe West',
  'Asia East',
] as const

type ConnectionRegion = (typeof CONNECTION_REGIONS)[number]

interface NetworkConnection {
  id: string
  name: string
  status: ConnectionStatus
  region: ConnectionRegion
}

interface ConnectionDraft {
  name: string
  status: ConnectionStatus
  region: ConnectionRegion
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
        region: 'Europe West',
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
  const [draft, setDraft] = useState<ConnectionDraft>({
    name: '',
    status: 'Active',
    region: CONNECTION_REGIONS[0],
  })

  useEffect(() => {
    document.title = 'Dashboard | Alkira'
  }, [])

  // ProtectedRoute already redirected; this narrows `user` for the page.
  if (user === null) {
    return null
  }

  const canEdit = user.role === 'read-write'

  function startEdit(connection: NetworkConnection) {
    setEditingId(connection.id)
    setDraft({
      name: connection.name,
      status: connection.status,
      region: connection.region,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft({
      name: '',
      status: 'Active',
      region: CONNECTION_REGIONS[0],
    })
  }

  function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (editingId === null) {
      return
    }

    const nextName = draft.name.trim()

    setConnections((current) =>
      current.map((connection) =>
        connection.id === editingId
          ? {
              ...connection,
              name: nextName || connection.name,
              status: draft.status,
              region: draft.region,
            }
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
        <div className="dashboard-header-inner">
          <div className="dashboard-identity">
            <p className="dashboard-brand">Alkira</p>
            <h1>Dashboard</h1>
            <p className="dashboard-user">Signed in as {user.email}</p>
          </div>
          <div className="dashboard-header-actions">
            <p className="role-badge">Role: {formatRole(user.role)}</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-section-heading">
          <h2>Network Connections</h2>
          {!canEdit ? (
            <p className="permission-note">
              Read-only access — editing is unavailable.
            </p>
          ) : null}
        </div>

        <ul className="connection-list">
          {connections.map((connection) => (
            <li
              key={connection.id}
              className={
                editingId === connection.id
                  ? 'connection-card is-editing'
                  : canEdit
                    ? 'connection-card'
                    : 'connection-card is-readonly'
              }
            >
              {editingId === connection.id ? (
                <form className="edit-form" onSubmit={saveEdit}>
                  <div className="field">
                    <label className="field-label" htmlFor="connection-name">
                      Connection name
                    </label>
                    <input
                      className="input"
                      id="connection-name"
                      value={draft.name}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      autoFocus
                    />
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="connection-status">
                      Status
                    </label>
                    <select
                      className="input"
                      id="connection-status"
                      value={draft.status}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          status: event.target.value as ConnectionStatus,
                        }))
                      }
                    >
                      {CONNECTION_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="connection-region">
                      Region
                    </label>
                    <select
                      className="input"
                      id="connection-region"
                      value={draft.region}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          region: event.target.value as ConnectionRegion,
                        }))
                      }
                    >
                      {CONNECTION_REGIONS.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="edit-actions">
                    <button className="btn btn-primary" type="submit">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="connection-name">{connection.name}</h3>
                  <p className="connection-status">
                    Status:{' '}
                    <span
                      className={
                        connection.status === 'Active'
                          ? 'status-badge is-active'
                          : 'status-badge is-inactive'
                      }
                    >
                      {connection.status}
                    </span>
                  </p>
                  <p className="connection-region">
                    Region: {connection.region}
                  </p>
                  {canEdit ? (
                    <button
                      type="button"
                      className="btn btn-secondary connection-action"
                      onClick={() => startEdit(connection)}
                    >
                      Edit
                    </button>
                  ) : null}
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
