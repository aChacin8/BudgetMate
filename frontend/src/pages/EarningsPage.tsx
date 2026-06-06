import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '../utils/AuthContext'
import { earningsApi } from '../apis/earnings.api'
import type { EarningPayload } from '../apis/earnings.api'
import EarningCard from '../components/EarningCard'
import Modal from '../components/Modal'
import Navbar from '../components/Navbar'

interface Earning { id: number; baseAmount: number; periodType: 'monthly' | 'biweekly'; periodMonth: number; periodYear: number; periodNumber: number }

const now = new Date()

const inputCls = "w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
const selectCls = `${inputCls} appearance-none`

export default function EarningsPage() {
  const { user } = useAuth()
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<EarningPayload>({
    baseAmount: 0, periodType: 'monthly',
    periodMonth: now.getMonth() + 1, periodYear: now.getFullYear(), periodNumber: 1
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const userId = user!.id

  const load = async () => {
    try {
      const res = await earningsApi.getAll(userId)
      setEarnings(res.data.earning || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      await earningsApi.create(userId, form)
      setModalOpen(false); load()
    } catch (err: any) { setError(err.response?.data?.message || 'Error al crear ingreso') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este ingreso y todos sus gastos?')) return
    await earningsApi.delete(userId, id)
    setEarnings(prev => prev.filter(e => e.id !== id))
  }

  const f = (k: keyof EarningPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: ['baseAmount', 'periodMonth', 'periodYear', 'periodNumber'].includes(k) ? Number(e.target.value) : e.target.value }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mis ingresos</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Gestiona tus ingresos por período de pago</p>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors shadow-sm">
            + Nuevo ingreso
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
          </div>
        ) : earnings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400 dark:text-gray-500">
            <span className="text-4xl">📭</span>
            <p className="mt-3">Aún no tienes ingresos registrados.</p>
            <button onClick={() => setModalOpen(true)} className="mt-4 text-emerald-600 dark:text-emerald-400 font-medium hover:underline text-sm">
              Crear el primero →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnings.map(e => <EarningCard key={e.id} earning={e} userId={userId} onDelete={handleDelete} />)}
          </div>
        )}
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo ingreso">
        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>}
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className={labelCls}>Monto base</label>
            <input type="number" min="1" step="0.01" required value={form.baseAmount || ''}
              onChange={f('baseAmount')} className={inputCls} placeholder="0.00" />
          </div>
          <div>
            <label className={labelCls}>Tipo de período</label>
            <select value={form.periodType} onChange={f('periodType')} className={selectCls}>
              <option value="monthly">Mensual</option>
              <option value="biweekly">Quincenal</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Mes</label>
              <input type="number" min="1" max="12" required value={form.periodMonth} onChange={f('periodMonth')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Año</label>
              <input type="number" min="2020" required value={form.periodYear} onChange={f('periodYear')} className={inputCls} />
            </div>
          </div>
          {form.periodType === 'biweekly' && (
            <div>
              <label className={labelCls}>Número de quincena</label>
              <select value={form.periodNumber} onChange={f('periodNumber')} className={selectCls}>
                <option value={1}>Primera (1-15)</option>
                <option value={2}>Segunda (16-fin)</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
              {saving ? 'Guardando...' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
