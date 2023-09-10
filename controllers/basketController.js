const jwt = require('jsonwebtoken');
const { checkBasketInBD, addBasketInDB, removeBasketInDB, getBasketInBD } = require('../db');

class basketController {
    async add(req, res) {
        const { user, device_id } = req.query;
        await addBasketInDB(user, device_id);
        res.json(true);
    }
    async remove(req, res) {
        const { user, device_id } = req.query;
        await removeBasketInDB(user, device_id);
        res.json(true);
    }
    async get(req, res) {
        const { user } = req.query;
        const data = await getBasketInBD(user);
        res.json(data);
    }
    async check(req, res) {
        const { user, device_id } = req.query;
        if (!user) {
            return res.json(false);
        }
        const addedInBasket = await checkBasketInBD(user, device_id)
        res.json(addedInBasket);
    }
}

module.exports = new basketController();