import { X } from 'lucide-react'

export default function VoucherModal({ isOpen, voucherUrl, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="sale-modal-box" style={{ maxWidth: '420px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <div className="sale-modal-header">
          <h3>Comprobante Yape / Voucher</h3>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div style={{ margin: '16px 0', background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
          {voucherUrl ? (
            <img
              src={voucherUrl}
              alt="Comprobante Yape"
              style={{ width: '100%', maxHeight: '450px', objectFit: 'contain', borderRadius: '8px' }}
            />
          ) : (
            <p style={{ color: '#64748b', fontSize: '13px', margin: '20px 0' }}>
              No se adjuntó imagen de comprobante para esta venta.
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <button className="btn-modal-cancel" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
