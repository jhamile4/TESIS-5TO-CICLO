import { RefreshCw, Wallet } from 'lucide-react'
import { currency, statusClass } from '../../utils/formatters'

export default function FinanceTransactions({ transactions, onRefresh }) {
  return (
    <section className="card transactions-card">
      <div className="card-title">
        <h3>Transacciones Recientes</h3>
        <button className="row-action" onClick={onRefresh} title="Actualizar">
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="transaction-list">
        {(transactions || []).map((transaction) => (
          <div className="transaction-row" key={transaction.pk_id}>
            <div className="transaction-icon">
              <Wallet size={14} />
            </div>
            <div className="transaction-info">
              <b>{transaction.cliente_nombre || transaction.numero_pedido || 'Venta general'}</b>
              <small>
                {new Date(transaction.created_at).toLocaleDateString('es-PE')} · {transaction.metodo || 'Efectivo'}
              </small>
            </div>
            <strong className={statusClass(transaction.estado)}>
              {transaction.estado === 'pagado' ? '+' : ''}
              {currency.format(transaction.monto_total)}
            </strong>
          </div>
        ))}

        {(!transactions || transactions.length === 0) && (
          <p className="empty">No hay transacciones recientes registradas.</p>
        )}
      </div>
    </section>
  )
}
