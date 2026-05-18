import logoImg from '../../assets/logoCrecio.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginCliente } from '../../services/apiPublico'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState({ email: '', contrasena: '' })
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)
  const [errorApi, setErrorApi] = useState(null)

  const validar = () => {
    const e = {}
    if (!datos.email.trim()) e.email = 'El email es obligatorio'
    if (!datos.contrasena.trim()) e.contrasena = 'La contrasena es obligatoria'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async () => {
    if (!validar()) return
    setCargando(true)
    setErrorApi(null)
    try {
      const res = await loginCliente(datos.email, datos.contrasena)
      localStorage.setItem('token', res.token)
      localStorage.setItem('cliente', JSON.stringify(res.cliente))
      navigate('/')
    } catch (err) {
      setErrorApi(err.message || 'Email o contrasena incorrectos')
    } finally {
      setCargando(false)
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

          {errorApi && (
            <div style={{ color: '#E53E3E', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.5rem', fontSize: '14px' }}>
              {errorApi}
            </div>
          )}

          <button className="login-btn" onClick={handleLogin} disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar Sesion'}
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