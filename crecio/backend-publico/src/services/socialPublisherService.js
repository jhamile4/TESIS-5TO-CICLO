/**
 * Servicio de Publicación Real en Redes Sociales (Meta Graph API & TikTok API)
 * Conecta el Backend de Crecio directamente con las APIs oficiales de:
 * 1. Instagram Business API (Fotos, Carruseles y Reels)
 * 2. Facebook Pages API (Publicación en Muros de Páginas)
 * 3. TikTok Content Posting API (Videos y Shorts)
 *
 * Utiliza fetch nativo de Node.js (cero dependencias externas).
 */

/**
 * Publica una imagen en la cuenta de Instagram Business del usuario
 */
async function publishToInstagramPhoto({ igUserId, accessToken, imageUrl, caption }) {
  if (!igUserId || !accessToken) {
    throw new Error('Cuenta de Instagram no vinculada. Se requiere Token y ID de Instagram Business.')
  }

  // Paso 1: Crear contenedor de imagen en Instagram Graph API
  const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken
    })
  })

  const containerData = await containerRes.json()
  if (!containerRes.ok || !containerData.id) {
    throw new Error(containerData.error?.message || 'Error al crear contenedor de imagen en Instagram API.')
  }

  const creationId = containerData.id

  // Paso 2: Publicar el contenedor en el Feed oficial de Instagram
  const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: accessToken
    })
  })

  const publishData = await publishRes.json()
  if (!publishRes.ok) {
    throw new Error(publishData.error?.message || 'Error al publicar en Instagram Feed.')
  }

  return {
    platform: 'Instagram',
    postId: publishData.id,
    url: `https://www.instagram.com/p/${publishData.id}`,
    status: 'published'
  }
}

/**
 * Publica un Reel / Video en la cuenta de Instagram Business
 */
async function publishToInstagramReel({ igUserId, accessToken, videoUrl, caption }) {
  if (!igUserId || !accessToken) {
    throw new Error('Cuenta de Instagram no vinculada para Reels.')
  }

  // Paso 1: Crear contenedor tipo REELS
  const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'REELS',
      video_url: videoUrl,
      caption: caption,
      access_token: accessToken
    })
  })

  const containerData = await containerRes.json()
  if (!containerRes.ok || !containerData.id) {
    throw new Error(containerData.error?.message || 'Error al crear contenedor de Reel.')
  }

  const creationId = containerData.id

  // Paso 2: Esperar procesamiento del video por parte de Meta
  let ready = false
  let retries = 0

  while (!ready && retries < 10) {
    await new Promise((r) => setTimeout(r, 3000))
    const statusRes = await fetch(
      `https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`
    )
    const statusData = await statusRes.json()
    if (statusData.status_code === 'FINISHED') {
      ready = true
    } else if (statusData.status_code === 'ERROR') {
      throw new Error('Meta reportó error al procesar el video del Reel.')
    }
    retries++
  }

  // Paso 3: Publicar Reel
  const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: accessToken
    })
  })

  const publishData = await publishRes.json()
  return {
    platform: 'Instagram Reels',
    postId: publishData.id,
    status: 'published'
  }
}

/**
 * Publica un Post en la Fanpage de Facebook del negocio
 */
async function publishToFacebookPage({ pageId, pageAccessToken, message, imageUrl }) {
  if (!pageId || !pageAccessToken) {
    throw new Error('Fanpage de Facebook no conectada.')
  }

  const endpoint = imageUrl
    ? `https://graph.facebook.com/v19.0/${pageId}/photos`
    : `https://graph.facebook.com/v19.0/${pageId}/feed`

  const payload = imageUrl
    ? { url: imageUrl, caption: message, access_token: pageAccessToken }
    : { message: message, access_token: pageAccessToken }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error?.message || 'Error al publicar en la Fanpage de Facebook.')
  }

  return {
    platform: 'Facebook',
    postId: data.id || data.post_id,
    status: 'published'
  }
}

/**
 * Publica un video corto en TikTok Content Posting API
 */
async function publishToTikTok({ tiktokAccessToken, videoUrl, title }) {
  if (!tiktokAccessToken) {
    throw new Error('Cuenta de TikTok no conectada.')
  }

  const res = await fetch('https://open.tiktokapis.com/v2/post/publish/content/init/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tiktokAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      post_info: {
        title: title,
        privacy_level: 'PUBLIC_TO_EVERYONE',
        disable_duet: false,
        disable_stitch: false,
        disable_comment: false
      },
      source_info: {
        source: 'PULL_FROM_URL',
        video_url: videoUrl
      }
    })
  })

  const data = await res.json()
  if (!res.ok || data.error?.code !== 'ok') {
    throw new Error(data.error?.message || 'Error al publicar en TikTok Content Posting API.')
  }

  return {
    platform: 'TikTok',
    publishId: data.data?.publish_id,
    status: 'published'
  }
}

