import { WhatsAppIcon } from '../common/SocialIcons'

export default function StorePreviewDesktop({
  selectedTheme,
  selectedBtnStyle,
  selectedFont,
  form,
  sections,
  sampleProducts
}) {
  return (
    <div className="desktop-browser-frame">
      <div className="browser-top-bar">
        <div className="browser-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="browser-url-input">
          crecio.app/{form.nombre.toLowerCase().replace(/\s+/g, '-')}
        </div>
      </div>

      <div
        className="desktop-screen"
        style={{
          backgroundColor: selectedTheme.bg,
          color: selectedTheme.text,
          fontFamily: selectedFont
        }}
      >
        {/* Desktop Header */}
        <div className="desktop-nav-bar">
          <div className="desktop-logo">{form.nombre}</div>
          <div className="desktop-nav-links">
            <span>Inicio</span>
            <span>Catálogo</span>
            <span>Contacto</span>
          </div>
          <button
            className="desktop-contact-btn"
            style={{
              borderRadius: selectedBtnStyle.radius,
              backgroundColor: selectedTheme.accent,
              color: '#ffffff'
            }}
          >
            Contactar
          </button>
        </div>

        {/* Desktop Hero */}
        {sections.portada && (
          <div className="desktop-hero-banner">
            <span
              className="welcome-tag"
              style={{
                borderRadius: selectedBtnStyle.radius,
                backgroundColor: selectedTheme.cardBg,
                color: selectedTheme.accent
              }}
            >
              ¡Bienvenido!
            </span>
            <h1>{form.nombre}</h1>
            <p>{form.slogan}</p>
            <button
              className="desktop-cta-btn"
              style={{
                borderRadius: selectedBtnStyle.radius,
                backgroundColor: selectedTheme.cardBg,
                color: selectedTheme.text
              }}
            >
              Ver catálogo
            </button>
          </div>
        )}

        {/* Desktop Catalog */}
        {sections.catalogo && (
          <div className="desktop-products-container">
            <h3>Nuestros Productos</h3>
            <div className="desktop-products-grid">
              {sampleProducts.map((p) => (
                <div
                  key={p.pk_id}
                  className="desktop-prod-card"
                  style={{
                    backgroundColor: selectedTheme.cardBg,
                    borderRadius: selectedBtnStyle.radius
                  }}
                >
                  <div className="desktop-prod-img">
                    <img src={p.imagen_url} alt={p.nombre} />
                  </div>
                  <div className="desktop-prod-details">
                    <strong>{p.nombre}</strong>
                    <span style={{ color: selectedTheme.accent }}>S/{p.precio}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp Floating */}
        {sections.whatsapp && (
          <div
            className="desktop-wa-banner"
            style={{
              backgroundColor: selectedTheme.cardBg,
              borderRadius: selectedBtnStyle.radius
            }}
          >
            <div className="wa-left">
              <WhatsAppIcon size={20} />
              <div>
                <strong>¿Tienes preguntas?</strong>
                <small>{form.whatsapp}</small>
              </div>
            </div>
            <button
              style={{
                borderRadius: selectedBtnStyle.radius,
                backgroundColor: selectedTheme.accent
              }}
            >
              Escribir
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
