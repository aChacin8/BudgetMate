import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../apis/auth.api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const parseError = (err: any): string => {
    const data = err.response?.data
    if (data?.errors?.length) return data.errors.map((e: any) => e.msg).join(' · ')
    return data?.message || 'Error al registrarse'
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await authApi.register({ ...form, phone: form.phone || undefined })
      setSuccess(true)
    } catch (err: any) {
      setError(parseError(err))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-10 text-center max-w-md w-full">
          <span className="text-5xl">📧</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4">¡Revisa tu correo!</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Te enviamos un código de confirmación. Ingrésalo para activar tu cuenta.</p>
          <button onClick={() => navigate('/confirm-account')} className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors">
            Confirmar cuenta
          </button>
        </div>
      </div>
    )
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })

  const inputCls = "w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">💰</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-3">BudgetMate</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Crear cuenta</h2>

          {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Nombre</label>
                <input type="text" required value={form.firstName} onChange={f('firstName')} className={inputCls} placeholder="Juan" />
              </div>
              <div>
                <label className={labelCls}>Apellido</label>
                <input type="text" required value={form.lastName} onChange={f('lastName')} className={inputCls} placeholder="Pérez" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Correo electrónico</label>
              <input type="email" required value={form.email} onChange={f('email')} className={inputCls} placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <label className={labelCls}>Contraseña</label>
              <input type="password" required value={form.password} onChange={f('password')} className={inputCls} placeholder="••••••••" />
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 especial (@$!%*?&)</p>
            </div>
            <div>
              <label className={labelCls}>Teléfono <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span></label>
              <input type="tel" value={form.phone} onChange={f('phone')} className={inputCls} placeholder="5512345678" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-2">
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            ¿Ya tienes cuenta? <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
