const db = require("../db");

class productsController {
    async getProducts(req, res) {
        const { brand, form } = req.query;
        const { type } = req.params;

        const data = await db.getProducts(type, brand, form);
        res.json(data);
    }
    async getProduct(req, res) {
        const { id } = req.params;
        const data = await db.getProduct(id);
        res.json(data);
    }
}

module.exports = new productsController();
