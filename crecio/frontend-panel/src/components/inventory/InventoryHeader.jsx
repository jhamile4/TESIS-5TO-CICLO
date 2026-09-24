import { Plus, Download } from 'lucide-react'

export default function InventoryHeader({ onAddClick }) {
  return (
    <div className="inventory-heading-flex">
      <div>
        <h2>Inventarios</h2>
        <p>Gestiona tus productos con ayuda de IA</p>
      </div>

      <div className="inventory-top-actions">
        <button className="btn-export-outline">
          <Download size={14} /> Exportar
        </button>
        <button className="btn-add-product-teal" onClick={onAddClick}>
          <Plus size={16} /> Agregar Producto
        </button>
      </div>
    </div>
  )
}
