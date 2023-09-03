const { registrationUser, getUser } = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

function generateAccessToken(id, role) {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload, 'shodon2007', { expiresIn: '24h' })
}

class authController {
    async login(req, res) {
        const { login, password } = req.query;
        const user = await getUser(login);

        if (!user) {
            return res.status(400).json({ message: 'Такой пользователь не найден =(' })
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Неверный пароль' })
        }
        const token = generateAccessToken(user.id, user.role);
        res.status(200).json({ message: 'Пользователь успешно зашел', token, user: login });
    }
    async registration(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.errors[0].msg })
        }

        const { login, password } = req.body;
        if (!password) return res.status(400).json({ message: "ХЗ какая ошибка" });
        if (!login) return res.status(400).json({ message: "ХЗ какая ошибка" });
        const user = await getUser(login);
        if (user) {
            return res.status(400).json({ message: "Такой пользователь уже существует, попробуйте войти" });
        }
        const hashPassword = bcrypt.hashSync(password, 6)

        await registrationUser(login, hashPassword);
        const newUser = getUser(login);
        const token = generateAccessToken(newUser.id, newUser.role);
        console.log(token);
        res.status(200).json({ message: 'Пользователь успешно зарегестрирован', token, user: login });
    }
}


module.exports = new authController();