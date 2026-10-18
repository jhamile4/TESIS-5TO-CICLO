import { useState } from 'react'
import { crearResena } from '../../../services/apiPublico'

// Formulario para calificar un pedido entregado (una sola vez por pedido)
function ResenaPedido({ pedido }) {
  const [estrellas, setEstrellas] = useState(0)
  const [hover,     setHover]     = useState(0)
  const [texto,     setTexto]     = useState('')
  const [enviando,  setEnviando]  = useState(false)
  const [error,     setError]     = useState(null)
  const [enviada,   setEnviada]   = useState(pedido.resenado)

  const enviar = async () => {
    if (estrellas === 0) { setError('Elige de 1 a 5 estrellas'); return }
    setEnviando(true); setError(null)
    try {
      await crearResena(pedido.negocio_id, { pedidoId: pedido.pk_id, estrellas, texto }, localStorage.getItem('token_comprador'))
      setEnviada(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  if (enviada) return (
    <div className="flex items-center gap-3 bg-[#F0FDF9] border border-[#99F6E4] rounded-2xl p-4">
      <i className="ri-star-smile-line text-[#0D9488] text-xl shrink-0" />
      <p className="text-xs text-[#0F766E] font-semibold">¡Gracias! Tu reseña ya aparece en la tienda.</p>
    </div>
  )

  const activa = hover || estrellas
  const etiquetas = ['', 'Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente']

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
      <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5 mb-3">
        <i className="ri-star-line text-[#0D9488]" /> Califica tu compra
      </p>
      <div className="flex items-center gap-1 mb-3" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" onClick={() => { setEstrellas(n); setError(null) }} onMouseEnter={() => setHover(n)}
            className="cursor-pointer p-0.5" aria-label={`${n} estrellas`}>
            <i className={`text-2xl ${n <= activa ? 'ri-star-fill text-amber-400' : 'ri-star-line text-[#D1D5DB]'}`} />
          </button>
        ))}
        {activa > 0 && <span className="text-xs font-semibold text-[#6B7280] ml-2">{etiquetas[activa]}</span>}
      </div>
      <textarea
        value={texto}
        onChange={e => setTexto(e.target.value)}
        maxLength={500}
        rows={3}
        placeholder="Cuéntale a otros clientes cómo te fue (opcional)"
        className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF] resize-none"
      />
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5 mt-2">
          <i className="ri-error-warning-line shrink-0" />{error}
        </div>
      )}
      <button onClick={enviar} disabled={enviando}
        className="mt-3 px-6 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-xs cursor-pointer disabled:opacity-60 transition-all">
        {enviando ? 'Publicando...' : 'Publicar reseña'}
      </button>
    </div>
  )
}

export default ResenaPedido
