import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { summaryApi } from '../apis/summary.api'
import { earningsApi } from '../apis/earnings.api'
import { formatCurrency, periodLabel } from '../utils/formatters'
import StatCard from '../components/StatCard'
import Navbar from '../components/Navbar'

interface Summary { month: number; year: number; totalEarnings: number; totalExpenses: number; remaining: number }
interface Earning { id: number; baseAmount: number; periodType: 'monthly' | 'biweekly'; periodMonth: number; periodYear: number; periodNumber: number }

export default function DashboardPage() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [recentEarnings, setRecentEarnings] = useState<Earning[]>([])
  const [loadingSum, setLoadingSum] = useState(true)

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  useEffect(() => {
    if (!user) return
    const userId = user.id

    const fetchSummary = async () => {
      try {
        await summaryApi.compute(userId, month, year)
        const res = await summaryApi.getCurrent(userId, month, year)
        setSummary(res.data)
      } catch { /* no summary yet */ }
      finally { setLoadingSum(false) }
    }

    const fetchEarnings = async () => {
      try {
        const res = await earningsApi.getAll(userId)
        setRecentEarnings((res.data.earning || []).slice(0, 4))
      } catch { /* ignore */ }
    }

    fetchSummary()
    fetchEarnings()
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Hola, {user?.firstName} 
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Resumen financiero del mes actual</p>
        </div>

        {loadingSum ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
            {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Ingresos totales" value={formatCurrency(summary.totalEarnings)} icon="📈" color="green" />
            <StatCard label="Gastos totales" value={formatCurrency(summary.totalExpenses)} icon="📉" color="red" />
            <StatCard label="Saldo disponible" value={formatCurrency(summary.remaining)} icon="💵" color={summary.remaining >= 0 ? 'blue' : 'red'} />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center text-gray-400 dark:text-gray-500">
            <span className="text-3xl">📊</span>
            <p className="mt-2 text-sm">Aún no hay datos para este mes.</p>
            <Link to="/earnings" className="mt-4 inline-block text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
              Registrar ingreso →
            </Link>
          </div>
        )}

        {summary && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Progreso de gastos</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {summary.totalEarnings > 0 ? Math.round((summary.totalExpenses / summary.totalEarnings) * 100) : 0}%
              </p>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-emerald-400 dark:bg-emerald-500 transition-all"
                style={{ width: `${summary.totalEarnings > 0 ? Math.min((summary.totalExpenses / summary.totalEarnings) * 100, 100) : 0}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Ingresos recientes</h2>
            <Link to="/earnings" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Ver todos →</Link>
          </div>
          {recentEarnings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
              No hay ingresos registrados.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentEarnings.map(e => (
                <Link
                  key={e.id}
                  to={`/earnings/${e.id}`}
                  state={{ userId: user?.id }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{periodLabel(e.periodType, e.periodNumber, e.periodMonth, e.periodYear)}</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{formatCurrency(e.baseAmount)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    e.periodType === 'monthly'
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
                      : 'bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300'
                  }`}>
                    {e.periodType === 'monthly' ? 'Mensual' : 'Quincenal'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
