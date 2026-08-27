import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productsApi } from '../apis/products.api'
import type { Product } from '../apis/products.api'
import Modal from '../components/Modal'
import Navbar from '../components/Navbar'

const inputCls = "w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
const selectCls = `${inputCls} appearance-none`

export default function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [movementModalOpen, setMovementModalOpen] = useState(false)
  const [movementForm, setMovementForm] = useState({
    type: 'IN' as 'IN' | 'OUT' | 'ADJUSTMENT', quantity: 1, reason: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const pid = Number(productId)

  const loadProduct = async () => {
    if (!pid) return
    try {
      const res = await productsApi.getById(pid)
      setProduct(res.data.product)
    } catch (err) {
      console.error('Error fetching product details:', err)
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProduct()
  }, [pid])

  const handleOpenMovement = () => {
    setMovementForm({
      type: 'IN',
      quantity: 1,
      reason: ''
    })
    setError('')
    setMovementModalOpen(true)
  }

  const handleMovementSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      await productsApi.addMovement(pid, {
        type: movementForm.type,
        quantity: Number(movementForm.quantity),
        reason: movementForm.reason
      })
      setMovementModalOpen(false)
      loadProduct()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar el movimiento')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="h-60 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        </main>
      </div>
    )
  }

  if (!product) return null

  const isLowStock = product.stock <= product.minStock
  const stockRatio = product.minStock > 0 ? Math.min((product.stock / product.minStock) * 100, 100) : 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Back Link */}
        <Link
          to="/products"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 inline-flex items-center gap-1 transition-colors"
        >
          ← Volver a Inventario
        </Link>

        {/* Product Details Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-mono font-semibold">
                SKU: {product.sku || 'Sin Código'}
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">{product.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.description || 'Sin descripción'}</p>
            </div>
            
            <button
              onClick={handleOpenMovement}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto"
            >
              ⚙️ Ajustar Stock
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-semibold">Stock Actual</span>
              <p className={`text-2xl font-black mt-0.5 ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                {product.stock} <span className="text-xs font-medium text-gray-400">uds</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-semibold">Stock Mínimo Alerta</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                {product.minStock} <span className="text-xs font-medium text-gray-400">uds</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-semibold">Precio de Registro</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                ${Number(product.price || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-semibold">Estado de Alerta</span>
              <div className="mt-1">
                {isLowStock ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300">
                    ⚠️ Crítico (Bajo)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-300">
                    ✅ Saludable (Normal)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-700 text-sm">
            <div>
              <span className="text-gray-400 font-medium">Categoría:</span>
              <span className="ml-1.5 font-semibold text-gray-800 dark:text-gray-200">{product.category?.name || 'Ninguna'}</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium">Proveedor:</span>
              <span className="ml-1.5 font-semibold text-gray-800 dark:text-gray-200">{product.supplier?.name || 'Ninguno'}</span>
            </div>
          </div>
        </div>

        {/* Safety Margin Indicator */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-8 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Margen de Seguridad de Stock</span>
            <span className={`text-xs font-bold ${isLowStock ? 'text-red-500' : 'text-emerald-500'}`}>
              {product.stock >= product.minStock ? 'Límite Seguro' : `${Math.round(stockRatio)}% del mínimo`}
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${isLowStock ? 'bg-red-500' : 'bg-emerald-400 dark:bg-emerald-500'}`}
              style={{ width: `${stockRatio}%` }}
            />
          </div>
        </div>

        {/* Stock Movements Log for this product */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Historial de Movimientos de Stock</h2>
          
          {!product.movements || product.movements.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center text-gray-400 dark:text-gray-500 text-sm transition-colors">
              No hay movimientos registrados para este producto.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm transition-colors">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Cantidad</th>
                    <th className="px-6 py-4">Motivo / Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm text-gray-700 dark:text-gray-300">
                  {product.movements.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                        {new Date(m.createdAt).toLocaleString('es-ES', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            m.type === 'IN'
                              ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-300'
                              : m.type === 'OUT'
                              ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300'
                              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300'
                          }`}
                        >
                          {m.type === 'IN' ? 'Entrada' : m.type === 'OUT' ? 'Salida' : 'Ajuste'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        {m.type === 'IN' ? '+' : m.type === 'OUT' ? '-' : ''}
                        {m.quantity} uds
                      </td>
                      <td className="px-6 py-4">
                        {m.reason || (m.type === 'IN' ? 'Abastecimiento de stock' : m.type === 'OUT' ? 'Salida de almacén' : 'Ajuste')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Movement Modal */}
      <Modal open={movementModalOpen} onClose={() => { setMovementModalOpen(false); setError('') }} title="Registrar Movimiento de Stock">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleMovementSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Tipo de Movimiento</label>
            <select
              value={movementForm.type}
              onChange={e => setMovementForm({ ...movementForm, type: e.target.value as 'IN' | 'OUT' | 'ADJUSTMENT' })}
              className={selectCls}
            >
              <option value="IN">Entrada (Abastecimiento/Compra)</option>
              <option value="OUT">Salida (Venta/Uso/Daño)</option>
              <option value="ADJUSTMENT">Ajuste Manual (Auditoría/Conteo directo)</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>
              {movementForm.type === 'ADJUSTMENT' ? 'Nueva Cantidad Total en Stock' : 'Cantidad'}
            </label>
            <input
              type="number"
              min="0"
              required
              value={movementForm.quantity}
              onChange={e => setMovementForm({ ...movementForm, quantity: Number(e.target.value) })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Motivo / Notas</label>
            <input
              type="text"
              required
              value={movementForm.reason}
              onChange={e => setMovementForm({ ...movementForm, reason: e.target.value })}
              className={inputCls}
              placeholder="Ej. Compra a proveedor, Ajuste mensual, Venta local"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setMovementModalOpen(false)}
              className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {saving ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
