const db = require("../db");

class productsController {
    async getProducts(req, res) {
        const { form } = req.query;
        const { type } = req.params;
        console.log(form);

        const data = await db.getProducts(type, form);
        res.json(data);
    }
    async getProduct(req, res) {
        const { id } = req.params;
        const data = await db.getProduct(id);
        res.json(data);
    }
}

module.exports = new productsController();
