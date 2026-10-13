import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { eliminarProducto } from '../../services/apiAdmin'
import ModalShell from '../common/ModalShell'

export default function DeleteProductModal({ product, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!product) return null

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

  const footerActions = (
    <>
      <button className="btn-ui-outline" onClick={onClose} disabled={loading}>
        Cancelar
      </button>
      <button className="btn-confirm-delete-red" onClick={handleDelete} disabled={loading}>
        {loading ? 'Eliminando...' : 'Sí, eliminar'}
      </button>
    </>
  )

  return (
    <ModalShell
      isOpen={!!product}
      onClose={onClose}
      title="Eliminar producto"
      maxWidth="420px"
      footer={footerActions}
    >
      <div className="delete-confirm-content">
        <div className="delete-icon-circle">
          <Trash2 size={24} className="text-red" />
        </div>
        <p className="delete-confirm-text">
          ¿Estás seguro que quieres eliminar <strong>"{product.nombre}"</strong>?
          <br />
          <small>Esta acción no se puede deshacer.</small>
        </p>

        {error && <div className="modal-error">{error}</div>}
      </div>
    </ModalShell>
  )
}
