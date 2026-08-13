import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './LoginPage.css'

interface FieldErrors {
  email?: string
  password?: string
}

function getEmailError(email: string): string | undefined {
  if (!email) {
    return 'Email is required.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Enter a valid email address.'
  }

  return undefined
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
    <main className="login-page">
      <h1>Login</h1>

      {/* Native browser bubbles would conflict with the inline field errors. */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
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
            <p id="email-error" className="error" role="alert">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
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
            <p id="password-error" className="error" role="alert">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        {authError ? (
          <p className="error" role="alert">
            {authError}
          </p>
        ) : null}

        <button type="submit">Log in</button>
      </form>

      <p className="signup-prompt">
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </main>
  )
}
