const { getCatalog } = require("../db")


class catalogController {
    async getCatalog(req, res) {
        const data = await getCatalog();
        res.json(data)
    }
}

module.exports = new catalogController();