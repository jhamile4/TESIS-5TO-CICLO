const express    = require('express');
const router     = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta protegida: registra un nuevo pedido por WhatsApp (requiere token)
router.post('/', verifyToken, createOrder);

// Ruta protegida: devuelve el historial de pedidos del cliente autenticado (requiere token)
router.get('/my', verifyToken, getMyOrders);

module.exports = router;
