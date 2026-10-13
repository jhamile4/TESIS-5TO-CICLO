export default function ConfigAppearanceTab({ handleSave }) {
  return (
    <div className="config-card">
      <h4 className="config-card-title">Apariencia y Estilo</h4>
      <p className="config-card-subtitle">
        Personaliza el tema visual y tipografía de tu panel de control y tienda pública.
      </p>
      <div className="config-action-row">
        <button className="btn-save-config" onClick={handleSave}>
          Aplicar Tema Guardado
        </button>
      </div>
    </div>
  )
}
