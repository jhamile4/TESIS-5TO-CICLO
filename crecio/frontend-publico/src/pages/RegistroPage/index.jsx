import logoImg from '../../assets/logoCrecio.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from './components/StepIndicator'
import Paso1Negocio from './components/Paso1Negocio'
import Paso2Cuenta from './components/Paso2Cuenta'
import Paso3Revisar from './components/Paso3Revisar'
import { registrarNegocio } from '../../services/apiPublico'
import './RegistroPage.css'

function RegistroPage() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [exitoso, setExitoso] = useState(false)
  const [datos, setDatos] = useState({
    nombre: '',
    categoria: '',
    direccion: '',
    descripcion: '',
    whatsapp: '',
    nombreCompleto: '',
    email: '',
    contrasena: '',
  })

  const actualizarDatos = (nuevos) => {
    setDatos(prev => ({ ...prev, ...nuevos }))
  }

  const handleEnviar = async () => {
    setEnviando(true)
    setError(null)
    try {
      await registrarNegocio(datos)
      setExitoso(true)
      setTimeout(() => navigate('/verificar?email=' + encodeURIComponent(datos.email)), 1500)
    } catch (err) {
      setError(err.message || 'Ocurrio un error. Intenta nuevamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (exitoso) {
    return (
      <div className="registro-page">
        <div className="registro-topbar">
          <div className="registro-logo" onClick={() => navigate('/')}>
            <img src={logoImg} alt="CRECIO" style={{ height: '32px', width: 'auto' }} />
            CRECIO
          </div>
        </div>
        <div className="registro-contenido" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Solicitud enviada</h2>
          <p style={{ color: 'var(--gray-3)', marginBottom: '2rem' }}>
            Recibimos tu registro. Nuestro equipo revisara tu informacion y te contactara pronto.
          </p>
          <button className="paso-btn-siguiente" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="registro-page">

      <div className="registro-topbar">
        <div className="registro-logo" onClick={() => navigate('/')}>
          <img src={logoImg} alt="CRECIO" style={{ height: '32px', width: 'auto' }} />
          CRECIO
        </div>
        <button className="registro-volver" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>

      <div className="registro-contenido">
        <h1 className="registro-titulo">Registra tu negocio en CRECIO</h1>
        <p className="registro-subtitulo">
          Completa estos datos para que nuestro equipo pueda crear tu tienda digital.
        </p>

        <StepIndicator paso={paso} />

        {paso === 1 && (
          <Paso1Negocio
            datos={datos}
            onChange={actualizarDatos}
            onSiguiente={() => setPaso(2)}
          />
        )}
        {paso === 2 && (
          <Paso2Cuenta
            datos={datos}
            onChange={actualizarDatos}
            onAtras={() => setPaso(1)}
            onSiguiente={() => setPaso(3)}
          />
        )}
        {paso === 3 && (
          <Paso3Revisar
            datos={datos}
            onAtras={() => setPaso(2)}
            onEnviar={handleEnviar}
            enviando={enviando}
            error={error}
          />
        )}
      </div>

      <div className="registro-footer">
        <p>2026 CRECIO. Todos los derechos reservados.</p>
        <div className="registro-footer-links">
          <a href="#">Privacidad</a>
          <a href="#">Terminos</a>
          <a href="#">Contacto</a>
        </div>
      </div>

    </div>
  )
}

export default RegistroPage