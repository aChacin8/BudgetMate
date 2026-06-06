import http from '../utils/http'

export interface BudgetPayload {
  name: string; amount: number; budgetType: 'Monthly' | 'Future'; description?: string
}
export interface BudgetExpensePayload { name: string; amount: number }

const base = (userId: number, earningId: number) =>
  `/users/${userId}/earnings/${earningId}/budgets`

export const budgetsApi = {
  create: (userId: number, earningId: number, data: BudgetPayload) =>
    http.post(base(userId, earningId), data),
  getAll: (userId: number, earningId: number) => http.get(base(userId, earningId)),
  getById: (userId: number, earningId: number, budgetId: number) =>
    http.get(`${base(userId, earningId)}/${budgetId}`),
  update: (userId: number, earningId: number, budgetId: number, data: Partial<BudgetPayload>) =>
    http.patch(`${base(userId, earningId)}/${budgetId}`, data),
  delete: (userId: number, earningId: number, budgetId: number) =>
    http.delete(`${base(userId, earningId)}/${budgetId}`),

  createExpense: (userId: number, earningId: number, budgetId: number, data: BudgetExpensePayload) =>
    http.post(`${base(userId, earningId)}/${budgetId}/budgetExpenses`, data),
  getExpenseById: (userId: number, earningId: number, budgetId: number, expenseId: number) =>
    http.get(`${base(userId, earningId)}/${budgetId}/budgetExpenses/${expenseId}`),
  updateExpense: (userId: number, earningId: number, budgetId: number, expenseId: number, data: Partial<BudgetExpensePayload>) =>
    http.patch(`${base(userId, earningId)}/${budgetId}/budgetExpenses/${expenseId}`, data),
  deleteExpense: (userId: number, earningId: number, budgetId: number, expenseId: number) =>
    http.delete(`${base(userId, earningId)}/${budgetId}/budgetExpenses/${expenseId}`)
}
