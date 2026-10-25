/**
 * Publicación real en redes sociales mediante la Graph API oficial de Meta:
 * 1. Facebook: publicaciones en la Página del negocio (no en perfiles personales)
 * 2. Instagram: fotos, historias y reels en cuentas profesionales (Business o Creator)
 *    vinculadas a esa Página
 *
 * Utiliza fetch nativo de Node.js (cero dependencias externas).
 */

const GRAPH = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION || 'v23.0'}`

const esVideo = (url = '') => /\.(mp4|mov)(\?|$)/i.test(url)

async function graphPost(path, body) {
  const res = await fetch(`${GRAPH}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error?.message || `Error de Meta (${res.status})`)
  return data
}

async function graphGet(path, params) {
  const res = await fetch(`${GRAPH}/${path}?${new URLSearchParams(params)}`)
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error?.message || `Error de Meta (${res.status})`)
  return data
}

// Instagram procesa la imagen o el video antes de poder publicarlo
async function esperarContenedor(creationId, accessToken, intentos = 20) {
  for (let i = 0; i < intentos; i++) {
    const { status_code: estado } = await graphGet(creationId, { fields: 'status_code', access_token: accessToken })
    if (estado === 'FINISHED') return
    if (estado === 'ERROR' || estado === 'EXPIRED') throw new Error('Instagram no pudo procesar el archivo')
    await new Promise((r) => setTimeout(r, 3000))
  }
  throw new Error('Instagram tardó demasiado en procesar el archivo; inténtalo de nuevo')
}

/**
 * Publica en la cuenta profesional de Instagram.
 * formato: 'feed' (foto), 'story' (historia) o 'reel' (video)
 */
async function publishToInstagram({ igUserId, accessToken, mediaUrl, caption, formato = 'feed' }) {
  if (!mediaUrl) throw new Error('Instagram exige una imagen o un video para publicar')

  const contenedor = { access_token: accessToken }
  if (formato === 'story') {
    contenedor.media_type = 'STORIES'
    contenedor[esVideo(mediaUrl) ? 'video_url' : 'image_url'] = mediaUrl
  } else if (esVideo(mediaUrl)) {
    contenedor.media_type = 'REELS'
    contenedor.video_url = mediaUrl
    contenedor.caption = caption
  } else {
    contenedor.image_url = mediaUrl
    contenedor.caption = caption
  }

  const { id: creationId } = await graphPost(`${igUserId}/media`, contenedor)
  await esperarContenedor(creationId, accessToken)
  const { id: postId } = await graphPost(`${igUserId}/media_publish`, { creation_id: creationId, access_token: accessToken })

  // El enlace real lo da Meta (el id de la publicación no es el código de la URL)
  const { permalink } = await graphGet(postId, { fields: 'permalink', access_token: accessToken }).catch(() => ({}))
  return { plataforma: 'instagram', postId, url: permalink || null }
}

/**
 * Publica en la Página de Facebook del negocio (con foto si la hay)
 */
async function publishToFacebookPage({ pageId, pageAccessToken, message, mediaUrl }) {
  let data
  if (mediaUrl && esVideo(mediaUrl)) {
    data = await graphPost(`${pageId}/videos`, { file_url: mediaUrl, description: message, access_token: pageAccessToken })
  } else if (mediaUrl) {
    data = await graphPost(`${pageId}/photos`, { url: mediaUrl, caption: message, access_token: pageAccessToken })
  } else {
    data = await graphPost(`${pageId}/feed`, { message, access_token: pageAccessToken })
  }
  const postId = data.post_id || data.id
  return { plataforma: 'facebook', postId, url: `https://www.facebook.com/${postId}` }
}

/**
 * Publica en las redes elegidas y devuelve qué salió bien y qué falló en cada una.
 * cuentas: [{ plataforma, cuentaId, accessToken }] con token real de Meta
 */
