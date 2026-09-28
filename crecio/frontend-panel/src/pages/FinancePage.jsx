import { useEffect, useState } from 'react'
import { getFinanzas } from '../services/apiAdmin'

import FinanceHeader from '../components/finance/FinanceHeader'
import FinancePeriodTabs from '../components/finance/FinancePeriodTabs'

// Componentes para Vista 1: Caja del Día (Screenshot 1)
import FinanceTopRow from '../components/finance/FinanceTopRow'
import FinanceMiddleRow from '../components/finance/FinanceMiddleRow'
import FinanceAdviceCardsRow from '../components/finance/FinanceAdviceCardsRow'
import FinanceGatewayBanner from '../components/finance/FinanceGatewayBanner'

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

  const loadData = () => {
    getFinanzas()
      .then(setData)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadData()
  }, [])

  const summary = data?.resumen || {}
  const isMonth = period === 'month'

  return (
    <section className="content finance-content" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <FinanceHeader
        businessName={data?.negocio?.nombre}
        onNewTransaction={() => setShowExpenseForm(true)}
      />

      {error && <div className="toast-error" style={{ marginBottom: '16px' }}>{error}</div>}

      <FinancePeriodTabs period={period} setPeriod={setPeriod} />

      {!isMonth ? (
        /* VISTA 1: CAJA DEL DÍA (SCREENSHOT 1) */
        <>
          <FinanceTopRow summary={summary} isMonth={false} />
          <FinanceMiddleRow transacciones={data?.transacciones} summary={summary} isMonth={false} />
          <FinanceAdviceCardsRow summary={summary} isMonth={false} />
          <FinanceGatewayBanner />
        </>
      ) : (
        /* VISTA 2: RESUMEN MENSUAL (SCREENSHOT 2) */
        <>
          <FinanceMetricsMonthly summary={summary} />
          <FinanceChart data={data} />
          <FinanceGoalsRow summary={summary} isMonth={true} />
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
