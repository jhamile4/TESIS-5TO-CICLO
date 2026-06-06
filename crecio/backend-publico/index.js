require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const businessRoutes = require('./src/routes/businessRoutes')
const productRoutes  = require('./src/routes/productRoutes')
const resenaRoutes   = require('./src/routes/resenaRoutes')
const galeriaRoutes  = require('./src/routes/galeriaRoutes')
const authRoutes     = require('./src/routes/authRoutes')
const orderRoutes    = require('./src/routes/orderRoutes')
const stripeRoutes   = require('./src/routes/stripeRoutes')
const perfilRoutes   = require('./src/routes/perfilRoutes')
const planRoutes     = require('./src/routes/planRoutes')
const chatRoutes     = require('./src/routes/chatRoutes')
const cuentaRoutes   = require('./src/routes/cuentaRoutes')

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth',     authRoutes)
app.use('/api/negocios', businessRoutes)
app.use('/api/negocios/:id/resenas', resenaRoutes)
app.use('/api/negocios/:id/galeria', galeriaRoutes)
app.use('/api/productos', productRoutes)
app.use('/api/pedidos',   orderRoutes)
app.use('/api/stripe',    stripeRoutes)
app.use('/api/perfil',    perfilRoutes)
app.use('/api/plan',      planRoutes)
app.use('/api/chat',      chatRoutes)
app.use('/api/cuenta',    cuentaRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'API CRECIO funcionando' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})