async function publishToNetworks({ caption, mediaUrl, contentType, cuentas }) {
  const formato = contentType === 'Story' ? 'story' : 'feed'
  const resultados = []
  const errores = []

  for (const cuenta of cuentas) {
    try {
      if (cuenta.plataforma === 'instagram') {
        resultados.push(await publishToInstagram({
          igUserId: cuenta.cuentaId, accessToken: cuenta.accessToken, mediaUrl, caption, formato,
        }))
      } else if (cuenta.plataforma === 'facebook') {
        resultados.push(await publishToFacebookPage({
          pageId: cuenta.cuentaId, pageAccessToken: cuenta.accessToken, message: caption, mediaUrl,
        }))
      }
    } catch (err) {
      errores.push({ plataforma: cuenta.plataforma, error: err.message })
    }
  }

  return { resultados, errores }
}

/**
 * Genera la URL de inicio de sesión de Meta para vincular Instagram y Facebook
 */
function getMetaAuthUrl(redirectUri, state) {
  const appId = process.env.META_APP_ID
  if (!appId) throw new Error('META_APP_ID no configurado en .env')

  const scopes = [
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
    'business_management',
    'instagram_basic',
    'instagram_content_publish'
  ].join(',')

  // Las apps de tipo "Negocios" usan Facebook Login for Business: los permisos se eligen en una
  // "configuración" del panel de Meta y se envía su ID (META_CONFIG_ID) en lugar de la lista de scopes
  const permisos = process.env.META_CONFIG_ID
    ? `config_id=${encodeURIComponent(process.env.META_CONFIG_ID)}`
    : `scope=${scopes}`

  return `https://www.facebook.com/${process.env.META_GRAPH_VERSION || 'v23.0'}/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&${permisos}&response_type=code${state ? `&state=${encodeURIComponent(state)}` : ''}`
}

/**
 * Intercambia el código de autorización por un Access Token de larga duración (60 días)
 */
async function exchangeMetaCode({ code, redirectUri }) {
  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  if (!appId || !appSecret) throw new Error('Credenciales de Meta incompletas en .env')

  // 1. Obtener Token de corta duración
  const shortData = await graphGet('oauth/access_token', {
    client_id: appId, redirect_uri: redirectUri, client_secret: appSecret, code,
  })

  // 2. Canjear por Token de larga duración (60 días); los tokens de Página que se
  //    obtienen con él no vencen mientras el usuario no cambie su contraseña o permisos
  const longData = await graphGet('oauth/access_token', {
    grant_type: 'fb_exchange_token', client_id: appId, client_secret: appSecret, fb_exchange_token: shortData.access_token,
  }).catch(() => ({}))

  return longData.access_token || shortData.access_token
}

/**
 * Cambia un token de usuario de corta duración (por ejemplo, del Graph API Explorer, ~1 h)
 * por uno de 60 días. Así los tokens de Página que se obtienen con él no vencen.
 */
async function extendUserToken(userAccessToken) {
  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  if (!appId || !appSecret) return userAccessToken

  const longData = await graphGet('oauth/access_token', {
    grant_type: 'fb_exchange_token', client_id: appId, client_secret: appSecret, fb_exchange_token: userAccessToken,
  }).catch(() => ({}))
  return longData.access_token || userAccessToken
}

/**
 * Obtiene las Páginas de Facebook y las cuentas vinculadas de Instagram Business del usuario
 */
async function fetchMetaAccounts(userAccessToken) {
  const data = await graphGet('me/accounts', {
    fields: 'id,name,access_token,instagram_business_account{id,username,name}',
    access_token: userAccessToken,
  })

  const pages = data.data || []
  if (pages.length === 0) {
    throw new Error('Tu cuenta de Facebook no administra ninguna Página. Crea una Página para tu negocio (no sirve un perfil personal) y vuelve a conectar.')
  }

  const accounts = []
  pages.forEach(page => {
    // Cuenta de Facebook Page
    accounts.push({
      plataforma: 'facebook',
      cuentaIdExterna: page.id,
      nombreCuenta: page.name,
      handle: page.name,
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
  publishToInstagram,
  publishToFacebookPage,
  publishToNetworks,
  getMetaAuthUrl,
  exchangeMetaCode,
  extendUserToken,
  fetchMetaAccounts
}
