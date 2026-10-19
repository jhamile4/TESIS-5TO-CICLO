import { useEffect, useState } from 'react'
import { getFinanzas, guardarMetaVentas, getVentas } from '../services/apiAdmin'
import { descargarCsv, fechaArchivo } from '../utils/exportar'

import FinanceHeader from '../components/finance/FinanceHeader'
import FinancePeriodTabs from '../components/finance/FinancePeriodTabs'

// Componentes para Vista 1: Caja del Día (Screenshot 1)
import FinanceTopRow from '../components/finance/FinanceTopRow'
import FinanceMiddleRow from '../components/finance/FinanceMiddleRow'
import FinanceAdviceCardsRow from '../components/finance/FinanceAdviceCardsRow'

// Componentes para Vista 2: Resumen Mensual (Screenshot 2)
import FinanceMetricsMonthly from '../components/finance/FinanceMetricsMonthly'
import FinanceChart from '../components/finance/FinanceChart'
import FinanceGoalsRow from '../components/finance/FinanceGoalsRow'
import FinanceBreakdownRowMonthly from '../components/finance/FinanceBreakdownRowMonthly'

import ExpenseForm from '../components/ExpenseForm'

export default function FinancePage() {
  const [data, setData] = useState(null)
  const [period, setPeriod] = useState('day') // Default to 'day' (Caja del Día)
  const [error, setError] = useState('')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [exportando, setExportando] = useState(false)

  // Reporte en Excel/CSV: resumen del mes, últimos 6 meses y todas las ventas
  const exportarReporte = async () => {
    setExportando(true)
    try {
      const { ventas = [] } = await getVentas()
      const r = data?.resumen || {}
      const mes = (fecha) => new Date(fecha).toLocaleDateString('es-PE', { month: 'long', year: 'numeric', timeZone: 'UTC' })
      descargarCsv(`reporte-finanzas-${fechaArchivo()}.csv`, [
        [`Reporte financiero · ${data?.negocio?.nombre || ''}`],
        [],
        ['Resumen del mes', 'Monto (S/)'],
        ['Ingresos', Number(r.ingresos_mes || 0).toFixed(2)],
        ['Gastos', Number(r.gastos_mes || 0).toFixed(2)],
        ['Ganancia', (Number(r.ingresos_mes || 0) - Number(r.gastos_mes || 0)).toFixed(2)],
        [],
        ['Mes', 'Ingresos (S/)', 'Gastos (S/)'],
        ...(data?.historial || []).map((h) => [mes(h.mes), h.ingresos.toFixed(2), h.gastos.toFixed(2)]),
        [],
        ['N.° pedido', 'Fecha', 'Cliente', 'Método de pago', 'Estado del pago', 'Estado del pedido', 'Total (S/)'],
        ...ventas.map((v) => [
          v.numero_pedido, new Date(v.created_at).toLocaleString('es-PE'), v.cliente_nombre,
          v.metodo_pago || (v.stripe_payment_intent ? 'Tarjeta' : 'Efectivo'), v.estado, v.estado_pedido, Number(v.monto_total).toFixed(2),
        ]),
      ])
    } catch (err) {
      setError(err.message)
    } finally {
      setExportando(false)
    }
  }

  const loadData = () => {
    getFinanzas()
      .then(setData)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadData()
  }, [])

  const guardarMeta = async (meta) => {
    await guardarMetaVentas(meta)
    loadData()
  }

  const summary = data?.resumen || {}
  const isMonth = period === 'month'

  return (
    <section className="content finance-content" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <FinanceHeader
        businessName={data?.negocio?.nombre}
        onNewTransaction={() => setShowExpenseForm(true)}
        onExport={exportarReporte}
        exportando={exportando}
      />

      {error && <div className="toast-error" style={{ marginBottom: '16px' }}>{error}</div>}

      <FinancePeriodTabs period={period} setPeriod={setPeriod} />

      {!isMonth ? (
        /* VISTA 1: CAJA DEL DÍA (SCREENSHOT 1) */
        <>
          <FinanceTopRow summary={summary} isMonth={false} />
          <FinanceMiddleRow transacciones={data?.transacciones} summary={summary} isMonth={false} />
          <FinanceAdviceCardsRow summary={summary} isMonth={false} />
        </>
      ) : (
        /* VISTA 2: RESUMEN MENSUAL (SCREENSHOT 2) */
        <>
          <FinanceMetricsMonthly summary={summary} />
          <FinanceChart data={data} />
          <FinanceGoalsRow summary={summary} isMonth={true} onGuardarMeta={guardarMeta} />
          <FinanceBreakdownRowMonthly summary={summary} />
        </>
      )}

      {showExpenseForm && (
        <ExpenseForm
          onClose={() => setShowExpenseForm(false)}
          onCreated={() => {
            setShowExpenseForm(false)
            loadData()
          }}
        />
      )}
    </section>
  )
}
