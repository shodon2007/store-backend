const Router = require("express");
const multer = require("multer");
const db = require("../db");
const router = Router();

const storage = multer.diskStorage({
    destination: "./static",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

router.post("/addDevice", upload.single("image"), async (req, res) => {
    console.log("start helloworld");
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(req.body);
    const data = await db.addDevice(`/${req.file.originalname}`, req.body);
    console.log(data);

    return res.status(200).json({ message: "File uploaded successfully" });
});
router.get("/remove", (req, res) => {});

module.exports = router;
