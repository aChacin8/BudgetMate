import http from '../utils/http'
import type { Category } from './categories.api'
import type { Supplier } from './suppliers.api'

export interface ProductPayload {
  name: string
  sku?: string
  description?: string
  stock?: number
  minStock?: number
  price?: number
  categoryId?: number | null
  supplierId?: number | null
}

export interface StockMovement {
  id: number
  type: 'IN' | 'OUT' | 'ADJUSTMENT'
  quantity: number
  reason?: string
  productId: number
  userId: number
  createdAt: string
}

export interface Product {
  id: number
  name: string
  sku?: string
  description?: string
  stock: number
  minStock: number
  price?: number
  categoryId?: number | null
  supplierId?: number | null
  category?: Category
  supplier?: Supplier
  movements?: StockMovement[]
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  search?: string
  categoryId?: number
  supplierId?: number
  lowStock?: boolean
}

export const productsApi = {
  create: (data: ProductPayload) => http.post('/products', data),
  getAll: (filters?: ProductFilters) => {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.categoryId) params.append('categoryId', String(filters.categoryId))
    if (filters?.supplierId) params.append('supplierId', String(filters.supplierId))
    if (filters?.lowStock) params.append('lowStock', 'true')
    return http.get<{ products: Product[] }>(`/products?${params.toString()}`)
  },
  getById: (id: number) => http.get<{ product: Product }>(`/products/${id}`),
  update: (id: number, data: Partial<ProductPayload>) => http.put(`/products/${id}`, data),
  delete: (id: number) => http.delete(`/products/${id}`),
  addMovement: (productId: number, data: { type: 'IN' | 'OUT' | 'ADJUSTMENT'; quantity: number; reason?: string }) =>
    http.post<{ movement: StockMovement; currentStock: number }>(`/products/${productId}/movements`, data)
}
