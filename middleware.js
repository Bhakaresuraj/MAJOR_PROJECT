const Listing = require("./models/listing.js")
const Review = require("./models/reviews.js")
const ExpressError = require("./utils/ExpressError.js");
// listingSchema for schema validation 
const { listingSchema, reviewSchema } = require("./Schema.js");

module.exports.isLogedIn = (req,res,next) => {
    // console.log(req.path);
    // console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        // console.log(req.method)
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", `To ${req.method} you need to Ligin ...!`);
        return res.redirect("/login");
    }
    next();
}
module.exports.redirectUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl; 
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("owner");
    // console.log(listing.owner._id);
    // console.log(res.locals.currUser._id);
    if (res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have Access to edit this listing .....! ");
        return res.redirect(`/listing/${id}`);
    }
    next()
}
module.exports.isReviewOwner = async (req, res, next) => {
    let { id ,reviewid } = req.params;
    let review = await Review.findById(reviewid).populate("owner");
    // console.log("Middleware Review", review);
    console.log(res.locals.currUser._id);
    if (res.locals.currUser && !review.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have Access to Delete  this Review .....! ");
        return res.redirect(`/listing/${id}`);
    }
    next()
}

module.exports.validateListing = async (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(errMsg)
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}