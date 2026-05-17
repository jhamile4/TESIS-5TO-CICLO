import { Check } from 'lucide-react'
import './StepIndicator.css'

const pasos = ['Tu Negocio', 'Tu Cuenta', 'Revisar']

function StepIndicator({ paso }) {
  return (
    <div className="step-indicator">
      <div className="step-circles">
        {pasos.map((label, i) => {
          const num = i + 1
          const completado = paso > num
          const activo = paso === num
          return (
            <div className="step-item" key={i}>
              <div className={`step-circle ${activo ? 'activo' : ''} ${completado ? 'completado' : ''}`}>
                {completado ? <Check size={14} color="white" strokeWidth={3} /> : num}
              </div>
              {i < pasos.length - 1 && (
                <div className={`step-linea ${completado ? 'completada' : ''}`} />
              )}
            </div>
          )
        })}
      </div>
      <div className="step-labels">
        {pasos.map((label, i) => (
          <span key={i} className={`step-label ${paso === i + 1 ? 'activo' : ''}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default StepIndicator