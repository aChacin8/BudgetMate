import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../apis/auth.api'
import { storage } from './storage'

interface User {
  id: number; firstName: string; lastName: string; email: string
  phone?: string; isConfirmed: boolean; isPremium: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (jwt: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = storage.getToken()
    if (!token) { setLoading(false); return }
    authApi.getUser()
      .then(res => setUser(res.data.user))
      .catch(() => storage.clear())
      .finally(() => setLoading(false))
  }, [])

  const login = async (jwt: string) => {
    storage.setToken(jwt)
    const res = await authApi.getUser()
    setUser(res.data.user)
  }

  const logout = () => {
    storage.clear()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
