module.exports.isLogedIn = (req, res, next) => {
    console.log(req.path);
    console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "To Add listing you need to Ligin ...!");
        return res.redirect("/login");
    }
    next();
}
module.exports.redirectUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    console.log("middleware :", res.locals.redirectUrl); 
    next();
}