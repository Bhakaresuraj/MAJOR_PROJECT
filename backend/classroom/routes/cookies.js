const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.cookie("name", "Suraj");
    res.cookie("greet", "Welcome", { signed: true });
    res.send("We send you some cookies...!");
});

module.exports = router;