import { useState } from 'react'
import { X, Upload, Plus, Trash2, Smartphone, DollarSign, CreditCard } from 'lucide-react'
import { crearVenta } from '../../services/apiAdmin'
import { currency } from '../../utils/formatters'

export default function RegisterSaleModal({ isOpen, onClose, onSuccess }) {
  const [nombreCliente, setNombreCliente] = useState('')
  const [telefonoCliente, setTelefonoCliente] = useState('')
  const [metodoPago, setMetodoPago] = useState('Yape')
  const [comprobanteUrl, setComprobanteUrl] = useState('')
  const [items, setItems] = useState([{ nombre: '', cantidad: 1, precio: 0 }])
  const [nota, setNota] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleAddItem = () => {
    setItems([...items, { nombre: '', cantidad: 1, precio: 0 }])
  }

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index, field, value) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setComprobanteUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const montoTotal = items.reduce((sum, item) => sum + (Number(item.cantidad) || 0) * (Number(item.precio) || 0), 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await crearVenta({
        clienteNombre: nombreCliente || 'Cliente Directo',
        clienteTelefono: telefonoCliente,
        metodoPago,
        comprobanteUrl,
        items,
        nota,
        montoTotal,
      })
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Error al guardar la venta')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="sale-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="sale-modal-header">
          <h3>Registrar nueva venta</h3>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="toast-error" style={{ marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Cliente Info */}
          <div className="modal-form-grid">
            <div className="form-field-group">
              <label>Nombre del cliente</label>
              <input
                type="text"
                placeholder="Ej: María Quispe"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
              />
            </div>
            <div className="form-field-group">
              <label>Teléfono (opcional)</label>
              <input
                type="text"
                placeholder="+51 9XX XXX XXX"
                value={telefonoCliente}
                onChange={(e) => setTelefonoCliente(e.target.value)}
              />
            </div>
          </div>

          {/* Método de Pago */}
          <div className="form-field-group">
            <label>Método de pago</label>
            <div className="payment-methods-grid">
              <button
                type="button"
                className={`payment-method-card ${metodoPago === 'Yape' ? 'selected' : ''}`}
                onClick={() => setMetodoPago('Yape')}
              >
                <Smartphone size={20} />
                <span>Yape</span>
              </button>

              <button
                type="button"
                className={`payment-method-card ${metodoPago === 'Efectivo' ? 'selected' : ''}`}
                onClick={() => setMetodoPago('Efectivo')}
              >
                <DollarSign size={20} />
                <span>Efectivo</span>
              </button>

              <button
                type="button"
                className={`payment-method-card ${metodoPago === 'Tarjeta' ? 'selected' : ''}`}
                onClick={() => setMetodoPago('Tarjeta')}
              >
                <CreditCard size={20} />
                <span>Tarjeta</span>
              </button>
            </div>
          </div>

          {/* Subir comprobante Yape if selected */}
          {metodoPago === 'Yape' && (
            <div className="form-field-group">
              <label>Foto del comprobante Yape</label>
              <label className="yape-upload-area">
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                {comprobanteUrl ? (
                  <img src={comprobanteUrl} alt="Comprobante Yape" className="yape-preview-thumb" />
                ) : (
                  <>
                    <div className="yape-upload-icon-box">
                      <Upload size={20} />
                    </div>
                    <p className="yape-upload-title">Subir foto del Yape</p>
                    <p className="yape-upload-subtext">Toca para seleccionar imagen</p>
                  </>
                )}
              </label>
            </div>
          )}

          {/* Productos / Servicios */}
          <div className="form-field-group" style={{ marginTop: '12px' }}>
            <div className="items-section-header">
              <label>Productos / Servicios</label>
              <button type="button" className="btn-add-item-row" onClick={handleAddItem}>
                <Plus size={14} /> Agregar
              </button>
            </div>

            {items.map((item, idx) => (
              <div key={idx} className="product-item-row">
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={item.nombre}
                  onChange={(e) => handleItemChange(idx, 'nombre', e.target.value)}
                  required
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Cant"
                  value={item.cantidad}
                  onChange={(e) => handleItemChange(idx, 'cantidad', e.target.value)}
                  required
                />
                <input
                  type="number"
                  step="0.10"
                  min="0"
                  placeholder="Precio S/"
                  value={item.precio}
                  onChange={(e) => handleItemChange(idx, 'precio', e.target.value)}
                  required
                />
                <button
                  type="button"
                  style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                  onClick={() => handleRemoveItem(idx)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Nota */}
          <div className="form-field-group">
            <label>Nota (opcional)</label>
            <textarea
              rows={2}
              placeholder="Ej: cliente pidió envío, descuento aplicado..."
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
          </div>

          {/* Total Banner */}
          <div className="total-banner-box">
            <label>Total a cobrar</label>
            <h4>{currency.format(montoTotal)}</h4>
          </div>

          {/* Footer Actions */}
          <div className="modal-actions-row">
            <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-save" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar Venta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
