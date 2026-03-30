const mongoose = require("mongoose");
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
        type: String,
        default: "https://media.istockphoto.com/id/483724081/photo/yosemite-valley-landscape-and-river-california.jpg?s=612x612&w=0&k=20&c=QQ7rvq0Qbfpkug1Wbd36PGqkOntoPFKWxiE4w4tV-NE=",
        set: (v) => v === "" ? "https://media.istockphoto.com/id/483724081/photo/yosemite-valley-landscape-and-river-california.jpg?s=612x612&w=0&k=20&c=QQ7rvq0Qbfpkug1Wbd36PGqkOntoPFKWxiE4w4tV-NE=" : v
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
    }

});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
