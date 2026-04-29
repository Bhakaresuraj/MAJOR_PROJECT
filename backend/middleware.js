module.exports.isLogedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "To Add listing you need to Ligin ...!");
        return res.redirect("/login");
    }
    next();
}