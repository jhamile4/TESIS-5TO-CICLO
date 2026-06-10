const express = require('express')
const router  = express.Router()

router.use('/auth',     require('./authRoutes'))
router.use('/negocios', require('./businessRoutes'))
router.use('/negocios/:id/resenas', require('./resenaRoutes'))
router.use('/negocios/:id/galeria', require('./galeriaRoutes'))
router.use('/productos', require('./productRoutes'))
router.use('/pedidos',   require('./orderRoutes'))
router.use('/stripe',    require('./stripeRoutes'))
router.use('/perfil',    require('./perfilRoutes'))
router.use('/plan',      require('./planRoutes'))
router.use('/chat',      require('./chatRoutes'))
router.use('/cuenta',    require('./cuentaRoutes'))

module.exports = router
