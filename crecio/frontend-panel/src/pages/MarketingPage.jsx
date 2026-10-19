import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import {
  generarMarketing,
  getResumen,
  getInventario,
  generarImagenProducto,
  getPublicacionesMarketing,
  guardarPublicacionMarketing,
  publicarDirectoMarketing,
  getRedesSociales,
  desconectarRedSocial,
  getMetaAuthUrl,
  enviarMetaCallback,
  conectarMetaToken
} from '../services/apiAdmin'

import MarketingHeader from '../components/marketing/MarketingHeader'
import MarketingTabs from '../components/marketing/MarketingTabs'
import MarketingEditorCol from '../components/marketing/MarketingEditorCol'
import MarketingPreviewCol from '../components/marketing/MarketingPreviewCol'
import MarketingScheduledTab from '../components/marketing/MarketingScheduledTab'
import MarketingPublishedTab from '../components/marketing/MarketingPublishedTab'

const templates = [
  'Promoción / Oferta',
  'Nuevo Producto',
  'Testimonial',
  'Tip / Educativo',
  'Detrás de Cámaras',
  'Viral / Trending'
]

const tones = [
  'Modo Creativo',
  'Modo Profesional',
  'Formato Corto',
  'Viral / Trending'
]

// Formatos visuales reales de publicación (sin redundancia de temas)
const contentTypes = [
  { id: 'Publicación', label: 'Publicación Feed (1:1)' },
  { id: 'Story', label: 'Story / Estado (9:16)' },
  { id: 'Video', label: 'Video / Reel (9:16)' }
]

// Redes donde se puede publicar automáticamente (API oficial de Meta)
const REDES_META = [
  { id: 'facebook', name: 'Facebook', color: '#1877f2' },
  { id: 'instagram', name: 'Instagram', color: '#e1306c' }
]
const cuentasSinConectar = REDES_META.map((red) => ({ ...red, handle: '', connected: false, active: false }))

