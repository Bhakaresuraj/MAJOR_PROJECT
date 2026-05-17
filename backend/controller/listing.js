const Listing = require("../models/listing.js")

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    // console.log(result);
    res.render("listing/index.ejs", { allListings });
}

module.exports.renderNewListing = (req, res) => {
    res.render("listing/new.ejs");
}

module.exports.addNewListing = async (req, res) => {

    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.img.url = req.file.path;
    newlisting.img.filename = req.file.filename;
    newlisting.save();
    console.log("Listing Successful :", newlisting);
    req.flash("success", "New Listing Added Successfully ...!");
    res.redirect("/listing");
}

module.exports.showAllListings = async (req, res) => {
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
}

module.exports.renderUpdateForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("owner");
    // console.log(listing);
    if (!listing) {
        req.flash("error", "The listing you request does not exists");
        res.redirect("/listing");
    } else {
        res.render("listing/edit.ejs", { listing });
    }

}

module.exports.updateListing = async (req, res) => {
    let list = req.body;
    list.listing = { ...list.listing, owner: res.locals.currUser }
    let { id } = req.params;
    let result = await Listing.findOneAndUpdate({ _id: id }, list.listing, { returnDocument: 'after' }); 
    if (typeof req.file !== 'undefined') {
        url = req.file.path;
        filename = req.file.filename;
        result.img = { url, filename };
        await result.save();
    }
    let route = `/listing/${id}`;
    req.flash("success", " Listing Updated Successfully ...!");
    res.redirect(route);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted Successfully ...!");

    res.redirect("/listing");
}