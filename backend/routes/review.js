const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")
const Review = require("../models/reviews.js")
const { isLogedIn, validateReview, isReviewOwner } = require("../middleware.js");
// Reviews ... 


// post route for review 
router.post("/", isLogedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    // console.log(listing);
    // req.body.review={...req.body.review ,owner:res.locals.currUser}
    // console.log(req.body.review);
    let newReview = new Review(req.body.review);
    newReview.owner = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log("new rivew saved");
    req.flash("success", "New Review Added Successfully ...!");
    res.redirect(`/listing/${listing._id}`);


}));

// delete route for rivew 
router.delete("/:reviewid",isLogedIn,isReviewOwner, wrapAsync(async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", " Review Deleted Successfully ...!");
    res.redirect(`/listing/${id}`);

}));

module.exports = router;