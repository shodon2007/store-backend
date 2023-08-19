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
        SELECT product.name, product.id, product.price, brand.name AS "brand", type.name_ru AS "type_name" FROM product 
        INNER JOIN type ON product.type_id = type.id
        INNER JOIN brand ON product.brand_id = brand.id
        WHERE type.name = "${type}"`;
        const data = await queryDatabase(query);
        res.json(data);
    }
    async getSettings(req, res) {
        const { type, settings } = req.query;
        const query = `
        SELECT product.name, product.id, product.price, brand.name  AS "brand", type.name_ru AS "type_name" FROM product 
        INNER JOIN type ON product.type_id = type.id
        INNER JOIN brand ON product.brand_id = brand.id
        WHERE type.name = "${type}" 
        AND product.price >= "${settings.price.min}" 
        AND product.price <= "${settings.price.max}"
        ${settings.brand !== 'all' ? `AND brand.name = "${settings.brand}"` : ''};`;
        const data = await queryDatabase(query);
        res.json(data);
    }
    async getProduct(req, res) {
        const { id } = req.query;
        const query = `SELECT * FROM product_info WHERE product_id = "${id}";`;
        const data = await queryDatabase(query);
        res.json(data);
    }
}

module.exports = new Controller();