import { useState, useRef, useEffect } from 'react'

const BASE_URL = 'http://localhost:3001/api'

const SUGERENCIAS = [
  '¿Cuál es el horario?',
  '¿Tienen delivery?',
  '¿Cuáles son sus productos?',
  '¿Cómo hago un pedido?',
]

function ChatNegocio({ negocio }) {
  const [abierto, setAbierto]   = useState(false)
  const [mensajes, setMensajes] = useState([])
  const [input, setInput]       = useState('')
  const [cargando, setCargando] = useState(false)
  const [iniciado, setIniciado] = useState(false)
  const bottomRef               = useRef(null)
  const inputRef                = useRef(null)
  const STORAGE_KEY             = `chat_negocio_${negocio?.id || 'anon'}`

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, cargando])

  useEffect(() => {
    if (abierto && inputRef.current) setTimeout(() => inputRef.current?.focus(), 300)
  }, [abierto])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length) { setMensajes(parsed); setIniciado(true) }
      }
    } catch {}
  }, [STORAGE_KEY])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(mensajes)) } catch {}
  }, [mensajes, STORAGE_KEY])

  const handleAbrir = () => {
    setAbierto(true)
    if (!iniciado) {
      setIniciado(true)
      setMensajes([{ rol: 'asistente', texto: `¡Hola! 👋 Soy el asistente de **${negocio.nombre}**. ¿En qué te puedo ayudar? Puedo contarte sobre productos, horarios y cómo hacer tu pedido.` }])
    }
  }

  const enviarMensaje = async (texto = input) => {
    const msg = texto.trim()
    if (!msg || cargando) return
    const nuevosMensajes = [...mensajes, { rol: 'usuario', texto: msg }]
    setMensajes(nuevosMensajes); setInput(''); setCargando(true)
    try {
      const historial = nuevosMensajes.slice(1).map(m => ({ role: m.rol === 'usuario' ? 'user' : 'assistant', content: m.texto }))
      const res  = await fetch(`${BASE_URL}/chat/negocio`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ negocioId: negocio.id, mensaje: msg, historial: historial.slice(0,-1) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMensajes(prev => [...prev, { rol: 'asistente', texto: data.respuesta }])
    } catch {
      setMensajes(prev => [...prev, { rol: 'asistente', texto: 'Lo siento, hubo un problema. Contáctanos por WhatsApp.', error: true }])
    } finally { setCargando(false) }
  }

  const renderTexto = (texto) => {
    const partes = texto.split(/\*\*(.*?)\*\*/g)
    return partes.map((parte, i) => i % 2 === 1 ? <strong key={i}>{parte}</strong> : parte)
  }

  // Color del negocio basado en inicial
  const negoColors = ['#7C3AED','#DB2777','#EA580C','#0891B2','#059669','#DC2626']
  const negoColor  = negoColors[(negocio?.nombre?.charCodeAt(0) || 0) % negoColors.length]

  return (
    <>
            {/* ── Botón circular robot ── */}
      {!abierto && (
        <button
          onClick={handleAbrir}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full cursor-pointer group flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #0D9488 0%, #042f2e 70%)',
            boxShadow: '0 0 0 2px rgba(13,148,136,0.35), 0 8px 32px rgba(13,148,136,0.55), 0 0 50px rgba(13,148,136,0.18)',
          }}
        >
          <span className="absolute inset-0 rounded-full animate-ping opacity-15"
            style={{ background: 'radial-gradient(circle, #2DD4BF, transparent)' }} />

          <svg viewBox="0 0 64 64" className="w-12 h-12 relative z-10 group-hover:scale-110 transition-transform duration-300" fill="none">
            <line x1="32" y1="8" x2="32" y2="16" stroke="#99f6e4" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="32" cy="6" r="3.5" fill="#2DD4BF"/>
            <circle cx="32" cy="6" r="1.5" fill="#ccfbf1"/>
            <rect x="12" y="16" width="40" height="30" rx="8" fill="#0D9488"/>
            <rect x="14" y="17" width="36" height="10" rx="6" fill="rgba(45,212,191,0.2)"/>
            <rect x="17" y="20" width="30" height="22" rx="5" fill="#0a0a0a"/>
            <rect x="18" y="21" width="28" height="8" rx="4" fill="rgba(13,148,136,0.08)"/>
            <circle cx="25" cy="28" r="4" fill="white"/>
            <circle cx="39" cy="28" r="4" fill="white"/>
            <circle cx="26" cy="29" r="2" fill="#0D9488"/>
            <circle cx="40" cy="29" r="2" fill="#0D9488"/>
            <circle cx="27" cy="27.5" r="0.8" fill="white"/>
            <circle cx="41" cy="27.5" r="0.8" fill="white"/>
            <path d="M24 35 Q32 40 40 35" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="10" cy="30" r="4" fill="#0f766e"/>
            <circle cx="10" cy="30" r="2" fill="#2DD4BF"/>
            <circle cx="54" cy="30" r="4" fill="#0f766e"/>
            <circle cx="54" cy="30" r="2" fill="#2DD4BF"/>
          </svg>

          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0a0a0a]" />
        </button>
      )}

      {/* ── Ventana del chat ── */}
      {abierto && (
        <div className="fixed bottom-6 right-6 lg:right-20 z-50 w-80 md:w-[360px] flex flex-col rounded-2xl overflow-hidden"
          style={{
            height: '520px',
            animation: 'chatIn 0.35s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: `0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06), 0 0 40px ${negoColor}15`,
          }}>

          {/* Header con color del negocio */}
          <div className="shrink-0 px-4 py-4 flex items-center gap-3"
            style={{ background: `linear-gradient(135deg, #09090b 0%, #1c1917 60%, ${negoColor}40 100%)` }}>

            {/* Avatar negocio */}
            <div className="relative shrink-0">
              {negocio.img
                ? <img src={negocio.img} alt={negocio.nombre}
                    className="w-11 h-11 rounded-xl object-cover"
                    style={{ border: `2px solid ${negoColor}60` }} />
                : <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                    style={{ background: `${negoColor}30`, border: `2px solid ${negoColor}50` }}>
                    {negocio.nombre?.charAt(0)}
                  </div>
              }
              {/* Auricular badge */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: negoColor }}>
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none">
                  <path d="M12 3C8.13 3 5 6.13 5 10v2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M19 10v2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M12 3C15.87 3 19 6.13 19 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <rect x="3" y="11" width="4" height="4" rx="1.5" fill="white"/>
                  <rect x="17" y="11" width="4" height="4" rx="1.5" fill="white"/>
                </svg>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{negocio.nombre}</p>
              <p className="text-white/40 text-[10px] flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                Asistente IA · En línea
              </p>
            </div>

            <button onClick={() => setAbierto(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white/50 hover:text-white">
              <i className="ri-close-line text-sm" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 bg-[#fafafa]">
            {mensajes.map((m, i) => (
              <div key={i} className={`flex ${m.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                {m.rol === 'asistente' && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mr-2 mt-0.5 text-white text-xs font-bold"
                    style={{ background: `${negoColor}25`, border: `1px solid ${negoColor}40`, color: negoColor }}>
                    {negocio.nombre?.charAt(0)}
                  </div>
                )}
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.rol === 'usuario'
                    ? 'text-white rounded-br-sm'
                    : m.error ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-sm'
                    : 'bg-white text-[#374151] border border-[#E5E7EB] rounded-bl-sm shadow-sm'
                }`}
                style={m.rol === 'usuario' ? { background: `linear-gradient(135deg, ${negoColor}, ${negoColor}cc)` } : {}}>
                  {renderTexto(m.texto)}
                </div>
              </div>
            ))}

            {cargando && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ background: `${negoColor}20`, border: `1px solid ${negoColor}30`, color: negoColor }}>
                  {negocio.nombre?.charAt(0)}
                </div>
                <div className="bg-white border border-[#E5E7EB] px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    {[0,1,2].map(j => <span key={j} className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: negoColor, animationDelay: `${j*0.15}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Sugerencias */}
          {mensajes.length === 1 && !cargando && (
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto no-scrollbar bg-white border-t border-[#F3F4F6]">
              {SUGERENCIAS.map((s, i) => (
                <button key={i} onClick={() => enviarMensaje(s)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-all cursor-pointer whitespace-nowrap"
                  style={{ border: `1px solid ${negoColor}40`, color: negoColor, background: `${negoColor}08` }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* WhatsApp quick action */}
          {negocio.whatsapp && mensajes.length >= 2 && (
            <div className="px-3 py-2 border-t border-[#F3F4F6] bg-white">
              <a href={`https://wa.me/${negocio.whatsapp}`} target="_blank" rel="noreferrer"
                className="w-full py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-all cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #15803d, #16a34a)' }}>
                <i className="ri-whatsapp-line" /> ¿Urgente? Escríbenos por WhatsApp
              </a>
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-2.5 bg-white border-t border-[#E5E7EB] flex gap-2 items-center">
            <input ref={inputRef} type="text" placeholder="Escribe tu pregunta..."
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviarMensaje()}
              disabled={cargando}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#111827] outline-none transition-colors placeholder-[#9CA3AF] disabled:opacity-50"
              style={{ '--tw-ring-color': negoColor }}
              onFocus={e => e.target.style.borderColor = negoColor}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
            <button onClick={() => enviarMensaje()} disabled={!input.trim() || cargando}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white transition-all cursor-pointer disabled:opacity-40 shrink-0"
              style={{ background: negoColor }}>
              <i className="ri-send-plane-fill text-sm" />
            </button>
          </div>

          <div className="px-3 py-1.5 bg-white text-center border-t border-[#F3F4F6]">
            <p className="text-[9px] text-[#9CA3AF] flex items-center justify-center gap-1">
              <i className="ri-sparkling-2-line" style={{ color: negoColor }} />
              Asistente IA · Powered by CRECIO
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatIn { from { opacity:0; transform:scale(0.9) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </>
  )
}

export default ChatNegocio