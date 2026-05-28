import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { crearPaymentIntent, confirmarPago } from '../../../services/apiPublico'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const ELEMENT_STYLE = {
  style: {
    base: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '14px',
      color: '#111827',
      '::placeholder': { color: '#9CA3AF' },
    },
    invalid: { color: '#EF4444' },
  },
}

function FormularioPago({ carrito, negocioId, subtotal, onExito, onCerrar }) {
  const stripe   = useStripe()
  const elements = useElements()

  const comprador = JSON.parse(localStorage.getItem('comprador') || '{}')
  const token     = localStorage.getItem('token_comprador')

  const [nombre, setNombre]     = useState(comprador.nombre || '')
  const [cargando, setCargando] = useState(false)
  const [error, setError]       = useState(null)
  const [exito, setExito]       = useState(false)

  const handlePagar = async () => {
    if (!stripe || !elements) return
    if (!nombre.trim()) { setError('Ingresa el nombre en la tarjeta'); return }
    setCargando(true); setError(null)
    try {
      const { clientSecret } = await crearPaymentIntent(carrito, negocioId, token)
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: nombre, email: comprador.email || '' },
        },
      })
      if (stripeError) { setError(stripeError.message); setCargando(false); return }
      await confirmarPago(paymentIntent.id, token)
      setExito(true)
      setTimeout(() => { onExito(); onCerrar() }, 2500)
    } catch (err) {
      setError(err.message || 'Error al procesar el pago')
    } finally {
      setCargando(false)
    }
  }

  if (exito) return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-16 h-16 rounded-full bg-[#0D9488]/10 flex items-center justify-center mb-4">
        <i className="ri-checkbox-circle-line text-[#0D9488] text-4xl" />
      </div>
      <h3 className="text-lg font-bold text-[#111827] mb-2">¡Pago exitoso!</h3>
      <p className="text-sm text-[#6B7280]">Tu pedido fue registrado correctamente.</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-5">

      {/* Comprador logueado */}
      <div className="flex items-center gap-3 bg-[#F0FDF9] border border-[#99F6E4] rounded-xl px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-[#0D9488]/20 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-[#0D9488]">
            {comprador.nombre ? comprador.nombre.charAt(0).toUpperCase() : '?'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#0F766E] truncate">Pagando como: {comprador.nombre}</p>
          <p className="text-[10px] text-[#6B7280] truncate">{comprador.email}</p>
        </div>
        <i className="ri-shield-check-fill text-[#0D9488] text-lg shrink-0" />
      </div>

      {/* Resumen */}
      <div className="bg-[#FAFAFA] rounded-xl border border-[#E5E7EB] p-4">
        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Resumen del pedido</p>
        <div className="flex flex-col gap-2">
          {carrito.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-[#374151] truncate flex-1">{p.nombre} <span className="text-[#9CA3AF]">x{p.cantidad}</span></span>
              <span className="font-semibold text-[#111827] ml-2 shrink-0">S/ {(p.precio * p.cantidad).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-[#E5E7EB] pt-2 mt-1 flex items-center justify-between">
            <span className="text-sm font-bold text-[#111827]">Total</span>
            <span className="text-base font-bold text-[#0D9488]">S/ {subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Formulario de tarjeta — campos separados, se ve real */}
      <div className="flex flex-col gap-4">

        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#374151]">Nombre en la tarjeta</label>
          <input
            type="text"
            placeholder="Como aparece en tu tarjeta"
            value={nombre}
            onChange={e => { setNombre(e.target.value); setError(null) }}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF]"
          />
        </div>

        {/* Número de tarjeta */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#374151]">Número de tarjeta</label>
          <div className="relative px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white focus-within:border-[#0D9488] transition-colors">
            <CardNumberElement options={ELEMENT_STYLE} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-5 w-auto opacity-60" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" className="h-5 w-auto opacity-60" />
            </div>
          </div>
        </div>

        {/* Fecha y CVV en fila */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#374151]">Fecha de vencimiento</label>
            <div className="px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white focus-within:border-[#0D9488] transition-colors">
              <CardExpiryElement options={ELEMENT_STYLE} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#374151]">CVV</label>
            <div className="relative px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white focus-within:border-[#0D9488] transition-colors">
              <CardCvcElement options={ELEMENT_STYLE} />
              <i className="ri-question-line absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm" />
            </div>
          </div>
        </div>

        {/* SSL info */}
        <p className="text-[10px] text-[#9CA3AF] flex items-center gap-1.5">
          <i className="ri-lock-line text-[#0D9488]" />
          Tus datos están protegidos con cifrado SSL. Nunca almacenamos tu número de tarjeta.
        </p>
      </div>

      {/* Tarjeta de prueba */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-[11px] font-bold text-amber-700 mb-1 flex items-center gap-1">
          <i className="ri-information-line" />
          Modo de prueba — usa esta tarjeta:
        </p>
        <p className="text-[11px] text-amber-600 font-mono">4242 4242 4242 4242 · 12/34 · 123</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
          <i className="ri-error-warning-line shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={handlePagar}
        disabled={cargando || !stripe}
        className="w-full py-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-sm transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-[#0D9488]/20"
      >
        {cargando
          ? <><i className="ri-loader-4-line animate-spin" /> Procesando pago...</>
          : <><i className="ri-lock-line" /> Pagar S/ {subtotal.toFixed(2)} de forma segura</>
        }
      </button>
    </div>
  )
}

function PagoStripeModal({ carrito, negocioId, subtotal, onCerrar, onExito }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ animation: 'modalIn 0.3s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
              <i className="ri-bank-card-line text-[#0D9488]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">Pago seguro</h2>
              <p className="text-xs text-[#9CA3AF]">Procesado por Stripe · SSL encriptado</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-[#374151]" />
          </button>
        </div>

        <div className="p-6">
          <Elements stripe={stripePromise}>
            <FormularioPago
              carrito={carrito}
              negocioId={negocioId}
              subtotal={subtotal}
              onExito={onExito}
              onCerrar={onCerrar}
            />
          </Elements>
        </div>

        {/* Footer seguridad */}
        <div className="px-6 pb-5 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1 text-[10px] text-[#9CA3AF]">
            <i className="ri-lock-line text-[#0D9488]" />
            SSL Seguro
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#9CA3AF]">
            <i className="ri-shield-check-line text-[#0D9488]" />
            PCI Compliant
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#9CA3AF]">
            <i className="ri-secure-payment-line text-[#635BFF]" />
            Powered by Stripe
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default PagoStripeModal