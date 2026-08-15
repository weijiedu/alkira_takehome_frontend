import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './auth.css'

function getCodeError(code: string): string | undefined {
  if (!code) {
    return 'Verification code is required.'
  }

  if (!/^\d{6}$/.test(code)) {
    return 'Enter a 6-digit verification code.'
  }

  return undefined
}

export function MfaPage() {
  const { user, pendingUser, verifyMfa, logout } = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Verify identity | Alkira'
  }, [])

  // Successful MFA clears pendingUser before this page unmounts. Send that
  // case to the dashboard instead of treating it as a missing login.
  if (pendingUser === null) {
    return <Navigate to={user ? '/dashboard' : '/login'} replace />
  }

  function handleCodeChange(event: ChangeEvent<HTMLInputElement>) {
    setCode(event.target.value)
    setError(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextCode = code.trim()
    const codeError = getCodeError(nextCode)

    if (codeError) {
      setError(codeError)
      return
    }

    if (!verifyMfa(nextCode)) {
      setError('Invalid verification code.')
      return
    }

    navigate('/dashboard')
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="auth-brand">Alkira</p>
        <h1>Verify your identity</h1>
        <p className="auth-lead">
          Enter the 6-digit verification code to finish signing in.
        </p>
        <p className="auth-context">
          Continuing as <strong>{pendingUser.email}</strong>
        </p>

        {/* Native browser bubbles would conflict with the inline field errors. */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="verification-code">
              Verification code
            </label>
            <input
              className="input"
              id="verification-code"
              name="one-time-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              spellCheck={false}
              value={code}
              onChange={handleCodeChange}
              aria-invalid={error ? true : undefined}
              aria-describedby={
                error ? 'mfa-help code-error' : 'mfa-help'
              }
            />
            <p id="mfa-help" className="field-hint">
              Enter your 6-digit verification code.
            </p>
            {error ? (
              <p id="code-error" className="field-error" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <button className="btn btn-primary" type="submit">
            Verify
          </button>
        </form>

        <p className="auth-footer">
          <Link className="auth-link" to="/login" onClick={logout}>
            Back to login
          </Link>
        </p>
      </div>
    </main>
  )
}
