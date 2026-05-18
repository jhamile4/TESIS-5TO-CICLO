import logoImg from '../../assets/logoCrecio.png'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, CheckCircle, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react'
import { verificarCodigo } from '../../services/apiPublico'
import './VerificacionPage.css'

function VerificacionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const [codigo, setCodigo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [exitoso, setExitoso] = useState(false)

  const handleVerificar = async () => {
    if (codigo.length !== 6) {
      setError('El codigo debe tener 6 digitos')
      return
    }
    setCargando(true)
    setError(null)
    try {
      await verificarCodigo(email, codigo)
      setExitoso(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'Codigo incorrecto')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="verificacion-page">

      <div className="verificacion-topbar">
        <div className="verificacion-logo" onClick={() => navigate('/')}>
          <img src={logoImg} alt="CRECIO" style={{ height: '32px', width: 'auto' }} />
          CRECIO
        </div>
      </div>

      <div className="verificacion-contenido">

        {exitoso ? (
          <div style={{ textAlign: 'center' }}>
            <div className="verificacion-icono-lucide verificacion-icono-success">
              <CheckCircle size={52} color="#00B894" strokeWidth={1.5} />
            </div>
            <h2 className="verificacion-titulo">Correo verificado</h2>
            <p style={{ color: 'var(--gray-3)' }}>Redirigiendo al login...</p>
          </div>
        ) : (
          <>
            <div className="verificacion-icono-lucide">
              <Mail size={52} color="#00B894" strokeWidth={1.5} />
            </div>
            <h1 className="verificacion-titulo">Verifica tu correo</h1>
            <p className="verificacion-subtitulo">
              Enviamos un codigo de 6 digitos a<br />
              <strong>{email}</strong>
            </p>

            <div className="verificacion-card">
              <div className="campo">
                <label className="campo-label" style={{ textAlign: 'center', display: 'block' }}>
                  <ShieldCheck size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Codigo de verificacion
                </label>
                <input
                  className="campo-input verificacion-input"
                  placeholder="000000"
                  maxLength={6}
                  value={codigo}
                  onChange={e => setCodigo(e.target.value.replace(/\D/g, ''))}
                  style={{ textAlign: 'center', fontSize: '28px', letterSpacing: '8px', fontWeight: 'bold' }}
                />
              </div>

              {error && (
                <div className="verificacion-error">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button
                className="verificacion-btn"
                onClick={handleVerificar}
                disabled={cargando || codigo.length !== 6}
              >
                {cargando ? 'Verificando...' : 'Verificar cuenta'}
              </button>

              <button className="verificacion-btn-volver" onClick={() => navigate('/registro')}>
                <ArrowLeft size={15} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                Volver al registro
              </button>

              <p className="verificacion-hint">
                Revisa tu carpeta de spam si no encuentras el correo.
              </p>
            </div>
          </>
        )}

      </div>

    </div>
  )
}

export default VerificacionPage
