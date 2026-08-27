import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../apis/products.api'
import type { Product, ProductPayload } from '../apis/products.api'
import { categoriesApi } from '../apis/categories.api'
import type { Category } from '../apis/categories.api'
import { suppliersApi } from '../apis/suppliers.api'
import type { Supplier } from '../apis/suppliers.api'
import Modal from '../components/Modal'
import Navbar from '../components/Navbar'

const inputCls = "w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
const selectCls = `${inputCls} appearance-none`

export default function ProductsPage() {
  // Data lists
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  
  // UI States
  const [loading, setLoading] = useState(true)
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [movementModalOpen, setMovementModalOpen] = useState(false)
  
  // Filtering states
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<number | ''>('')
  const [selectedSup, setSelectedSup] = useState<number | ''>('')
  const [lowStockFilter, setLowStockFilter] = useState(false)

  // Forms
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState<ProductPayload>({
    name: '', sku: '', description: '', stock: 0, minStock: 5, price: 0, categoryId: null, supplierId: null
  })
  const [movementForm, setMovementForm] = useState({
    productId: 0, productName: '', type: 'IN' as 'IN' | 'OUT' | 'ADJUSTMENT', quantity: 1, reason: ''
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Load Categories & Suppliers
  const loadFilters = async () => {
    try {
      const [catRes, supRes] = await Promise.all([
        categoriesApi.getAll(),
        suppliersApi.getAll()
      ])
      setCategories(catRes.data.categories || [])
      setSuppliers(supRes.data.suppliers || [])
    } catch (err) {
      console.error('Error loading filters:', err)
    }
  }

  // Load Products with filters
  const loadProducts = async () => {
    setLoading(true)
    try {
      const res = await productsApi.getAll({
        search: search || undefined,
        categoryId: selectedCat || undefined,
        supplierId: selectedSup || undefined,
        lowStock: lowStockFilter || undefined
      })
      setProducts(res.data.products || [])
    } catch (err) {
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Reload products whenever filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts()
    }, 300) // debounce search
    return () => clearTimeout(timer)
  }, [search, selectedCat, selectedSup, lowStockFilter])

  useEffect(() => {
    loadFilters()
  }, [])

  // Open modal for creating product
  const handleOpenCreate = () => {
    setEditingProduct(null)
    setProductForm({
      name: '', sku: '', description: '', stock: 0, minStock: 5, price: 0, categoryId: null, supplierId: null
    })
    setError('')
    setProductModalOpen(true)
  }

  // Open modal for editing product
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p)
    setProductForm({
      name: p.name,
      sku: p.sku || '',
      description: p.description || '',
      minStock: p.minStock,
      price: p.price || 0,
      categoryId: p.categoryId || null,
      supplierId: p.supplierId || null
    })
    setError('')
    setProductModalOpen(true)
  }

  // Open stock movement modal
  const handleOpenMovement = (p: Product) => {
    setMovementForm({
      productId: p.id,
      productName: p.name,
      type: 'IN',
      quantity: 1,
      reason: ''
    })
    setError('')
    setMovementModalOpen(true)
  }

  // Submit product create/edit
  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      const payload = {
        ...productForm,
        categoryId: productForm.categoryId ? Number(productForm.categoryId) : null,
        supplierId: productForm.supplierId ? Number(productForm.supplierId) : null,
        price: productForm.price ? Number(productForm.price) : 0,
        minStock: productForm.minStock ? Number(productForm.minStock) : 5,
        stock: productForm.stock ? Number(productForm.stock) : 0
      }

      if (editingProduct) {
        await productsApi.update(editingProduct.id, payload)
      } else {
        await productsApi.create(payload)
      }
      setProductModalOpen(false)
      loadProducts()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  // Submit stock movement
  const handleMovementSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      await productsApi.addMovement(movementForm.productId, {
        type: movementForm.type,
        quantity: Number(movementForm.quantity),
        reason: movementForm.reason
      })
      setMovementModalOpen(false)
      loadProducts()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar el movimiento')
    } finally {
      setSaving(false)
    }
  }

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto y todo su historial de movimientos?')) return
    try {
      await productsApi.delete(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting product:', err)
      alert('No se pudo eliminar el producto')
    }
  }

  const handleCreateCategoryQuick = async () => {
    const name = prompt('Nombre de la nueva categoría:')
    if (!name) return
    try {
      await categoriesApi.create({ name })
      loadFilters()
    } catch (err) {
      alert('Error al crear la categoría')
    }
  }

  const handleCreateSupplierQuick = async () => {
    const name = prompt('Nombre del nuevo proveedor:')
    if (!name) return
    try {
      await suppliersApi.create({ name })
      loadFilters()
    } catch (err) {
      alert('Error al crear el proveedor')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Inventario de Productos</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Controla las existencias, SKU y abastecimiento de tus productos</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm self-start sm:self-auto"
          >
            + Añadir Producto
          </button>
        </div>

        {/* Filters Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm mb-6 transition-colors grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Buscar</label>
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Categoría</label>
            <select
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value ? Number(e.target.value) : '')}
              className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            >
              <option value="">Todas</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Proveedor</label>
            <select
              value={selectedSup}
              onChange={e => setSelectedSup(e.target.value ? Number(e.target.value) : '')}
              className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            >
              <option value="">Todos</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between sm:justify-start gap-3 py-2">
            <input
              type="checkbox"
              id="lowStockCheck"
              checked={lowStockFilter}
              onChange={e => setLowStockFilter(e.target.checked)}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="lowStockCheck" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
              ⚠️ Alerta de Bajo Stock
            </label>
          </div>
        </div>

        {/* Catalog List / Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[...Array(6)].map((_, i) => <div key={i} className="h-44 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400 dark:text-gray-500 transition-colors">
            <span className="text-4xl">📭</span>
            <p className="mt-3 text-sm">No se encontraron productos registrados.</p>
            <button onClick={handleOpenCreate} className="mt-4 text-emerald-600 dark:text-emerald-400 font-medium hover:underline text-sm">
              Registrar el primero →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => {
              const isLowStock = p.stock <= p.minStock
              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-mono">
                        {p.sku || 'Sin SKU'}
                      </span>
                      {isLowStock && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 flex items-center gap-1 animate-pulse">
                          ⚠️ Bajo Stock
                        </span>
                      )}
                    </div>
                    <Link to={`/products/${p.id}`} className="block hover:text-emerald-600 dark:hover:text-emerald-400">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">{p.name}</h3>
                    </Link>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2 min-h-[2rem]">
                      {p.description || 'Sin descripción.'}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase">Categoría</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{p.category?.name || 'Ninguna'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase">Proveedor</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{p.supplier?.name || 'Ninguno'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Stock</span>
                      <span className={`text-lg font-extrabold ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {p.stock} <span className="text-xs font-normal text-gray-400">uds</span>
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenMovement(p)}
                        title="Ajustar Stock"
                        className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 p-2 rounded-xl transition"
                      >
                        ⚙️
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        title="Editar"
                        className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 p-2 rounded-xl transition"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        title="Eliminar"
                        className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 p-2 rounded-xl transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Product Create/Edit Modal */}
      <Modal open={productModalOpen} onClose={() => setProductModalOpen(false)} title={editingProduct ? 'Editar Producto' : 'Añadir Producto'}>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Nombre del Producto</label>
            <input
              type="text"
              required
              value={productForm.name}
              onChange={e => setProductForm({ ...productForm, name: e.target.value })}
              className={inputCls}
              placeholder="Ej. Teclado Mecánico"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Código SKU / Barcode</label>
              <input
                type="text"
                value={productForm.sku || ''}
                onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                className={inputCls}
                placeholder="Ej. TEC-MEC-01"
              />
            </div>
            <div>
              <label className={labelCls}>Precio Unitario</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={productForm.price || ''}
                onChange={e => setProductForm({ ...productForm, price: e.target.value ? Number(e.target.value) : 0 })}
                className={inputCls}
                placeholder="0.00"
              />
            </div>
          </div>
          
          {/* Only prompt initial stock when creating */}
          {!editingProduct && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Stock Inicial</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={productForm.stock || ''}
                  onChange={e => setProductForm({ ...productForm, stock: e.target.value ? Number(e.target.value) : 0 })}
                  className={inputCls}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelCls}>Stock Mínimo Alerta</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={productForm.minStock || ''}
                  onChange={e => setProductForm({ ...productForm, minStock: e.target.value ? Number(e.target.value) : 5 })}
                  className={inputCls}
                  placeholder="5"
                />
              </div>
            </div>
          )}

          {editingProduct && (
            <div>
              <label className={labelCls}>Stock Mínimo Alerta</label>
              <input
                type="number"
                min="0"
                required
                value={productForm.minStock || ''}
                onChange={e => setProductForm({ ...productForm, minStock: e.target.value ? Number(e.target.value) : 5 })}
                className={inputCls}
                placeholder="5"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                <button type="button" onClick={handleCreateCategoryQuick} className="text-xs text-emerald-600 hover:underline">+ Crear</button>
              </div>
              <select
                value={productForm.categoryId || ''}
                onChange={e => setFormCategoryId(e.target.value)}
                className={selectCls}
              >
                <option value="">Ninguna</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Proveedor</label>
                <button type="button" onClick={handleCreateSupplierQuick} className="text-xs text-emerald-600 hover:underline">+ Crear</button>
              </div>
              <select
                value={productForm.supplierId || ''}
                onChange={e => setFormSupplierId(e.target.value)}
                className={selectCls}
              >
                <option value="">Ninguno</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Descripción</label>
            <textarea
              value={productForm.description || ''}
              onChange={e => setProductForm({ ...productForm, description: e.target.value })}
              className={`${inputCls} h-20 resize-none`}
              placeholder="Detalles sobre ubicación, marcas, etc."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setProductModalOpen(false)}
              className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {saving ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Stock Movement adjustment modal */}
      <Modal open={movementModalOpen} onClose={() => setMovementModalOpen(false)} title={`Ajustar Stock - ${movementForm.productName}`}>
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
              {movementForm.type === 'ADJUSTMENT' ? 'Nueva Cantidad Total en Stock' : 'Cantidad a Ajustar'}
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

  // helper to safely handle category/supplier selects which can be null
  function setFormCategoryId(val: string) {
    setProductForm(prev => ({ ...prev, categoryId: val ? Number(val) : null }))
  }

  function setFormSupplierId(val: string) {
    setProductForm(prev => ({ ...prev, supplierId: val ? Number(val) : null }))
  }
}
