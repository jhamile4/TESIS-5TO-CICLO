import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import {
  generarMarketing,
  getResumen,
  generarImagenProducto,
  getPublicacionesMarketing,
  guardarPublicacionMarketing,
  publicarDirectoMarketing
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

const contentTypes = [
  { id: 'Publicación', label: 'Publicación' },
  { id: 'Story', label: 'Story 9:16' },
  { id: 'Reels / Short', label: 'Reel / Short' },
  { id: 'Video', label: 'Video Largo' },
  { id: 'Promoción', label: 'Promoción' },
  { id: 'Producto', label: 'Producto' },
  { id: 'Anuncio', label: 'Anuncio' }
]

const initialAccounts = [
  { id: 'instagram', name: 'Instagram', handle: '@mitiendacrecio', active: true, connected: true, color: '#e1306c' },
  { id: 'tiktok', name: 'TikTok', handle: '@mitiendacrecio', active: true, connected: true, color: '#000000' },
  { id: 'facebook', name: 'Facebook', handle: 'MiTiendaCrecio', active: true, connected: true, color: '#1877f2' },
  { id: 'youtube', name: 'YouTube', handle: 'Sin conectar', active: false, connected: false, color: '#ff0000' },
  { id: 'whatsapp', name: 'WhatsApp Status', handle: 'Mi Tienda', active: false, connected: true, color: '#25d366' }
]

export default function MarketingPage() {
  const [activeMainTab, setActiveMainTab] = useState('crear')
  const [business, setBusiness] = useState(null)

  const [tipo, setTipo] = useState(templates[0])
  const [tono, setTono] = useState(tones[0])
  const [contentType, setContentType] = useState('Publicación')
  const [prompt, setPrompt] = useState('')
  const [content, setContent] = useState('')
  const [guionVideo, setGuionVideo] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [accounts, setAccounts] = useState(initialAccounts)

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

  const loadPosts = async () => {
    try {
      const scheduled = await getPublicacionesMarketing('programado')
      const published = await getPublicacionesMarketing('publicado')
      if (Array.isArray(scheduled)) {
        setScheduledPosts(scheduled.map(p => ({
          id: p.pk_id,
          image: p.media_url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80',
          platforms: p.plataformas || ['Instagram', 'Facebook'],
          text: p.caption,
          date: p.fecha_programada || new Date().toISOString()
        })))
      }
      if (Array.isArray(published)) {
        setPublishedPosts(published.map(p => ({
          id: p.pk_id,
          image: p.media_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
          platforms: p.plataformas || ['Instagram', 'Facebook'],
          text: p.caption,
          date: p.fecha_publicada || new Date().toISOString(),
          likes: p.likes || 12,
          comments: p.comments || 3,
          shares: p.shares || 5
        })))
      }
    } catch (err) {}
  }

  useEffect(() => {
    getResumen()
      .then((result) => setBusiness(result.negocio))
      .catch(() => {})
    loadPosts()
  }, [])

  const handleConnectAccount = async (accountData) => {
    try {
      await conectarRedSocial(accountData)
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === accountData.plataforma) {
            return {
              ...acc,
              handle: accountData.handle,
              connected: true,
              active: true
            }
          }
          return acc
        })
      )
    } catch (err) {
      console.error(err)
    }
  }

  const toggleAccount = (id) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id && acc.connected) return { ...acc, active: !acc.active }
        return acc
      })
    )
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) setUploadedImage(URL.createObjectURL(file))
  }

  const generateImageIa = async () => {
    setLoadingImage(true)
    try {
      const res = await generarImagenProducto({ prompt: prompt || 'Publicación destacada de tienda', mode: 'studio' })
      if (res.imageUrl) setUploadedImage(res.imageUrl)
    } catch (err) {
      alert('No se pudo generar la imagen IA. Se utilizará la plantilla por defecto.')
    } finally {
      setLoadingImage(false)
    }
  }


  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await generarMarketing({
        tipo,
        tono,
        prompt: prompt || 'Crea una oferta atractiva para mi tienda',
        contentType
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

  const activeAccountsList = accounts.filter((a) => a.active)

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
        platforms: activeAccountsList.map((a) => a.name),
        publishMode,
        scheduleDate,
        scheduleTime
      }

      if (publishMode === 'ahora') {
        const res = await publicarDirectoMarketing(payload)
        const newPost = {
          id: res.pk_id || Date.now(),
          image: uploadedImage || res.media_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
          platforms: activeAccountsList.map((a) => a.name),
          text: content,
          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
          likes: 0,
          comments: 0,
          shares: 0
        }
        setPublishedPosts([newPost, ...publishedPosts])
        alert('🚀 ¡Publicación enviada exitosamente a la API de Meta y publicada en tus redes sociales!')
        setActiveMainTab('publicadas')
      } else {
        const res = await guardarPublicacionMarketing(payload)
        const newPost = {
          id: res.pk_id || Date.now(),
          image: uploadedImage || res.media_url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80',
          platforms: activeAccountsList.map((a) => a.name),
          text: content,
          date: `${scheduleDate || '2026-05-05'} ${scheduleTime || '12:00'}`
        }
        setScheduledPosts([newPost, ...scheduledPosts])
        alert('📅 ¡Publicación programada correctamente en la base de datos!')
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
            handleImageUpload={handleImageUpload}
            generateImageIa={generateImageIa}
            loadingImage={loadingImage}
            tones={tones}
            tono={tono}
            setTono={setTono}
            contentType={contentType}
            loading={loading}
            error={error}
            generate={generate}
            accounts={accounts}
            activeAccountsList={activeAccountsList}
            toggleAccount={toggleAccount}
            onConnectAccount={handleConnectAccount}
            business={business}
          />


          <MarketingPreviewCol
            contentTypes={contentTypes}
            contentType={contentType}
            setContentType={setContentType}
            business={business}
            uploadedImage={uploadedImage}
            content={content}
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

