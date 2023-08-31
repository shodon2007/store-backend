const Router = require('express');
const router = Router();
const basketController = require('../controllers/basketController');

router.get('/checkAdd', basketController.addedInBasket);

module.exports = router;