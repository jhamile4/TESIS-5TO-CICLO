import { Download, Plus } from 'lucide-react'

export default function FinanceHeader({ businessName, onNewTransaction, onExport, exportando }) {
  return (
    <div className="finance-page-header">
      <div>
        <h2>Gestión Financiera</h2>
        <p>Resumen y control de activos para {businessName || 'tu negocio'}.</p>
      </div>

      <div className="finance-top-actions">
        <button className="btn-export-outline" onClick={onExport} disabled={exportando}>
          <Download size={14} /> {exportando ? 'Preparando…' : 'Exportar reporte'}
        </button>
        <button className="btn-add-product-teal" onClick={onNewTransaction}>
          <Plus size={16} /> Nueva Transacción
        </button>
      </div>
    </div>
  )
}
