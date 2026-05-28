import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'

const BASE_URL = 'http://localhost:3001/api'

const get = async (path, token) => {
  const res  = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

const put = async (path, body, token) => {
  const res  = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

const formatFecha = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const estadoBadge = (estado) => {
  const map = {
    pagado:    { bg: 'bg-green-100',  text: 'text-green-700',  icon: 'ri-checkbox-circle-line', label: 'Pagado'    },
    pendiente: { bg: 'bg-amber-100',  text: 'text-amber-700',  icon: 'ri-time-line',            label: 'Pendiente' },
    fallido:   { bg: 'bg-red-100',    text: 'text-red-700',    icon: 'ri-close-circle-line',    label: 'Fallido'   },
  }
  return map[estado] || map.pendiente
}

function PerfilPage() {
  const navigate  = useNavigate()
  const token     = localStorage.getItem('token_comprador')
  const compradorLocal = JSON.parse(localStorage.getItem('comprador') || '{}')

  const [tab, setTab]             = useState('pedidos')
  const [perfil, setPerfil]       = useState(null)
  const [pedidos, setPedidos]     = useState([])
  const [cargando, setCargando]   = useState(true)
  const [editNombre, setEditNombre] = useState('')
  const [editando, setEditando]   = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [msgExito, setMsgExito]   = useState(null)

  useEffect(() => {
    if (!token) { navigate('/'); return }
    Promise.all([get('/perfil/me', token), get('/perfil/pedidos', token)])
      .then(([p, ped]) => { setPerfil(p); setEditNombre(p.nombre); setPedidos(ped); setCargando(false) })
      .catch(() => { localStorage.removeItem('token_comprador'); navigate('/') })
  }, [])

  const handleGuardar = async () => {
    setGuardando(true)
    try {
      const res = await put('/perfil/me', { nombre: editNombre }, token)
      setPerfil(res.cliente)
      localStorage.setItem('comprador', JSON.stringify(res.cliente))
      setEditando(false)
      setMsgExito('¡Perfil actualizado!')
      setTimeout(() => setMsgExito(null), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setGuardando(false)
    }
  }

  const handleCerrarSesion = () => {
    localStorage.removeItem('token_comprador')
    localStorage.removeItem('comprador')
    navigate('/')
  }

  if (cargando) return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <i className="ri-loader-4-line animate-spin text-3xl text-[#0D9488]" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-16">

        {/* Header perfil */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#0D9488] flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-2xl font-bold text-white">
              {perfil?.nombre?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#111827]">{perfil?.nombre}</h1>
            <p className="text-sm text-[#6B7280]">{perfil?.email}</p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Miembro desde {formatFecha(perfil?.created_at)}
            </p>
          </div>
          <button
            onClick={handleCerrarSesion}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#374151] text-sm font-semibold hover:border-red-300 hover:text-red-500 transition-all cursor-pointer"
          >
            <i className="ri-logout-box-line" />
            Cerrar sesión
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1 mb-6 w-fit">
          {[
            { key: 'pedidos', label: `Mis pedidos (${pedidos.length})`, icon: 'ri-shopping-bag-line' },
            { key: 'perfil',  label: 'Mis datos',                       icon: 'ri-user-line'         },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === t.key ? 'bg-[#0D9488] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'
              }`}
            >
              <i className={t.icon} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab Pedidos ── */}
        {tab === 'pedidos' && (
          <div className="flex flex-col gap-4">
            {pedidos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
                <i className="ri-shopping-bag-line text-5xl text-[#E5E7EB] block mb-3" />
                <h3 className="text-base font-bold text-[#111827] mb-1">Aún no tienes pedidos</h3>
                <p className="text-sm text-[#6B7280] mb-5">Explora el directorio y haz tu primer pedido.</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 rounded-xl bg-[#0D9488] text-white font-semibold text-sm cursor-pointer hover:bg-[#0F766E] transition-all"
                >
                  Ver negocios
                </button>
              </div>
            ) : (
              pedidos.map((p, i) => {
                const badge = estadoBadge(p.estado)
                const items = typeof p.items === 'string' ? JSON.parse(p.items) : p.items
                return (
                  <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-all">

                    {/* Header pedido */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
                      <div className="flex items-center gap-3">
                        {p.negocio_logo ? (
                          <img src={p.negocio_logo} alt={p.negocio_nombre} className="w-10 h-10 rounded-xl object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
                            <i className="ri-store-2-line text-[#0D9488]" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-[#111827]">{p.negocio_nombre || 'Negocio'}</p>
                          <p className="text-xs text-[#9CA3AF]">{formatFecha(p.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                          <i className={badge.icon} />
                          {badge.label}
                        </span>
                        <span className="text-base font-bold text-[#111827]">S/ {Number(p.monto_total).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Items del pedido */}
                    <div className="px-5 py-3 flex flex-col gap-2">
                      {items && items.map((item, j) => (
                        <div key={j} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#F3F4F6] flex items-center justify-center text-xs font-bold text-[#6B7280]">
                              {item.cantidad}
                            </span>
                            <span className="text-[#374151]">{item.nombre}</span>
                          </div>
                          <span className="text-[#6B7280] text-xs">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer pedido */}
                    <div className="px-5 py-3 bg-[#FAFAFA] border-t border-[#F3F4F6] flex items-center justify-between">
                      <span className="text-[10px] text-[#9CA3AF] font-mono truncate max-w-[200px]">
                        {p.stripe_payment_intent}
                      </span>
                      <div className="flex items-center gap-2">
                        {p.negocio_whatsapp && (
                          <a
                            href={`https://wa.me/${p.negocio_whatsapp}?text=${encodeURIComponent(`Hola, tengo una consulta sobre mi pedido ${p.stripe_payment_intent}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-[#22C55E] hover:underline cursor-pointer"
                          >
                            <i className="ri-whatsapp-line" />
                            Contactar negocio
                          </a>
                        )}
                        <button
                          onClick={() => navigate(`/tienda/${p.negocio_id}`)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#0D9488] hover:underline cursor-pointer"
                        >
                          <i className="ri-store-2-line" />
                          Ver tienda
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ── Tab Mis datos ── */}
        {tab === 'perfil' && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8">
            <h3 className="text-base font-bold text-[#111827] mb-6">Información personal</h3>

            {msgExito && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
                <i className="ri-checkbox-circle-line" />
                {msgExito}
              </div>
            )}

            <div className="flex flex-col gap-5">
              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">Nombre completo</label>
                {editando ? (
                  <input
                    type="text"
                    value={editNombre}
                    onChange={e => setEditNombre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#0D9488] bg-white text-sm text-[#111827] outline-none"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA]">
                    <span className="text-sm text-[#111827]">{perfil?.nombre}</span>
                    <button
                      onClick={() => setEditando(true)}
                      className="text-xs text-[#0D9488] font-semibold hover:underline cursor-pointer"
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>

              {/* Email (no editable) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">Email</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA]">
                  <span className="text-sm text-[#111827] flex-1">{perfil?.email}</span>
                  <i className="ri-shield-check-fill text-[#0D9488] text-sm" />
                </div>
                <p className="text-[10px] text-[#9CA3AF]">El email no se puede cambiar por seguridad</p>
              </div>

              {/* Miembro desde */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">Miembro desde</label>
                <div className="px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA]">
                  <span className="text-sm text-[#111827]">{formatFecha(perfil?.created_at)}</span>
                </div>
              </div>

              {/* Botones edición */}
              {editando && (
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEditando(false); setEditNombre(perfil?.nombre) }}
                    className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold text-sm cursor-pointer hover:bg-[#F3F4F6] transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGuardar}
                    disabled={guardando}
                    className="flex-1 py-3 rounded-xl bg-[#0D9488] text-white font-bold text-sm cursor-pointer hover:bg-[#0F766E] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {guardando ? <><i className="ri-loader-4-line animate-spin" /> Guardando...</> : 'Guardar cambios'}
                  </button>
                </div>
              )}
            </div>

            {/* Zona peligrosa */}
            <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
              <h4 className="text-sm font-bold text-[#374151] mb-3">Sesión</h4>
              <button
                onClick={handleCerrarSesion}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-all cursor-pointer"
              >
                <i className="ri-logout-box-line" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PerfilPage