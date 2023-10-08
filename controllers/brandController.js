const db = require("../db");

class brandController {
    async getBrand(req, res) {
        const { type } = req.params;
        console.log("получено brand");
        const data = await db.getBrand(type);
        res.send(data);
    }
}

module.exports = new brandController();
