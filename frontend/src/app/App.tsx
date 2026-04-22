import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth.ts'
import { ProtectedRoute } from './ProtectedRoute.tsx'
import { LoginPage } from '../pages/LoginPage.tsx'
import { NotesPage } from '../pages/NotesPage.tsx'

export default function App() {
    const { isAuthenticated } = useAuth()

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/notes"
                element={
                    <ProtectedRoute>
                        <NotesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="*"
                element={<Navigate to={isAuthenticated ? '/notes' : '/login'} replace />}
            />
        </Routes>
    )
}
