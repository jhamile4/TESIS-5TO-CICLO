import { useEffect, useState } from 'react'
import {
  User, Palette, Sliders, QrCode, Shield, Upload, Share2, Save,
  CheckCircle, RefreshCw
} from 'lucide-react'
import { getTienda, actualizarTienda } from '../services/apiAdmin'

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
  </svg>
)

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('perfil')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nombre: '',
    categoria: 'Ropa y Accesorios',
    descripcion: '',
    emailContacto: '',
    whatsapp: '',
    direccion: '',
    logoUrl: '',
    redesSociales: {
      instagram: '',
      facebook: '',
      tiktok: '',
      youtube: '',
      twitter: '',
      whatsapp: '',
    },
    toggles: {
      instagram: true,
      facebook: true,
      tiktok: true,
      youtube: true,
      twitter: true,
      whatsapp: true,
    }
  })

  useEffect(() => {
    loadBusinessData()
  }, [])

  const loadBusinessData = () => {
    setLoading(true)
    getTienda()
      .then((res) => {
        if (res) {
          setForm({
            nombre: res.nombre || '',
            categoria: res.categoria || 'Ropa y Accesorios',
            descripcion: res.descripcion || '',
            emailContacto: res.email_contacto || res.email || '',
            whatsapp: res.whatsapp || '',
            direccion: res.direccion || '',
            logoUrl: res.logo_url || '',
            redesSociales: {
              instagram: res.redes_sociales?.instagram || '',
              facebook: res.redes_sociales?.facebook || '',
              tiktok: res.redes_sociales?.tiktok || '',
              youtube: res.redes_sociales?.youtube || '',
              twitter: res.redes_sociales?.twitter || '',
              whatsapp: res.redes_sociales?.whatsapp || res.whatsapp || '',
            },
            toggles: {
              instagram: true,
              facebook: true,
              tiktok: true,
              youtube: true,
              twitter: true,
              whatsapp: true,
            }
          })
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, logoUrl: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSocialChange = (key, val) => {
    setForm((prev) => ({
      ...prev,
      redesSociales: { ...prev.redesSociales, [key]: val }
    }))
  }

  const handleToggleChange = (key) => {
    setForm((prev) => ({
      ...prev,
      toggles: { ...prev.toggles, [key]: !prev.toggles[key] }
    }))
  }

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await actualizarTienda({
        nombre: form.nombre,
        categoria: form.categoria,
        descripcion: form.descripcion,
        emailContacto: form.emailContacto,
        whatsapp: form.whatsapp,
        direccion: form.direccion,
        logoUrl: form.logoUrl,
        redesSociales: form.redesSociales,
      })
      setMessage('Configuración guardada exitosamente.')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.message || 'Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="config-page-wrapper">
      {/* Page Header */}
      <div className="config-heading-bar">
        <div>
          <h2>Configuración</h2>
          <p>Administra tu negocio, preferencias y seguridad</p>
        </div>
        <button className="btn-save-config" onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {message && <div className="toast-success">{message}</div>}
      {error && <div className="toast-error">{error}</div>}

      {/* Pill Navigation Bar */}
      <div className="config-nav-pills">
        <button
          className={`config-pill-btn ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          <User size={15} /> Perfil del Negocio
        </button>
        <button
          className={`config-pill-btn ${activeTab === 'apariencia' ? 'active' : ''}`}
          onClick={() => setActiveTab('apariencia')}
        >
          <Palette size={15} /> Apariencia
        </button>
        <button
          className={`config-pill-btn ${activeTab === 'preferencias' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferencias')}
        >
          <Sliders size={15} /> Preferencias
        </button>
        <button
          className={`config-pill-btn ${activeTab === 'qr' ? 'active' : ''}`}
          onClick={() => setActiveTab('qr')}
        >
          <QrCode size={15} /> QR y Link
        </button>
        <button
          className={`config-pill-btn ${activeTab === 'seguridad' ? 'active' : ''}`}
          onClick={() => setActiveTab('seguridad')}
        >
          <Shield size={15} /> Seguridad
        </button>
      </div>

      {/* SUBTAB 1: PERFIL DEL NEGOCIO (Figma 1:1) */}
      {activeTab === 'perfil' && (
        <div className="config-content-stack">
          {/* Card 1: Logo del Negocio */}
          <div className="config-card">
            <h4 className="config-card-title">Logo del Negocio</h4>
            <div className="logo-upload-row">
              <div className="logo-avatar-box">
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt="Logo" className="logo-preview-img" />
                ) : (
                  <div className="logo-fallback-initial">
                    {(form.nombre || 'N').charAt(0).toUpperCase()}
                  </div>
                )}
                <label className="logo-edit-badge" title="Cambiar logo">
                  <Upload size={12} />
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                </label>
              </div>
              <div className="logo-upload-info">
                <strong>Sube tu logo</strong>
                <p>PNG o JPG · Máx. 2MB · Recomendado 400x400px</p>
                <label className="btn-outline-upload">
                  Cambiar imagen
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Información del Negocio */}
          <div className="config-card">
            <h4 className="config-card-title">Información del Negocio</h4>
            <form onSubmit={handleSave} className="config-info-form">
              <div className="form-grid-2col">
                <div className="config-field">
                  <label>Nombre del negocio</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ej: Barbados Store"
                    required
                  />
                </div>

                <div className="config-field">
                  <label>Rubro / Categoría</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  >
                    <option value="Ropa y Accesorios">Ropa y Accesorios</option>
                    <option value="Gastronomía / Restaurantes">Gastronomía / Restaurantes</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Ferretería">Ferretería</option>
                    <option value="Panadería / Pastelería">Panadería / Pastelería</option>
                    <option value="Florería">Florería</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="config-field">
                <label>Descripción del negocio</label>
                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Venta de ropa y accesorios para toda la familia. Calidad garantizada y precios accesibles."
                />
              </div>

              <div className="form-grid-2col">
                <div className="config-field">
                  <label>Email de contacto</label>
                  <input
                    type="email"
                    value={form.emailContacto}
                    onChange={(e) => setForm({ ...form, emailContacto: e.target.value })}
                    placeholder="contacto@tunegocio.com"
                  />
                </div>

                <div className="config-field">
                  <label>Teléfono / WhatsApp</label>
                  <div className="phone-prefix-input">
                    <span className="prefix-box">+51</span>
                    <input
                      type="text"
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="987 654 321"
                    />
                  </div>
                </div>
              </div>

              <div className="config-field">
                <label>Dirección</label>
                <input
                  type="text"
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  placeholder="Jr. Huallaga 342, Cercado de Lima"
                />
              </div>
            </form>
          </div>

          {/* Card 3: Redes Sociales (Figma 1:1) */}
          <div className="config-card">
            <div className="config-card-header-with-sub">
              <div>
                <h4 className="config-card-title flex-title">
                  <Share2 size={18} className="title-icon-green" /> Redes Sociales
                </h4>
                <p className="config-card-subtitle">
                  Conecta tus cuentas para publicar directamente desde Marketing IA
                </p>
              </div>
            </div>

            <div className="social-networks-list">
              {/* Instagram */}
              <div className="social-row-item">
                <div className="social-badge instagram">
                  <InstagramIcon size={18} />
                </div>
                <div className="social-input-col">
                  <span className="social-name-label">Instagram</span>
                  <input
                    type="text"
                    value={form.redesSociales.instagram}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    placeholder="@tunegocio"
                  />
                </div>
                <div className="social-toggle-col">
                  <span className="status-active-badge">Activo</span>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={form.toggles.instagram}
                      onChange={() => handleToggleChange('instagram')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              {/* Facebook */}
              <div className="social-row-item">
                <div className="social-badge facebook">
                  <FacebookIcon size={18} />
                </div>
                <div className="social-input-col">
                  <span className="social-name-label">Facebook</span>
                  <input
                    type="text"
                    value={form.redesSociales.facebook}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    placeholder="facebook.com/tunegocio"
                  />
                </div>
                <div className="social-toggle-col">
                  <span className="status-active-badge">Activo</span>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={form.toggles.facebook}
                      onChange={() => handleToggleChange('facebook')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              {/* TikTok */}
              <div className="social-row-item">
                <div className="social-badge tiktok">
                  <span>🎵</span>
                </div>
                <div className="social-input-col">
                  <span className="social-name-label">TikTok</span>
                  <input
                    type="text"
                    value={form.redesSociales.tiktok}
                    onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                    placeholder="@tunegocio"
                  />
                </div>
                <div className="social-toggle-col">
                  <span className="status-active-badge">Activo</span>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={form.toggles.tiktok}
                      onChange={() => handleToggleChange('tiktok')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              {/* YouTube */}
              <div className="social-row-item">
                <div className="social-badge youtube">
                  <YoutubeIcon size={18} />
                </div>
                <div className="social-input-col">
                  <span className="social-name-label">YouTube</span>
                  <input
                    type="text"
                    value={form.redesSociales.youtube}
                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                    placeholder="youtube.com/@tunegocio"
                  />
                </div>
                <div className="social-toggle-col">
                  <span className="status-active-badge">Activo</span>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={form.toggles.youtube}
                      onChange={() => handleToggleChange('youtube')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              {/* X / Twitter */}
              <div className="social-row-item">
                <div className="social-badge twitter">
                  <TwitterIcon size={18} />
                </div>
                <div className="social-input-col">
                  <span className="social-name-label">X / Twitter</span>
                  <input
                    type="text"
                    value={form.redesSociales.twitter}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    placeholder="@tunegocio"
                  />
                </div>
                <div className="social-toggle-col">
                  <span className="status-active-badge">Activo</span>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={form.toggles.twitter}
                      onChange={() => handleToggleChange('twitter')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              {/* WhatsApp Business */}
              <div className="social-row-item">
                <div className="social-badge whatsapp">
                  <WhatsAppIcon size={18} />
                </div>
                <div className="social-input-col">
                  <span className="social-name-label">WhatsApp Business</span>
                  <input
                    type="text"
                    value={form.redesSociales.whatsapp || form.whatsapp}
                    onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                    placeholder="+51 987 654 321"
                  />
                </div>
                <div className="social-toggle-col">
                  <span className="status-active-badge">Activo</span>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={form.toggles.whatsapp}
                      onChange={() => handleToggleChange('whatsapp')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: APARIENCIA */}
      {activeTab === 'apariencia' && (
        <div className="config-card">
          <h4 className="config-card-title">Apariencia y Estilo</h4>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            Personaliza el tema visual y tipografía de tu panel de control y tienda pública.
          </p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
            <button className="btn-save-config" onClick={handleSave}>
              Aplicar Tema Guardado
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PREFERENCIAS */}
      {activeTab === 'preferencias' && (
        <div className="config-card">
          <h4 className="config-card-title">Preferencias Generales</h4>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            Moneda principal: <strong>Soles Peruanos (PEN - S/)</strong>. Idioma: <strong>Español (PE)</strong>.
          </p>
        </div>
      )}

      {/* SUBTAB 4: QR Y LINK */}
      {activeTab === 'qr' && (
        <div className="config-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h4 className="config-card-title" style={{ justifyContent: 'center' }}>Código QR de tu Negocio</h4>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
            Los clientes pueden escanear este código QR para entrar directamente a tu catálogo web.
          </p>
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', display: 'inline-block', border: '1px solid #e2e8f0' }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://crecio.app/${form.nombre.toLowerCase().replace(/\s+/g, '-')}`}
              alt="QR Code"
              style={{ width: '180px', height: '180px' }}
            />
            <strong style={{ display: 'block', margin: '12px 0 4px', color: '#0f172a', fontSize: '14px' }}>
              crecio.app/{form.nombre.toLowerCase().replace(/\s+/g, '-')}
            </strong>
          </div>
        </div>
      )}

      {/* SUBTAB 5: SEGURIDAD */}
      {activeTab === 'seguridad' && (
        <div className="config-card">
          <h4 className="config-card-title">Seguridad y Credenciales</h4>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
            Tu sesión cuenta con cifrado SSL/TLS de 256 bits y autenticación mediante JWT seguro.
          </p>
        </div>
      )}
    </section>
  )
}
