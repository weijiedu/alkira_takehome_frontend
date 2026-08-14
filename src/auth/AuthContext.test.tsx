import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

function renderAuth() {
  return renderHook(() => useAuth(), { wrapper: AuthProvider })
}

describe('AuthContext', () => {
  it('sets pendingUser but not user after a valid login', () => {
    const { result } = renderAuth()

    let success = false
    act(() => {
      success = result.current.login('editor@alkira.test', 'password123')
    })

    expect(success).toBe(true)
    expect(result.current.user).toBeNull()
    expect(result.current.pendingUser?.email).toBe('editor@alkira.test')
  })

  it('rejects invalid credentials and does not authenticate', () => {
    const { result } = renderAuth()

    let success = true
    act(() => {
      success = result.current.login('nobody@alkira.test', 'wrong-password')
    })

    expect(success).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.pendingUser).toBeNull()
  })

  it('moves pendingUser to user after valid MFA', () => {
    const { result } = renderAuth()

    act(() => {
      result.current.login('readonly@alkira.test', 'password123')
    })
    act(() => {
      result.current.verifyMfa('123456')
    })

    expect(result.current.user?.email).toBe('readonly@alkira.test')
    expect(result.current.pendingUser).toBeNull()
  })

  it('preserves pendingUser after invalid MFA', () => {
    const { result } = renderAuth()

    act(() => {
      result.current.login('editor@alkira.test', 'password123')
    })

    let success = true
    act(() => {
      success = result.current.verifyMfa('000000')
    })

    expect(success).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.pendingUser?.email).toBe('editor@alkira.test')
  })

  it('clears auth state on logout', () => {
    const { result } = renderAuth()

    act(() => {
      result.current.login('editor@alkira.test', 'password123')
    })
    act(() => {
      result.current.verifyMfa('123456')
    })
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.pendingUser).toBeNull()
  })
})
