const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shodon2007',
    database: 'onlineStore',
});

conn.connect();

async function getUser(login) {
    const [[user]] = await conn.promise().query('SELECT * FROM user WHERE login = ?', [login]);
    return user;
}

async function registrationUser(login, password) {
    conn.query(`INSERT INTO user (login, password, role) VALUES (?, ?, "user")`, [login, password]);
}

async function getCatalog() {
    const [data] = await conn.promise().query(`SELECT * FROM type`);
    return data;
}

async function getProductsFromDB(type) {
    const [data] = await conn.promise().query(`
    SELECT device.*, brand.name AS 'brand'
    FROM device
    INNER JOIN type ON device.type_id = type.id
    INNER JOIN brand ON device.brand_id = brand.id
    WHERE type.name = ?`, [type]);
    return data;
}

async function getProductFromDB(id) {
    const [attributes] = await conn.promise().query(`
    SELECT * FROM attribute WHERE device_id = ?
    `, [id]);
    const [product] = await conn.promise().query(`
    SELECT * FROM device WHERE id = ?
    `, [id]);
    product.attributes = attributes;
    return { ...product[0], attributes };
}

module.exports = { registrationUser, getUser, getCatalog, getProductsFromDB, getProductFromDB };