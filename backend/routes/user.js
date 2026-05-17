const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");

const userController = require("../controller/user.js");

// signup route......
router
    .route("/signup")
    .get(userController.renderSignUPForm)
    .post(wrapAsync(userController.singnUp));

// login Route .....
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(redirectUrl, passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true
        }
    )
        , userController.login);

router
    .route("/logout")
    .get(userController.logout)

module.exports = router;