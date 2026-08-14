import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './SignupPage.css'

interface FieldErrors {
  email?: string
  password?: string
  confirmPassword?: string
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

function getConfirmPasswordError(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) {
    return 'Confirm password is required.'
  }

  if (confirmPassword !== password) {
    return 'Passwords do not match.'
  }

  return undefined
}

export function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)

    if (fieldErrors.email) {
      setFieldErrors((current) => ({ ...current, email: undefined }))
    }
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)

    if (fieldErrors.password || fieldErrors.confirmPassword) {
      setFieldErrors((current) => ({
        ...current,
        password: undefined,
        confirmPassword: undefined,
      }))
    }
  }

  function handleConfirmPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(event.target.value)

    if (fieldErrors.confirmPassword) {
      setFieldErrors((current) => ({
        ...current,
        confirmPassword: undefined,
      }))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()
    const emailError = getEmailError(trimmedEmail)
    const passwordError = getPasswordError(password)
    const confirmPasswordError = getConfirmPasswordError(
      password,
      confirmPassword,
    )
    const nextFieldErrors: FieldErrors = {}

    if (emailError) {
      nextFieldErrors.email = emailError
    }

    if (passwordError) {
      nextFieldErrors.password = passwordError
    }

    if (confirmPasswordError) {
      nextFieldErrors.confirmPassword = confirmPasswordError
    }

    setFieldErrors(nextFieldErrors)

    if (emailError || passwordError || confirmPasswordError) {
      return
    }

    setSubmitted(true)
  }

  return (
    <main className="signup-page">
      <h1>Create Account</h1>

      {submitted ? (
        <p className="success" role="status">
          Registration is complete for this demo. Please sign in with one of
          the provided mock accounts.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {/* Native browser bubbles would conflict with the inline field errors. */}
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
              autoComplete="new-password"
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

          <div className="field">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              aria-invalid={fieldErrors.confirmPassword ? true : undefined}
              aria-describedby={
                fieldErrors.confirmPassword
                  ? 'confirm-password-error'
                  : undefined
              }
            />
            {fieldErrors.confirmPassword ? (
              <p id="confirm-password-error" className="error" role="alert">
                {fieldErrors.confirmPassword}
              </p>
            ) : null}
          </div>

          <button type="submit">Create Account</button>
        </form>
      )}

      <p className="login-prompt">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </main>
  )
}
