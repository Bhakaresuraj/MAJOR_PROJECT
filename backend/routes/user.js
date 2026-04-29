const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");


router.get("/signup", (req, res) => {
    res.render("Users/signup.ejs");
})
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let registereduser = await User.register(newUser, password);
        console.log("registereduser", registereduser);
        req.flash("listingSuccess", "User Registered Successfully...!")
        res.redirect("/listing")
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}))


router.get("/login",(req,res)=>{
    res.render("Users/login.ejs");
})
router.post("/login", passport.authenticate('local',
    {
        failureRedirect: '/login',
        failureFlash: true
    }
), async (req, res) => {
    req.flash("listingSuccess", "You are loged in successfully....!");
    res.redirect("/listing");
});
module.exports = router;