import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cambiarPassword } from '../../../services/apiPublico'

const VACIO = { actual: '', nueva: '', confirmar: '' }
const inputClase = 'w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#0D9488] transition-colors'

function CambiarPassword() {
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState(false)
  const [form,    setForm]    = useState(VACIO)
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState(null)
  const [exito,   setExito]   = useState(null)

  const guardar = async () => {
    setError(null); setExito(null)
    if (!form.actual)                 { setError('Ingresa tu contraseña actual'); return }
    if (form.nueva.length < 6)        { setError('La nueva contraseña debe tener al menos 6 caracteres'); return }
    if (form.nueva !== form.confirmar) { setError('Las contraseñas no coinciden'); return }
    setSaving(true)
    try {
      const data = await cambiarPassword(form.actual, form.nueva, localStorage.getItem('token_comprador'))
      setExito(data.message)
      setForm(VACIO)
      setAbierto(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center">
            <i className="ri-lock-password-line text-[#6B7280] text-sm" />
          </div>
          <h3 className="text-sm font-bold text-[#111827]">Contraseña</h3>
        </div>
        {!abierto && (
          <button onClick={() => { setAbierto(true); setExito(null) }}
            className="text-xs font-bold text-[#0D9488] hover:underline cursor-pointer">
            Cambiar contraseña
          </button>
        )}
      </div>

      {exito && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-4 py-3 mt-4">
          <i className="ri-checkbox-circle-line" />{exito}
        </div>
      )}

      {abierto && (
        <div className="flex flex-col gap-3 mt-4">
          {[
            ['actual', 'Contraseña actual'],
            ['nueva', 'Nueva contraseña (mínimo 6 caracteres)'],
            ['confirmar', 'Repite la nueva contraseña'],
          ].map(([key, placeholder]) => (
            <input key={key} type="password" placeholder={placeholder} value={form[key]} className={inputClase}
              onChange={e => { setForm({ ...form, [key]: e.target.value }); setError(null) }} />
          ))}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
              <i className="ri-error-warning-line shrink-0" />{error}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={guardar} disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-xs cursor-pointer disabled:opacity-60 transition-all">
              {saving ? 'Guardando...' : 'Guardar contraseña'}
            </button>
            <button onClick={() => { setAbierto(false); setForm(VACIO); setError(null) }}
              className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold text-xs cursor-pointer hover:border-[#0D9488] transition-all">
              Cancelar
            </button>
            <button onClick={() => navigate('/recuperar')}
              className="text-xs font-semibold text-[#0D9488] hover:underline cursor-pointer">
              ¿Olvidaste tu contraseña actual?
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CambiarPassword
