const Router = require('express');
const db = require('../db.js');
const controller = require('../controller/controller.js');

const router = new Router();

router.get('/type', controller.getType)
router.get('/product', controller.getProducts)

module.exports = router;