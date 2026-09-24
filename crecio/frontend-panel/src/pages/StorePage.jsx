import { useEffect, useState } from 'react'
import { Smartphone, Monitor } from 'lucide-react'
import { actualizarTienda, getTienda } from '../services/apiAdmin'

import StoreHeader from '../components/store/StoreHeader'
import StoreTabsEditor from '../components/store/StoreTabsEditor'
import StorePreviewMobile from '../components/store/StorePreviewMobile'
import StorePreviewDesktop from '../components/store/StorePreviewDesktop'
import StoreStatsSidebar from '../components/store/StoreStatsSidebar'

const colorThemes = [
  { id: 'Moderno', name: 'Moderno', bg: '#121214', text: '#ffffff', accent: '#0d9488', cardBg: '#1e1e24' },
  { id: 'Claro', name: 'Claro', bg: '#f8fafc', text: '#0f172a', accent: '#0284c7', cardBg: '#ffffff' },
  { id: 'Verde', name: 'Verde', bg: '#064e3b', text: '#ffffff', accent: '#10b981', cardBg: '#065f46' },
  { id: 'Naranja', name: 'Naranja', bg: '#7c2d12', text: '#ffffff', accent: '#f97316', cardBg: '#9a3412' },
  { id: 'Coral', name: 'Coral', bg: '#881337', text: '#ffffff', accent: '#f43f5e', cardBg: '#9f1239' }
]

const buttonStyles = [
  { id: 'Redondeado', name: 'Redondeado', radius: '8px' },
  { id: 'Cuadrado', name: 'Cuadrado', radius: '2px' },
  { id: 'Píldora', name: 'Píldora', radius: '24px' }
]

const fonts = ['Inter', 'Poppins', 'Playfair Display']

export default function StorePage() {
  const [data, setData] = useState(null)
  const [deviceMode, setDeviceMode] = useState('movil') // 'movil', 'escritorio'

  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0])
  const [selectedBtnStyle, setSelectedBtnStyle] = useState(buttonStyles[0])
  const [selectedFont, setSelectedFont] = useState(fonts[0])

  const [form, setForm] = useState({
    nombre: 'Mi Tienda Crecio',
    slogan: 'Los mejores productos al mejor precio',
    whatsapp: '+51 999 123 456',
    instagram: '@mitiendacrecio',
    facebook: 'facebook.com/mitiendacrecio',
    direccion: 'Av. Principal 123, Lima',
    logoUrl: ''
  })

  const [sections, setSections] = useState({
    portada: true,
    catalogo: true,
    whatsapp: true,
    redes: true,
    ubicacion: false
  })

  const [copiedLink, setCopiedLink] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getTienda()
      .then((result) => {
        setData(result)
        if (result?.negocio) {
          setForm((prev) => ({
            ...prev,
            nombre: result.negocio.nombre || prev.nombre,
            slogan: result.negocio.descripcion || prev.slogan,
            whatsapp: result.negocio.whatsapp || prev.whatsapp,
            direccion: result.negocio.direccion || prev.direccion,
            logoUrl: result.negocio.logo_url || prev.logoUrl
          }))
        }
      })
      .catch((err) => setError(err.message))
  }, [])

  const updateForm = (key, val) => setForm({ ...form, [key]: val })
  const toggleSection = (sec) => setSections({ ...sections, [sec]: !sections[sec] })

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://crecio.app/${form.nombre.toLowerCase().replace(/\s+/g, '-')}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const saveChanges = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const result = await actualizarTienda({
        nombre: form.nombre,
        descripcion: form.slogan,
        direccion: form.direccion,
        whatsapp: form.whatsapp,
        logoUrl: form.logoUrl
      })
      setData({ ...data, negocio: result.negocio })
      setMessage('¡Cambios guardados exitosamente!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const sampleProducts = data?.productos?.length
    ? data.productos.slice(0, 3)
    : [
        { pk_id: 1, nombre: 'Camiseta Premium', precio: 89, imagen_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80' },
        { pk_id: 2, nombre: 'Mochila Urbana', precio: 149, imagen_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop&q=80' },
        { pk_id: 3, nombre: 'Audífonos Pro', precio: 299, imagen_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80' }
      ]

  return (
    <section className="store-page-wrapper">
      <StoreHeader saving={saving} onSave={saveChanges} />

      {message && <div className="toast-success">{message}</div>}
      {error && <div className="toast-error">{error}</div>}

      <div className="store-main-layout">
        {/* LEFT EDITOR SIDEBAR */}
        <StoreTabsEditor
          colorThemes={colorThemes}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          buttonStyles={buttonStyles}
          selectedBtnStyle={selectedBtnStyle}
          setSelectedBtnStyle={setSelectedBtnStyle}
          fonts={fonts}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          form={form}
          updateForm={updateForm}
          sections={sections}
          toggleSection={toggleSection}
          copiedLink={copiedLink}
          onCopyLink={handleCopyLink}
        />

        {/* CENTER LIVE PREVIEW */}
        <div className="store-preview-area">
          <div className="preview-top-toolbar">
            <div className="device-switcher-pill">
              <button
                className={deviceMode === 'movil' ? 'active' : ''}
                onClick={() => setDeviceMode('movil')}
              >
                <Smartphone size={14} /> Móvil
              </button>
              <button
                className={deviceMode === 'escritorio' ? 'active' : ''}
                onClick={() => setDeviceMode('escritorio')}
              >
                <Monitor size={14} /> Escritorio
              </button>
            </div>
            <div className="domain-url-preview">
              crecio.app/{form.nombre.toLowerCase().replace(/\s+/g, '-')}
            </div>
          </div>

          <div className="preview-device-container">
            {deviceMode === 'movil' ? (
              <StorePreviewMobile
                selectedTheme={selectedTheme}
                selectedBtnStyle={selectedBtnStyle}
                selectedFont={selectedFont}
                form={form}
                sections={sections}
                sampleProducts={sampleProducts}
              />
            ) : (
              <StorePreviewDesktop
                selectedTheme={selectedTheme}
                selectedBtnStyle={selectedBtnStyle}
                selectedFont={selectedFont}
                form={form}
                sections={sections}
                sampleProducts={sampleProducts}
              />
            )}
          </div>
        </div>

        {/* RIGHT STATS SIDEBAR */}
        <StoreStatsSidebar />
      </div>
    </section>
  )
}
