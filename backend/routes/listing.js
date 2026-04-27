const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")
//  requiring wrapAsync function-------------
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// listingSchema for schema validation 
const { listingSchema} = require("../Schema.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// listing model index route
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    // console.log(result);
    res.render("listing/index.ejs", { allListings });

}));

// create new listing 

router.get("/new", (req, res) => {
    res.render("listing/new.ejs");
});
router.post("/", validateListing, wrapAsync(async (req, res, next) => {

    // console.log(req.body.listing);
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Please Send Valid data ...!");
    // }

    let listing = req.body.listing;
    let result = await Listing.insertOne(listing);
    // console.log("Listing Successful :", result);
    res.redirect("/listing");
}));



// view route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    // console.log(list);
    res.render("listing/show.ejs", { listing });
}));


// Update route........
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
}));
router.patch("/:id", validateListing, wrapAsync(async (req, res) => {
    let list = req.body;
    let { id } = req.params;
    let result = await Listing.findOneAndReplace({ _id: id }, list.listing, { returnDocument: 'after' });
    console.log("Successfully edited  :", result);
    let route = `/listing/${id}`;
    res.redirect(route);
}));

// Destroy route.....

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));




module.exports = router;