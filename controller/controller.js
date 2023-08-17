const db = require('../db.js');

async function queryDatabase(query) {
    const resp = new Promise((res, rej) => {
        db.query(query, (err, result) => {
            res(result);
        })
    });

    return resp;
}

class Controller {
    async getType(req, res) {
        const query = 'SELECT * FROM type';
        const data = await queryDatabase(query);
        res.json(data);
    }
    async getProducts(req, res) {
        const { type } = req.query;
        const query = `
        SELECT product.name, product.price, brand.name AS "brand"FROM product 
        INNER JOIN type ON product.type_id = type.id
        INNER JOIN brand ON product.brand_id = brand.id
        WHERE type.name = "${type}"`;
        const data = await queryDatabase(query);
        res.json(data);
    }
    async getBrand(req, res) {
        const { type } = req.query;
        const query = `
        SELECT DISTINCT brand.id, brand.name from brand 
        INNER JOIN product ON brand.id = product.brand_id
        INNER JOIN type ON product.type_id = type.id
        WHERE type.name = "${type}"`;
        const data = await queryDatabase(query);
        res.json(data);
    }
}

module.exports = new Controller();