/**
 * Función principal unificada para emitir la publicación a todas las redes conectadas
 */
async function publishToAllNetworks({
  caption,
  mediaUrl,
  contentType,
  socialTokens = {}
}) {
  const results = []
  const errors = []

  // 1. Instagram (Post o Reel)
  if (socialTokens.instagram?.igUserId && socialTokens.instagram?.accessToken) {
    try {
      let res
      if (contentType === 'Reels / Short' || contentType === 'Video') {
        res = await publishToInstagramReel({
          igUserId: socialTokens.instagram.igUserId,
          accessToken: socialTokens.instagram.accessToken,
          videoUrl: mediaUrl,
          caption
        })
      } else {
        res = await publishToInstagramPhoto({
          igUserId: socialTokens.instagram.igUserId,
          accessToken: socialTokens.instagram.accessToken,
          imageUrl: mediaUrl,
          caption
        })
      }
      results.push(res)
    } catch (err) {
      errors.push({ platform: 'Instagram', error: err.message })
    }
  }

  // 2. Facebook Page
  if (socialTokens.facebook?.pageId && socialTokens.facebook?.pageAccessToken) {
    try {
      const res = await publishToFacebookPage({
        pageId: socialTokens.facebook.pageId,
        pageAccessToken: socialTokens.facebook.pageAccessToken,
        message: caption,
        imageUrl: mediaUrl
      })
      results.push(res)
    } catch (err) {
      errors.push({ platform: 'Facebook', error: err.message })
    }
  }

  // 3. TikTok
  if (socialTokens.tiktok?.accessToken && mediaUrl) {
    try {
      const res = await publishToTikTok({
        tiktokAccessToken: socialTokens.tiktok.accessToken,
        videoUrl: mediaUrl,
        title: caption
      })
      results.push(res)
    } catch (err) {
      errors.push({ platform: 'TikTok', error: err.message })
    }
  }

  return {
    success: results.length > 0,
    results,
    errors
  }
}

/**
 * Genera la URL de inicio de sesión de Meta para vincular Instagram y Facebook
 */
function getMetaAuthUrl(redirectUri) {
  const appId = process.env.META_APP_ID
  if (!appId) throw new Error('META_APP_ID no configurado en .env')
  
  const scopes = [
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
    'instagram_basic',
    'instagram_content_publish'
  ].join(',')

  return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code`
}

/**
 * Intercambia el código de autorización por un Access Token de larga duración (60 días)
 */
async function exchangeMetaCode({ code, redirectUri }) {
  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  if (!appId || !appSecret) throw new Error('Credenciales de Meta incompletas en .env')

  // 1. Obtener Token de corta duración
  const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`
  const shortRes = await fetch(tokenUrl)
  const shortData = await shortRes.json()

  if (!shortRes.ok || !shortData.access_token) {
    throw new Error(shortData.error?.message || 'Error al obtener access_token de Meta')
  }

  // 2. Canjear por Token de larga duración (60 días)
  const longTokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortData.access_token}`
  const longRes = await fetch(longTokenUrl)
  const longData = await longRes.json()

  const finalToken = longData.access_token || shortData.access_token
  return finalToken
}

/**
 * Obtiene las Páginas de Facebook y las cuentas vinculadas de Instagram Business del usuario
 */
async function fetchMetaAccounts(userAccessToken) {
  const accountsUrl = `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name}&access_token=${userAccessToken}`
  const res = await fetch(accountsUrl)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error?.message || 'Error al obtener cuentas de Facebook e Instagram')
  }

  const pages = data.data || []
  const accounts = []

  pages.forEach(page => {
    // Cuenta de Facebook Page
    accounts.push({
      plataforma: 'facebook',
      cuentaIdExterna: page.id,
      nombreCuenta: page.name,
      handle: `facebook.com/${page.id}`,
      accessToken: page.access_token,
      estado: 'conectado'
    })

    // Cuenta de Instagram vinculada a esa Page
    if (page.instagram_business_account) {
      const ig = page.instagram_business_account
      accounts.push({
        plataforma: 'instagram',
        cuentaIdExterna: ig.id,
        nombreCuenta: ig.name || ig.username || page.name,
        handle: ig.username ? `@${ig.username}` : `@${page.name}`,
        accessToken: page.access_token, // Para Instagram Graph API se usa el Page Access Token
        estado: 'conectado'
      })
    }
  })

  return accounts
}

module.exports = {
  publishToInstagramPhoto,
  publishToInstagramReel,
  publishToFacebookPage,
  publishToTikTok,
  publishToAllNetworks,
  getMetaAuthUrl,
  exchangeMetaCode,
  fetchMetaAccounts
}

