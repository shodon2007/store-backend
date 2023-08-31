const Router = require('express');
const router = Router();
const authRouter = require('./authRouter.js');
const catalogRouter = require('./catalogRouter.js');
const productsRouter = require('./productsRouter.js');
const basketRouter = require('./basketRouter.js');

router.use('/auth', authRouter);
router.use('/catalog', catalogRouter);
router.use('/products', productsRouter);
router.use('/basket', basketRouter);

module.exports = router;