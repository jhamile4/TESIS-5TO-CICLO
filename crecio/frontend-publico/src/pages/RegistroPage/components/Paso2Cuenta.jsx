import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import './Pasos.css'

function Paso2Cuenta({ datos, onChange, onAtras, onSiguiente }) {
  const [errores, setErrores] = useState({})
  const [verContrasena, setVerContrasena] = useState(false)

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validarContrasena = (pass) => pass.length >= 8 && /\d/.test(pass) && /[a-zA-Z]/.test(pass)

  const validar = () => {
    const e = {}
    if (!datos.nombreCompleto.trim() || datos.nombreCompleto.trim().length < 3)
      e.nombreCompleto = 'Ingresa tu nombre completo (min. 3 caracteres)'
    if (!datos.email.trim())
      e.email = 'El email es obligatorio'
    else if (!validarEmail(datos.email))
      e.email = 'Ingresa un email valido (ej: tu@correo.com)'
    if (!datos.contrasena)
      e.contrasena = 'La contrasena es obligatoria'
    else if (!validarContrasena(datos.contrasena))
      e.contrasena = 'Minimo 8 caracteres con letras y numeros'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const fortaleza = () => {
    if (!datos.contrasena) return null
    if (datos.contrasena.length < 6) return 'debil'
    if (datos.contrasena.length < 8 || !/\d/.test(datos.contrasena) || !/[a-zA-Z]/.test(datos.contrasena)) return 'media'
    return 'fuerte'
  }

  const f = fortaleza()

  return (
    <div className="paso">

      <div className="campo">
        <label className="campo-label">
          Tu nombre completo <span className="requerido">*</span>
        </label>
        <div className={`campo-wrap ${errores.nombreCompleto ? 'error' : ''}`}>
          <User size={16} color="#A0AEC0" />
          <input
            className="campo-inner"
            placeholder="Ej: Juan Perez Garcia"
            value={datos.nombreCompleto}
            onChange={e => onChange({ nombreCompleto: e.target.value })}
          />
        </div>
        {errores.nombreCompleto && (
          <span className="campo-error"><AlertCircle size={12} /> {errores.nombreCompleto}</span>
        )}
      </div>

      <div className="campo">
        <label className="campo-label">
          Email <span className="requerido">*</span>
        </label>
        <div className={`campo-wrap ${errores.email ? 'error' : datos.email && validarEmail(datos.email) ? 'success' : ''}`}>
          <Mail size={16} color="#A0AEC0" />
          <input
            className="campo-inner"
            placeholder="tu@email.com"
            type="email"
            value={datos.email}
            onChange={e => onChange({ email: e.target.value })}
          />
          {datos.email && validarEmail(datos.email) && (
            <CheckCircle size={16} color="#00B894" />
          )}
        </div>
        {errores.email && (
          <span className="campo-error"><AlertCircle size={12} /> {errores.email}</span>
        )}
      </div>

      <div className="campo">
        <label className="campo-label">
          Contrasena <span className="requerido">*</span>
        </label>
        <div className={`campo-wrap ${errores.contrasena ? 'error' : ''}`}>
          <Lock size={16} color="#A0AEC0" />
          <input
            className="campo-inner"
            placeholder="Minimo 8 caracteres con letras y numeros"
            type={verContrasena ? 'text' : 'password'}
            value={datos.contrasena}
            onChange={e => onChange({ contrasena: e.target.value })}
          />
          <button
            type="button"
            className="campo-ojo"
            onClick={() => setVerContrasena(!verContrasena)}
          >
            {verContrasena ? <EyeOff size={16} color="#A0AEC0" /> : <Eye size={16} color="#A0AEC0" />}
          </button>
        </div>
        {datos.contrasena && (
          <div className="fortaleza-wrap">
            <div className={`fortaleza-bar ${f}`} />
            <span className={`fortaleza-texto ${f}`}>
              {f === 'debil' ? 'Contrasena debil' : f === 'media' ? 'Contrasena media' : 'Contrasena fuerte'}
            </span>
          </div>
        )}
        {errores.contrasena && (
          <span className="campo-error"><AlertCircle size={12} /> {errores.contrasena}</span>
        )}
      </div>

      <div className="paso-botones">
        <button className="paso-btn-atras" onClick={onAtras}>← Atras</button>
        <button className="paso-btn-siguiente" onClick={() => { if (validar()) onSiguiente() }}>
          Revisar →
        </button>
      </div>

    </div>
  )
}

export default Paso2Cuenta
