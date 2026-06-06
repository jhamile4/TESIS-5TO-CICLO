import { useState } from 'react'

const formatFecha = (iso) => new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })

function TabDatos({ perfil, onGuardar, onCerrarSesion }) {
  const [editNombre, setEditNombre]         = useState(perfil?.nombre || '')
  const [editando, setEditando]             = useState(false)
  const [guardando, setGuardando]           = useState(false)
  const [msgExito, setMsgExito]             = useState(null)
  const [direcciones, setDirecciones]       = useState(() => {
    const stored = localStorage.getItem('crecio_direcciones')
    return stored ? JSON.parse(stored) : []
  })
  const [formDir, setFormDir]               = useState({ nombre: '', telefono: '', direccion: '', ciudad: '' })
  const [mostrarFormDir, setMostrarFormDir] = useState(false)

  const handleGuardar = async () => {
    setGuardando(true)
    try {
      await onGuardar(editNombre)
      setEditando(false)
      setMsgExito('¡Perfil actualizado!')
      setTimeout(() => setMsgExito(null), 3000)
    } catch {} finally { setGuardando(false) }
  }

  const guardarDireccion = () => {
    if (!formDir.nombre || !formDir.direccion) return
    const updated = [...direcciones, formDir]
    setDirecciones(updated)
    localStorage.setItem('crecio_direcciones', JSON.stringify(updated))
    setFormDir({ nombre: '', telefono: '', direccion: '', ciudad: '' })
    setMostrarFormDir(false)
  }

  const eliminarDireccion = (idx) => {
    const updated = direcciones.filter((_, i) => i !== idx)
    setDirecciones(updated)
    localStorage.setItem('crecio_direcciones', JSON.stringify(updated))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black text-[#111827]">Mis datos</h2>

      {/* Info cuenta */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center">
            <i className="ri-user-settings-line text-[#6B7280] text-sm" />
          </div>
          <h3 className="text-sm font-bold text-[#111827]">Información de la cuenta</h3>
        </div>

        {msgExito && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-4 py-3 mb-4">
            <i className="ri-checkbox-circle-line" />{msgExito}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: 'Email', valor: perfil?.email, icon: 'ri-mail-line' },
            { label: 'Miembro desde', valor: formatFecha(perfil?.created_at), icon: 'ri-calendar-line' },
          ].map((item, i) => (
            <div key={i} className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E5E7EB]">
              <p className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider mb-1.5">{item.label}</p>
              <div className="flex items-center gap-2">
                <i className={`${item.icon} text-[#D1D5DB] text-sm`} />
                <p className="text-sm font-medium text-[#111827] truncate flex-1">{item.valor}</p>
                <i className="ri-shield-check-fill text-[#0D9488] text-sm shrink-0" />
              </div>
            </div>
          ))}

          <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E5E7EB] md:col-span-2">
            <p className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider mb-1.5">Nombre</p>
            {editando ? (
              <div className="flex gap-2">
                <input type="text" value={editNombre} onChange={e => setEditNombre(e.target.value)} autoFocus
                  className="flex-1 bg-white border border-[#0D9488] rounded-lg px-3 py-1.5 text-sm outline-none" />
                <button onClick={handleGuardar} disabled={guardando}
                  className="px-4 py-1.5 rounded-lg bg-[#0D9488] text-white text-xs font-bold cursor-pointer disabled:opacity-60">
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={() => { setEditando(false); setEditNombre(perfil?.nombre) }}
                  className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs text-[#6B7280] cursor-pointer">
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <i className="ri-user-line text-[#D1D5DB] text-sm" />
                <p className="text-sm font-medium text-[#111827] flex-1">{perfil?.nombre}</p>
                <button onClick={() => setEditando(true)} className="text-xs text-[#0D9488] font-semibold cursor-pointer hover:underline">
                  Editar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Direcciones */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <i className="ri-map-pin-line text-amber-500 text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Direcciones guardadas</h3>
              <p className="text-[10px] text-[#9CA3AF]">Para envíos y entregas</p>
            </div>
          </div>
          <button onClick={() => setMostrarFormDir(!mostrarFormDir)}
            className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#111827] text-white cursor-pointer flex items-center gap-1">
            <i className="ri-add-line" />Nueva
          </button>
        </div>

        {mostrarFormDir && (
          <div className="bg-[#FAFAFA] rounded-xl p-4 mb-4 border border-[#E5E7EB] space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Nombre del destinatario" value={formDir.nombre}
                onChange={e => setFormDir(p => ({...p, nombre: e.target.value}))}
                className="px-3 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs outline-none focus:border-[#0D9488] placeholder-[#9CA3AF]" />
              <input type="text" placeholder="Teléfono" value={formDir.telefono}
                onChange={e => setFormDir(p => ({...p, telefono: e.target.value}))}
                className="px-3 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs outline-none focus:border-[#0D9488] placeholder-[#9CA3AF]" />
            </div>
            <input type="text" placeholder="Dirección completa" value={formDir.direccion}
              onChange={e => setFormDir(p => ({...p, direccion: e.target.value}))}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs outline-none focus:border-[#0D9488] placeholder-[#9CA3AF]" />
            <div className="flex gap-3">
              <input type="text" placeholder="Ciudad / Distrito" value={formDir.ciudad}
                onChange={e => setFormDir(p => ({...p, ciudad: e.target.value}))}
                className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs outline-none focus:border-[#0D9488] placeholder-[#9CA3AF]" />
              <button onClick={guardarDireccion} className="px-4 py-2.5 bg-[#0D9488] text-white rounded-xl text-xs font-bold cursor-pointer">Guardar</button>
              <button onClick={() => setMostrarFormDir(false)} className="text-xs text-[#9CA3AF] cursor-pointer">Cancelar</button>
            </div>
          </div>
        )}

        {direcciones.length === 0 && !mostrarFormDir ? (
          <div className="text-center py-8">
            <i className="ri-map-pin-line text-3xl text-amber-200 block mb-2" />
            <p className="text-xs text-[#9CA3AF]">Aún no tienes direcciones guardadas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {direcciones.map((dir, idx) => (
              <div key={idx} className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E5E7EB] group hover:border-amber-200 transition-all">
                <div className="flex justify-between">
                  <div className="flex gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <i className="ri-user-line text-amber-600 text-xs" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#111827]">{dir.nombre}</p>
                      {dir.telefono && <p className="text-[10px] text-[#9CA3AF]">{dir.telefono}</p>}
                    </div>
                  </div>
                  <button onClick={() => eliminarDireccion(idx)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-red-400">
                    <i className="ri-delete-bin-line text-xs" />
                  </button>
                </div>
                <p className="text-[10px] text-[#6B7280] mt-2 pl-10">{dir.direccion}{dir.ciudad ? `, ${dir.ciudad}` : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Zona de peligro */}
      <div className="bg-white rounded-2xl border border-red-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
            <i className="ri-error-warning-line text-red-500 text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-600">Zona de peligro</h3>
            <p className="text-[10px] text-[#9CA3AF]">Acciones irreversibles</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-red-50/50 border border-red-100">
          <p className="text-xs text-[#6B7280]">Cerrar sesión en todos los dispositivos.</p>
          <button onClick={onCerrarSesion}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-all">
            <i className="ri-logout-box-line" />Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default TabDatos