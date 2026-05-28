import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import Navbar from '../../components/Navbar/Navbar'
import logoCrecio from '../../assets/logoCrecio.png'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
const BASE_URL      = 'http://localhost:3001/api'

const PLANES_INFO = {
  pro: {
    nombre:      'CRECIO Pro',
    precio:      { mensual: 49, anual: 39 },
    descripcion: 'El plan favorito de los negocios que quieren crecer.',
    color:       '#0D9488',
    features: [
      'Catálogo ilimitado de productos',
      'Panel de administración completo',
      'Herramientas de IA incluidas',
      'Dominio personalizado',
      'Reportes y analíticas avanzadas',
      'Soporte prioritario 24/7',
    ],
  },
  enterprise: {
    nombre:      'CRECIO Enterprise',
    precio:      { mensual: 129, anual: 99 },
    descripcion: 'Para negocios con múltiples sucursales.',
    color:       '#111827',
    features: [
      'Todo lo de Pro',
      'Múltiples sucursales',
      'API personalizada',
      'Usuarios ilimitados',
      'Onboarding dedicado',
      'SLA garantizado',
    ],
  },
}

const ELEMENT_STYLE = {
  style: {
    base: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize:   '14px',
      color:      '#111827',
      '::placeholder': { color: '#9CA3AF' },
    },
    invalid: { color: '#EF4444' },
  },
}

// ── Formulario de pago ──
function FormularioPago({ planId, esAnual, planInfo, onExito }) {
  const stripe   = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  const token     = localStorage.getItem('token_comprador')
  const comprador = JSON.parse(localStorage.getItem('comprador') || '{}')

  const [nombre, setNombre]     = useState(comprador.nombre || '')
  const [cargando, setCargando] = useState(false)
  const [error, setError]       = useState(null)
  const [exito, setExito]       = useState(false)

  const precioFinal = esAnual ? planInfo.precio.anual : planInfo.precio.mensual
  const planIdFinal = esAnual ? `${planId}_anual` : planId

  const handlePagar = async () => {
    if (!stripe || !elements) return
    if (!nombre.trim()) { setError('Ingresa el nombre en la tarjeta'); return }
    setCargando(true); setError(null)

    try {
      // 1. Crear Payment Intent
      const res1 = await fetch(`${BASE_URL}/plan/crear-intent`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ planId: planIdFinal }),
      })
      const data1 = await res1.json()
      if (!res1.ok) throw new Error(data1.message)

      // 2. Confirmar con Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data1.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: { name: nombre, email: comprador.email || '' },
          },
        }
      )
      if (stripeError) { setError(stripeError.message); setCargando(false); return }

      // 3. Confirmar en backend
      const res2 = await fetch(`${BASE_URL}/plan/confirmar`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ paymentIntentId: paymentIntent.id, planId: planIdFinal }),
      })
      const data2 = await res2.json()
      if (!res2.ok) throw new Error(data2.message)

      setExito(true)
      setTimeout(() => navigate('/perfil'), 3000)
    } catch (err) {
      setError(err.message || 'Error al procesar el pago')
    } finally {
      setCargando(false)
    }
  }

  if (exito) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-5">
        <i className="ri-checkbox-circle-line text-[#0D9488] text-5xl" />
      </div>
      <h2 className="text-2xl font-bold text-[#111827] mb-2">¡Plan activado!</h2>
      <p className="text-[#6B7280] mb-1">Tu plan <strong>{planInfo.nombre}</strong> está activo.</p>
      <p className="text-sm text-[#9CA3AF]">Redirigiendo a tu perfil...</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-5">

      {/* Comprador */}
      <div className="flex items-center gap-3 bg-[#F0FDF9] border border-[#99F6E4] rounded-xl px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-[#0D9488]/20 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-[#0D9488]">
            {comprador.nombre?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#0F766E] truncate">Comprando como: {comprador.nombre}</p>
          <p className="text-[10px] text-[#6B7280] truncate">{comprador.email}</p>
        </div>
        <i className="ri-shield-check-fill text-[#0D9488] text-lg shrink-0" />
      </div>

      {/* Formulario tarjeta */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#374151]">Nombre en la tarjeta</label>
          <input
            type="text"
            placeholder="Como aparece en tu tarjeta"
            value={nombre}
            onChange={e => { setNombre(e.target.value); setError(null) }}
            className="w-full px-4 py-3.5 rounded-xl border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#374151]">Número de tarjeta</label>
          <div className="relative px-4 py-3.5 rounded-xl border border-[#E5E7EB] bg-white focus-within:border-[#0D9488] transition-colors">
            <CardNumberElement options={ELEMENT_STYLE} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-5 w-auto opacity-60" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" className="h-5 w-auto opacity-60" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#374151]">Vencimiento</label>
            <div className="px-4 py-3.5 rounded-xl border border-[#E5E7EB] bg-white focus-within:border-[#0D9488] transition-colors">
              <CardExpiryElement options={ELEMENT_STYLE} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#374151]">CVV</label>
            <div className="relative px-4 py-3.5 rounded-xl border border-[#E5E7EB] bg-white focus-within:border-[#0D9488] transition-colors">
              <CardCvcElement options={ELEMENT_STYLE} />
              <i className="ri-question-line absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm" />
            </div>
          </div>
        </div>

        <p className="text-[10px] text-[#9CA3AF] flex items-center gap-1.5">
          <i className="ri-lock-line text-[#0D9488]" />
          Datos protegidos con cifrado SSL. Nunca almacenamos tu tarjeta.
        </p>
      </div>

      {/* Tarjeta de prueba */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-[11px] font-bold text-amber-700 mb-1 flex items-center gap-1">
          <i className="ri-information-line" /> Modo de prueba:
        </p>
        <p className="text-[11px] text-amber-600 font-mono">4242 4242 4242 4242 · 12/34 · 123</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
          <i className="ri-error-warning-line shrink-0" />{error}
        </div>
      )}

      <button
        onClick={handlePagar}
        disabled={cargando || !stripe}
        className="w-full py-4 rounded-xl font-bold text-sm text-white transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
        style={{ background: planInfo.color }}
      >
        {cargando
          ? <><i className="ri-loader-4-line animate-spin" /> Procesando...</>
          : <><i className="ri-lock-line" /> Pagar S/ {precioFinal * (esAnual ? 12 : 1)}.00 {esAnual ? '/ año' : '/ mes'}</>
        }
      </button>

      <p className="text-center text-xs text-[#9CA3AF]">
        {esAnual
          ? `Se cobra S/ ${precioFinal * 12}.00 por 12 meses. Cancela cuando quieras.`
          : `Se cobra S/ ${precioFinal}.00 cada mes. Cancela cuando quieras.`
        }
      </p>
    </div>
  )
}

