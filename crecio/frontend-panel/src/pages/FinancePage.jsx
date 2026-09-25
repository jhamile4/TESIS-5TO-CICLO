import { useEffect, useState } from 'react'
import { getFinanzas } from '../services/apiAdmin'

import FinanceHeader from '../components/finance/FinanceHeader'
import FinancePeriodTabs from '../components/finance/FinancePeriodTabs'
import FinanceMetrics from '../components/finance/FinanceMetrics'
import FinanceChart from '../components/finance/FinanceChart'
import FinanceGoalsRow from '../components/finance/FinanceGoalsRow'
import FinanceBreakdownRow from '../components/finance/FinanceBreakdownRow'
import ExpenseForm from '../components/ExpenseForm'

export default function FinancePage() {
  const [data, setData] = useState(null)
  const [period, setPeriod] = useState('month')
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
    <section className="content finance-content">
      <FinanceHeader
        businessName={data?.negocio?.nombre}
        onNewTransaction={() => setShowExpenseForm(true)}
      />

      {error && <div className="toast-error">{error}</div>}

      <FinancePeriodTabs period={period} setPeriod={setPeriod} />

      <FinanceMetrics summary={summary} isMonth={isMonth} />

      <FinanceChart data={data} />

      <FinanceGoalsRow summary={summary} />

      <FinanceBreakdownRow summary={summary} />

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
