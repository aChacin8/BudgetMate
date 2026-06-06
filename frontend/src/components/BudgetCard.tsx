import { formatCurrency } from '../utils/formatters'

interface Budget {
  id: number; name: string; amount: number
  budgetType: 'Monthly' | 'Future'; isActive: boolean; description?: string
}

interface Props {
  budget: Budget
  onDelete: (id: number) => void
  onAddExpense: (budget: Budget) => void
}

export default function BudgetCard({ budget, onDelete, onAddExpense }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{budget.name}</h4>
          {budget.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">{budget.description}</p>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          budget.budgetType === 'Monthly'
            ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300'
            : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300'
        }`}>
          {budget.budgetType === 'Monthly' ? 'Mensual' : 'Futuro'}
        </span>
      </div>
      <p className="text-xl font-bold text-gray-700 dark:text-gray-200 mt-3">{formatCurrency(budget.amount)}</p>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onAddExpense(budget)}
          className="flex-1 text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg py-2 font-medium transition-colors"
        >
          + Gasto
        </button>
        <button
          onClick={() => onDelete(budget.id)}
          className="text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 px-3 rounded-lg transition-colors"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
