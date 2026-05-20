

const User = require("../models/user.js");
module.exports.renderSignUPForm = (req, res) => {
    res.render("Users/signup.ejs");
}
module.exports.singnUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let registereduser = await User.register(newUser, password);
        // console.log("registereduser", registereduser);
        req.login(registereduser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wandarlust...!")
            res.redirect("/listing")
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.login = async (req, res) => {
    req.flash("success", "You are loged in successfully....!");
    console.log(res.locals.redirectUr);
    let redirectUrl = res.locals.redirectUrl || "/listing";
    // console.log("route : ",req.user);
    // res.locals.currUser =req.user;
    res.redirect(redirectUrl);
}

module.exports.renderLoginForm = (req, res) => {
    res.render("Users/login.ejs");
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            // req.flash("error", "Error in logOut ,Please try Again !");
            return next(err);
        }
        req.flash("success", "Successfully logOut ....!");
        res.redirect("/listing");
    })

}