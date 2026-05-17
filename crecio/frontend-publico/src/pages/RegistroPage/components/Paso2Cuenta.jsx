import { useState } from 'react'
import './Pasos.css'

function Paso2Cuenta({ datos, onChange, onAtras, onSiguiente }) {
  const [errores, setErrores] = useState({})

  const validar = () => {
    const e = {}
    if (!datos.nombreCompleto.trim()) e.nombreCompleto = 'El nombre es obligatorio'
    if (!datos.email.trim()) e.email = 'El email es obligatorio'
    if (!datos.contrasena || datos.contrasena.length < 8) e.contrasena = 'Minimo 8 caracteres'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handleSiguiente = () => {
    if (validar()) onSiguiente()
  }

  return (
    <div className="paso">

      <div className="campo">
        <label className="campo-label">Tu nombre completo <span className="requerido">*</span></label>
        <input
          className={errores.nombreCompleto ? 'campo-input error' : 'campo-input'}
          placeholder="Ej: Juan Perez Garcia"
          value={datos.nombreCompleto}
          onChange={e => onChange({ nombreCompleto: e.target.value })}
        />
        {errores.nombreCompleto && <span className="campo-error">{errores.nombreCompleto}</span>}
      </div>

      <div className="campo">
        <label className="campo-label">Email <span className="requerido">*</span></label>
        <input
          className={errores.email ? 'campo-input error' : 'campo-input'}
          placeholder="tu@email.com"
          type="email"
          value={datos.email}
          onChange={e => onChange({ email: e.target.value })}
        />
        {errores.email && <span className="campo-error">{errores.email}</span>}
      </div>

      <div className="campo">
        <label className="campo-label">Contrasena <span className="requerido">*</span></label>
        <input
          className={errores.contrasena ? 'campo-input error' : 'campo-input'}
          placeholder="Minimo 8 caracteres"
          type="password"
          value={datos.contrasena}
          onChange={e => onChange({ contrasena: e.target.value })}
        />
        {errores.contrasena && <span className="campo-error">{errores.contrasena}</span>}
      </div>

      <div className="paso-botones">
        <button className="paso-btn-atras" onClick={onAtras}>
          ← Atras
        </button>
        <button className="paso-btn-siguiente" onClick={handleSiguiente}>
          Revisar →
        </button>
      </div>

    </div>
  )
}

export default Paso2Cuenta