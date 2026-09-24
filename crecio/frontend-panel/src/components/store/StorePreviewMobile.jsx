import { MapPin } from 'lucide-react'
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '../common/SocialIcons'

export default function StorePreviewMobile({
  selectedTheme,
  selectedBtnStyle,
  selectedFont,
  form,
  sections,
  sampleProducts
}) {
  return (
    <div className="mobile-phone-frame">
      <div
        className="phone-screen"
        style={{
          backgroundColor: selectedTheme.bg,
          color: selectedTheme.text,
          fontFamily: selectedFont
        }}
      >
        {/* Phone Header */}
        <div className="phone-nav-bar" style={{ borderColor: selectedTheme.accent + '30' }}>
          <span className="phone-store-name">{form.nombre}</span>
          <button
            className="phone-contact-btn"
            style={{
              borderRadius: selectedBtnStyle.radius,
              backgroundColor: selectedTheme.cardBg,
              color: selectedTheme.text
            }}
          >
            Contactar
          </button>
        </div>

        {/* Portada Section */}
        {sections.portada && (
          <div className="phone-hero-section">
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
            <h2>{form.nombre}</h2>
            <p>{form.slogan}</p>
            <button
              className="catalog-cta-btn"
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

        {/* Catálogo Section */}
        {sections.catalogo && (
          <div className="phone-products-section">
            <h3>Nuestros Productos</h3>
            <div className="phone-products-grid">
              {sampleProducts.map((p) => (
                <div
                  key={p.pk_id}
                  className="phone-product-card"
                  style={{
                    backgroundColor: selectedTheme.cardBg,
                    borderRadius: selectedBtnStyle.radius
                  }}
                >
                  <div className="phone-prod-img">
                    <img src={p.imagen_url} alt={p.nombre} />
                  </div>
                  <div className="phone-prod-info">
                    <strong>{p.nombre}</strong>
                    <small style={{ color: selectedTheme.accent }}>S/{p.precio}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp CTA */}
        {sections.whatsapp && (
          <div
            className="phone-whatsapp-box"
            style={{
              backgroundColor: selectedTheme.cardBg,
              borderRadius: selectedBtnStyle.radius
            }}
          >
            <div className="wa-icon-circle">
              <WhatsAppIcon size={18} />
            </div>
            <div>
              <strong>¿Tienes preguntas?</strong>
              <small>{form.whatsapp}</small>
            </div>
            <button
              className="wa-write-btn"
              style={{
                borderRadius: selectedBtnStyle.radius,
                backgroundColor: selectedTheme.accent
              }}
            >
              Escribir
            </button>
          </div>
        )}

        {/* Redes Section */}
        {sections.redes && (
          <div className="phone-socials-row">
            <small>Síguenos:</small>
            <div className="socials-icons">
              <InstagramIcon size={14} />
              <FacebookIcon size={14} />
            </div>
          </div>
        )}

        {/* Ubicación Section */}
        {sections.ubicacion && (
          <div className="phone-location-box">
            <MapPin size={12} /> {form.direccion}
          </div>
        )}

        {/* Phone Footer */}
        <div className="phone-footer">
          © 2026 {form.nombre} · Hecho con Crecio
        </div>
      </div>
    </div>
  )
}
