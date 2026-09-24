import { useState } from 'react'
import { X, Camera, Sparkles, Wand2 } from 'lucide-react'
import { crearProducto } from '../../services/apiAdmin'

const categoryOptions = ['Ropa', 'Accesorios', 'Hogar', 'Electrónica', 'Papelería', 'General']

export default function AddProductModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    descripcion: '',
    imagenUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'
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
      await crearProducto({
        nombre: form.nombre,
        precio: Number(form.precio),
        stock: Number(form.stock),
        categoria: form.categoria || 'General',
        descripcion: form.descripcion,
        imagenUrl: form.imagenUrl
      })
      onCreated()
    } catch (err) {
      setError(err.message || 'Error al agregar producto')
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
            <h3>Agregar Producto</h3>
            <small>La IA procesará tu imagen automáticamente</small>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* AI Image Banner Section */}
        <div className="ai-image-preview-block">
          <div className="img-preview-box">
            <img src={form.imagenUrl} alt="Preview" />
            <span className="ia-processed-badge">
              <Sparkles size={11} /> IA procesada
            </span>
            <button className="change-photo-btn">
              <Camera size={13} /> Cambiar foto
            </button>
          </div>

          <div className="ai-green-note">
            <Wand2 size={14} /> Imagen procesada con IA · Fondo eliminado correctamente
          </div>
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
              placeholder="Ej: Camiseta Premium"
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
                placeholder="S/ 0.00"
                required
              />
            </div>
            <div className="field">
              <label>Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => update('stock', e.target.value)}
                placeholder="0"
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
              <option value="">Seleccionar categoría...</option>
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
              placeholder="Describe las características principales de tu producto..."
              rows={3}
            />
          </div>

          <div className="modal-actions-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-submit" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
