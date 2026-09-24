import { useState } from 'react'
import { crearGasto } from '../services/apiAdmin'

export default function ExpenseForm({ onClose, onCreated }) {
  const [form, setForm] = useState({ descripcion: '', categoria: 'Operación', monto: '', fecha: new Date().toISOString().slice(0, 10) })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const update = (key, value) => setForm({ ...form, [key]: value })
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('')
    try { await crearGasto(form); onCreated() } catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  return <div className="modal-backdrop" onClick={onClose}><form className="product-form" onSubmit={submit} onClick={(event) => event.stopPropagation()}><div className="card-title"><h3>Registrar gasto</h3><button type="button" onClick={onClose}>Cerrar</button></div><label>Descripción<input required value={form.descripcion} onChange={(event) => update('descripcion', event.target.value)} placeholder="Compra de insumos" /></label><label>Categoría<select value={form.categoria} onChange={(event) => update('categoria', event.target.value)}><option>Operación</option><option>Insumos</option><option>Publicidad</option><option>Servicios</option><option>Alquiler</option><option>Sueldos</option><option>Otro</option></select></label><div className="form-row"><label>Monto<input required type="number" min="0.01" step="0.01" value={form.monto} onChange={(event) => update('monto', event.target.value)} /></label><label>Fecha<input required type="date" value={form.fecha} onChange={(event) => update('fecha', event.target.value)} /></label></div>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={saving}>{saving ? 'Guardando...' : 'Guardar gasto'}</button></form></div>
}
