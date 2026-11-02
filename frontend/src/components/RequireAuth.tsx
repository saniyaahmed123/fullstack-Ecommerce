import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'

export default function RequireAuth({
  children,
  adminOnly = false,
}: {
  children: ReactNode
  adminOnly?: boolean
}) {
  const { user, isLoading, error } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <main className="account-page"><p>Checking your account...</p></main>
  }

  if (error) {
    return <main className="account-page"><p role="alert">{error}</p></main>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
