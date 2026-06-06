import { Link } from 'react-router-dom'
import { formatCurrency, periodLabel } from '../utils/formatters'

interface Earning {
  id: number; baseAmount: number
  periodType: 'monthly' | 'biweekly'
  periodMonth: number; periodYear: number; periodNumber: number
}

interface Props { earning: Earning; userId: number; onDelete: (id: number) => void }

export default function EarningCard({ earning, userId, onDelete }: Props) {
  const label = periodLabel(earning.periodType, earning.periodNumber, earning.periodMonth, earning.periodYear)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{formatCurrency(earning.baseAmount)}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          earning.periodType === 'monthly'
            ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
            : 'bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300'
        }`}>
          {earning.periodType === 'monthly' ? 'Mensual' : 'Quincenal'}
        </span>
      </div>
      <div className="flex gap-2 mt-4">
        <Link
          to={`/earnings/${earning.id}`}
          state={{ userId }}
          className="flex-1 text-center text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg py-2 font-medium transition-colors"
        >
          Ver detalle
        </Link>
        <button
          onClick={() => onDelete(earning.id)}
          className="text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 px-3 rounded-lg transition-colors"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
