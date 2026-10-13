import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function ModalShell({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '520px',
  footer = null,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-backdrop-ui" onClick={onClose}>
      <div
        className="modal-box-ui"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header-ui">
          <div>
            <h3 id="modal-title" className="modal-title-ui">{title}</h3>
            {subtitle && <p className="modal-subtitle-ui">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="modal-close-btn-ui"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-ui">
          {children}
        </div>

        {footer && (
          <div className="modal-footer-ui">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
