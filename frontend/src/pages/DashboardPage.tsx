import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { productsApi } from '../apis/products.api'
import type { Product } from '../apis/products.api'
import { movementsApi } from '../apis/movements.api'
import type { GlobalStockMovement } from '../apis/movements.api'
import StatCard from '../components/StatCard'
import Navbar from '../components/Navbar'

export default function DashboardPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [recentMovements, setRecentMovements] = useState<GlobalStockMovement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const prodRes = await productsApi.getAll()
        setProducts(prodRes.data.products || [])

        const movRes = await movementsApi.getAll()
        setRecentMovements((movRes.data.movements || []).slice(0, 5))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Simple inventory aggregates
  const totalProducts = products.length
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0)
  const lowStockProducts = products.filter(p => p.stock <= p.minStock)
  const lowStockCount = lowStockProducts.length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Hola, {user?.firstName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Resumen del estado de tu inventario en MiniGestor
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Productos Registrados"
              value={String(totalProducts)}
              icon="📦"
              color="blue"
            />
            <StatCard
              label="Total de Unidades"
              value={String(totalStock)}
              icon="🔢"
              color="green"
            />
            <StatCard
              label="Bajo Stock (Alertas)"
              value={String(lowStockCount)}
              icon="⚠️"
              color={lowStockCount > 0 ? 'red' : 'green'}
            />
          </div>
        )}

        {/* Low Stock Warning Panel if any */}
        {!loading && lowStockCount > 0 && (
          <div className="mt-6 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-red-700 dark:text-red-300 font-semibold">
              <span>⚠️</span>
              <h3>Atención: {lowStockCount} producto(s) en stock crítico</h3>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">
              Los siguientes productos están en o por debajo de su límite de stock mínimo y requieren reabastecimiento.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lowStockProducts.map(p => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/40 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition"
                >
                  {p.name} ({p.stock} / {p.minStock})
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Catálogo de Productos</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Registra nuevos productos, edita información y administra inventario.</p>
            </div>
            <Link to="/products" className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm px-4 py-2 rounded-xl transition">
              Ir a Inventario
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Controladores de Stock</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Visualiza y analiza el historial completo de entradas y salidas.</p>
            </div>
            <Link to="/products" className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm px-4 py-2 rounded-xl transition">
              Ajustar Stock
            </Link>
          </div>
        </div>

        {/* Recent Movements Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Movimientos Recientes
            </h2>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : recentMovements.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
              No se han registrado movimientos de stock aún.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMovements.map(m => (
                <div
                  key={m.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-semibold ${
                        m.type === 'IN'
                          ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-300'
                          : m.type === 'OUT'
                          ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300'
                          : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300'
                      }`}
                    >
                      {m.type === 'IN' ? '↓' : m.type === 'OUT' ? '↑' : '⚙️'}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {m.product?.name || 'Producto Eliminado'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {m.reason || (m.type === 'IN' ? 'Entrada' : m.type === 'OUT' ? 'Salida' : 'Ajuste')}
                        {' · '}
                        {new Date(m.createdAt).toLocaleString('es-ES', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-sm ${
                        m.type === 'IN'
                          ? 'text-green-600 dark:text-green-400'
                          : m.type === 'OUT'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {m.type === 'IN' ? '+' : m.type === 'OUT' ? '-' : ''}
                      {m.quantity} unidades
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Tipo: {m.type === 'IN' ? 'Entrada' : m.type === 'OUT' ? 'Salida' : 'Ajuste'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
