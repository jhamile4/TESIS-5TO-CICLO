import { useState } from 'react'
import { Store, Tag, MapPin, FileText, Phone, AlertCircle } from 'lucide-react'
import './Pasos.css'

const categorias = [
  'Restaurante', 'Moda', 'Ferreteria', 'Panaderia',
  'Tecnologia', 'Flores', 'Salud', 'Educacion', 'Otros'
]

function Paso1Negocio({ datos, onChange, onSiguiente }) {
  const [errores, setErrores] = useState({})

  const validar = () => {
    const e = {}
    if (!datos.nombre.trim() || datos.nombre.trim().length < 3)
      e.nombre = 'El nombre debe tener al menos 3 caracteres'
    if (!datos.categoria)
      e.categoria = 'Selecciona una categoria'
    if (!datos.whatsapp.trim())
      e.whatsapp = 'El WhatsApp es obligatorio'
    else if (!/^\d{9}$/.test(datos.whatsapp.replace(/\s/g, '')))
      e.whatsapp = 'Debe tener exactamente 9 digitos (ej: 987654321)'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="paso">

      <div className="campo">
        <label className="campo-label">
          Nombre de tu negocio <span className="requerido">*</span>
        </label>
        <div className={`campo-wrap ${errores.nombre ? 'error' : ''}`}>
          <Store size={16} color="#A0AEC0" />
          <input
            className="campo-inner"
            placeholder="Ej: Mi Tienda Peruana"
            value={datos.nombre}
            onChange={e => onChange({ nombre: e.target.value })}
          />
        </div>
        {errores.nombre && (
          <span className="campo-error">
            <AlertCircle size={12} /> {errores.nombre}
          </span>
        )}
      </div>

      <div className="campo">
        <label className="campo-label">
          Tipo de negocio <span className="requerido">*</span>
        </label>
        <div className={`campo-wrap ${errores.categoria ? 'error' : ''}`}>
          <Tag size={16} color="#A0AEC0" />
          <select
            className="campo-inner"
            value={datos.categoria}
            onChange={e => onChange({ categoria: e.target.value })}
          >
            <option value="">Selecciona una categoria</option>
            {categorias.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {errores.categoria && (
          <span className="campo-error">
            <AlertCircle size={12} /> {errores.categoria}
          </span>
        )}
      </div>

      <div className="campo">
        <label className="campo-label">Direccion o ubicacion</label>
        <div className="campo-wrap">
          <MapPin size={16} color="#A0AEC0" />
          <input
            className="campo-inner"
            placeholder="Ej: Av. Javier Prado 123, Lima"
            value={datos.direccion}
            onChange={e => onChange({ direccion: e.target.value })}
          />
        </div>
      </div>

      <div className="campo">
        <label className="campo-label">Descripcion de tu negocio</label>
        <div className="campo-wrap campo-wrap-textarea">
          <FileText size={16} color="#A0AEC0" style={{ marginTop: '2px', flexShrink: 0 }} />
          <textarea
            className="campo-inner campo-textarea"
            placeholder="Ej: Vendemos comida peruana casera para delivery..."
            value={datos.descripcion}
            onChange={e => onChange({ descripcion: e.target.value })}
            maxLength={500}
          />
        </div>
        <span className="campo-contador">{datos.descripcion.length}/500</span>
      </div>

      <div className="campo">
        <label className="campo-label">
          WhatsApp del negocio <span className="requerido">*</span>
        </label>
        <div className={`campo-wrap ${errores.whatsapp ? 'error' : datos.whatsapp.length === 9 ? 'success' : ''}`}>
          <Phone size={16} color="#A0AEC0" />
          <span style={{ fontSize: '13px', color: 'var(--gray-3)', fontWeight: 600, flexShrink: 0 }}>+51</span>
          <input
            className="campo-inner"
            placeholder="987654321"
            value={datos.whatsapp}
            onChange={e => onChange({ whatsapp: e.target.value.replace(/\D/g, '') })}
            maxLength={9}
            inputMode="numeric"
          />
          <span style={{ fontSize: '12px', color: 'var(--gray-4)', flexShrink: 0 }}>
            {datos.whatsapp.length}/9
          </span>
        </div>
        <span className="campo-contador" style={{ textAlign: 'left' }}>
          Solo numeros, 9 digitos (Peru)
        </span>
        {errores.whatsapp && (
          <span className="campo-error">
            <AlertCircle size={12} /> {errores.whatsapp}
          </span>
        )}
      </div>

      <button className="paso-btn-siguiente" onClick={() => { if (validar()) onSiguiente() }}>
        Continuar →
      </button>

    </div>
  )
}

export default Paso1Negocio
