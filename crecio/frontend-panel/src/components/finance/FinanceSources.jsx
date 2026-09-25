import { Banknote, CreditCard } from 'lucide-react'

export default function FinanceSources({ summary }) {
  const total = Number(summary?.ingresos_mes || 1)
  const tarjeta = Number(summary?.ingresos_tarjeta || 0)
  const efectivo = Number(summary?.ingresos_efectivo || 0)

  const pctTarjeta = Math.min(Math.round((tarjeta / total) * 100), 100)
  const pctEfectivo = Math.min(Math.round((efectivo / total) * 100), 100)

  return (
    <section className="card sources-card">
      <div className="card-title">
        <h3>Fuentes de Ingreso</h3>
      </div>

      <div className="source-item">
        <div className="source-label">
          <span>
            <CreditCard size={15} /> Ventas con Tarjeta
          </span>
          <b>{pctTarjeta}%</b>
        </div>
        <div className="source-track">
          <div className="source-bar blue" style={{ width: `${pctTarjeta}%` }} />
        </div>
      </div>

      <div className="source-item">
        <div className="source-label">
          <span>
            <Banknote size={15} /> Ventas en Efectivo
          </span>
          <b>{pctEfectivo}%</b>
        </div>
        <div className="source-track">
          <div className="source-bar green" style={{ width: `${pctEfectivo}%` }} />
        </div>
      </div>

      <p className="finance-note">
        Los ingresos se calculan a partir de los pedidos marcados como pagados en el sistema.
      </p>
    </section>
  )
}
