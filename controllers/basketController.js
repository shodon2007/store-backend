const db = require('../db');

class basketController {
    async add(req, res) {
        const { user, device_id } = req.query;
        await db.addBasket(user, device_id);
        res.json(true);
    }
    async remove(req, res) {
        const { user, device_id } = req.query;
        await db.removeBasket(user, device_id);
        res.json(true);
    }
    async get(req, res) {
        const { user } = req.query;
        const data = await db.getBasket(user);
        res.json(data);
    }
    async check(req, res) {
        const { user, device_id } = req.query;
        if (!user) {
            return res.json(false);
        }
        const addedInBasket = await db.checkBasket(user, device_id)
        res.json(addedInBasket);
    }
}

module.exports = new basketController();