// ── Página principal ──
function PagarPlanPage() {
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const planId         = searchParams.get('plan') || 'pro'
  const esAnual        = searchParams.get('periodo') === 'anual'
  const planInfo       = PLANES_INFO[planId] || PLANES_INFO.pro
  const token          = localStorage.getItem('token_comprador')

  useEffect(() => {
    if (!token) navigate('/login')
  }, [])

  const precioFinal = esAnual ? planInfo.precio.anual : planInfo.precio.mensual

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-16">

        {/* Volver */}
        <button
          onClick={() => navigate('/#precios')}
          className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#0D9488] font-medium mb-8 cursor-pointer transition-colors group"
        >
          <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform" />
          Volver a planes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Izquierda — resumen del plan */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0D9488] mb-3">
                Plan seleccionado
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-2">
                {planInfo.nombre}
              </h1>
              <p className="text-[#6B7280] text-sm">{planInfo.descripcion}</p>
            </div>

            {/* Precio */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-[#111827]">S/ {precioFinal}</span>
                <span className="text-[#6B7280] text-sm">/ mes</span>
              </div>
              {esAnual && (
                <p className="text-xs text-[#0D9488] font-semibold mb-1">
                  Facturado S/ {precioFinal * 12} anuales — ahorras 20%
                </p>
              )}
              <p className="text-xs text-[#9CA3AF]">Sin compromiso · Cancela cuando quieras</p>

              {/* Toggle periodo */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/pagar-plan?plan=${planId}&periodo=mensual`)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    !esAnual ? 'bg-[#0D9488] text-white' : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                  }`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => navigate(`/pagar-plan?plan=${planId}&periodo=anual`)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    esAnual ? 'bg-[#0D9488] text-white' : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                  }`}
                >
                  Anual
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${esAnual ? 'bg-white/20' : 'bg-[#0D9488] text-white'}`}>
                    -20%
                  </span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-4">
                Incluye
              </p>
              <div className="flex flex-col gap-3">
                {planInfo.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#374151]">
                    <div className="w-5 h-5 rounded-full bg-[#0D9488]/10 flex items-center justify-center shrink-0">
                      <i className="ri-check-line text-[#0D9488] text-xs" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Seguridad */}
            <div className="flex items-center gap-6 text-xs text-[#9CA3AF]">
              <div className="flex items-center gap-1.5">
                <i className="ri-lock-line text-[#0D9488]" /> SSL Seguro
              </div>
              <div className="flex items-center gap-1.5">
                <i className="ri-shield-check-line text-[#0D9488]" /> PCI Compliant
              </div>
              <div className="flex items-center gap-1.5">
                <i className="ri-secure-payment-line text-[#635BFF]" /> Stripe
              </div>
            </div>
          </div>

          {/* Derecha — formulario de pago */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-1">Datos de pago</h2>
            <p className="text-xs text-[#9CA3AF] mb-6">Procesado de forma segura por Stripe</p>

            <Elements stripe={stripePromise}>
              <FormularioPago
                planId={planId}
                esAnual={esAnual}
                planInfo={planInfo}
                onExito={() => {}}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PagarPlanPage