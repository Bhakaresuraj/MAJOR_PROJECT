const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(() => {
    console.log("Database connected successfully ........!");
}).catch((err) => {
    console.log("Error in database connecting :", err);
});
const Listing = require("./models/listing.js")
let port = 8080;
app.listen(port, () => {
    console.log("Server is runninng");
});

//  root route
app.get("/", (req, res) => {
    res.send("working");
});



// listing model index route
app.get("/listing", async (req, res) => {
    let allListings = await Listing.find();
    // console.log(result);
    res.render("listing/index.ejs", { allListings });

});

// view route

app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(list);
    res.render("listing/show.ejs", { listing });
});

// create new listing 

app.get("listing/new", (req, res) => {
    res.render("new.ejs");
});