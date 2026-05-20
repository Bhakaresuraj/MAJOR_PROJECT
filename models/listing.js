const mongoose = require("mongoose");
const Review = require("./reviews");
const User = require("./user");
//  requiring wrapAsync function-------------
const wrapAsync = require("../utils/wrapAsync");
const Schema = mongoose.Schema;
let listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    img: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing.reviews.length) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
