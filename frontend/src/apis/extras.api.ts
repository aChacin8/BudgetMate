import http from '../utils/http'

export interface ExtraPayload { source: string; amount: number }

const base = (userId: number, earningId: number) =>
  `/users/${userId}/earnings/${earningId}/extras`

export const extrasApi = {
  create: (userId: number, earningId: number, data: ExtraPayload) =>
    http.post(base(userId, earningId), data),
  getAll: (userId: number, earningId: number) => http.get(base(userId, earningId)),
  getById: (userId: number, earningId: number, extraEarningId: number) =>
    http.get(`${base(userId, earningId)}/${extraEarningId}`),
  update: (userId: number, earningId: number, extraEarningId: number, data: Partial<ExtraPayload>) =>
    http.patch(`${base(userId, earningId)}/${extraEarningId}`, data),
  delete: (userId: number, earningId: number, extraEarningId: number) =>
    http.delete(`${base(userId, earningId)}/${extraEarningId}`)
}
