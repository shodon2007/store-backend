const Router = require('express');
const router = Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

router.get('/login', authController.login);
router.post('/registration', [
    check('login', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть от 6 символов").isLength({ min: 6 })

], authController.registration)

module.exports = router;