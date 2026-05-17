import logoImg from '../../assets/logoCrecio.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState({ email: '', contrasena: '' })
  const [errores, setErrores] = useState({})

  const validar = () => {
    const e = {}
    if (!datos.email.trim()) e.email = 'El email es obligatorio'
    if (!datos.contrasena.trim()) e.contrasena = 'La contrasena es obligatoria'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = () => {
    if (validar()) {
      alert('Bienvenido! Redirigiendo al panel...')
    }
  }

  return (
    <div className="login-page">

      <div className="login-topbar">
        <div className="login-logo" onClick={() => navigate('/')}>
          <img src={logoImg} alt="CRECIO" style={{ height: '32px', width: 'auto' }} />
          CRECIO
        </div>
        <button className="login-volver" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>

      <div className="login-contenido">
        <h1 className="login-titulo">Bienvenido de vuelta</h1>
        <p className="login-subtitulo">
          Accede a tu panel de administracion, gestiona tu catalogo y revisa tus ventas del dia.
        </p>

        <div className="login-card">

          <div className="campo">
            <label className="campo-label">Email</label>
            <input
              className={errores.email ? 'campo-input error' : 'campo-input'}
              placeholder="tu@email.com"
              type="email"
              value={datos.email}
              onChange={e => setDatos({ ...datos, email: e.target.value })}
            />
            {errores.email && <span className="campo-error">{errores.email}</span>}
          </div>

          <div className="campo">
            <label className="campo-label">Contrasena</label>
            <input
              className={errores.contrasena ? 'campo-input error' : 'campo-input'}
              placeholder="Tu contrasena"
              type="password"
              value={datos.contrasena}
              onChange={e => setDatos({ ...datos, contrasena: e.target.value })}
            />
            {errores.contrasena && <span className="campo-error">{errores.contrasena}</span>}
          </div>

          <button className="login-btn" onClick={handleLogin}>
            Iniciar Sesion
          </button>

          <p className="login-olvide">Olvidaste tu contrasena?</p>

          <div className="login-divider">
            <span>Aun no tienes cuenta?</span>
          </div>

          <button className="login-btn-registro" onClick={() => navigate('/registro')}>
            Crear mi Tienda
          </button>

        </div>
      </div>

      <div className="login-footer">
        <p>2026 CRECIO. Todos los derechos reservados.</p>
        <div className="login-footer-links">
          <a href="#">Privacidad</a>
          <a href="#">Terminos</a>
          <a href="#">Contacto</a>
        </div>
      </div>

    </div>
  )
}

export default LoginPage