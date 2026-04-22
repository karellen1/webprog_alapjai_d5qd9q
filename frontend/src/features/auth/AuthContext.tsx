import { useCallback, useMemo, useState } from 'react'
import { loginRequest, registerRequest } from './api'
import { clearToken, readToken, writeToken } from './storage'
import type { ReactNode } from 'react'
import type { AuthContextValue } from './contextTypes'
import type { AuthActionResult, AuthRequest } from './types'
import { extractApiError } from '../../shared/utils/extractApiError'
import { authContext } from './context'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string>(() => readToken())

    const runAuthRequest = useCallback(async (request: (payload: AuthRequest) => Promise<{ accessToken: string }>, payload: AuthRequest, fallback: string): Promise<AuthActionResult> => {
        try {
            const response = await request(payload)
            writeToken(response.accessToken)
            setToken(response.accessToken)
            return { ok: true }
        } catch (error) {
            return { ok: false, error: extractApiError(error, fallback) }
        }
    }, [])

    const login = useCallback(async (payload: AuthRequest): Promise<AuthActionResult> => {
        return runAuthRequest(loginRequest, payload, 'Login failed.')
    }, [runAuthRequest])

    const register = useCallback(async (payload: AuthRequest): Promise<AuthActionResult> => {
        return runAuthRequest(registerRequest, payload, 'Registration failed.')
    }, [runAuthRequest])

    const logout = useCallback(() => {
        clearToken()
        setToken('')
    }, [])

    const value = useMemo<AuthContextValue>(() => ({
        token,
        isAuthenticated: Boolean(token),
        login,
        register,
        logout,
    }), [token, login, register, logout])

    return <authContext.Provider value={value}>{children}</authContext.Provider>
}
