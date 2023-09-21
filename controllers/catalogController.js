const db = require("../db")

class catalogController {
    async getCatalog(req, res) {
        const data = await db.getCatalog();
        res.json(data)
    }
}

module.exports = new catalogController();