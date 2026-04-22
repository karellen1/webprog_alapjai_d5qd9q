import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth.ts'
import type { AuthMode } from '../features/auth/types.ts'

export function LoginPage() {
    const { isAuthenticated, login, register } = useAuth()

    const [mode, setMode] = useState<AuthMode>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')

    if (isAuthenticated) {
        return <Navigate to="/notes" replace />
    }

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setBusy(true)
        setError('')

        const result =
            mode === 'login'
                ? await login({ email, password })
                : await register({ email, password })

        if (!result.ok) {
            setError(result.error ?? 'Authentication failed.')
        }

        setBusy(false)
    }

    return (
        <main className="screen center">
            <section className="panel auth-panel">
                <h1>Private Notes Terminal</h1>
                <p className="subtitle">Log in first, then continue on your notes page.</p>

                <form className="stack" onSubmit={onSubmit}>
                    <label className="field">
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                        />
                    </label>

                    <label className="field">
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            minLength={8}
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            placeholder="minimum 8 characters"
                        />
                    </label>

                    {error ? <p className="feedback error">{error}</p> : null}

                    <button type="submit" className="btn" disabled={busy}>
                        {busy ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account'}
                    </button>
                </form>

                <div className="switcher">
                    <button
                        type="button"
                        className={mode === 'login' ? 'tab active' : 'tab'}
                        onClick={() => setMode('login')}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={mode === 'register' ? 'tab active' : 'tab'}
                        onClick={() => setMode('register')}
                    >
                        Register
                    </button>
                </div>
            </section>
        </main>
    )
}
