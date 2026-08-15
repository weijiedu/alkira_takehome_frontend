import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getEmailError } from '../validation'
import './auth.css'

interface FieldErrors {
  email?: string
  password?: string
}

function getPasswordError(password: string): string | undefined {
  if (!password) {
    return 'Password is required.'
  }

  return undefined
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Log in | Alkira'
  }, [])

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    setAuthError(null)

    if (fieldErrors.email) {
      setFieldErrors((current) => ({ ...current, email: undefined }))
    }
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
    setAuthError(null)

    if (fieldErrors.password) {
      setFieldErrors((current) => ({ ...current, password: undefined }))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()
    const emailError = getEmailError(trimmedEmail)
    const passwordError = getPasswordError(password)
    const nextFieldErrors: FieldErrors = {}

    if (emailError) {
      nextFieldErrors.email = emailError
    }

    if (passwordError) {
      nextFieldErrors.password = passwordError
    }

    setFieldErrors(nextFieldErrors)
    setAuthError(null)

    if (emailError || passwordError) {
      return
    }

    if (!login(trimmedEmail, password)) {
      setAuthError('Invalid email or password.')
      return
    }

    navigate('/mfa')
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="auth-brand">Alkira</p>
        <h1>Log in</h1>
        <p className="auth-lead">Sign in to manage your network connections.</p>

        {/* Native browser bubbles would conflict with the inline field errors. */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              className="input"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email ? (
              <p id="email-error" className="field-error" role="alert">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={
                fieldErrors.password ? 'password-error' : undefined
              }
            />
            {fieldErrors.password ? (
              <p id="password-error" className="field-error" role="alert">
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          {authError ? (
            <p className="field-error" role="alert">
              {authError}
            </p>
          ) : null}

          <button className="btn btn-primary" type="submit">
            Log in
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link className="auth-link" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
