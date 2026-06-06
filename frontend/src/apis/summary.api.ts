import http from '../utils/http'

const base = (userId: number) => `/users/${userId}/summary`

export const summaryApi = {
  getHistory: (userId: number) => http.get(base(userId)),
  getCurrent: (userId: number, month?: number, year?: number) =>
    http.get(`${base(userId)}/current`, { params: { month, year } }),
  compute: (userId: number, month: number, year: number) =>
    http.post(`${base(userId)}/compute`, { month, year })
}
