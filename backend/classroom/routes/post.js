//  post routes
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("THis is index route for post");
})
router.get("/:id", (req, res) => {
    res.send("THis is show route for post");
})
router.post("/", (req, res) => {
    res.send("THis is post route for post");
})
router.delete("/:id", (req, res) => {
    res.send("THis is delete route for post");
})


module.exports = router;