import { useState } from 'react'
import { cambiarPassword } from '../../services/apiAdmin'
import { PUBLIC_URL } from '../../config/env'

const VACIO = { actual: '', nueva: '', confirmar: '' }

export default function ConfigSecurityTab() {
  const [form, setForm] = useState(VACIO)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')
    if (form.nueva.length < 6) return setError('La nueva contraseña debe tener al menos 6 caracteres')
    if (form.nueva !== form.confirmar) return setError('Las contraseñas no coinciden')

    setSaving(true)
    try {
      const data = await cambiarPassword(form.actual, form.nueva)
      setExito(data.message)
      setForm(VACIO)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const campo = (key, label) => (
    <div className="config-field">
      <label>{label}</label>
      <input
        type="password"
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        autoComplete={key === 'actual' ? 'current-password' : 'new-password'}
        required
      />
    </div>
  )

  return (
    <div className="config-card">
      <h4 className="config-card-title">Cambiar contraseña</h4>
      <p className="config-card-subtitle">
        Es la misma contraseña con la que entras a comprar en CRECIO. Usa al menos 6 caracteres.
      </p>

      {exito && <div className="toast-success">{exito}</div>}
      {error && <div className="toast-error">{error}</div>}

      <form onSubmit={handleSubmit} className="config-info-form">
        {campo('actual', 'Contraseña actual')}
        <div className="form-grid-2col">
          {campo('nueva', 'Nueva contraseña')}
          {campo('confirmar', 'Repite la nueva contraseña')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button type="submit" className="btn-ui-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
          <a href={`${PUBLIC_URL}/recuperar`} style={{ fontSize: '12px', color: '#0d9488', fontWeight: 600 }}>
            ¿Olvidaste tu contraseña actual?
          </a>
        </div>
      </form>
    </div>
  )
}
