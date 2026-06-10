require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const routes       = require('./src/routes/index')
const errorHandler = require('./src/middleware/errorHandler')

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api', routes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'API CRECIO funcionando' })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
