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
        console.log(data);
        res.json(data);
    }
}

module.exports = new Controller();