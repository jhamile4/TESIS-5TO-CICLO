import './Pasos.css'

function Paso3Revisar({ datos, onAtras, onEnviar, enviando, error }) {
  return (
    <div className="paso">

      <div className="revisar-card">
        <h4 className="revisar-titulo">Datos de tu negocio</h4>
        <div className="revisar-fila">
          <span className="revisar-label">Nombre</span>
          <span className="revisar-valor">{datos.nombre}</span>
        </div>
        <div className="revisar-fila">
          <span className="revisar-label">Categoria</span>
          <span className="revisar-valor">{datos.categoria}</span>
        </div>
        <div className="revisar-fila">
          <span className="revisar-label">Direccion</span>
          <span className="revisar-valor">{datos.direccion || 'No especificada'}</span>
        </div>
        <div className="revisar-fila">
          <span className="revisar-label">WhatsApp</span>
          <span className="revisar-valor">{datos.whatsapp}</span>
        </div>
        {datos.descripcion && (
          <div className="revisar-fila">
            <span className="revisar-label">Descripcion</span>
            <span className="revisar-valor">{datos.descripcion}</span>
          </div>
        )}
      </div>

      <div className="revisar-card">
        <h4 className="revisar-titulo">Tu cuenta</h4>
        <div className="revisar-fila">
          <span className="revisar-label">Nombre</span>
          <span className="revisar-valor">{datos.nombreCompleto}</span>
        </div>
        <div className="revisar-fila">
          <span className="revisar-label">Email</span>
          <span className="revisar-valor">{datos.email}</span>
        </div>
      </div>

      <p className="revisar-terminos">
        Al enviar aceptas nuestros{' '}
        <a href="#">Terminos de Servicio y Politica de Privacidad</a>.
      </p>

      {error && (
        <div style={{ color: '#E53E3E', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div className="paso-botones">
        <button className="paso-btn-atras" onClick={onAtras} disabled={enviando}>
          ← Atras
        </button>
        <button className="paso-btn-enviar" onClick={onEnviar} disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar solicitud →'}
        </button>
      </div>

    </div>
  )
}

export default Paso3Revisar