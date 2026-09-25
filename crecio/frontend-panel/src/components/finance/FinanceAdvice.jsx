import { Lightbulb } from 'lucide-react'

export default function FinanceAdvice({ recommendations }) {
  return (
    <section className="finance-advice-card">
      <div className="advice-head">
        <Lightbulb size={18} />
        <div>
          <h3>Consejos Financieros</h3>
          <p>Recomendaciones automáticas basadas en la actividad reciente de tu negocio</p>
        </div>
      </div>

      <div className="advice-grid">
        {recommendations.map((recommendation, idx) => (
          <div className="advice-item" key={idx}>
            <span className="advice-dot">•</span>
            <p>{recommendation}</p>
          </div>
        ))}

        {recommendations.length === 0 && (
          <div className="advice-item">
            <span className="advice-dot">•</span>
            <p>¡Buen trabajo! Mantén el registro constante de tus gastos e ingresos para obtener diagnósticos precisos.</p>
          </div>
        )}
      </div>
    </section>
  )
}
