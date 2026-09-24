import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import { generarMarketing, getResumen } from '../services/apiAdmin'

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
  { id: 'Story', label: 'Story' },
  { id: 'Video', label: 'Video' },
  { id: 'Reels / Short', label: 'Reels / Short' },
  { id: 'Promoción', label: 'Promoción' },
  { id: 'Producto', label: 'Producto' },
  { id: 'Colección', label: 'Colección' },
  { id: 'Anuncio', label: 'Anuncio' }
]

const initialAccounts = [
  { id: 'instagram', name: 'Instagram', handle: '@mitiendacrecio', active: true, connected: true, color: '#e1306c' },
  { id: 'tiktok', name: 'TikTok', handle: '@mitiendacrecio', active: false, connected: true, color: '#000000' },
  { id: 'facebook', name: 'Facebook', handle: 'MiTiendaCrecio', active: true, connected: true, color: '#1877f2' },
  { id: 'youtube', name: 'YouTube', handle: 'Sin conectar', active: false, connected: false, color: '#ff0000' },
  { id: 'twitter', name: 'X / Twitter', handle: 'Sin conectar', active: false, connected: false, color: '#1da1f2' },
  { id: 'whatsapp', name: 'WhatsApp Status', handle: 'Mi Tienda', active: false, connected: true, color: '#25d366' }
]

const defaultScheduled = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80',
    platforms: ['Instagram', 'Facebook'],
    text: '¡Nueva colección de verano ya disponible! ☀️ Descubre los mejores looks para esta temporada con un 20% OFF. #verano #moda #descuento',
    date: '2026-05-03 09:00'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    platforms: ['TikTok', 'Instagram'],
    text: 'Tutorial rápido: 3 formas de usar nuestra mochila urbana 🎒 ¿Cuál es tu favorita? Comenta abajo 👇 #tutorial #mochila #tips',
    date: '2026-05-03 18:00'
  }
]

const defaultPublished = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    platforms: ['Instagram', 'Facebook', 'TikTok'],
    text: '🔥 ¡Oferta flash! Solo por hoy: 15% OFF en todo el catálogo. No dejes pasar esta oportunidad. Link en bio 👆',
    date: '2026-05-01 10:30',
    likes: 342,
    comments: 28,
    shares: 56
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&auto=format&fit=crop&q=80',
    platforms: ['Instagram', 'WhatsApp Status'],
    text: 'Detrás de cámaras: Así preparamos cada pedido con cariño 💚 Calidad y dedicación en cada detalle.',
    date: '2026-04-30 14:00',
    likes: 198,
    comments: 15,
    shares: 12
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    platforms: ['Facebook'],
    text: '¿Sabías que nuestros productos son 100% eco-friendly? 🌿 Cuidamos el planeta mientras cuidamos tu estilo.',
    date: '2026-04-28 11:00',
    likes: 267,
    comments: 42,
    shares: 73
  }
]

export default function MarketingPage() {
  const [activeMainTab, setActiveMainTab] = useState('crear')
  const [business, setBusiness] = useState(null)

  const [tipo, setTipo] = useState(templates[0])
  const [tono, setTono] = useState(tones[0])
  const [contentType, setContentType] = useState('Promoción')
  const [prompt, setPrompt] = useState('')
  const [content, setContent] = useState('')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [accounts, setAccounts] = useState(initialAccounts)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const [publishMode, setPublishMode] = useState('ahora')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')

  const [scheduledPosts, setScheduledPosts] = useState(defaultScheduled)
  const [publishedPosts, setPublishedPosts] = useState(defaultPublished)

  useEffect(() => {
    getResumen()
      .then((result) => setBusiness(result.negocio))
      .catch(() => {})
  }, [])

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

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await generarMarketing({ tipo, tono, prompt: prompt || 'Publicación atractiva para mi tienda' })
      setContent(result.contenido)
    } catch (err) {
      setError(err.message || 'Error al generar contenido')
      setContent(
        contentType === 'Video'
          ? `📹 Mira cómo nuestro producto transforma tu día a día. ¡Dale play! Guión generado por IA. #video #viral`
          : `🎉 ¡OFERTA ESPECIAL! 20% OFF en todos nuestros productos. ¡Compra ahora! #Descuento #Venta #negocio #emprendimiento #calidad`
      )
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

  const handlePublishOrSchedule = () => {
    if (!content) return
    if (publishMode === 'ahora') {
      const newPost = {
        id: Date.now(),
        image: uploadedImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
        platforms: activeAccountsList.map((a) => a.name),
        text: content,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        likes: 0,
        comments: 0,
        shares: 0
      }
      setPublishedPosts([newPost, ...publishedPosts])
      alert('¡Publicación realizada con éxito en tus redes sociales conectadas!')
      setActiveMainTab('publicadas')
    } else {
      const newPost = {
        id: Date.now(),
        image: uploadedImage || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80',
        platforms: activeAccountsList.map((a) => a.name),
        text: content,
        date: `${scheduleDate || '2026-05-05'} ${scheduleTime || '12:00'}`
      }
      setScheduledPosts([newPost, ...scheduledPosts])
      alert('¡Publicación programada correctamente!')
      setActiveMainTab('programadas')
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
          />

          <MarketingPreviewCol
            contentTypes={contentTypes}
            contentType={contentType}
            setContentType={setContentType}
            business={business}
            uploadedImage={uploadedImage}
            content={content}
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
