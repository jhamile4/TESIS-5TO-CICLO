import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE_URL = 'http://localhost:3001/api'

const SUGERENCIAS = [
  '¿Cómo registro mi negocio?',
  '¿Cuánto cuesta el plan Pro?',
  '¿Qué incluye el plan gratis?',
  '¿Cómo funciona el pago?',
]

function ChatCrecio() {
  const navigate                = useNavigate()
  const [abierto, setAbierto]   = useState(false)
  const [mensajes, setMensajes] = useState([])
  const [input, setInput]       = useState('')
  const [cargando, setCargando] = useState(false)
  const [iniciado, setIniciado] = useState(false)
  const [noLeido, setNoLeido]   = useState(true)
  const bottomRef               = useRef(null)
  const inputRef                = useRef(null)
  const STORAGE_KEY             = 'chat_crecio'

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
        if (Array.isArray(parsed) && parsed.length) {
          setMensajes(parsed); setIniciado(true); setNoLeido(false)
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(mensajes)) } catch {}
  }, [mensajes])

  const handleAbrir = () => {
    setAbierto(true); setNoLeido(false)
    if (!iniciado) {
      setIniciado(true)
      setMensajes([{ rol: 'asistente', texto: '¡Hola! 👋 Soy el asistente de **CRECIO**. Estoy aquí para ayudarte a digitalizar tu negocio. ¿En qué te puedo ayudar?' }])
    }
  }

  const enviarMensaje = async (texto = input) => {
    const msg = texto.trim()
    if (!msg || cargando) return
    const nuevosMensajes = [...mensajes, { rol: 'usuario', texto: msg }]
    setMensajes(nuevosMensajes); setInput(''); setCargando(true)
    try {
      const historial = nuevosMensajes.slice(1).map(m => ({ role: m.rol === 'usuario' ? 'user' : 'assistant', content: m.texto }))
      const res  = await fetch(`${BASE_URL}/chat/crecio`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: msg, historial: historial.slice(0,-1) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMensajes(prev => [...prev, { rol: 'asistente', texto: data.respuesta }])
    } catch {
      setMensajes(prev => [...prev, { rol: 'asistente', texto: 'Lo siento, tuve un problema. Escríbenos a soporte@crecio.pe', error: true }])
    } finally { setCargando(false) }
  }

  const renderTexto = (texto) => {
    const partes = texto.split(/\*\*(.*?)\*\*/g)
    return partes.map((parte, i) => i % 2 === 1 ? <strong key={i} className="font-bold">{parte}</strong> : parte)
  }

  return (
    <>
      {/* ── Botón flotante CRECIO — pill premium oscuro ── */}
      {!abierto && (
        <button onClick={handleAbrir}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 cursor-pointer group"
          style={{ animation: 'floatUp 3s ease-in-out infinite' }}
        >
          <div
            className="flex items-center gap-3 pl-2 pr-5 py-2 rounded-full transition-all duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #09090b 0%, #18181b 60%, #134e4a 100%)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Logo hexagonal */}
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full">
                <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="none" stroke="rgba(45,212,191,0.4)" strokeWidth="1" />
                <polygon points="20,6 32,13 32,27 20,34 8,27 8,13" fill="rgba(13,148,136,0.15)" stroke="rgba(45,212,191,0.2)" strokeWidth="0.5" />
              </svg>
              {/* Robot icon SVG */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 relative z-10" fill="none">
                <rect x="5" y="8" width="14" height="10" rx="2" fill="#2DD4BF" opacity="0.9"/>
                <rect x="9" y="4" width="6" height="4" rx="1" fill="#2DD4BF" opacity="0.7"/>
                <line x1="12" y1="4" x2="12" y2="8" stroke="#2DD4BF" strokeWidth="1.5"/>
                <circle cx="9.5" cy="12.5" r="1.5" fill="#0a0a0a"/>
                <circle cx="14.5" cy="12.5" r="1.5" fill="#0a0a0a"/>
                <rect x="9" y="15" width="6" height="1.5" rx="0.75" fill="#0a0a0a" opacity="0.6"/>
                <rect x="3" y="10" width="2" height="5" rx="1" fill="#2DD4BF" opacity="0.5"/>
                <rect x="19" y="10" width="2" height="5" rx="1" fill="#2DD4BF" opacity="0.5"/>
              </svg>
              {/* Pulse */}
              {noLeido && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#09090b] animate-pulse" />}
            </div>
            <div className="text-left">
              <p className="text-white text-[11px] font-bold leading-none tracking-wide">Asistente CRECIO</p>
              <p className="text-white/40 text-[9px] mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                IA · En línea ahora
              </p>
            </div>
          </div>
        </button>
      )}

      {/* ── Ventana del chat ── */}
      {abierto && (
        <div className="fixed bottom-6 right-6 z-50 w-80 md:w-[360px] flex flex-col rounded-2xl overflow-hidden"
          style={{
            height: '520px',
            animation: 'chatIn 0.35s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
          }}>

          {/* Header — dark premium */}
          <div className="shrink-0 px-4 py-4 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #09090b 0%, #18181b 70%, #134e4a 100%)' }}>
            {/* Avatar hexagonal */}
            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full">
                <polygon points="22,2 40,12 40,32 22,42 4,32 4,12" fill="rgba(13,148,136,0.2)" stroke="rgba(45,212,191,0.5)" strokeWidth="1.5"/>
              </svg>
              <svg viewBox="0 0 24 24" className="w-6 h-6 relative z-10" fill="none">
                <rect x="5" y="8" width="14" height="10" rx="2" fill="#2DD4BF"/>
                <rect x="9" y="4" width="6" height="4" rx="1" fill="#2DD4BF" opacity="0.8"/>
                <line x1="12" y1="4" x2="12" y2="8" stroke="#2DD4BF" strokeWidth="1.5"/>
                <circle cx="9.5" cy="12.5" r="1.5" fill="#09090b"/>
                <circle cx="14.5" cy="12.5" r="1.5" fill="#09090b"/>
                <rect x="9" y="15" width="6" height="1.5" rx="0.75" fill="#09090b" opacity="0.6"/>
                <rect x="3" y="10" width="2" height="5" rx="1" fill="#2DD4BF" opacity="0.6"/>
                <rect x="19" y="10" width="2" height="5" rx="1" fill="#2DD4BF" opacity="0.6"/>
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#09090b]" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Asistente CRECIO</p>
              <p className="text-white/40 text-[10px] flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                IA · Responde al instante
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
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mr-2 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #09090b, #134e4a)' }}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                      <rect x="5" y="8" width="14" height="10" rx="2" fill="#2DD4BF"/>
                      <rect x="9" y="4" width="6" height="4" rx="1" fill="#2DD4BF" opacity="0.8"/>
                      <line x1="12" y1="4" x2="12" y2="8" stroke="#2DD4BF" strokeWidth="1.5"/>
                      <circle cx="9.5" cy="12.5" r="1.5" fill="#09090b"/>
                      <circle cx="14.5" cy="12.5" r="1.5" fill="#09090b"/>
                    </svg>
                  </div>
                )}
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.rol === 'usuario'
                    ? 'text-white rounded-br-sm'
                    : m.error ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-sm'
                    : 'bg-white text-[#374151] border border-[#E5E7EB] rounded-bl-sm shadow-sm'
                }`}
                style={m.rol === 'usuario' ? { background: 'linear-gradient(135deg, #0D9488, #0891B2)' } : {}}>
                  {renderTexto(m.texto)}
                </div>
              </div>
            ))}
            {cargando && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #09090b, #134e4a)' }}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                    <rect x="5" y="8" width="14" height="10" rx="2" fill="#2DD4BF"/>
                    <circle cx="9.5" cy="12.5" r="1.5" fill="#09090b"/>
                    <circle cx="14.5" cy="12.5" r="1.5" fill="#09090b"/>
                  </svg>
                </div>
                <div className="bg-white border border-[#E5E7EB] px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    {[0,1,2].map(j => <span key={j} className="w-1.5 h-1.5 bg-[#0D9488] rounded-full animate-bounce" style={{ animationDelay: `${j*0.15}s` }} />)}
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
                  className="shrink-0 px-3 py-1.5 rounded-full border border-[#0D9488]/30 text-[#0D9488] text-xs font-medium hover:bg-[#0D9488]/5 transition-colors cursor-pointer whitespace-nowrap">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* CTA */}
          {mensajes.length >= 3 && (
            <div className="px-3 py-2 border-t border-[#F3F4F6] bg-white">
              <button onClick={() => { navigate('/registro'); setAbierto(false) }}
                className="w-full py-2 rounded-xl text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #09090b, #0D9488)' }}>
                <i className="ri-store-2-line" /> Crear mi tienda gratis ahora
              </button>
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-2.5 bg-white border-t border-[#E5E7EB] flex gap-2 items-center">
            <input ref={inputRef} type="text" placeholder="Escribe tu pregunta..."
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && enviarMensaje()}
              disabled={cargando}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#111827] outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF] disabled:opacity-50" />
            <button onClick={() => enviarMensaje()} disabled={!input.trim() || cargando}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white transition-all cursor-pointer disabled:opacity-40 shrink-0"
              style={{ background: 'linear-gradient(135deg, #09090b, #0D9488)' }}>
              <i className="ri-send-plane-fill text-sm" />
            </button>
          </div>

          <div className="px-3 py-1.5 bg-white text-center border-t border-[#F3F4F6]">
            <p className="text-[9px] text-[#9CA3AF] flex items-center justify-center gap-1">
              <i className="ri-sparkling-2-line text-[#0D9488]" /> Asistente IA · Powered by CRECIO
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatIn { from { opacity:0; transform:scale(0.9) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes floatUp { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </>
  )
}

export default ChatCrecio