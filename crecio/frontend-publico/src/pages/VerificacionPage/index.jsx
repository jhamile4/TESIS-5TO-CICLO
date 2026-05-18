import logoImg from '../../assets/logoCrecio.png'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2>Correo verificado</h2>
            <p style={{ color: 'var(--gray-3)' }}>Redirigiendo al login...</p>
          </div>
        ) : (
          <>
            <div className="verificacion-icono">📧</div>
            <h1 className="verificacion-titulo">Verifica tu correo</h1>
            <p className="verificacion-subtitulo">
              Enviamos un codigo de 6 digitos a<br />
              <strong>{email}</strong>
            </p>

            <div className="verificacion-card">
              <div className="campo">
                <label className="campo-label">Codigo de verificacion</label>
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
                <div style={{ color: '#E53E3E', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <button
                className="verificacion-btn"
                onClick={handleVerificar}
                disabled={cargando || codigo.length !== 6}
              >
                {cargando ? 'Verificando...' : 'Verificar cuenta'}
              </button>

              <p className="verificacion-hint">
                Revisa tu carpeta de spam si no lo encuentras.
              </p>
            </div>
          </>
        )}

      </div>

    </div>
  )
}

export default VerificacionPage
