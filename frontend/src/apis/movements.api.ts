import http from '../utils/http'
import type { Product } from './products.api'

export interface GlobalStockMovement {
  id: number
  type: 'IN' | 'OUT' | 'ADJUSTMENT'
  quantity: number
  reason?: string
  productId: number
  product?: Product
  userId: number
  createdAt: string
}

export const movementsApi = {
  getAll: () => http.get<{ movements: GlobalStockMovement[] }>('/movements')
}
