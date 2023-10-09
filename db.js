const mysql = require("mysql2");
const generateFilterQuery = require("./filter");

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "shodon2007",
    database: "onlineStore",
});

conn.connect();

async function sendQuery(query, ...params) {
    try {
        const [res] = await conn.promise().query(query, params);
        return res;
    } catch (e) {
        console.error(e);
        throw Error;
    }
}

class DatabaseController {
    async getUser(login) {
        const [user] = await sendQuery(
            "SELECT * FROM user WHERE login = ?",
            login
        );

        return user;
    }

    async registration(login, password) {
        sendQuery(
            `INSERT INTO user (login, password, role) VALUES (?, ?, "user")`,
            login,
            password
        );
    }

    async getCatalog() {
        return await sendQuery(`SELECT * FROM type`);
    }

    async getProducts(type, form) {
        const sqlQuery = generateFilterQuery(form, type);
        return await sendQuery(sqlQuery);
    }

    async getProduct(id) {
        const attributes = await sendQuery(
            `SELECT * FROM attribute WHERE device_id = ?`,
            id
        );
        const product = await sendQuery(
            `SELECT * FROM device
            WHERE id = ?`,
            id
        );
        product.attributes = attributes;
        return { ...product[0], attributes };
    }

    async getBrand(type) {
        const checkType = type !== "all" ? `WHERE type.name = "${type}"` : "";
        let data = await sendQuery(
            `SELECT DISTINCT brand.name
            FROM device
            INNER JOIN type ON device.type_id = type.id
            INNER JOIN brand ON device.brand_id = brand.id
            ${checkType}`
        );
        data = data.map((item) => item.name);
        return data;
    }

    async checkBasket(login, device_id) {
        const data = await sendQuery(
            `
        SELECT basket.* FROM basket INNER JOIN user ON basket.user_id = user.id
        INNER JOIN device ON basket.device_id = device.id
        WHERE user.login = ? AND basket.device_id = ?;
        `,
            login,
            device_id
        );
        return !(data.length === 0);
    }

    async addBasket(login, device_id) {
        const [{ id: user_id }] = await sendQuery(
            `
        SELECT id FROM user WHERE login = ?;
        `,
            login
        );
        await sendQuery(
            `INSERT INTO basket (user_id, device_id)
            VALUES (?, ?)`,
            +user_id,
            +device_id
        );
    }

    async getBasket(login) {
        const [{ id: user_id }] = await sendQuery(
            `SELECT id FROM user WHERE login = ?`,
            login
        );
        return await sendQuery(
            `
        SELECT device.*, type.name AS 'type' FROM basket
        INNER JOIN user ON basket.user_id = user.id
        INNER JOIN device ON basket.device_id = device.id
        INNER JOIN type ON device.type_id = type.id
        WHERE user.id = ?`,
            user_id
        );
    }

    async removeBasket(login, device_id) {
        const [{ id: user_id }] = await sendQuery(
            `SELECT id FROM user WHERE login = ?`,
            login
        );
        await sendQuery(
            `DELETE FROM basket WHERE user_id = ? AND device_id = ?`,
            +user_id,
            +device_id
        );
    }

    async createSideFilter(type) {
        return await sendQuery(
            `SELECT attribute.* FROM attribute 
            INNER JOIN device ON attribute.device_id = device.id
            INNER JOIN type ON device.type_id = type.id
            WHERE type.name = ?`,
            type
        );
    }
}

module.exports = new DatabaseController();
