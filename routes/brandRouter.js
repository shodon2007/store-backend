const Router = require("express");
const router = Router();
const brandController = require("../controllers/brandController");

router.get("/:type", brandController.getBrand);
router.get("/", brandController.getBrand);

module.exports = router;
