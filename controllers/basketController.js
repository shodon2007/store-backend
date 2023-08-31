class basketController {
    async addedInBasket(req, res) {
        const { device_id, user_id } = req.query;
        res.send('heelo word')
    }
}

module.exports = new basketController();