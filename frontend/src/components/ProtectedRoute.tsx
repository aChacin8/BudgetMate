import { Navigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><span className="text-gray-500">Cargando...</span></div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
