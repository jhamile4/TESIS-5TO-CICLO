import { Share2, Upload, Store, MapPin } from 'lucide-react'
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  TwitterIcon,
  YoutubeIcon
} from '../common/SocialIcons'

const CATEGORIAS = [
  'Ropa y Accesorios', 'Gastronomía / Restaurantes', 'Tecnología', 'Ferretería',
  'Panadería / Pastelería', 'Florería', 'Belleza y Cuidado personal', 'Hogar', 'Servicios', 'Otro'
]

const REDES = [
  ['instagram', 'Instagram', InstagramIcon, '@tunegocio o instagram.com/tunegocio'],
  ['facebook', 'Facebook', FacebookIcon, 'facebook.com/tunegocio'],
  ['tiktok', 'TikTok', TikTokIcon, '@tunegocio'],
  ['youtube', 'YouTube', YoutubeIcon, 'youtube.com/@tunegocio'],
  ['twitter', 'X / Twitter', TwitterIcon, '@tunegocio'],
]

export default function ConfigProfileTab({ form, setForm, handleLogoUpload, handleSocialChange, handleSave }) {
  const campo = (clave) => ({
    value: form[clave] || '',
    onChange: (e) => setForm({ ...form, [clave]: e.target.value }),
  })
  // Si la tienda tiene una categoría que no está en la lista, se conserva (no se cambia al guardar)
  const categorias = form.categoria && !CATEGORIAS.includes(form.categoria) ? [form.categoria, ...CATEGORIAS] : CATEGORIAS

  return (
    <div className="config-content-stack">
      <div className="config-card" style={{ background: '#f0fdfa', borderColor: '#99f6e4' }}>
        <p className="config-card-subtitle" style={{ margin: 0, color: '#0f766e' }}>
          <Store size={14} style={{ verticalAlign: '-2px', marginRight: '6px' }} />
          Todo lo que completes aquí es lo que tus clientes ven en tu tienda de CRECIO. No olvides presionar <strong>Guardar cambios</strong>.
        </p>
      </div>

      {/* Logo */}
      <div className="config-card">
        <h4 className="config-card-title">Logo del negocio</h4>
        <div className="logo-upload-row">
          <div className="logo-avatar-box">
            {form.logoUrl ? (
              <img src={form.logoUrl} alt="Logo" className="logo-preview-img" />
            ) : (
              <div className="logo-fallback-initial">{(form.nombre || 'N').charAt(0).toUpperCase()}</div>
            )}
            <label className="logo-edit-badge" title="Cambiar logo">
              <Upload size={12} />
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <div className="logo-upload-info">
            <strong>Sube tu logo</strong>
            <p>PNG o JPG · cuadrado, idealmente 400 × 400 px</p>
            <label className="btn-outline-upload">
              Cambiar imagen
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
      </div>

      {/* Datos principales */}
      <div className="config-card">
        <h4 className="config-card-title">Información del negocio</h4>
        <form onSubmit={handleSave} className="config-info-form">
          <div className="form-grid-2col">
            <div className="config-field">
              <label>Nombre del negocio *</label>
              <input type="text" {...campo('nombre')} placeholder="Ej: Florería Primavera" required />
            </div>
            <div className="config-field">
              <label>Rubro / Categoría</label>
              <select {...campo('categoria')}>
                {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="config-field">
            <label>Descripción</label>
            <textarea rows={3} {...campo('descripcion')} placeholder="Qué vendes, qué te hace especial y si haces delivery." />
          </div>

          <div className="form-grid-2col">
            <div className="config-field">
              <label>WhatsApp para pedidos *</label>
              <input type="tel" {...campo('whatsapp')} placeholder="51 987 654 321" />
              <small style={{ fontSize: '11px', color: '#64748b' }}>Con el código de Perú (51) adelante, sin espacios ni +.</small>
            </div>
            <div className="config-field">
              <label>Teléfono para llamadas (opcional)</label>
              <input type="tel" {...campo('telefono')} placeholder="01 234 5678 o 987 654 321" />
            </div>
          </div>

          <div className="form-grid-2col">
            <div className="config-field">
              <label>Horario de atención</label>
              <input type="text" {...campo('horario')} placeholder="Lun–Sáb 9:00 a. m. – 8:00 p. m." />
            </div>
            <div className="config-field">
              <label>Email de contacto (opcional)</label>
              <input type="email" {...campo('emailContacto')} placeholder="contacto@tunegocio.com" />
            </div>
          </div>
        </form>
      </div>

      {/* Ubicación */}
      <div className="config-card">
        <h4 className="config-card-title"><MapPin size={16} style={{ verticalAlign: '-2px', marginRight: '6px' }} />Ubicación</h4>
        <p className="config-card-subtitle">Al guardar, CRECIO ubica tu dirección en el mapa de tu tienda automáticamente.</p>
        <div className="form-grid-2col">
          <div className="config-field">
            <label>Dirección</label>
            <input type="text" {...campo('direccion')} placeholder="Jr. Huallaga 342" />
          </div>
          <div className="config-field">
            <label>Distrito</label>
            <input type="text" {...campo('distrito')} placeholder="Cercado de Lima" />
          </div>
        </div>
        {form.direccion && form.tieneUbicacion === false && (
          <p className="config-card-subtitle" style={{ color: '#b45309', marginTop: '8px' }}>
            Aún no pudimos ubicar tu dirección en el mapa. Revisa que tenga calle y número, y el distrito.
          </p>
        )}
      </div>

      {/* Redes */}
      <div className="config-card">
        <h4 className="config-card-title flex-title">
          <Share2 size={18} className="title-icon-green" /> Redes sociales
        </h4>
        <p className="config-card-subtitle">
          Las que completes aparecen como enlaces en tu tienda. Deja vacías las que no uses.
          Para <strong>publicar</strong> desde CRECIO, conecta tu Página en Marketing IA.
        </p>
        <div className="social-networks-list">
          {REDES.map(([clave, nombre, Icon, ejemplo]) => (
            <div key={clave} className="social-row-item">
              <div className={`social-badge ${clave}`}><Icon size={18} /></div>
              <div className="social-input-col">
                <span className="social-name-label">{nombre}</span>
                <input
                  type="text"
                  value={form.redesSociales?.[clave] || ''}
                  onChange={(e) => handleSocialChange(clave, e.target.value)}
                  placeholder={ejemplo}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
