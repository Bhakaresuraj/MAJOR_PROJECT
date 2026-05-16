const express = require("express");
const router = express.Router({mergeParams: true });
const Listing = require("../models/listing.js")
//  requiring wrapAsync function-------------
const wrapAsync = require("../utils/wrapAsync.js");

const { isLogedIn, isOwner, validateListing } = require("../middleware.js");
// listing model index route
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    // console.log(result);
    res.render("listing/index.ejs", { allListings });
}));

// create new listing 
router.get("/new", isLogedIn, (req, res) => {
    res.render("listing/new.ejs");
});
router.post("/", validateListing, wrapAsync(async (req, res) => {
    // console.log(req.body.listing);
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Please Send Valid data ...!");
    // }
    let listing = req.body.listing;
    listing.owner = req.user._id;
    let result = await Listing.insertOne(listing);
    // console.log("Listing Successful :", result);
    req.flash("success", "New Listing Added Successfully ...!");
    res.redirect("/listing");
}));

// view route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log("req.user in view route:",req.user);
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "owner"
        }
    }).populate("owner");
    // console.log("listing view route :", listing);
    if (!listing) {
        req.flash("error", "The listing you request does not exists");
        res.redirect("/listing");
    } else {
        res.render("listing/show.ejs", { listing });
    }
}));

// Update route........
router.get("/:id/edit", isLogedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("owner");
    // console.log(listing);
    if (!listing) {
        req.flash("error", "The listing you request does not exists");
        res.redirect("/listing");
    } else {
        res.render("listing/edit.ejs", { listing });
    }

}));
router.patch("/:id", validateListing, wrapAsync(async (req, res) => {
    let list = req.body;
    // console.log("forupdating",res.locals.currUser);
    list.listing = { ...list.listing, owner: res.locals.currUser }
    // console.log("Update list :", list)
    let { id } = req.params;
    let result = await Listing.findOneAndReplace({ _id: id }, list.listing, { returnDocument: 'after' });
    // console.log("Successfully edited  :", result);
    let route = `/listing/${id}`;
    req.flash("success", " Listing Updated Successfully ...!");
    res.redirect(route);
}));

// Destroy route.....

router.delete("/:id", isLogedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted Successfully ...!");

    res.redirect("/listing");
}));

module.exports = router;