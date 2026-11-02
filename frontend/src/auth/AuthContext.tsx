import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import axios from 'axios'
import api from '../api/api'

export interface AuthUser {
  id: string
  username: string
  email: string
  role: 'user' | 'admin'
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  error: string
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get<{ user: AuthUser }>('/api/auth/me')
      setUser(data.user)
      setError('')
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        setUser(null)
        setError('')
        return
      }
      setError('Could not verify your session. Please refresh the page.')
      throw requestError
    }
  }, [])

  useEffect(() => {
    refreshUser()
      .catch(() => undefined)
      .finally(() => setIsLoading(false))
  }, [refreshUser])

  const logout = useCallback(async () => {
    await api.post('/api/auth/logout')
    setUser(null)
    setError('')
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, error, refreshUser, logout }),
    [user, isLoading, error, refreshUser, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
