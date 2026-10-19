import { useEffect, useState } from 'react'
import { User, QrCode, Shield, Save } from 'lucide-react'
import { getTienda, actualizarTienda, enviarMetaCallback } from '../services/apiAdmin'
import ConfigProfileTab from '../components/config/ConfigProfileTab'
import ConfigQrTab from '../components/config/ConfigQrTab'
import ConfigSecurityTab from '../components/config/ConfigSecurityTab'

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState(new URLSearchParams(window.location.search).get('tab') || 'perfil')
  const [negocioId, setNegocioId] = useState(null)
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
    telefono: '',
    horario: '',
    direccion: '',
    distrito: '',
    logoUrl: '',
    redesSociales: {
      instagram: '',
      facebook: '',
      tiktok: '',
      youtube: '',
      twitter: '',
    },
  })

  useEffect(() => {
    loadBusinessData()

    // Detectar retorno de autorización de Meta OAuth
    const urlParams = new URLSearchParams(window.location.search)
    const metaCode = urlParams.get('code')
    if (metaCode) {
      setLoading(true)
      const redirectUri = window.location.origin + window.location.pathname
      enviarMetaCallback(metaCode, redirectUri)
        .then((res) => {
          setMessage('✅ ¡Meta API conectada exitosamente! Cuentas de Instagram y Facebook sincronizadas.')
          window.history.replaceState({}, document.title, window.location.pathname)
          loadBusinessData()
        })
        .catch((err) => {
          setError(err.message || 'Error al conectar con Meta API')
        })
        .finally(() => setLoading(false))
    }
  }, [])

  const loadBusinessData = () => {
    setLoading(true)
    getTienda()
      .then((respuesta) => {
        // La API responde { negocio, productos }: los datos de la tienda están en "negocio"
        const res = respuesta?.negocio
        if (res) {
          setNegocioId(res.pk_id)
          setForm({
            nombre: res.nombre || '',
            categoria: res.categoria || 'Ropa y Accesorios',
            descripcion: res.descripcion || '',
            emailContacto: res.email_contacto || res.email || '',
            whatsapp: res.whatsapp || '',
            telefono: res.telefono || '',
            horario: res.horario && res.horario !== 'Por confirmar' ? res.horario : '',
            direccion: res.direccion || '',
            distrito: res.distrito || '',
            tieneUbicacion: res.latitud != null && res.longitud != null,
            logoUrl: res.logo_url || '',
            redesSociales: {
              instagram: res.redes_sociales?.instagram || '',
              facebook: res.redes_sociales?.facebook || '',
              tiktok: res.redes_sociales?.tiktok || '',
              youtube: res.redes_sociales?.youtube || '',
              twitter: res.redes_sociales?.twitter || '',
            },
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
        telefono: form.telefono,
        horario: form.horario,
        direccion: form.direccion,
        distrito: form.distrito,
        logoUrl: form.logoUrl,
        redesSociales: form.redesSociales,
      })
      setMessage('Datos guardados. Ya se ven en tu tienda.')
      loadBusinessData()
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
        <button className="btn-ui-primary" onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {message && <div className="toast-success">{message}</div>}
      {error && <div className="toast-error">{error}</div>}

      {/* Navigation Pills */}
      <div className="config-nav-pills">
        <button
          className={`config-pill-btn ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          <User size={15} /> Perfil del Negocio
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

      {/* Tab Content */}
      {activeTab === 'perfil' && (
        <ConfigProfileTab
          form={form}
          setForm={setForm}
          handleLogoUpload={handleLogoUpload}
          handleSocialChange={handleSocialChange}
          handleSave={handleSave}
          setMessage={setMessage}
        />
      )}
      {activeTab === 'qr' && (
        <ConfigQrTab negocioId={negocioId} />
      )}
      {activeTab === 'seguridad' && (
        <ConfigSecurityTab />
      )}
    </section>
  )
}
