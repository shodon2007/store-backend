const { getProductsFromDB, getProductFromDB } = require("../db")


class productsController {
    async getProducts(req, res) {
        const { type } = req.params;
        const data = await getProductsFromDB(type);
        res.json(data);
    }
    async getProduct(req, res) {
        const { id } = req.params;
        const data = await getProductFromDB(id);
        res.json(data);
    }
}

module.exports = new productsController();