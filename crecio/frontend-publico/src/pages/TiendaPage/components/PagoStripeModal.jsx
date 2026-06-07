import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { crearPaymentIntent, confirmarPago, confirmarPedidoEfectivo } from '../../../services/apiPublico'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
const ENVIO         = 15

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

function CheckoutInner({ carrito, negocioId, subtotal, onExito, onCerrar, onPasoChange }) {
  const navigate  = useNavigate()
  const stripe    = useStripe()
  const elements  = useElements()

  const comprador = JSON.parse(localStorage.getItem('comprador') || '{}')
  const token     = localStorage.getItem('token_comprador')

  const envio = subtotal >= 200 ? 0 : ENVIO
  const total = subtotal + envio

  const [paso,       setPaso]      = useState(1)
  const [metodo,     setMetodo]    = useState(null)
  const [direccion,  setDireccion] = useState('')
  const [ciudad,     setCiudad]    = useState('')
  const [notas,      setNotas]     = useState('')
  const [nombre,     setNombre]    = useState(comprador.nombre || '')
  const [cargando,   setCargando]  = useState(false)
  const [error,      setError]     = useState(null)
  const [ordenId,    setOrdenId]   = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError,   setGeoError]   = useState(null)

  const cambiarPaso = (n) => { setPaso(n); onPasoChange(n) }

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setGeoError('Tu navegador no soporta geolocalización')
      return
    }
    setGeoLoading(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&accept-language=es`,
            { headers: { 'Accept-Language': 'es' } }
          )
          const data = await res.json()
          const a    = data.address || {}

          const calle  = [a.road, a.house_number].filter(Boolean).join(' ')
          const barrio = a.suburb || a.neighbourhood || a.quarter || ''
          const dist   = a.city_district || a.district || a.county || ''
          const ciudad_ = a.city || a.town || a.village || ''

          setDireccion(calle || data.display_name?.split(',')[0] || '')
          setCiudad([barrio || dist, ciudad_].filter(Boolean).join(', '))
          setError(null)
        } catch {
          setGeoError('No se pudo obtener la dirección. Ingrésala manualmente.')
        } finally {
          setGeoLoading(false)
        }
      },
      (err) => {
        setGeoLoading(false)
        if (err.code === 1) setGeoError('Permiso de ubicación denegado. Ingrésala manualmente.')
        else                setGeoError('No se pudo obtener tu ubicación.')
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }

  const irPaso2 = () => {
    if (!direccion.trim()) { setError('La dirección de entrega es obligatoria'); return }
    setError(null)
    cambiarPaso(2)
  }

  const handlePagarTarjeta = async () => {
    if (!stripe || !elements) return
    if (!nombre.trim()) { setError('Ingresa el nombre en la tarjeta'); return }
    setCargando(true); setError(null)
    try {
      const data = await crearPaymentIntent(carrito, negocioId, token, { direccion, ciudad, notas })
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: nombre, email: comprador.email || '' },
        },
      })
      if (stripeError) { setError(stripeError.message); setCargando(false); return }
      await confirmarPago(paymentIntent.id, token)
      setOrdenId(data.ordenId)
      onExito()
      cambiarPaso(3)
    } catch (err) {
      setError(err.message || 'Error al procesar el pago')
    } finally {
      setCargando(false)
    }
  }

  const handleConfirmarEfectivo = async () => {
    setCargando(true); setError(null)
    try {
      const data = await confirmarPedidoEfectivo({ carrito, negocioId, direccion, ciudad, notas, total }, token)
      setOrdenId(data.ordenId)
      onExito()
      cambiarPaso(3)
    } catch (err) {
      setError(err.message || 'Error al confirmar el pedido')
    } finally {
      setCargando(false)
    }
  }

  /* ── Paso 3: Éxito ── */
  if (paso === 3) return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center"
        style={{ animation: 'popIn 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        <i className="ri-checkbox-circle-fill text-[#0D9488] text-5xl" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-[#111827]">¡Pedido confirmado!</h3>
        {ordenId && <p className="text-xs text-[#9CA3AF] font-mono mt-1">N° de orden: #{ordenId}</p>}
      </div>
      <div className="w-full bg-[#F9FAFB] rounded-xl p-4 text-left border border-[#E5E7EB]">
        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Tu pedido</p>
        {carrito.map((p, i) => (
          <div key={i} className="flex justify-between text-sm py-1">
            <span className="text-[#374151]">{p.nombre} <span className="text-[#9CA3AF]">x{p.cantidad}</span></span>
            <span className="font-semibold text-[#111827]">S/ {(p.precio * p.cantidad).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-[#E5E7EB] mt-2 pt-2 flex justify-between text-sm font-bold">
          <span>Total</span>
          <span className="text-[#0D9488]">S/ {total.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <button onClick={() => { navigate('/perfil'); onCerrar() }}
          className="w-full py-3.5 rounded-xl bg-[#0D9488] text-white font-bold text-sm cursor-pointer hover:bg-[#0F766E] transition-all">
          Ver mis pedidos
        </button>
        <button onClick={onCerrar}
          className="w-full py-3.5 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold text-sm cursor-pointer hover:border-[#0D9488] hover:text-[#0D9488] transition-all">
          Seguir comprando
        </button>
      </div>
    </div>
  )

  /* ── Paso 1: Pedido + Dirección ── */
  if (paso === 1) return (
    <div className="flex flex-col gap-4">
      {/* Productos */}
      <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-4">
        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
          Tu pedido ({carrito.reduce((a, p) => a + p.cantidad, 0)} {carrito.reduce((a, p) => a + p.cantidad, 0) === 1 ? 'item' : 'items'})
        </p>
        <div className="flex flex-col gap-2.5">
          {carrito.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              {p.img
                ? <img src={p.img} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                : <div className="w-10 h-10 rounded-lg bg-[#E5E7EB] shrink-0" />
              }
              <span className="flex-1 text-sm text-[#374151] truncate">
                {p.nombre} <span className="text-[#9CA3AF]">x{p.cantidad}</span>
              </span>
              <span className="text-sm font-semibold text-[#0D9488] shrink-0">
                S/ {(p.precio * p.cantidad).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#E5E7EB] mt-3 pt-3 flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between text-[#6B7280]">
            <span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#6B7280]">
            <span>Envío</span>
            <span>{envio === 0
              ? <span className="text-[#0D9488] font-semibold">Gratis</span>
              : `S/ ${envio.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-[#111827] text-base pt-1 border-t border-[#E5E7EB] mt-1">
            <span>Total</span>
            <span className="text-[#0D9488]">S/ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Usuario */}
      <div className="flex items-center gap-3 bg-[#F0FDF9] border border-[#99F6E4] rounded-xl px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-[#0D9488]/20 flex items-center justify-center shrink-0">
          <i className="ri-user-line text-[#0D9488] text-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#0F766E] truncate">{comprador.email}</p>
          <p className="text-[10px] text-[#6B7280]">Cuenta verificada — ya no pedimos tus datos</p>
        </div>
      </div>

      {/* Separador dirección */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <i className="ri-map-pin-line" /> Dirección de entrega
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      {/* Botón geolocalización */}
      <button
        type="button"
        onClick={obtenerUbicacion}
        disabled={geoLoading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[#0D9488] text-[#0D9488] text-xs font-semibold hover:bg-[#F0FDF9] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {geoLoading
          ? <><i className="ri-loader-4-line animate-spin" /> Obteniendo ubicación...</>
          : <><i className="ri-map-pin-2-line" /> Usar mi ubicación actual</>
        }
      </button>

      {geoError && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-3 py-2.5">
          <i className="ri-alert-line shrink-0" />{geoError}
        </div>
      )}

      {direccion && !geoLoading && (
        <div className="flex items-center gap-2 bg-[#F0FDF9] border border-[#99F6E4] text-[#0F766E] text-xs rounded-xl px-3 py-2.5">
          <i className="ri-checkbox-circle-line shrink-0" /> Ubicación detectada — puedes ajustarla si es necesario
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#374151]">
            Dirección de entrega <span className="text-red-500">*</span>
          </label>
          <input
            value={direccion}
            onChange={e => { setDireccion(e.target.value); setError(null) }}
            placeholder="Ej: Av. Arequipa 1234, piso 2"
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#374151]">Ciudad / Distrito</label>
          <input
            value={ciudad}
            onChange={e => setCiudad(e.target.value)}
            placeholder="Ej: Miraflores, Lima"
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#374151]">Notas (opcional)</label>
          <textarea
            value={notas}
            onChange={e => setNotas(e.target.value)}
            placeholder="Referencias, timbre, piso, instrucciones de entrega..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF] resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
          <i className="ri-error-warning-line shrink-0" />{error}
        </div>
      )}

      <button onClick={irPaso2}
        className="w-full py-4 rounded-xl bg-[#111827] hover:bg-[#374151] text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2">
        Elegir método de pago →
      </button>
    </div>
  )

  /* ── Paso 2: Método de pago ── */
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-2">
        <i className="ri-bank-card-line" /> ¿Cómo querés pagar?
      </p>

      {/* Opciones */}
      <div className="flex flex-col gap-2">
        <button onClick={() => setMetodo('tarjeta')}
          className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${metodo === 'tarjeta' ? 'border-[#0D9488] bg-[#F0FDF9]' : 'border-[#E5E7EB] bg-white hover:border-[#0D9488]/40'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${metodo === 'tarjeta' ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
            <i className={`ri-bank-card-line text-lg ${metodo === 'tarjeta' ? 'text-white' : 'text-[#6B7280]'}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[#111827]">Tarjeta</p>
            <p className="text-xs text-[#6B7280]">Visa, Mastercard, Amex</p>
          </div>
          {metodo === 'tarjeta' && <i className="ri-check-line text-[#0D9488] text-lg" />}
        </button>

        <button onClick={() => setMetodo('efectivo')}
          className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${metodo === 'efectivo' ? 'border-[#0D9488] bg-[#F0FDF9]' : 'border-[#E5E7EB] bg-white hover:border-[#0D9488]/40'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${metodo === 'efectivo' ? 'bg-[#0D9488]' : 'bg-[#F3F4F6]'}`}>
            <i className={`ri-hand-coin-line text-lg ${metodo === 'efectivo' ? 'text-white' : 'text-[#6B7280]'}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[#111827]">Pago en efectivo</p>
            <p className="text-xs text-[#6B7280]">Pagas al recibir el delivery</p>
          </div>
          {metodo === 'efectivo' && <i className="ri-check-line text-[#0D9488] text-lg" />}
        </button>
      </div>

      {/* Panel tarjeta */}
      {metodo === 'tarjeta' && (
        <div className="flex flex-col gap-3 border border-[#E5E7EB] rounded-xl p-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#374151]">Nombre en la tarjeta</label>
            <input type="text" placeholder="Como aparece en tu tarjeta" value={nombre}
              onChange={e => { setNombre(e.target.value); setError(null) }}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#374151]">Número de tarjeta</label>
            <div className="relative px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white focus-within:border-[#0D9488] transition-colors">
              <CardNumberElement options={ELEMENT_STYLE} />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <img src="https://js.stripe.com/v3/fingerprinted/img/visa-365725566f9578a9589553aa9296d178.svg" alt="Visa" className="h-5 w-auto opacity-60" />
                <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="MC" className="h-5 w-auto opacity-60" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#374151]">Vencimiento</label>
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
        </div>
      )}

      {/* Panel efectivo */}
      {metodo === 'efectivo' && (
        <div className="flex flex-col items-center gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 text-center">
          <div className="w-12 h-12 rounded-full bg-[#0D9488]/10 flex items-center justify-center">
            <i className="ri-hand-coin-line text-[#0D9488] text-2xl" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#111827]">Pagas al recibir tu pedido</p>
            <p className="text-xs text-[#6B7280] mt-1">El delivery pasara por tu dirección y pagas en efectivo al momento de la entrega.</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#0D9488] font-semibold">
            <span className="flex items-center gap-1"><i className="ri-check-line" /> Sin adelantos</span>
            <span className="flex items-center gap-1"><i className="ri-shield-check-line" /> Pago seguro</span>
          </div>
        </div>
      )}

      {!metodo && (
        <div className="border border-dashed border-[#E5E7EB] rounded-xl p-4 text-center text-xs text-[#9CA3AF]">
          + Ingresar datos de la tarjeta
        </div>
      )}

      {/* Totales */}
      <div className="flex flex-col gap-1.5 text-sm bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
        <div className="flex justify-between text-[#6B7280]"><span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-[#6B7280]"><span>Envío</span><span>{envio === 0 ? 'Gratis' : `S/ ${envio.toFixed(2)}`}</span></div>
        <div className="flex justify-between font-bold text-[#111827] text-base pt-1 border-t border-[#E5E7EB] mt-1">
          <span>Total a pagar</span><span className="text-[#0D9488]">S/ {total.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
          <i className="ri-error-warning-line shrink-0" />{error}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => { cambiarPaso(1); setMetodo(null); setError(null) }}
          className="flex-1 py-3.5 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold text-sm cursor-pointer hover:border-[#0D9488] hover:text-[#0D9488] transition-all">
          Atrás
        </button>

        {metodo === 'tarjeta' && (
          <button onClick={handlePagarTarjeta} disabled={cargando || !stripe}
            className="flex-1 py-3.5 rounded-xl bg-[#111827] hover:bg-[#374151] text-white font-bold text-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 transition-all">
            {cargando
              ? <><i className="ri-loader-4-line animate-spin" /> Procesando...</>
              : <><i className="ri-bank-card-line" /> Pagar S/ {total.toFixed(2)}</>
            }
          </button>
        )}

        {metodo === 'efectivo' && (
          <button onClick={handleConfirmarEfectivo} disabled={cargando}
            className="flex-1 py-3.5 rounded-xl bg-[#111827] hover:bg-[#374151] text-white font-bold text-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 transition-all">
            {cargando
              ? <><i className="ri-loader-4-line animate-spin" /> Confirmando...</>
              : <><i className="ri-hand-coin-line" /> Confirmar pedido</>
            }
          </button>
        )}

        {!metodo && (
          <button disabled
            className="flex-1 py-3.5 rounded-xl bg-[#E5E7EB] text-[#9CA3AF] font-bold text-sm cursor-not-allowed">
            Selecciona método
          </button>
        )}
      </div>
    </div>
  )
}

function PagoStripeModal({ carrito, negocioId, negocioNombre, subtotal, onCerrar, onExito }) {
  const [paso, setPaso] = useState(1)

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ animation: 'modalIn 0.3s cubic-bezier(0.16,1,0.3,1)' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-base font-bold text-[#111827]">Checkout rápido</h2>
            {negocioNombre && <p className="text-xs text-[#9CA3AF]">{negocioNombre}</p>}
          </div>
          <button onClick={onCerrar}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] transition-colors cursor-pointer">
            <i className="ri-close-line text-[#374151]" />
          </button>
        </div>

        {/* Indicador de pasos */}
        {paso < 3 && (
          <div className="flex items-center justify-center gap-2 pt-4 px-6">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${paso >= s ? 'bg-[#0D9488]' : 'bg-[#E5E7EB]'}`} />
                {i < 2 && <div className={`h-px w-8 transition-all duration-300 ${paso > s ? 'bg-[#0D9488]' : 'bg-[#E5E7EB]'}`} />}
              </div>
            ))}
          </div>
        )}

        <div className="p-6">
          <Elements stripe={stripePromise}>
            <CheckoutInner
              carrito={carrito}
              negocioId={negocioId}
              subtotal={subtotal}
              onExito={onExito}
              onCerrar={onCerrar}
              onPasoChange={setPaso}
            />
          </Elements>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default PagoStripeModal
