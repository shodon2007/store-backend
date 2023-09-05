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

async function getProductsFromDB(type, brand) {
    const [data] = await conn.promise().query(`
    SELECT device.*, brand.name AS 'brand'
    FROM device
    INNER JOIN type ON device.type_id = type.id
    INNER JOIN brand ON device.brand_id = brand.id
    WHERE type.name = ? ${brand !== 'all' ? 'AND brand.name = ?' : ''}`, [type, brand]);
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

async function getBrandFromDB(type) {
    console.log(type);
    const [data] = await conn.promise().query(`
    SELECT DISTINCT brand.*
    FROM device
    INNER JOIN type ON device.type_id = type.id
    INNER JOIN brand ON device.brand_id = brand.id
    ${type !== 'all' ? 'WHERE type.name = ?' : ''}`, [type]);
    return data;
}

async function checkBasketInBD(username, device_id) {
    const [data] = await conn.promise().query(`
    SELECT basket.* FROM basket INNER JOIN user ON basket.user_id = user.id
    INNER JOIN device ON basket.device_id = device.id
    WHERE user.login = ? AND basket.device_id = ?;
    `, [username, device_id]);
    return !(data.length === 0);
}

async function addBasketInDB(username, device_id) {
    const [[{ id: user_id }]] = await conn.promise().query(`
    SELECT id FROM user WHERE login = ?;
    `, [username]);
    await conn.promise().query(`
    INSERT INTO basket (user_id, device_id) VALUES (?, ?)
    `, [+user_id, +device_id]);
}

async function getBasketInBD(username) {
    const [[{ id: user_id }]] = await conn.promise().query(`
    SELECT id FROM user WHERE login = ?;
    `, [username]);
    const [data] = await conn.promise().query(`
    SELECT device.* FROM basket
    INNER JOIN user ON basket.user_id = user.id
    INNER JOIN device ON basket.device_id = device.id
    WHERE user.id = ?`, [user_id]);
    return data;
}

async function removeBasketInDB(username, device_id) {
    const [[{ id: user_id }]] = await conn.promise().query(`
    SELECT id FROM user WHERE login = ?;
    `, [username]);
    await conn.promise().query(`
    DELETE FROM basket WHERE user_id = ? AND device_id = ?
    `, [+user_id, +device_id]);
}

module.exports = {
    registrationUser,
    getUser,
    getCatalog,
    getProductsFromDB,
    getProductFromDB,
    getBrandFromDB,
    checkBasketInBD,
    addBasketInDB,
    removeBasketInDB,
    getBasketInBD
};