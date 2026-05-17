// Sección CTA final de la LandingPage
// Invita al negocio a unirse; incluye formulario de contacto y puntos de confianza
import { Check, Shield, Clock, Zap } from 'lucide-react'
import './CTAFinal.css'

function CTAFinal() {
  return (
    <section className="cta-section">
      <div className="cta-inner">

        <div className="cta-left">
          <div className="cta-label">PON TU NEGOCIO EN EL MAPA DIGITAL</div>
          <h2 className="cta-title">
            Tus clientes te están buscando online.<br />
            <em>Ayúdalos a encontrarte.</em>
          </h2>
          <p className="cta-desc">
            Más del 70% de los consumidores buscan negocios locales por
            internet antes de visitarlos. Con CRECIO tu negocio aparece con
            catálogo, precios, horarios y todo lo que necesitan para decidir.
          </p>

          <div className="cta-stats">
            <div className="cta-stat">
              <div className="cta-stat-num">5 min</div>
              <div className="cta-stat-label">Para crear tu perfil</div>
            </div>
            <div className="cta-stat">
              <div className="cta-stat-num">24/7</div>
              <div className="cta-stat-label">Disponible para clientes</div>
            </div>
            <div className="cta-stat">
              <div className="cta-stat-num">0 costo</div>
              <div className="cta-stat-label">Para empezar</div>
            </div>
          </div>

          <div className="cta-features">
            {[
              'Perfil profesional con tu logo y fotos',
              'Catálogo digital interactivo',
              'Botón de WhatsApp para pedidos directos',
              'Apareces en búsquedas locales de Google',
              'Herramientas de IA para crecer tu negocio'
            ].map((f, i) => (
              <div className="cta-feature" key={i}>
                <Check size={16} color="#00B894" strokeWidth={2.5} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-right">
          <div className="cta-form-card">
            <h3>¿Quieres que tu negocio aparezca aquí?</h3>
            <p>Déjanos tu email y te contactamos en menos de 24 horas para ayudarte a empezar.</p>

            <div className="cta-form">
              <input placeholder="Nombre de tu negocio" />
              <input placeholder="Tu correo electrónico" type="email" />
              <input placeholder="Número de WhatsApp" type="tel" />
              <button className="cta-submit">Quiero que mi negocio aparezca</button>
              <p className="cta-note">Sin compromiso. Te ayudamos gratis a crear tu perfil.</p>
              <p className="cta-link">
                ¿Prefieres hacerlo tú mismo?{' '}
                <a href="#">Crear mi tienda ahora</a>
              </p>
            </div>

            <div className="cta-trust">
              <div className="cta-trust-item">
                <Shield size={14} color="#00B894" />
                Datos seguros
              </div>
              <div className="cta-trust-item">
                <Clock size={14} color="#00B894" />
                Respuesta en 24h
              </div>
              <div className="cta-trust-item">
                <Zap size={14} color="#00B894" />
                Sin costo
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default CTAFinal