const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    res.send("THis is index route");
})
router.get("/:id", (req, res) => {
    res.send("THis is show route");
})
router.post("/", (req, res) => {
    res.send("THis is post route");
})
router.delete("/:id", (req, res) => {
    res.send("THis is delete route");
})

module.exports = router;