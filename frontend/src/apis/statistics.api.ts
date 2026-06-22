import http from '../utils/http'

const base = (userId: number) => `/users/${userId}/stats`

export const statisticsApi = {
  getMonthlyTrend: (userId: number, year: number) =>
    http.get(`${base(userId)}/monthly-trend`, { params: { year } }),
  getExpensesBreakdown: (userId: number, year: number, month?: number) =>
    http.get(`${base(userId)}/expenses-breakdown`, { params: { year, ...(month ? { month } : {}) } }),
  getOverview: (userId: number) =>
    http.get(`${base(userId)}/overview`),
}
