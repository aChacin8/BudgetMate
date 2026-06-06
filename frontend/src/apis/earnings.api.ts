import http from '../utils/http'

export interface EarningPayload {
  baseAmount: number
  periodType: 'monthly' | 'biweekly'
  periodMonth: number
  periodYear: number
  periodNumber?: number
}

const base = (userId: number) => `/users/${userId}/earnings`

export const earningsApi = {
  create: (userId: number, data: EarningPayload) => http.post(base(userId), data),
  getAll: (userId: number) => http.get(base(userId)),
  getById: (userId: number, earningId: number) => http.get(`${base(userId)}/${earningId}`),
  update: (userId: number, earningId: number, data: Partial<EarningPayload>) =>
    http.patch(`${base(userId)}/${earningId}`, data),
  delete: (userId: number, earningId: number) => http.delete(`${base(userId)}/${earningId}`)
}
