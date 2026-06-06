import axios from 'axios'
import { storage } from './storage'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
})

http.interceptors.request.use(config => {
  const token = storage.getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const url: string = err.config?.url ?? ''
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/forgot-password')
      if (!isAuthEndpoint) {
        storage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default http
