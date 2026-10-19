// Convierte "@usuario" o "instagram.com/usuario" en un enlace válido
export const REDES = {
  instagram: ['ri-instagram-line', 'Instagram', (u) => `https://instagram.com/${u}`],
  facebook:  ['ri-facebook-circle-line', 'Facebook', (u) => `https://facebook.com/${u}`],
  tiktok:    ['ri-tiktok-line', 'TikTok', (u) => `https://tiktok.com/@${u}`],
  youtube:   ['ri-youtube-line', 'YouTube', (u) => `https://youtube.com/@${u}`],
  twitter:   ['ri-twitter-x-line', 'X', (u) => `https://x.com/${u}`],
}
export const enlaceRed = (clave, valor) => {
  const v = valor.trim()
  if (/^https?:\/\//i.test(v)) return v
  if (/\.(com|pe)\//i.test(v)) return `https://${v.replace(/^\/+/, '')}`
  return REDES[clave][2](v.replace(/^@/, ''))
}

// Solo las redes que el negocio completó
export const redesConValor = (redes = {}) =>
  Object.entries(redes).filter(([clave, valor]) => REDES[clave] && typeof valor === 'string' && valor.trim())
