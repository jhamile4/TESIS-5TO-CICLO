import { useState } from 'react'
import './Pasos.css'

const categorias = [
  'Restaurante', 'Moda', 'Ferreteria', 'Panaderia',
  'Tecnologia', 'Flores', 'Salud', 'Educacion', 'Otros'
]

function Paso1Negocio({ datos, onChange, onSiguiente }) {
  const [errores, setErrores] = useState({})

  const validar = () => {
    const e = {}
    if (!datos.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!datos.categoria) e.categoria = 'Selecciona una categoria'
    if (!datos.whatsapp.trim()) e.whatsapp = 'El WhatsApp es obligatorio'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handleSiguiente = () => {
    if (validar()) onSiguiente()
  }

  return (
    <div className="paso">

      <div className="campo">
        <label className="campo-label">Nombre de tu negocio <span className="requerido">*</span></label>
        <input
          className={errores.nombre ? 'campo-input error' : 'campo-input'}
          placeholder="Ej: Mi Tienda Peruana"
          value={datos.nombre}
          onChange={e => onChange({ nombre: e.target.value })}
        />
        {errores.nombre && <span className="campo-error">{errores.nombre}</span>}
      </div>

      <div className="campo">
        <label className="campo-label">Tipo de negocio <span className="requerido">*</span></label>
        <select
          className={errores.categoria ? 'campo-input error' : 'campo-input'}
          value={datos.categoria}
          onChange={e => onChange({ categoria: e.target.value })}
        >
          <option value="">Selecciona una categoria</option>
          {categorias.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
        {errores.categoria && <span className="campo-error">{errores.categoria}</span>}
      </div>

      <div className="campo">
        <label className="campo-label">Direccion o ubicacion</label>
        <input
          className="campo-input"
          placeholder="Ej: Av. Javier Prado 123, Lima"
          value={datos.direccion}
          onChange={e => onChange({ direccion: e.target.value })}
        />
      </div>

      <div className="campo">
        <label className="campo-label">Breve descripcion de lo que vendes</label>
        <textarea
          className="campo-input campo-textarea"
          placeholder="Ej: Vendemos comida peruana casera para delivery y recojo en tienda..."
          value={datos.descripcion}
          onChange={e => onChange({ descripcion: e.target.value })}
          maxLength={500}
        />
        <span className="campo-contador">{datos.descripcion.length}/500</span>
      </div>

      <div className="campo">
        <label className="campo-label">Numero de WhatsApp <span className="requerido">*</span></label>
        <input
          className={errores.whatsapp ? 'campo-input error' : 'campo-input'}
          placeholder="Ej: +51 999 888 777"
          value={datos.whatsapp}
          onChange={e => onChange({ whatsapp: e.target.value })}
        />
        {errores.whatsapp && <span className="campo-error">{errores.whatsapp}</span>}
      </div>

      <button className="paso-btn-siguiente" onClick={handleSiguiente}>
        Continuar →
      </button>

    </div>
  )
}

export default Paso1Negocio