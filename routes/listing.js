const express = require("express");
const router = express.Router({ mergeParams: true });

// requiring multer
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });

//  requiring wrapAsync function-------------
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controller/listing.js")

const { isLogedIn, isOwner, validateListing } = require("../middleware.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(upload.single("listing[img]"), validateListing, wrapAsync(listingController.addNewListing));


router
    .route("/new")
    .get(isLogedIn, listingController.renderNewListing);


router
    .route("/:id")
    .get(wrapAsync(listingController.showAllListings))
    .patch(upload.single("listing[img]"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLogedIn, isOwner, wrapAsync(listingController.destroyListing));



router
    .route("/:id/edit")
    .get(isLogedIn, isOwner, wrapAsync(listingController.renderUpdateForm));

module.exports = router;