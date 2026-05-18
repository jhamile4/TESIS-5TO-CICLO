import { Store, User, Mail, Phone, MapPin, Tag, AlertCircle, CheckCircle2, Send } from 'lucide-react'
import './Pasos.css'

function FilaRevisar({ label, valor, icono: Icono }) {
  return (
    <div className="revisar-fila">
      <span className="revisar-label">{label}</span>
      <span className="revisar-valor">{valor || <span style={{ color: 'var(--gray-4)', fontWeight: 400 }}>No especificado</span>}</span>
    </div>
  )
}

function Paso3Revisar({ datos, onAtras, onEnviar, enviando, error }) {
  return (
    <div className="paso">

      <div className="revisar-card">
        <h4 className="revisar-titulo">
          <Store size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          Datos de tu negocio
        </h4>
        <FilaRevisar label="Nombre" valor={datos.nombre} />
        <FilaRevisar label="Categoria" valor={datos.categoria} />
        <FilaRevisar label="WhatsApp" valor={datos.whatsapp ? `+51 ${datos.whatsapp}` : ''} />
        <FilaRevisar label="Direccion" valor={datos.direccion} />
        {datos.descripcion && (
          <FilaRevisar label="Descripcion" valor={datos.descripcion} />
        )}
      </div>

      <div className="revisar-card">
        <h4 className="revisar-titulo">
          <User size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          Tu cuenta
        </h4>
        <FilaRevisar label="Nombre" valor={datos.nombreCompleto} />
        <div className="revisar-fila">
          <span className="revisar-label">Email</span>
          <span className="revisar-valor" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {datos.email}
            <CheckCircle2 size={13} color="#00B894" />
          </span>
        </div>
        <div className="revisar-fila">
          <span className="revisar-label">Contrasena</span>
          <span className="revisar-valor">{'•'.repeat(datos.contrasena.length)}</span>
        </div>
      </div>

      {error && (
        <div className="campo-error" style={{ background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '13px' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <p className="revisar-terminos">
        Al enviar aceptas nuestros{' '}
        <a href="#">Terminos de Servicio</a> y{' '}
        <a href="#">Politica de Privacidad</a>.
      </p>

      <div className="paso-botones">
        <button className="paso-btn-atras" onClick={onAtras} disabled={enviando}>
          ← Atras
        </button>
        <button className="paso-btn-enviar" onClick={onEnviar} disabled={enviando}>
          {enviando
            ? 'Enviando...'
            : <><Send size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Enviar solicitud</>
          }
        </button>
      </div>

    </div>
  )
}

export default Paso3Revisar
