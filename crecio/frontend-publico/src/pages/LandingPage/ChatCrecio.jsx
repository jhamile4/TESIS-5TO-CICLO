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

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, cargando])

  useEffect(() => {
    if (abierto && inputRef.current)
      setTimeout(() => inputRef.current?.focus(), 300)
  }, [abierto])

  const handleAbrir = () => {
    setAbierto(true)
    setNoLeido(false)
    if (!iniciado) {
      setIniciado(true)
      setMensajes([{
        rol:   'asistente',
        texto: '¡Hola! 👋 Soy el asistente de **CRECIO**. Estoy aquí para ayudarte a digitalizar tu negocio. ¿En qué te puedo ayudar?',
      }])
    }
  }

  const enviarMensaje = async (texto = input) => {
    const msg = texto.trim()
    if (!msg || cargando) return

    const nuevosMensajes = [...mensajes, { rol: 'usuario', texto: msg }]
    setMensajes(nuevosMensajes)
    setInput('')
    setCargando(true)

    try {
      const historial = nuevosMensajes.slice(1).map(m => ({
        role:    m.rol === 'usuario' ? 'user' : 'assistant',
        content: m.texto,
      }))

      const res  = await fetch(`${BASE_URL}/chat/crecio`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          mensaje:   msg,
          historial: historial.slice(0, -1),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setMensajes(prev => [...prev, { rol: 'asistente', texto: data.respuesta }])
    } catch {
      setMensajes(prev => [...prev, {
        rol:   'asistente',
        texto: 'Lo siento, tuve un problema. Escríbenos a soporte@crecio.pe',
        error: true,
      }])
    } finally {
      setCargando(false)
    }
  }

  const renderTexto = (texto) => {
    const partes = texto.split(/\*\*(.*?)\*\*/g)
    return partes.map((parte, i) =>
      i % 2 === 1
        ? <strong key={i} className="font-bold">{parte}</strong>
        : parte
    )
  }

  return (
    <>
      {/* ── Botón flotante — negro con estrella ── */}
      {!abierto && (
        <button
          onClick={handleAbrir}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl text-white shadow-2xl cursor-pointer flex items-center justify-center hover:scale-110 transition-all duration-300 group"
          style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0D9488 100%)' }}
        >
          {/* Brillo en hover */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }} />

          <i className="ri-stars-fill text-2xl relative z-10" style={{ color: '#2DD4BF' }} />

          {/* Punto verde */}
          {noLeido && (
            <>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-ping" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
            </>
          )}
        </button>
      )}

      {/* ── Ventana del chat ── */}
      {abierto && (
        <div
          className="fixed bottom-6 right-6 z-50 w-80 md:w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{ height: '500px', animation: 'modalIn 0.3s cubic-bezier(0.16,1,0.3,1)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {/* Header oscuro con gradiente */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 shrink-0"
            style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 60%, #0D9488 100%)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <i className="ri-stars-fill text-xl" style={{ color: '#2DD4BF' }} />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Asistente CRECIO</p>
              <p className="text-white/50 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                IA · Responde al instante
              </p>
            </div>
            <button
              onClick={() => setAbierto(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white/70 hover:text-white"
            >
              <i className="ri-close-line text-sm" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 bg-[#F8FFFE]">
            {mensajes.map((m, i) => (
              <div key={i} className={`flex ${m.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                {m.rol === 'asistente' && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mr-2 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #0a0a0a, #0D9488)' }}>
                    <i className="ri-stars-fill text-[10px]" style={{ color: '#2DD4BF' }} />
                  </div>
                )}
                <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.rol === 'usuario'
                    ? 'text-white rounded-br-sm'
                    : m.error
                      ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-sm'
                      : 'bg-white text-[#374151] border border-[#E5E7EB] rounded-bl-sm shadow-sm'
                }`}
                style={m.rol === 'usuario' ? { background: 'linear-gradient(135deg, #0D9488, #0F766E)' } : {}}
                >
                  {renderTexto(m.texto)}
                </div>
              </div>
            ))}

            {/* Typing */}
            {cargando && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0a0a0a, #0D9488)' }}>
                  <i className="ri-stars-fill text-[10px]" style={{ color: '#2DD4BF' }} />
                </div>
                <div className="bg-white border border-[#E5E7EB] px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-[#0D9488] rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
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
              <button
                onClick={() => { navigate('/registro'); setAbierto(false) }}
                className="w-full py-2 rounded-xl text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #0a0a0a, #0D9488)' }}
              >
                <i className="ri-store-2-line" />
                Crear mi tienda gratis ahora
              </button>
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-2.5 bg-white border-t border-[#E5E7EB] flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && enviarMensaje()}
              disabled={cargando}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#111827] outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF] disabled:opacity-50"
            />
            <button
              onClick={() => enviarMensaje()}
              disabled={!input.trim() || cargando}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white transition-all cursor-pointer disabled:opacity-40 shrink-0"
              style={{ background: 'linear-gradient(135deg, #0a0a0a, #0D9488)' }}
            >
              <i className="ri-send-plane-fill text-sm" />
            </button>
          </div>

          {/* Footer */}
          <div className="px-3 py-1.5 bg-white text-center border-t border-[#F3F4F6]">
            <p className="text-[9px] text-[#9CA3AF] flex items-center justify-center gap-1">
              <i className="ri-sparkling-2-line text-[#0D9488]" />
              Asistente IA · Powered by CRECIO
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  )
}

export default ChatCrecio