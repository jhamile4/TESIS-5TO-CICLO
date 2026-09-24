import { Package } from 'lucide-react'
import { currency } from '../../utils/formatters'

export default function InventoryCard({ product, onClick }) {
  const isLowStock = Number(product.stock) <= 5

  return (
    <div className="product-inv-card" onClick={onClick}>
      <div className="prod-img-container">
        {product.imagen_url ? (
          <img src={product.imagen_url} alt={product.nombre} />
        ) : (
          <div className="prod-no-img">
            <Package size={36} />
          </div>
        )}
        {isLowStock && (
          <span className="stock-alert-badge">
            Stock bajo: {product.stock}
          </span>
        )}
      </div>

      <div className="prod-card-content">
        <div className="prod-title-price-flex">
          <div className="prod-name-box">
            <strong>{product.nombre}</strong>
            <small>{product.categoria || 'General'}</small>
          </div>
          <span className="prod-price-tag">{currency.format(product.precio)}</span>
        </div>

        <div className="prod-stock-sales-footer">
          <div className="stock-indicator">
            <span className={`status-dot-circle ${isLowStock ? 'dot-red' : 'dot-green'}`}></span>
            <span>{product.stock} en stock</span>
          </div>
          <small className="sales-count">{product.ventas || Math.floor(product.stock * 0.8) || 12} ventas</small>
        </div>
      </div>
    </div>
  )
}
