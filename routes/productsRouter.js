const Router = require('express');
const router = Router();
const productsController = require('../controllers/productsController');

router.get('/:type', productsController.getProducts);
router.get('/:type/:id', productsController.getProduct);

module.exports = router;