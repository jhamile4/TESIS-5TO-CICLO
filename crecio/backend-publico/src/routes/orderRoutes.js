const express     = require('express');
const router      = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const verifyToken = require('../middleware/verifyToken');

// Ruta protegida: registra un pedido por WhatsApp (requiere token)
router.post('/', verifyToken, createOrder);

// Ruta protegida: historial de pedidos del cliente autenticado (requiere token)
router.get('/mis-pedidos', verifyToken, getMyOrders);

module.exports = router;
