import http from '../utils/http'

export interface ExpensePayload { name: string; amount: number }

const base = (userId: number, earningId: number) =>
  `/users/${userId}/earnings/${earningId}/expenses`

export const expensesApi = {
  create: (userId: number, earningId: number, data: ExpensePayload) =>
    http.post(base(userId, earningId), data),
  getAll: (userId: number, earningId: number) => http.get(base(userId, earningId)),
  getById: (userId: number, earningId: number, expenseId: number) =>
    http.get(`${base(userId, earningId)}/${expenseId}`),
  update: (userId: number, earningId: number, expenseId: number, data: Partial<ExpensePayload>) =>
    http.patch(`${base(userId, earningId)}/${expenseId}`, data),
  delete: (userId: number, earningId: number, expenseId: number) =>
    http.delete(`${base(userId, earningId)}/${expenseId}`)
}
