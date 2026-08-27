import http from '../utils/http'

export interface SupplierPayload {
  name: string
  contactEmail?: string
  phone?: string
  address?: string
}

export interface Supplier {
  id: number
  name: string
  contactEmail?: string
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export const suppliersApi = {
  create: (data: SupplierPayload) => http.post('/suppliers', data),
  getAll: () => http.get<{ suppliers: Supplier[] }>('/suppliers'),
  getById: (id: number) => http.get<{ supplier: Supplier }>(`/suppliers/${id}`),
  update: (id: number, data: SupplierPayload) => http.put(`/suppliers/${id}`, data),
  delete: (id: number) => http.delete(`/suppliers/${id}`)
}
