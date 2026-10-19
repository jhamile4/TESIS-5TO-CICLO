// Convierte una dirección en coordenadas (para el mapa de la tienda) con OpenStreetMap.
// Si no encuentra la dirección devuelve null: el mapa simplemente no se muestra.
const geocodificar = async (direccion) => {
  if (!direccion || direccion.trim().length < 4) return { latitud: null, longitud: null }
  try {
    const query = encodeURIComponent(`${direccion}, Perú`)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=pe`,
      { headers: { 'User-Agent': 'CRECIO-App/1.0' } }
    )
    const data = await res.json()
    if (data.length > 0)
      return { latitud: parseFloat(data[0].lat), longitud: parseFloat(data[0].lon) }
  } catch (err) {
    console.error('Error geocodificando:', err.message)
  }
  return { latitud: null, longitud: null }
}

module.exports = { geocodificar }
