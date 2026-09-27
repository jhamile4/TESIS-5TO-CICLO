import { useState } from 'react'
import { X, Camera, Sparkles, Wand2, Upload, RefreshCw } from 'lucide-react'
import { crearProducto, generarImagenProducto } from '../../services/apiAdmin'

const categoryOptions = ['Ropa', 'Accesorios', 'Hogar', 'Electrónica', 'Papelería', 'General']

export default function AddProductModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    descripcion: '',
    imagenUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'
  })

  // Image mode state
  const [imgMode, setImgMode] = useState('subir') // 'subir' | 'ia_prompt'
  const [aiPrompt, setAiPrompt] = useState('')
  const [generatingAi, setGeneratingAi] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key, val) => setForm({ ...form, [key]: val })

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imagenUrl: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleEnhanceWithAI = async () => {
    setGeneratingAi(true)
    setError('')
    try {
      const res = await generarImagenProducto({
        mode: 'enhance',
        prompt: form.nombre || 'Producto e-commerce',
        nombre: form.nombre,
        categoria: form.categoria,
      })
      if (res?.imageUrl) {
        setForm((prev) => ({ ...prev, imagenUrl: res.imageUrl }))
      }
    } catch (err) {
      setError(err.message || 'Error al mejorar la imagen con IA')
    } finally {
      setGeneratingAi(false)
    }
  }

  const handleGenerateFromPrompt = async () => {
    if (!aiPrompt.trim() && !form.nombre.trim()) {
      setError('Escribe una descripción del producto para que la IA genere la imagen.')
      return
    }
    setGeneratingAi(true)
    setError('')
    try {
      const res = await generarImagenProducto({
        mode: 'prompt',
        prompt: aiPrompt.trim() || form.nombre,
        nombre: form.nombre,
        categoria: form.categoria,
      })
      if (res?.imageUrl) {
        setForm((prev) => ({ ...prev, imagenUrl: res.imageUrl }))
      }
    } catch (err) {
      setError(err.message || 'Error al generar la imagen por IA')
    } finally {
      setGeneratingAi(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.precio || !form.stock) {
      setError('Por favor completa el nombre, precio y stock.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await crearProducto({
        nombre: form.nombre,
        precio: Number(form.precio),
        stock: Number(form.stock),
        categoria: form.categoria || 'General',
        descripcion: form.descripcion,
        imagenUrl: form.imagenUrl
      })
      onCreated()
    } catch (err) {
      setError(err.message || 'Error al agregar producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="inv-modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3>Agregar Producto</h3>
            <small>Crea o mejora la imagen de tu producto con Inteligencia Artificial</small>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* AI Image Mode Selector Pills */}
        <div className="ai-image-mode-pills">
          <button
            type="button"
            className={`ai-mode-pill-btn ${imgMode === 'subir' ? 'active' : ''}`}
            onClick={() => setImgMode('subir')}
          >
            <Upload size={13} /> Subir / Mejorar Foto
          </button>
          <button
            type="button"
            className={`ai-mode-pill-btn ${imgMode === 'ia_prompt' ? 'active' : ''}`}
            onClick={() => setImgMode('ia_prompt')}
          >
            <Sparkles size={13} /> Generar con IA (Descripción)
          </button>
        </div>

        {/* AI Image Creation Box */}
        <div className="ai-image-preview-block">
          <div className="img-preview-box">
            <img src={form.imagenUrl} alt="Preview" />

            {generatingAi && (
              <div className="ai-loading-overlay">
                <RefreshCw size={24} className="spin-icon" style={{ color: '#0d9488' }} />
                <span>La IA está procesando la fotografía de tu producto...</span>
              </div>
            )}

            <span className="ia-processed-badge">
              <Sparkles size={11} /> IA habilitada
            </span>

            {imgMode === 'subir' && (
              <label className="change-photo-btn">
                <Camera size={13} /> Subir foto
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          {/* Action Row Based on Selected Mode */}
          {imgMode === 'subir' ? (
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-sparkle-generate"
                style={{ width: '100%' }}
                onClick={handleEnhanceWithAI}
                disabled={generatingAi}
              >
                <Wand2 size={14} /> {generatingAi ? 'Mejorando con IA...' : 'Mejorar Foto con IA (Iluminación & Estudio)'}
              </button>
            </div>
          ) : (
            <div className="ai-prompt-generator-box" style={{ marginTop: '10px' }}>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describir imagen (ej: Zapatillas de cuero blanco en estudio de lujo)"
              />
              <button
                type="button"
                className="btn-sparkle-generate"
                onClick={handleGenerateFromPrompt}
                disabled={generatingAi}
              >
                <Sparkles size={14} /> {generatingAi ? 'Generando Fotografía...' : 'Generar Imagen con IA'}
              </button>
            </div>
          )}

          <div className="ai-green-note">
            <Wand2 size={14} /> La IA optimiza el contraste, encuadre y fondo para catálogo e-commerce.
          </div>
        </div>

        {error && <div className="modal-error">{error}</div>}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="modal-form-body">
          <div className="field">
            <label>Nombre del producto</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => update('nombre', e.target.value)}
              placeholder="Ej: Camiseta Premium"
              required
            />
          </div>

          <div className="two-cols-row">
            <div className="field">
              <label>Precio (S/)</label>
              <input
                type="number"
                step="0.01"
                value={form.precio}
                onChange={(e) => update('precio', e.target.value)}
                placeholder="S/ 0.00"
                required
              />
            </div>
            <div className="field">
              <label>Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => update('stock', e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Categoría</label>
            <select
              value={form.categoria}
              onChange={(e) => update('categoria', e.target.value)}
            >
              <option value="">Seleccionar categoría...</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => update('descripcion', e.target.value)}
              placeholder="Describe las características principales de tu producto..."
              rows={3}
            />
          </div>

          <div className="modal-actions-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-submit" disabled={loading || generatingAi}>
              {loading ? 'Publicando...' : 'Publicar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
