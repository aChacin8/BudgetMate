import http from '../utils/http'

export interface CategoryPayload {
  name: string
  description?: string
}

export interface Category {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export const categoriesApi = {
  create: (data: CategoryPayload) => http.post('/categories', data),
  getAll: () => http.get<{ categories: Category[] }>('/categories'),
  getById: (id: number) => http.get<{ category: Category }>(`/categories/${id}`),
  update: (id: number, data: CategoryPayload) => http.put(`/categories/${id}`, data),
  delete: (id: number) => http.delete(`/categories/${id}`)
}
