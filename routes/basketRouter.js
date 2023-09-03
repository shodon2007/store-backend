const Router = require('express');
const router = Router();
const basketController = require('../controllers/basketController');

router.get('/add', basketController.add);
router.get('/remove', basketController.remove);
router.get('/check', basketController.check);
router.get('/get', basketController.get);

module.exports = router;