import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { authApi } from '../apis/auth.api'

export default function ConfirmAccountPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const fromLogin = location.state?.fromLogin === true
  const email = location.state?.email as string | undefined

  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await authApi.confirmAccount(token)
      setConfirmed(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Código inválido o expirado')
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-10 text-center max-w-md w-full">
          <span className="text-5xl">🎉</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4">¡Cuenta confirmada!</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Tu cuenta ha sido activada correctamente. Serás redirigido al inicio de sesión en unos segundos…</p>
          <button onClick={() => navigate('/login')} className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors">
            Ir al inicio de sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 w-full max-w-md transition-colors">
        <div className="text-center mb-6">
          <span className="text-4xl">📧</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-3">Confirmar cuenta</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Ingresa el código de 6 dígitos enviado a tu correo</p>
        </div>

        {fromLogin && (
          <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm mb-4 flex gap-2 items-start">
            <span className="mt-0.5">⚠️</span>
            <div>
              <p className="font-medium">Tu cuenta aún no está confirmada</p>
              {email && <p className="mt-0.5 text-amber-600 dark:text-amber-400">Revisa el correo enviado a <strong>{email}</strong> e ingresa el código aquí.</p>}
              {!email && <p className="mt-0.5">Revisa tu correo electrónico e ingresa el código de activación.</p>}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" required maxLength={6} value={token} onChange={e => setToken(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            placeholder="000000"
          />
          <button type="submit" disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors">
            {loading ? 'Verificando...' : 'Confirmar cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          ¿Ya tienes tu código?{' '}
          <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Volver al login</Link>
        </p>
      </div>
    </div>
  )
}
