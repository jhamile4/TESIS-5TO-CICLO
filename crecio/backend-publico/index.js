require('dotenv').config();
const express = require('express');
const cors    = require('cors');

// Importación de rutas por módulo
const authRoutes     = require('./src/routes/authRoutes');
const businessRoutes = require('./src/routes/businessRoutes');
const productRoutes  = require('./src/routes/productRoutes');
const orderRoutes    = require('./src/routes/orderRoutes');

const app  = express();
const PORT = process.env.PORT || 3001;

// Permite peticiones desde el frontend (React en localhost:5173)
app.use(cors());

// Permite leer el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Registro de rutas con su prefijo base
app.use('/api/auth',      authRoutes);
app.use('/api/negocios',  businessRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/pedidos',   orderRoutes);

// Ruta de verificación rápida
app.get('/', (req, res) => {
  res.json({ mensaje: 'API CRECIO funcionando correctamente' });
});

// Inicia el servidor en el puerto definido en .env o en 3001 por defecto
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
