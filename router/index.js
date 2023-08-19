const Router = require('express');
const db = require('../db.js');
const controller = require('../controller/controller.js');

const router = new Router();

router.get('/type', controller.getType)
router.get('/product', controller.getProducts)
router.get('/product_info', controller.getProduct)
router.get('/getSettings', controller.getSettings)

module.exports = router;