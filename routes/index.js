const Router = require("express");
const router = Router();
const authRouter = require("./authRouter.js");
const catalogRouter = require("./catalogRouter.js");
const productsRouter = require("./productsRouter.js");
const basketRouter = require("./basketRouter.js");
const brandRouter = require("./brandRouter.js");
const sideRouter = require("./sideRouter.js");
const adminRouter = require("./adminRouter.js");

router.use("/auth", authRouter);
router.use("/catalog", catalogRouter);
router.use("/products", productsRouter);
router.use("/basket", basketRouter);
router.use("/brands", brandRouter);
router.use("/side", sideRouter);
router.use("/admin", adminRouter);

module.exports = router;
