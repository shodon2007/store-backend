const mysql = require("mysql2");

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "shodon2007",
    database: "onlineStore",
});

conn.connect();

conn.query(
    'UPDATE FROM attribute SET title = "Операвиная память" where id = 1'
);

class DatabaseController {
    async getUser(login) {
        const [[user]] = await conn
            .promise()
            .query("SELECT * FROM user WHERE login = ?", [login]);
        return user;
    }

    async registration(login, password) {
        conn.query(
            `INSERT INTO user (login, password, role) VALUES (?, ?, "user")`,
            [login, password]
        );
    }

    async getCatalog() {
        const [data] = await conn.promise().query(`SELECT * FROM type`);
        return data;
    }

    async getProducts(type, brand, form) {
        let filter = [];
        for (let i in form) {
            let res = [];
            form[i].forEach((item) => {
                res.push(
                    `attribute.title = '${i}' and attribute.description = '${item}'`
                );
            });
            res = res.join(" OR ");
            filter.push(`${res}`);
        }

        filter = filter.join(" AND ");

        const [data] = await conn.promise().query(
            `
        SELECT DISTINCT device.*, brand.name AS 'brand'
        FROM device
        INNER JOIN type ON device.type_id = type.id
        INNER JOIN brand ON device.brand_id = brand.id
        INNER JOIN attribute ON attribute.device_id = device.id
        WHERE type.name = ? 
        ${filter ? `AND ${filter}` : ""}
        GROUP BY device.id`,
            [type]
        );

        return data;
    }

    async getProduct(id) {
        const [attributes] = await conn.promise().query(
            `
        SELECT * FROM attribute WHERE device_id = ?
        `,
            [id]
        );
        const [product] = await conn.promise().query(
            `
        SELECT * FROM device
        WHERE id = ?
        `,
            [id]
        );
        product.attributes = attributes;
        return { ...product[0], attributes };
    }

    async getBrand(type) {
        const [data] = await conn.promise().query(
            `
        SELECT DISTINCT brand.*
        FROM device
        INNER JOIN type ON device.type_id = type.id
        INNER JOIN brand ON device.brand_id = brand.id
        ${type !== "all" ? "WHERE type.name = ?" : ""}`,
            [type]
        );
        return data;
    }

    async checkBasket(login, device_id) {
        const [data] = await conn.promise().query(
            `
        SELECT basket.* FROM basket INNER JOIN user ON basket.user_id = user.id
        INNER JOIN device ON basket.device_id = device.id
        WHERE user.login = ? AND basket.device_id = ?;
        `,
            [login, device_id]
        );
        return !(data.length === 0);
    }

    async addBasket(login, device_id) {
        const [[{ id: user_id }]] = await conn.promise().query(
            `
        SELECT id FROM user WHERE login = ?;
        `,
            [login]
        );
        await conn.promise().query(
            `
        INSERT INTO basket (user_id, device_id) VALUES (?, ?)
        `,
            [+user_id, +device_id]
        );
    }

    async getBasket(login) {
        const [[{ id: user_id }]] = await conn.promise().query(
            `
        SELECT id FROM user WHERE login = ?;
        `,
            [login]
        );
        const [data] = await conn.promise().query(
            `
        SELECT device.*, type.name AS 'type' FROM basket
        INNER JOIN user ON basket.user_id = user.id
        INNER JOIN device ON basket.device_id = device.id
        INNER JOIN type ON device.type_id = type.id
        WHERE user.id = ?`,
            [user_id]
        );
        return data;
    }

    async removeBasket(login, device_id) {
        const [[{ id: user_id }]] = await conn.promise().query(
            `
        SELECT id FROM user WHERE login = ?;
        `,
            [login]
        );
        await conn.promise().query(
            `
        DELETE FROM basket WHERE user_id = ? AND device_id = ?
        `,
            [+user_id, +device_id]
        );
    }

    async createSideFilter(type) {
        const [res] = await conn.promise().query(
            `SELECT attribute.* FROM attribute 
                INNER JOIN device ON attribute.device_id = device.id
                INNER JOIN type ON device.type_id = type.id
                WHERE type.name = ?`,
            [type]
        );
        return res;
    }
}

module.exports = new DatabaseController();
