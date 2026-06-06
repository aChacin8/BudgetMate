import http from '../utils/http'

export interface RegisterPayload {
  firstName: string; lastName: string; email: string; password: string; phone?: string
}
export interface LoginPayload { email: string; password: string }

export const authApi = {
  register: (data: RegisterPayload) => http.post('/auth', data),
  confirmAccount: (token: string) => http.post('/auth/confirm-account', { token }),
  login: (data: LoginPayload) => http.post<{ jwt: string }>('/auth/login', data),
  getUser: () => http.get('/auth/user'),
  forgotPassword: (email: string) => http.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => http.post(`/auth/reset-password/${token}`, { password }),
  updatePassword: (currentPassword: string, newPassword: string) => http.post('/auth/update-password', { currentPassword, newPassword }),
  checkPassword: (password: string) => http.post('/auth/check-password', { password })
}
