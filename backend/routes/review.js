const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")
const Review = require("../models/reviews.js")

const { listingSchema, reviewSchema } = require("../Schema.js");


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(errMsg)
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
// Reviews ... 
// post route for rivew 
router.post("/", validateReview, wrapAsync(async (req, res) => {
    // console.log(req.body.review);

    let listing = await Listing.findById(req.params.id);

    // console.log(listing);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log("new rivew saved");
    req.flash("listingSuccess", "New Review Added Successfully ...!");

    res.redirect(`/listing/${listing._id}`);


}));

// delete route for rivew 
router.delete("/:reviewid", wrapAsync(async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("listingSuccess", " Review Deleted Successfully ...!");

    res.redirect(`/listing/${id}`);

}));



module.exports = router;