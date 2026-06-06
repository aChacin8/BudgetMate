import { useState, useEffect, FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { earningsApi } from '../apis/earnings.api'
import { expensesApi } from '../apis/expenses.api'
import type { ExpensePayload } from '../apis/expenses.api'
import { extrasApi } from '../apis/extras.api'
import type { ExtraPayload } from '../apis/extras.api'
import { budgetsApi } from '../apis/budgets.api'
import type { BudgetPayload } from '../apis/budgets.api'
import { formatCurrency, periodLabel } from '../utils/formatters'
import Modal from '../components/Modal'
import BudgetCard from '../components/BudgetCard'
import Navbar from '../components/Navbar'

type Tab = 'expenses' | 'extras' | 'budgets'

interface Expense { id: number; name: string; amount: number }
interface Extra { id: number; source: string; amount: number }
interface Budget { id: number; name: string; amount: number; budgetType: 'Monthly' | 'Future'; isActive: boolean; description?: string }
interface Earning { id: number; baseAmount: number; periodType: 'monthly' | 'biweekly'; periodMonth: number; periodYear: number; periodNumber: number }

const inputCls = "w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
const cancelBtnCls = "flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors"
const errorCls = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800 rounded-xl px-4 py-3 text-sm mb-4"

export default function EarningDetailPage() {
  const { earningId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const userId = user!.id

  const [earning, setEarning] = useState<Earning | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [extras, setExtras] = useState<Extra[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [tab, setTab] = useState<Tab>('expenses')

  const [expenseModal, setExpenseModal] = useState(false)
  const [extraModal, setExtraModal] = useState(false)
  const [budgetModal, setBudgetModal] = useState(false)
  const [budgetExpenseModal, setBudgetExpenseModal] = useState<Budget | null>(null)

  const [expenseForm, setExpenseForm] = useState<ExpensePayload>({ name: '', amount: 0 })
  const [extraForm, setExtraForm] = useState<ExtraPayload>({ source: '', amount: 0 })
  const [budgetForm, setBudgetForm] = useState<BudgetPayload>({ name: '', amount: 0, budgetType: 'Monthly', description: '' })
  const [budgetExpenseForm, setBudgetExpenseForm] = useState({ name: '', amount: 0 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const eid = Number(earningId)

  useEffect(() => {
    if (!eid) return
    earningsApi.getById(userId, eid).then(r => setEarning(r.data))
    loadExpenses(); loadExtras(); loadBudgets()
  }, [eid])

  const loadExpenses = () => expensesApi.getAll(userId, eid).then(r => setExpenses(r.data)).catch(() => {})
  const loadExtras = () => extrasApi.getAll(userId, eid).then(r => setExtras(r.data)).catch(() => {})
  const loadBudgets = () => budgetsApi.getAll(userId, eid).then(r => setBudgets(r.data)).catch(() => {})

  const submit = (action: () => Promise<any>, onSuccess: () => void) => async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try { await action(); onSuccess() }
    catch (err: any) { setError(err.response?.data?.message || 'Error al guardar') }
    finally { setSaving(false) }
  }

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const totalExtras = extras.reduce((s, e) => s + Number(e.amount), 0)
  const net = earning ? Number(earning.baseAmount) + totalExtras - totalExpenses : 0

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'expenses', label: 'Gastos', count: expenses.length },
    { key: 'extras', label: 'Extras', count: extras.length },
    { key: 'budgets', label: 'Presupuestos', count: budgets.length }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/earnings')}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 flex items-center gap-1 transition-colors"
        >
          ← Volver
        </button>

        {earning && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6 transition-colors">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              {periodLabel(earning.periodType, earning.periodNumber, earning.periodMonth, earning.periodYear)}
            </p>
            <div className="flex items-end justify-between mt-2">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(earning.baseAmount)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ingreso base</p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  {formatCurrency(net)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Saldo neto</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">Gastos</p>
                <p className="font-semibold text-red-500 dark:text-red-400 mt-0.5">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">Extras</p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatCurrency(totalExtras)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">Presupuestos</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400 mt-0.5">{budgets.length}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
              {t.label}{t.count > 0 && <span className={`ml-1 text-xs ${tab === t.key ? 'opacity-80' : 'text-gray-400 dark:text-gray-500'}`}>({t.count})</span>}
            </button>
          ))}
          <div className="ml-auto">
            {tab === 'expenses' && <button onClick={() => setExpenseModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors">+ Gasto</button>}
            {tab === 'extras' && <button onClick={() => setExtraModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors">+ Extra</button>}
            {tab === 'budgets' && <button onClick={() => setBudgetModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors">+ Presupuesto</button>}
          </div>
        </div>

        {tab === 'expenses' && (
          <div className="space-y-3">
            {expenses.length === 0 ? <EmptyState label="gastos" /> : expenses.map(ex => (
              <div key={ex.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-5 py-4 flex items-center justify-between shadow-sm transition-colors">
                <span className="font-medium text-gray-700 dark:text-gray-200">{ex.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-red-500 dark:text-red-400">{formatCurrency(ex.amount)}</span>
                  <button onClick={async () => { await expensesApi.delete(userId, eid, ex.id); loadExpenses() }}
                    className="text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 transition-colors">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'extras' && (
          <div className="space-y-3">
            {extras.length === 0 ? <EmptyState label="ingresos extra" /> : extras.map(ex => (
              <div key={ex.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-5 py-4 flex items-center justify-between shadow-sm transition-colors">
                <span className="font-medium text-gray-700 dark:text-gray-200">{ex.source}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(ex.amount)}</span>
                  <button onClick={async () => { await extrasApi.delete(userId, eid, ex.id); loadExtras() }}
                    className="text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 transition-colors">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'budgets' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {budgets.length === 0 ? <EmptyState label="presupuestos" /> : budgets.map(b => (
              <BudgetCard key={b.id} budget={b}
                onDelete={async (id) => { await budgetsApi.delete(userId, eid, id); loadBudgets() }}
                onAddExpense={(budget) => setBudgetExpenseModal(budget)} />
            ))}
          </div>
        )}
      </main>

      <Modal open={expenseModal} onClose={() => { setExpenseModal(false); setError('') }} title="Nuevo gasto">
        {error && <div className={errorCls}>{error}</div>}
        <form onSubmit={submit(() => expensesApi.create(userId, eid, expenseForm), () => { setExpenseModal(false); setExpenseForm({ name: '', amount: 0 }); loadExpenses() })} className="space-y-4">
          <div><label className={labelCls}>Nombre</label>
            <input type="text" required value={expenseForm.name} onChange={e => setExpenseForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Renta, supermercado..." /></div>
          <div><label className={labelCls}>Monto</label>
            <input type="number" min="0.01" step="0.01" required value={expenseForm.amount || ''} onChange={e => setExpenseForm(f => ({ ...f, amount: Number(e.target.value) }))} className={inputCls} /></div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setExpenseModal(false)} className={cancelBtnCls}>Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold">{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={extraModal} onClose={() => { setExtraModal(false); setError('') }} title="Ingreso extra">
        {error && <div className={errorCls}>{error}</div>}
        <form onSubmit={submit(() => extrasApi.create(userId, eid, extraForm), () => { setExtraModal(false); setExtraForm({ source: '', amount: 0 }); loadExtras() })} className="space-y-4">
          <div><label className={labelCls}>Fuente</label>
            <input type="text" required value={extraForm.source} onChange={e => setExtraForm(f => ({ ...f, source: e.target.value }))} className={inputCls} placeholder="Freelance, regalo, venta..." /></div>
          <div><label className={labelCls}>Monto</label>
            <input type="number" min="0.01" step="0.01" required value={extraForm.amount || ''} onChange={e => setExtraForm(f => ({ ...f, amount: Number(e.target.value) }))} className={inputCls} /></div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setExtraModal(false)} className={cancelBtnCls}>Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold">{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={budgetModal} onClose={() => { setBudgetModal(false); setError('') }} title="Nuevo presupuesto">
        {error && <div className={errorCls}>{error}</div>}
        <form onSubmit={submit(() => budgetsApi.create(userId, eid, budgetForm), () => { setBudgetModal(false); setBudgetForm({ name: '', amount: 0, budgetType: 'Monthly', description: '' }); loadBudgets() })} className="space-y-4">
          <div><label className={labelCls}>Nombre</label>
            <input type="text" required value={budgetForm.name} onChange={e => setBudgetForm(f => ({ ...f, name: e.target.value }))} className={inputCls} /></div>
          <div><label className={labelCls}>Monto límite</label>
            <input type="number" min="0.01" step="0.01" required value={budgetForm.amount || ''} onChange={e => setBudgetForm(f => ({ ...f, amount: Number(e.target.value) }))} className={inputCls} /></div>
          <div><label className={labelCls}>Tipo</label>
            <select value={budgetForm.budgetType} onChange={e => setBudgetForm(f => ({ ...f, budgetType: e.target.value as any }))} className={inputCls}>
              <option value="Monthly">Mensual</option>
              <option value="Future">Futuro / Ahorro</option>
            </select></div>
          <div><label className={labelCls}>Descripción <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span></label>
            <input type="text" value={budgetForm.description} onChange={e => setBudgetForm(f => ({ ...f, description: e.target.value }))} className={inputCls} /></div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setBudgetModal(false)} className={cancelBtnCls}>Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold">{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!budgetExpenseModal} onClose={() => { setBudgetExpenseModal(null); setError('') }} title={`Gasto en: ${budgetExpenseModal?.name}`}>
        {error && <div className={errorCls}>{error}</div>}
        <form onSubmit={submit(
          () => budgetsApi.createExpense(userId, eid, budgetExpenseModal!.id, budgetExpenseForm),
          () => { setBudgetExpenseModal(null); setBudgetExpenseForm({ name: '', amount: 0 }) }
        )} className="space-y-4">
          <div><label className={labelCls}>Nombre</label>
            <input type="text" required value={budgetExpenseForm.name} onChange={e => setBudgetExpenseForm(f => ({ ...f, name: e.target.value }))} className={inputCls} /></div>
          <div><label className={labelCls}>Monto</label>
            <input type="number" min="0.01" step="0.01" required value={budgetExpenseForm.amount || ''} onChange={e => setBudgetExpenseForm(f => ({ ...f, amount: Number(e.target.value) }))} className={inputCls} /></div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setBudgetExpenseModal(null)} className={cancelBtnCls}>Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold">{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center text-gray-400 dark:text-gray-500 text-sm transition-colors">
      No hay {label} registrados.
    </div>
  )
}
