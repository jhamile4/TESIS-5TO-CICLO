import ModalShell from '../common/ModalShell'

export default function VoucherModal({ isOpen, voucherUrl, onClose }) {
  const footerAction = (
    <button className="btn-ui-outline" onClick={onClose}>
      Cerrar
    </button>
  )

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Comprobante Yape / Voucher"
      maxWidth="440px"
      footer={footerAction}
    >
      <div className="voucher-preview-container">
        {voucherUrl ? (
          <img
            src={voucherUrl}
            alt="Comprobante Yape"
            className="voucher-preview-img"
          />
        ) : (
          <p className="voucher-empty-text">
            No se adjuntó imagen de comprobante para esta venta.
          </p>
        )}
      </div>
    </ModalShell>
  )
}
