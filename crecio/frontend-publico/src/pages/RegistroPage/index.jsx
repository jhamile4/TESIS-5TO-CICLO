import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from './components/StepIndicator'
import Paso1Negocio from './components/Paso1Negocio'
import Paso2Cuenta from './components/Paso2Cuenta'
import Paso3Revisar from './components/Paso3Revisar'
import './RegistroPage.css'

function RegistroPage() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
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

  return (
    <div className="registro-page">

      <div className="registro-topbar">
        <div className="registro-logo" onClick={() => navigate('/')}>
          <div className="registro-logo-icon"></div>
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
            onEnviar={() => alert('Solicitud enviada. Te contactaremos pronto.')}
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