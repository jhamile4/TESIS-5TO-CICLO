import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { eliminarProducto } from '../../services/apiAdmin'

export default function DeleteProductModal({ product, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true)
    setError('')
    try {
      await eliminarProducto(product.pk_id)
      onDeleted()
    } catch (err) {
      setError(err.message || 'Error al eliminar producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="inv-modal-card delete-confirm-card">
        <div className="delete-icon-circle">
          <Trash2 size={24} className="text-red" />
        </div>

        <h3>Eliminar producto</h3>
        <p className="delete-confirm-text">
          ¿Estás seguro que quieres eliminar{' '}
          <strong>"{product.nombre}"</strong>?
          <br />
          <small>Esta acción no se puede deshacer.</small>
        </p>

        {error && <div className="modal-error">{error}</div>}

        <div className="delete-modal-actions">
          <button className="btn-modal-cancel" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="btn-confirm-delete-red" onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