export default function MarketingPage() {
  const [activeMainTab, setActiveMainTab] = useState('crear')
  const [business, setBusiness] = useState(null)
  const [productos, setProductos] = useState([])

  const [tipo, setTipo] = useState('Detrás de Cámaras')
  const [tono, setTono] = useState(tones[0])
  const [contentType, setContentType] = useState('Video')
  const [prompt, setPrompt] = useState('Comparte un momento detrás de cámaras de tu negocio para humanizar tu marca')
  const [content, setContent] = useState('🎬 Mira cómo nuestro producto transforma tu día a día. ¡Dale play! Guión generado por IA. #video #viral')
  const [guionVideo, setGuionVideo] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [accounts, setAccounts] = useState(cuentasSinConectar)

  const [loading, setLoading] = useState(false)
  const [loadingImage, setLoadingImage] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const [publishMode, setPublishMode] = useState('ahora')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')

  const [scheduledPosts, setScheduledPosts] = useState([])
  const [publishedPosts, setPublishedPosts] = useState([])

  const loadAccounts = async () => {
    try {
      const guardadas = await getRedesSociales()
      setAccounts((prev) =>
        REDES_META.map((red) => {
          const cuenta = (guardadas || []).find((c) => c.plataforma === red.id && c.vinculada)
          const anterior = prev.find((a) => a.id === red.id)
          return cuenta
            ? { ...red, pkId: cuenta.pk_id, handle: cuenta.handle || cuenta.nombre_cuenta, connected: true, active: anterior?.connected ? anterior.active : true }
            : { ...red, handle: '', connected: false, active: false }
        })
      )
    } catch (err) {
      console.warn('No se pudieron cargar cuentas sociales:', err.message)
    }
  }

  const loadPosts = async () => {
    try {
      const scheduled = await getPublicacionesMarketing('programado')
      const published = await getPublicacionesMarketing('publicado')
      if (Array.isArray(scheduled)) {
        setScheduledPosts(scheduled.map(p => ({
          id: p.pk_id,
          image: p.media_url || null,
          platforms: p.plataformas || [],
          text: p.caption,
          date: p.fecha_programada || p.created_at
        })))
      }
      if (Array.isArray(published)) {
        setPublishedPosts(published.map(p => ({
          id: p.pk_id,
          image: p.media_url || null,
          platforms: p.plataformas || [],
          text: p.caption,
          date: p.fecha_publicada || p.created_at,
          likes: p.likes || 0,
          comments: p.comments || 0,
          shares: p.shares || 0
        })))
      }
    } catch (err) {}
  }

  useEffect(() => {
    getResumen()
      .then((result) => setBusiness(result.negocio))
      .catch(() => {})
    getInventario()
      .then((result) => {
        if (Array.isArray(result?.productos)) {
          setProductos(result.productos)
        }
      })
      .catch(() => {})
    loadPosts()
    loadAccounts()

    // Detectar retorno de autorización de Meta OAuth
    const urlParams = new URLSearchParams(window.location.search)
    const metaCode = urlParams.get('code')
    if (metaCode) {
      const redirectUri = window.location.origin + window.location.pathname
      enviarMetaCallback(metaCode, redirectUri)
        .then(() => {
          alert('✅ ¡Meta API conectada exitosamente! Cuentas de Instagram y Facebook sincronizadas.')
          window.history.replaceState({}, document.title, window.location.pathname)
          loadAccounts()
        })
        .catch((err) => {
          console.error(err)
          alert('Aviso al procesar autorización de Meta: ' + (err.message || 'Error desconocido'))
        })
    }
  }, [])

  const handleStartMetaAuth = async () => {
    try {
      const redirectUri = window.location.origin + '/marketing'
      const res = await getMetaAuthUrl(redirectUri)
      if (res?.url) {
        window.location.href = res.url
      }
    } catch (err) {
      alert('Error al iniciar conexión con Meta: ' + err.message)
    }
  }

  const handleManualTokenConnect = async () => {
    const token = window.prompt('Pega un token de usuario de Meta (Graph API Explorer, con permisos pages_show_list, pages_manage_posts, instagram_basic e instagram_content_publish):')
    if (!token) return
    try {
      await conectarMetaToken(token.trim())
      alert('✅ ¡Cuentas vinculadas exitosamente con Meta API!')
      await loadAccounts()
    } catch (err) {
      alert('Error al vincular token: ' + err.message)
    }
  }

  const handleDisconnect = async (acc) => {
    if (!window.confirm(`¿Desconectar ${acc.name}? Ya no se podrá publicar ahí hasta que vuelvas a conectar con Meta.`)) return
    try {
      await desconectarRedSocial(acc.pkId)
      await loadAccounts()
    } catch (err) {
      alert('No se pudo desconectar: ' + err.message)
    }
  }

  const toggleAccount = (id) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) return { ...acc, active: !acc.active }
        return acc
      })
    )
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) setUploadedImage(URL.createObjectURL(file))
  }

  const generateImageIa = async () => {
    if (!prompt?.trim()) {
      alert('Por favor escribe primero en el cuadro de texto el producto o idea para generar la imagen.')
      return
    }
    setLoadingImage(true)
    try {
      const res = await generarImagenProducto({
        prompt: prompt.trim(),
        categoria: business?.categoria,
        mode: 'studio'
      })
      if (res?.imageUrl) {
        setUploadedImage(res.imageUrl)
      }
    } catch (err) {
      alert('No se pudo generar la imagen IA. Puedes subir una foto propia o intentarlo de nuevo.')
    } finally {
      setLoadingImage(false)
    }
  }

  const generate = async () => {
    if (!prompt?.trim()) {
      setError('Escribe una breve descripción o idea de lo que deseas publicar')
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await generarMarketing({
        tipo,
        tono,
        prompt: prompt.trim(),
        contentType,
        generateImage: !uploadedImage // Solo genera imagen si no hay una ya establecida
      })
      setContent(result.contenido)
      setGuionVideo(result.guionVideo || null)
      if (result.mediaUrl && !uploadedImage) {
        setUploadedImage(result.mediaUrl)
      }
    } catch (err) {
      setError(err.message || 'Error al generar contenido con IA')
    } finally {
      setLoading(false)
    }
  }

  const copyText = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const activeAccountsList = accounts.filter((a) => a.connected && a.active)

  const handlePublishOrSchedule = async () => {
    if (!content) return
    setPublishing(true)
    try {
      const payload = {
        tipo,
        tono,
        contentType,
        prompt,
        text: content,
        caption: content,
        guionVideo,
        image: uploadedImage,
        mediaUrl: uploadedImage,
        platforms: activeAccountsList.map((a) => a.id),
        publishMode,
        scheduleDate,
        scheduleTime
      }

      if (publishMode === 'ahora') {
        const res = await publicarDirectoMarketing(payload)
        const nombres = { facebook: 'Facebook', instagram: 'Instagram' }
        const ok = (res.resultados || []).map((r) => `✅ ${nombres[r.plataforma]}${r.url ? `: ${r.url}` : ''}`)
        const fallos = (res.errores || []).map((e) => `⚠️ ${nombres[e.plataforma] || e.plataforma}: ${e.error}`)
        alert(['¡Publicado en tus redes!', ...ok, ...fallos].join('\n'))
        await loadPosts()
        setActiveMainTab('publicadas')
      } else {
        await guardarPublicacionMarketing(payload)
        await loadPosts()
        alert('📅 Publicación guardada como programada. Todavía no se publica sola a esa hora: ese día publícala desde "Crear" con "Publicar ahora".')
        setActiveMainTab('programadas')
      }
    } catch (err) {
      alert(err.message || 'Error al procesar publicación')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <section className="marketing-page-wrapper">
      <MarketingHeader />

      <MarketingTabs
        activeMainTab={activeMainTab}
        setActiveMainTab={setActiveMainTab}
        scheduledCount={scheduledPosts.length}
      />

      {activeMainTab === 'crear' && (
        <div className="marketing-layout-grid">
          <MarketingEditorCol
            templates={templates}
            tipo={tipo}
            setTipo={setTipo}
            prompt={prompt}
            setPrompt={setPrompt}
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            handleImageUpload={handleImageUpload}
            generateImageIa={generateImageIa}
            loadingImage={loadingImage}
            tones={tones}
            tono={tono}
            setTono={setTono}
            contentType={contentType}
            setContentType={setContentType}
            loading={loading}
            error={error}
            generate={generate}
            accounts={accounts}
            toggleAccount={toggleAccount}
            onStartMetaAuth={handleStartMetaAuth}
            onManualTokenConnect={handleManualTokenConnect}
            onDisconnect={handleDisconnect}
            business={business}
            productos={productos}
          />


          <MarketingPreviewCol
            contentTypes={contentTypes}
            contentType={contentType}
            setContentType={setContentType}
            business={business}
            uploadedImage={uploadedImage}
            content={content}
            setContent={setContent}
            guionVideo={guionVideo}
            copied={copied}
            copyText={copyText}
            generate={generate}
            publishMode={publishMode}
            setPublishMode={setPublishMode}
            scheduleDate={scheduleDate}
            setScheduleDate={setScheduleDate}
            scheduleTime={scheduleTime}
            setScheduleTime={setScheduleTime}
            activeAccountsList={activeAccountsList}
            handlePublishOrSchedule={handlePublishOrSchedule}
            publishing={publishing}
          />
        </div>
      )}

      {activeMainTab === 'programadas' && (
        <MarketingScheduledTab scheduledPosts={scheduledPosts} />
      )}

      {activeMainTab === 'publicadas' && (
        <MarketingPublishedTab publishedPosts={publishedPosts} />
      )}

      {activeMainTab === 'borradores' && (
        <div className="tab-view-container">
          <div className="tab-view-header">
            <h3>Borradores Guardados</h3>
            <p>Contenido en borrador pendiente de revisar o publicar.</p>
          </div>
          <div className="empty-state-box">
            <FileText size={32} />
            <p>No tienes borradores guardados por el momento.</p>
          </div>
        </div>
      )}
    </section>
  )
}

