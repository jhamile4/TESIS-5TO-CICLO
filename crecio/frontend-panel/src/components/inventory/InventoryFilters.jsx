import { Search } from 'lucide-react'

export default function InventoryFilters({
  query,
  setQuery,
  selectedCategory,
  setSelectedCategory,
  categoriesWithCount
}) {
  return (
    <div className="inventory-filters-row">
      <div className="inv-search-input-wrap">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
        />
      </div>

      <div className="category-pills-scroll">
        {categoriesWithCount.map((cat) => (
          <button
            key={cat.name}
            className={`cat-pill-btn ${selectedCategory === cat.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.name)}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>
    </div>
  )
}
