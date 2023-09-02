const { getBrandFromDB } = require("../db");

class brandController {
    async getBrand(req, res) {
        const { type } = req.params;
        const data = await getBrandFromDB(type);
        console.log(data);
        res.send(data);
    }
}

module.exports = new brandController();