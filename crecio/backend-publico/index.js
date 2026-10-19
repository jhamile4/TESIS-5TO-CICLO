require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const routes       = require('./src/routes/index')
const errorHandler = require('./src/middleware/errorHandler')
const programadas  = require('./src/jobs/publicacionesProgramadas')

const app  = express()
const PORT = process.env.PORT || 3001

// Dominios de los frontends que pueden llamar a la API, separados por comas.
// En producción: CORS_ORIGINS=https://crecio.vercel.app,https://crecio-panel.vercel.app
const origenesPermitidos = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origen) => origen.trim().replace(/\/$/, ''))
  .filter(Boolean)

app.use(cors({
  origin: origenesPermitidos,
  credentials: true,
}))
app.use(express.json({ limit: '15mb' })) // las imágenes llegan en base64 desde el panel

app.use('/api', routes)

app.post('/api/tareas/publicaciones-programadas', programadas.rutaExterna)

app.get('/', (req, res) => {
  res.json({ mensaje: 'API CRECIO funcionando' })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
  programadas.iniciar()
})
