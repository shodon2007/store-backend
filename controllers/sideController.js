const db = require("../db");

class brandController {
    async getFilter(req, res) {
        const { type } = req.params;
        const data = await db.createSideFilter(type);
        res.send(data);
    }
}

module.exports = new brandController();
