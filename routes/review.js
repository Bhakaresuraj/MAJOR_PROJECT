const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const { isLogedIn, validateReview, isReviewOwner } = require("../middleware.js");
// Reviews ... 
const reviewController = require("../controller/reviews.js")

// post route for review 
router.post("/", isLogedIn, validateReview, wrapAsync(reviewController.createReview));

// delete route for rivew 
router.delete("/:reviewid", isLogedIn, isReviewOwner, wrapAsync(reviewController.destroyReview));

module.exports = router;