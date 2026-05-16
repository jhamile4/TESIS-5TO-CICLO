import { Globe, MessageCircle, Music, Send } from 'lucide-react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon"></div>
              CRECIO
            </div>
            <p className="footer-desc">
              La plataforma que ayuda a los pequeños negocios a crecer con tecnología,
              catálogos digitales e inteligencia artificial.
            </p>
            <div className="footer-newsletter">
              <input placeholder="Tu email para novedades" type="email" />
              <button>Suscribir</button>
            </div>
            <div className="footer-social">
              <a href="#"><Globe size={18} /></a>
              <a href="#"><MessageCircle  size={18} /></a>
              <a href="#"><Music size={18} /></a>
              <a href="#"><Send size={18} /></a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h5>PRODUCTO</h5>
              <a href="#">Cómo funciona</a>
              <a href="#">Precios</a>
              <a href="#">Herramientas IA</a>
              <a href="#">Buscador local</a>
              <a href="#">Panel de admin</a>
            </div>
            <div className="footer-col">
              <h5>EMPRESA</h5>
              <a href="#">Sobre nosotros</a>
              <a href="#">Blog</a>
              <a href="#">Casos de éxito</a>
              <a href="#">Contacto</a>
              <a href="#">Trabaja con nosotros</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CRECIO. Todos los derechos reservados.</p>
          <div className="footer-legal">
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
            <a href="#">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer