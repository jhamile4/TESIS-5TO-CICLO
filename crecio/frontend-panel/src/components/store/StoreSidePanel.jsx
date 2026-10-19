import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagePlus, Trash2, Copy, Download, Mail, Pencil } from 'lucide-react'
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from '../common/SocialIcons'
import { getGaleria, agregarFotoGaleria, quitarFotoGaleria } from '../../services/apiAdmin'
import { qrUrl } from '../../config/env'

const MAX_FOTOS = 8
const labelStyle = { display: 'block', margin: '0 0 8px', fontSize: '12px', fontWeight: 700, color: '#334155' }

// Panel izquierdo de "Mi tienda": fotos de la galería y opciones para compartir la tienda
export default function StoreSidePanel({ url, nombre, onGaleriaChange }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('fotos')
  const [fotos, setFotos] = useState([])
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const [copiado, setCopiado] = useState(false)

  const cargar = () => getGaleria().then((data) => { setFotos(data); onGaleriaChange?.(data) }).catch((err) => setError(err.message))
  useEffect(() => { cargar() }, [])

  const subir = (e) => {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return
    if (archivo.size > 8 * 1024 * 1024) { setError('La foto pesa más de 8 MB'); return }
    const lector = new FileReader()
    lector.onloadend = async () => {
      setSubiendo(true)
      setError('')
      try {
        await agregarFotoGaleria(lector.result)
        await cargar()
      } catch (err) {
        setError(err.message)
      } finally {
        setSubiendo(false)
      }
    }
    lector.readAsDataURL(archivo)
  }

  const quitar = async (foto) => {
    if (!window.confirm('¿Quitar esta foto de tu tienda?')) return
    try {
      await quitarFotoGaleria(foto.pk_id)
      await cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const copiar = async () => {
    await navigator.clipboard.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 1800)
  }

  const texto = `Visita ${nombre || 'mi tienda'} en CRECIO: ${url}`
  const compartir = [
    ['WhatsApp', WhatsAppIcon, `https://wa.me/?text=${encodeURIComponent(texto)}`],
    ['Facebook', FacebookIcon, `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`],
    ['Email', Mail, `mailto:?subject=${encodeURIComponent(nombre || 'Mi tienda')}&body=${encodeURIComponent(texto)}`],
  ]

  return (
    <div className="store-editor-card">
      <button type="button" className="btn-ui-primary" style={{ width: '100%', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => navigate('/configuracion')}>
        <Pencil size={14} /> Editar datos del negocio
      </button>

      <div className="editor-subtabs">
        <button className={`subtab-btn ${tab === 'fotos' ? 'active' : ''}`} onClick={() => setTab('fotos')}>Fotos</button>
        <button className={`subtab-btn ${tab === 'compartir' ? 'active' : ''}`} onClick={() => setTab('compartir')}>Compartir</button>
      </div>

      {tab === 'fotos' && (
        <div className="tab-form-content">
          <p style={{ ...labelStyle, marginBottom: '4px' }}>Fotos de tu tienda ({fotos.length}/{MAX_FOTOS})</p>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 10px' }}>
            Aparecen en la portada de tu tienda: el local, tus productos estrella o tu equipo.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {fotos.map((foto) => (
              <div key={foto.pk_id} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#f1f5f9' }}>
                <img src={foto.imagen_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" title="Quitar foto" onClick={() => quitar(foto)}
                  style={{ position: 'absolute', top: '4px', right: '4px', width: '24px', height: '24px', border: 'none', borderRadius: '6px', background: 'rgba(15,23,42,.65)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {fotos.length < MAX_FOTOS && (
              <label style={{ aspectRatio: '1', borderRadius: '8px', border: '1.5px dashed #cbd5e1', display: 'grid', placeItems: 'center', color: '#64748b', fontSize: '11px', textAlign: 'center', cursor: subiendo ? 'wait' : 'pointer' }}>
                <span><ImagePlus size={18} style={{ display: 'block', margin: '0 auto 4px' }} />{subiendo ? 'Subiendo…' : 'Agregar'}</span>
                <input type="file" accept="image/*" hidden onChange={subir} disabled={subiendo} />
              </label>
            )}
          </div>
          {error && <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: '8px' }}>{error}</p>}
        </div>
      )}

      {tab === 'compartir' && (
        <div className="tab-form-content">
          <p style={labelStyle}>Enlace de tu tienda</p>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input readOnly value={url} style={{ flex: 1, minWidth: 0, padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#334155' }} />
            <button type="button" className="btn-ui-outline" onClick={copiar} title="Copiar enlace"><Copy size={14} /></button>
          </div>
          {copiado && <p style={{ fontSize: '11px', color: '#0d9488', margin: '4px 0 0' }}>¡Enlace copiado!</p>}

          <p style={{ ...labelStyle, marginTop: '16px' }}>Compartir en</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {compartir.map(([nombreRed, Icon, href]) => (
              <a key={nombreRed} href={href} target="_blank" rel="noreferrer" className="btn-ui-outline"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}>
                <Icon size={14} /> {nombreRed}
              </a>
            ))}
            <button type="button" className="btn-ui-outline" onClick={copiar} title="Instagram no permite compartir enlaces desde la web: cópialo y pégalo en tu biografía o historia"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <InstagramIcon size={14} /> Instagram
            </button>
          </div>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '6px 0 0' }}>
            En Instagram, pega el enlace en tu biografía o en una historia.
          </p>

          <p style={{ ...labelStyle, marginTop: '16px' }}>Código QR</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={qrUrl(url, 160)} alt="QR de la tienda" style={{ width: '80px', height: '80px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
            <a className="btn-ui-outline" href={`${qrUrl(url)}&format=png`} target="_blank" rel="noreferrer" download="qr-mi-tienda.png"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              <Download size={14} /> Descargar QR
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
