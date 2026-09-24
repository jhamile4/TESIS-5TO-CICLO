import { useState } from 'react'
import { X, Camera, Trash2 } from 'lucide-react'
import { actualizarProducto } from '../../services/apiAdmin'

const categoryOptions = ['Ropa', 'Accesorios', 'Hogar', 'Electrónica', 'Papelería', 'General']

export default function EditProductModal({ product, onClose, onUpdated, onDeleteClick }) {
  const [form, setForm] = useState({
    nombre: product.nombre || '',
    precio: product.precio || '',
    stock: product.stock || '',
    categoria: product.categoria || 'General',
    descripcion: product.descripcion || '',
    imagenUrl: product.imagen_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key, val) => setForm({ ...form, [key]: val })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.precio || !form.stock) {
      setError('Por favor completa el nombre, precio y stock.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await actualizarProducto(product.pk_id, {
        nombre: form.nombre,
        precio: Number(form.precio),
        stock: Number(form.stock),
        categoria: form.categoria,
        descripcion: form.descripcion,
        imagenUrl: form.imagenUrl
      })
      onUpdated()
    } catch (err) {
      setError(err.message || 'Error al actualizar producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="inv-modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3>Editar Producto</h3>
            <small>ID: PROD-00{product.pk_id}</small>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Product Image Section */}
        <div className="img-preview-box edit-mode-img">
          <img src={form.imagenUrl} alt={form.nombre} />
          <button className="change-photo-btn">
            <Camera size={13} /> Cambiar foto
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="modal-form-body">
          <div className="field">
            <label>Nombre del producto</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => update('nombre', e.target.value)}
              required
            />
          </div>

          <div className="two-cols-row">
            <div className="field">
              <label>Precio (S/)</label>
              <input
                type="number"
                step="0.01"
                value={form.precio}
                onChange={(e) => update('precio', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => update('stock', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Categoría</label>
            <select
              value={form.categoria}
              onChange={(e) => update('categoria', e.target.value)}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => update('descripcion', e.target.value)}
              rows={3}
            />
          </div>

          {/* Status bar */}
          <div className="status-sales-note-bar">
            <span>
              <span className="dot-green"></span> Estado: <strong>Activo</strong>
            </span>
            <small>{product.ventas || 45} ventas registradas</small>
          </div>

          {/* Modal Action Footer */}
          <div className="modal-actions-footer edit-footer">
            <button
              type="button"
              className="btn-modal-delete"
              onClick={() => onDeleteClick(product)}
            >
              <Trash2 size={14} /> Eliminar
            </button>
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
