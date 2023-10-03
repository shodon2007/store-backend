const Router = require("express");
const router = Router();
const sideController = require("../controllers/sideController");

router.get("/:type", sideController.getFilter);

module.exports = router;
