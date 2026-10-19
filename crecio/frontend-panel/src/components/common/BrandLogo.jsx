import './BrandLogo.css'

// Mismo logo animado del sitio público (barras de crecimiento + "CRECIO"),
// sin depender de Tailwind, que el panel no usa
export default function BrandLogo({ subtitle }) {
  const letras = [['C', 'dark'], ['R', 'dark'], ['E', 'dark'], ['C', 'teal'], ['I', 'teal'], ['O', 'teal']]

  return (
    <div className="brand-logo">
      <div className="brand-logo-icon">
        <div className="brand-logo-prism">
          <div className="brand-logo-bars brand-logo-bars--back">
            <span /><span /><span />
          </div>
          <div className="brand-logo-bars brand-logo-bars--front">
            <span /><span /><span />
          </div>
        </div>
      </div>

      <div className="brand-logo-text">
        <span className="brand-logo-word">
          {letras.map(([letra, color], i) => (
            <span key={i} className="brand-logo-char-wrap">
              <span className={`brand-logo-char brand-logo-char--${color}`}>{letra}</span>
            </span>
          ))}
        </span>
        {subtitle && <span className="brand-logo-subtitle">{subtitle}</span>}
      </div>
    </div>
  )
}
