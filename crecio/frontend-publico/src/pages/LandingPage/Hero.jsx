import heroImg from '../../assets/IMG-16.png'
import './Hero.css'
import { CheckCircle2 } from 'lucide-react'
function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">

        <div>
          <div className="hero-badge">
            <span></span> Impulsado por Inteligencia Artificial
          </div>
          <h1>
            Transforma tu negocio informal en una empresa{' '}
            <em>digital en 5 minutos</em>
          </h1>
          <p>
            Usa Inteligencia Artificial para crear tu catálogo, gestionar
            tus ventas y aceptar pagos con tarjeta y WhatsApp. Todo desde
            tu celular.
          </p>
          <div className="hero-actions">
            <button className="btn-hero">Empieza Gratis Ahora →</button>
            <button className="btn-outline">Ver como funciona </button>
          </div>
          <div className="hero-trust">
            <div className="trust-item">
              <CheckCircle2 size={16} color="#00B894" strokeWidth={2} />
                    Sin costo inicial
              
            </div>
            <div className="trust-item">
              <CheckCircle2 size={16} color="#00B894" strokeWidth={2} />
               Sin tarjeta de crédito
            </div>
            <div className="trust-item">
              <CheckCircle2 size={16} color="#00B894" strokeWidth={2} />
                Cancela cuando quieras
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <img src={heroImg} alt="App CRECIO en celular" className="hero-img" />
        </div>

      </div>
    </section>
  )
}

export default Hero