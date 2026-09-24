import { useEffect, useState } from 'react'
import { getInventario } from '../services/apiAdmin'

import InventoryHeader from '../components/inventory/InventoryHeader'
import InventoryMetrics from '../components/inventory/InventoryMetrics'
import InventoryFilters from '../components/inventory/InventoryFilters'
import InventoryCard from '../components/inventory/InventoryCard'
import AddProductModal from '../components/inventory/AddProductModal'
import EditProductModal from '../components/inventory/EditProductModal'
import DeleteProductModal from '../components/inventory/DeleteProductModal'

export default function InventoryPage() {
  const [data, setData] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [error, setError] = useState('')

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)

  const loadData = () => {
    getInventario()
      .then(setData)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadData()
  }, [])

  const products = data?.productos || []
  const metrics = data?.metricas || {
    totalProductos: 0,
    alertasStockBajo: 0,
    unidadesStock: 0,
    valorInventario: 0
  }

  // Calculate dynamic category list with badges
  const categoriesMap = products.reduce((acc, p) => {
    const cat = p.categoria || 'General'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  const categoriesWithCount = [
    { name: 'Todas', count: products.length },
    ...Object.entries(categoriesMap).map(([name, count]) => ({ name, count }))
  ]

  // Filter products by search query and category
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'Todas' || p.categoria === selectedCategory
    const matchesSearch = p.nombre.toLowerCase().includes(query.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <section className="inventory-page-wrapper">
      <InventoryHeader onAddClick={() => setShowAddModal(true)} />

      {error && <div className="toast-error">{error}</div>}

      <InventoryMetrics metrics={metrics} />

      <InventoryFilters
        query={query}
        setQuery={setQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoriesWithCount={categoriesWithCount}
      />

      <div className="inventory-cards-grid">
        {filteredProducts.map((product) => (
          <InventoryCard
            key={product.pk_id}
            product={product}
            onClick={() => setEditingProduct(product)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-inventory-box">
          <p>No se encontraron productos que coincidan con la búsqueda.</p>
        </div>
      )}

      {/* MODALS */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onCreated={() => {
            setShowAddModal(false)
            loadData()
          }}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdated={() => {
            setEditingProduct(null)
            loadData()
          }}
          onDeleteClick={(prod) => {
            setEditingProduct(null)
            setDeletingProduct(prod)
          }}
        />
      )}

      {deletingProduct && (
        <DeleteProductModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onDeleted={() => {
            setDeletingProduct(null)
            loadData()
          }}
        />
      )}
    </section>
  )
}
