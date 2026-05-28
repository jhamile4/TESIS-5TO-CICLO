import { useState, useRef, useEffect } from 'react'

const BASE_URL = 'http://localhost:3001/api'

const SUGERENCIAS = [
  '¿Cuál es el horario?',
  '¿Tienen delivery?',
  '¿Cuáles son sus productos?',
  '¿Cómo hago un pedido?',
]

function ChatNegocio({ negocio }) {
  const [abierto, setAbierto]     = useState(false)
  const [mensajes, setMensajes]   = useState([])
  const [input, setInput]         = useState('')
  const [cargando, setCargando]   = useState(false)
  const [iniciado, setIniciado]   = useState(false)
  const bottomRef                 = useRef(null)
  const inputRef                  = useRef(null)

  // Scroll al último mensaje
  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, cargando])

  // Foco al abrir
  useEffect(() => {
    if (abierto && inputRef.current)
      setTimeout(() => inputRef.current?.focus(), 300)
  }, [abierto])

  // Mensaje de bienvenida al abrir por primera vez
  const handleAbrir = () => {
    setAbierto(true)
    if (!iniciado) {
      setIniciado(true)
      setMensajes([{
        rol:  'asistente',
        texto: `¡Hola! 👋 Soy el asistente de **${negocio.nombre}**. ¿En qué te puedo ayudar? Puedo contarte sobre nuestros productos, horarios, precios y cómo hacer tu pedido.`,
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
      // Construir historial para la API
      const historial = nuevosMensajes.slice(1).map(m => ({
        role:    m.rol === 'usuario' ? 'user' : 'assistant',
        content: m.texto,
      }))

      const res  = await fetch(`${BASE_URL}/chat/negocio`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          negocioId: negocio.id,
          mensaje:   msg,
          historial: historial.slice(0, -1), // sin el último (ya va en mensaje)
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setMensajes(prev => [...prev, { rol: 'asistente', texto: data.respuesta }])
    } catch {
      setMensajes(prev => [...prev, {
        rol:   'asistente',
        texto: 'Lo siento, hubo un problema. Por favor contáctanos por WhatsApp.',
        error: true,
      }])
    } finally {
      setCargando(false)
    }
  }

  // Renderizar texto con **negrita**
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
      {/* ── Botón flotante ── */}
      {!abierto && (
        <button
          onClick={handleAbrir}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#0D9488] text-white shadow-xl hover:bg-[#0F766E] hover:scale-110 transition-all cursor-pointer flex items-center justify-center"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          <i className="ri-chat-ai-line text-2xl" />
          {/* Pulso */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
        </button>
      )}

      {/* ── Ventana del chat ── */}
      {abierto && (
        <div
          className="fixed bottom-6 right-6 z-50 w-80 md:w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB] bg-white"
          style={{
            height: '480px',
            animation: 'modalIn 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#0D9488]">
            <div className="relative">
              {negocio.img
                ? <img src={negocio.img} alt={negocio.nombre} className="w-9 h-9 rounded-full object-cover" />
                : <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                    {negocio.nombre?.charAt(0)}
                  </div>
              }
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0D9488]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{negocio.nombre}</p>
              <p className="text-white/70 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                Asistente IA disponible
              </p>
            </div>
            <button
              onClick={() => setAbierto(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white"
            >
              <i className="ri-close-line text-sm" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 bg-[#F8FFFE]">
            {mensajes.map((m, i) => (
              <div key={i} className={`flex ${m.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                {m.rol === 'asistente' && (
                  <div className="w-7 h-7 rounded-full bg-[#0D9488] flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <i className="ri-robot-line text-white text-xs" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.rol === 'usuario'
                      ? 'bg-[#0D9488] text-white rounded-br-sm'
                      : m.error
                        ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-sm'
                        : 'bg-white text-[#374151] border border-[#E5E7EB] rounded-bl-sm shadow-sm'
                  }`}
                >
                  {renderTexto(m.texto)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {cargando && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-[#0D9488] flex items-center justify-center shrink-0">
                  <i className="ri-robot-line text-white text-xs" />
                </div>
                <div className="bg-white border border-[#E5E7EB] px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    {[0,1,2].map(i => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-[#0D9488] rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Sugerencias — solo al inicio */}
          {mensajes.length === 1 && !cargando && (
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto no-scrollbar bg-white border-t border-[#F3F4F6]">
              {SUGERENCIAS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => enviarMensaje(s)}
                  className="shrink-0 px-3 py-1.5 rounded-full border border-[#0D9488]/30 text-[#0D9488] text-xs font-medium hover:bg-[#0D9488]/5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-2.5 bg-white border-t border-[#E5E7EB] flex gap-2 items-end">
            <input
              ref={inputRef}
              type="text"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviarMensaje()}
              disabled={cargando}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#111827] outline-none focus:border-[#0D9488] transition-colors placeholder-[#9CA3AF] resize-none disabled:opacity-50"
            />
            <button
              onClick={() => enviarMensaje()}
              disabled={!input.trim() || cargando}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
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

export default ChatNegocio