const Router = require('express');
const router = Router();
const catalogController = require('../controllers/catalogController');

router.get('/', catalogController.getCatalog);

module.exports = router;