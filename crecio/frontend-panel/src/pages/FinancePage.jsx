import { useEffect, useMemo, useState } from 'react'
import { ArrowDownToLine, Banknote, CreditCard, Lightbulb, RefreshCw, Wallet } from 'lucide-react'
import ExpenseForm from '../components/ExpenseForm'
import { getFinanzas } from '../services/apiAdmin'
import { currency, statusClass } from '../utils/formatters'

export default function FinancePage() {
  const [data, setData] = useState(null)
  const [period, setPeriod] = useState('day')
  const [error, setError] = useState('')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const load = () => getFinanzas().then(setData).catch((err) => setError(err.message))
  useEffect(() => { load() }, [])

  const summary = data?.resumen || {}
  const isMonth = period === 'month'
  const income = isMonth ? summary.ingresos_mes : summary.ingresos_hoy
  const expenses = isMonth ? summary.gastos_mes : summary.gastos_hoy
  const operations = isMonth ? summary.operaciones_mes : summary.operaciones_hoy
  const utility = Number(income || 0) - Number(expenses || 0)
  const recommendations = useMemo(() => {
    const result = []
    if (!data) return result
    if (!summary.gastos_mes) result.push('Registra tus gastos fijos y variables para calcular utilidad real.')
    if (summary.ingresos_efectivo > summary.ingresos_tarjeta) result.push('Ofrece pagos con tarjeta para reducir la dependencia del efectivo.')
    if (summary.ingresos_mes > 0) result.push('Revisa tus productos más vendidos y crea una promoción para aumentar el ticket promedio.')
    return result
  }, [data, summary.gastos_mes, summary.ingresos_efectivo, summary.ingresos_tarjeta, summary.ingresos_mes])

  return <section className="content finance-content">
    <div className="finance-heading"><div><h2>Gestión Financiera</h2><p>Resumen y control de activos para {data?.negocio?.nombre || 'tu negocio'}</p></div><div className="finance-actions"><button className="export"><ArrowDownToLine size={14} />Exportar reporte</button><button className="add-product" onClick={() => setShowExpenseForm(true)}>Registrar gasto</button></div></div>
    {error && <div className="alert">{error}</div>}
    <div className="finance-tabs"><button className={period === 'day' ? 'selected' : ''} onClick={() => setPeriod('day')}>Caja del día</button><button className={period === 'month' ? 'selected' : ''} onClick={() => setPeriod('month')}>Resumen mensual</button></div>
    <div className="finance-metrics"><FinanceMetric label={isMonth ? 'Ingresos del mes' : 'Ingresos de hoy'} value={currency.format(income || 0)} detail={`${operations || 0} operaciones pagadas`} tone="green" icon={Wallet} /><FinanceMetric label={isMonth ? 'Gastos del mes' : 'Gastos de hoy'} value={currency.format(expenses || 0)} detail="Gastos registrados" tone="red" icon={ArrowDownToLine} /><FinanceMetric label="Utilidad" value={currency.format(utility)} detail="Ingresos menos gastos" tone="blue" icon={Lightbulb} /></div>
    <div className="finance-grid"><section className="card sources-card"><h3>Fuentes de ingreso</h3><Source label="Ventas con tarjeta" value={summary.ingresos_tarjeta || 0} total={summary.ingresos_mes || 1} icon={CreditCard} color="blue" /><Source label="Ventas en efectivo" value={summary.ingresos_efectivo || 0} total={summary.ingresos_mes || 1} icon={Banknote} color="green" /><p className="finance-note">Los ingresos se calculan a partir de pedidos pagados.</p></section><section className="card transactions-card"><div className="card-title"><h3>Transacciones recientes</h3><button className="row-action" onClick={load} title="Actualizar"><RefreshCw size={15} /></button></div><div className="transaction-list">{(data?.transacciones || []).map((transaction) => <div className="transaction-row" key={transaction.pk_id}><div className="transaction-icon"><Wallet size={14} /></div><div className="transaction-info"><b>{transaction.cliente_nombre || transaction.numero_pedido || 'Venta'}</b><small>{new Date(transaction.created_at).toLocaleDateString('es-PE')} · {transaction.metodo}</small></div><strong className={statusClass(transaction.estado)}>{transaction.estado === 'pagado' ? '+' : ''}{currency.format(transaction.monto_total)}</strong></div>)}</div>{!data?.transacciones?.length && <p className="empty">No hay transacciones registradas.</p>}</section></div>
    <section className="finance-advice"><div className="advice-head"><Lightbulb size={17} /><div><h3>Consejos financieros</h3><p>Recomendaciones basadas en la actividad de tu negocio</p></div></div>{recommendations.map((recommendation) => <div className="advice-item" key={recommendation}><span>•</span>{recommendation}</div>)}</section>
    {showExpenseForm && <ExpenseForm onClose={() => setShowExpenseForm(false)} onCreated={() => { setShowExpenseForm(false); load() }} />}
  </section>
}

function FinanceMetric({ label, value, detail, tone, icon: Icon }) { return <article className={`finance-metric ${tone}`}><div className="finance-icon"><Icon size={16} /></div><p>{label}</p><h3>{value}</h3><small>{detail}</small></article> }
function Source({ label, value, total, icon: Icon, color }) { const percentage = Math.min(Number(value) / Number(total || 1) * 100, 100); return <div className="source"><div className="source-label"><span><Icon size={13} />{label}</span><b>{Math.round(percentage)}%</b></div><div className="source-track"><i className={color} style={{ width: `${percentage}%` }} /></div></div> }
