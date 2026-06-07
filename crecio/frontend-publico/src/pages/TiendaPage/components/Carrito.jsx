import { useState, useEffect } from 'react'
import LoginCompradorModal from './LoginCompradorModal'
import PagoStripeModal     from './PagoStripeModal'

const BASE_URL = 'http://localhost:3001/api'
// Guarda item en BD si hay token
const guardarEnBD = async (producto, negocioId, token) => {
  if (!token) return
  try {
    await fetch(`${BASE_URL}/cuenta/carrito`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({
        producto_id: producto.pk_id,
        negocio_id:  negocioId,
        cantidad:    1,
      }),
    })
  } catch {}
}

const limpiarCarritoBD = async (token) => {
  if (!token) return
  try {
    await fetch(`${BASE_URL}/cuenta/carrito`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {}
}

function Carrito({ carrito, subtotal, onCerrar, onCambiar, onEliminar, onWhatsApp, negocioId, negocioNombre }) {
  const [showLogin, setShowLogin] = useState(false)
  const [showPago, setShowPago]   = useState(false)
  const token = localStorage.getItem('token_comprador')

  // Guardar en BD cuando cambia el carrito
  useEffect(() => {
    if (!token || carrito.length === 0) return
    carrito.forEach(p => guardarEnBD(p, negocioId, token))
  }, [carrito, token, negocioId])

  const handlePagarTarjeta = () => {
    if (!token) setShowLogin(true)
    else        setShowPago(true)
  }

  const handleLoginExito = () => { setShowLogin(false); setShowPago(true) }

  const handlePagoExito = () => {
    limpiarCarritoBD(token)
    onCerrar()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm" onClick={onCerrar}>
        <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl"
          onClick={e => e.stopPropagation()}
          style={{ animation: 'slideInRight 0.3s ease-out' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <i className="ri-shopping-cart-2-line text-[#0D9488] text-lg" />
              <h3 className="font-bold text-[#111827] text-base">Tu pedido</h3>
              {carrito.length > 0 && (
                <span className="bg-[#0D9488] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {carrito.reduce((a, p) => a + p.cantidad, 0)}
                </span>
              )}
            </div>
            <button onClick={onCerrar} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] transition-colors cursor-pointer">
              <i className="ri-close-line text-lg text-[#374151]" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
            {carrito.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-[#9CA3AF] py-16">
                <i className="ri-shopping-cart-line text-5xl mb-3 text-[#E5E7EB]" />
                <p className="text-sm font-medium">Tu carrito está vacío</p>
                <p className="text-xs mt-1">Agrega productos para empezar</p>
              </div>
            ) : carrito.map((p, i) => (
              <div key={i} className="flex gap-3 bg-[#FAFAFA] rounded-xl p-3 items-center border border-[#E5E7EB]">
                {p.img
                  ? <img src={p.img} alt={p.nombre} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  : <div className="w-16 h-16 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0"><i className="ri-image-line text-[#D1D5DB] text-xl" /></div>
                }
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#111827] truncate">{p.nombre}</div>
                  <div className="text-xs text-[#0D9488] font-bold mt-0.5">S/ {Number(p.precio).toFixed(2)}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => onCambiar(p.pk_id, -1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer">
                      <i className="ri-subtract-line text-xs" />
                    </button>
                    <span className="text-sm font-bold text-[#111827] w-6 text-center">{p.cantidad}</span>
                    <button onClick={() => onCambiar(p.pk_id, 1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer">
                      <i className="ri-add-line text-xs" />
                    </button>
                    <button onClick={() => onEliminar(p.pk_id)} className="ml-auto w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-all cursor-pointer">
                      <i className="ri-delete-bin-line text-xs" />
                    </button>
                  </div>
                </div>
                <div className="text-sm font-bold text-[#111827] shrink-0">
                  S/ {(p.precio * p.cantidad).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {carrito.length > 0 && (
            <div className="border-t border-[#E5E7EB] p-5 flex flex-col gap-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280] font-medium">Subtotal</span>
                <span className="text-xl font-bold text-[#111827]">S/ {subtotal.toFixed(2)}</span>
              </div>
              <button onClick={onWhatsApp}
                className="w-full py-3.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg">
                <i className="ri-whatsapp-line text-base" />
                Pagar y pedir por WhatsApp
              </button>
              <button onClick={handlePagarTarjeta}
                className="w-full py-3.5 rounded-xl bg-[#111827] hover:bg-[#374151] text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                <i className="ri-secure-payment-line text-base" />
                ¿Cómo pagar?
              </button>
            </div>
          )}
        </div>
      </div>

      {showLogin && <LoginCompradorModal onClose={() => setShowLogin(false)} onSuccess={handleLoginExito} />}
      {showPago  && <PagoStripeModal carrito={carrito} negocioId={negocioId} negocioNombre={negocioNombre} subtotal={subtotal} onCerrar={() => setShowPago(false)} onExito={handlePagoExito} />}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

export default Carrito