import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { useAuth } from '../utils/AuthContext'
import { useTheme } from '../utils/ThemeContext'
import { statisticsApi } from '../apis/statistics.api'
import { formatCurrency } from '../utils/formatters'
import Navbar from '../components/Navbar'

interface MonthData {
  month: number; label: string
  earnings: number; expenses: number; savings: number
}
interface ExpenseItem { name: string; amount: number }
interface Overview {
  totalEarnings: number; totalExpenses: number
  totalSavings: number; savingsRate: number
}

const MONTHS = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const OVERVIEW_CARDS = [
  { key: 'totalEarnings', label: 'Ingresos totales', icon: '📈', color: 'green' as const },
  { key: 'totalExpenses', label: 'Gastos totales',   icon: '📉', color: 'red'   as const },
  { key: 'totalSavings',  label: 'Ahorro acumulado', icon: '💰', color: 'blue'  as const },
]

const cardColors = {
  green:  'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800',
  red:    'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-100 dark:border-red-800',
  blue:   'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800',
  purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800',
}

const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

export default function StatisticsPage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const userId = user!.id
  const now = new Date()

  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState<number | undefined>(undefined)
  const [trend, setTrend] = useState<MonthData[]>([])
  const [breakdown, setBreakdown] = useState<ExpenseItem[]>([])
  const [overview, setOverview] = useState<Overview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      statisticsApi.getMonthlyTrend(userId, year),
      statisticsApi.getExpensesBreakdown(userId, year, month),
      statisticsApi.getOverview(userId),
    ]).then(([t, b, o]) => {
      setTrend(t.data)
      setBreakdown(b.data)
      setOverview(o.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [year, month])

  const axisColor = isDark ? '#9ca3af' : '#6b7280'
  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const tooltipBg = isDark ? '#1f2937' : '#ffffff'
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb'
  const tooltipText = isDark ? '#f3f4f6' : '#111827'

  const maxBreakdown = breakdown[0]?.amount || 1

  const skeletonCls = 'bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Estadísticas</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Análisis detallado de tus finanzas</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            >
              {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select
              value={month ?? ''}
              onChange={e => setMonth(e.target.value === '' ? undefined : Number(e.target.value))}
              className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            >
              <option value="">Todos los meses</option>
              {MONTHS.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Overview cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => <div key={i} className={`h-24 ${skeletonCls}`} />)}
          </div>
        ) : overview ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {OVERVIEW_CARDS.map(c => (
              <div key={c.key} className={`rounded-2xl border p-5 flex items-center gap-4 transition-colors ${cardColors[c.color]}`}>
                <span className="text-3xl">{c.icon}</span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider opacity-70">{c.label}</p>
                  <p className="text-xl font-bold mt-0.5">{formatCurrency(overview[c.key as keyof Overview] as number)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Savings rate bar */}
        {overview && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm mb-8 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Tasa de ahorro global</p>
              <span className={`text-sm font-bold ${overview.savingsRate >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {overview.savingsRate}%
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${overview.savingsRate >= 0 ? 'bg-emerald-400 dark:bg-emerald-500' : 'bg-red-400 dark:bg-red-500'}`}
                style={{ width: `${Math.min(Math.abs(overview.savingsRate), 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {overview.savingsRate >= 20
                ? 'Excelente gestión financiera.'
                : overview.savingsRate >= 10
                  ? 'Buen ahorro, sigue así.'
                  : overview.savingsRate >= 0
                    ? 'Ahorro bajo, intenta reducir gastos.'
                    : 'Gastos superan los ingresos.'}
            </p>
          </div>
        )}

        {/* Monthly trend chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm mb-8 transition-colors">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Tendencia mensual — {year}</h2>

          {loading ? (
            <div className={`h-64 ${skeletonCls}`} />
          ) : trend.every(m => m.earnings === 0 && m.expenses === 0) ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-sm gap-2">
              <span className="text-3xl">📊</span>
              <p>Sin datos para {year}.</p>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={v => v === 0 ? '0' : `$${(v / 1000).toFixed(0)}k`} width={42} />
                  <Tooltip
                    contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, color: tooltipText, fontSize: 13 }}
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 12, color: axisColor, paddingTop: 8 }}
                    formatter={v => v === 'earnings' ? 'Ingresos' : v === 'expenses' ? 'Gastos' : 'Ahorro'}
                  />
                  <Bar dataKey="earnings" name="earnings" fill="#34d399" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="savings"  name="savings"  fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Expenses breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm transition-colors">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Desglose de gastos
            {month ? ` — ${MONTHS[month]} ${year}` : ` — ${year}`}
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className={`h-8 ${skeletonCls}`} />)}
            </div>
          ) : breakdown.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500 text-sm gap-2">
              <span className="text-3xl">🗂</span>
              <p>No hay gastos registrados para este período.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {breakdown.map((item, i) => {
                const pct = Math.round((item.amount / maxBreakdown) * 100)
                const barColors = [
                  'bg-emerald-400', 'bg-blue-400', 'bg-purple-400',
                  'bg-amber-400', 'bg-rose-400', 'bg-cyan-400', 'bg-indigo-400', 'bg-orange-400'
                ]
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-200 font-medium truncate max-w-[55%]">{item.name}</span>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${barColors[i % barColors.length]} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
