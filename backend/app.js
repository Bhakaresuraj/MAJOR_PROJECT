const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")


// method-override package imported and used...
const methodOverride = require("method-override");
app.use(methodOverride("_method"));


// Ejs mate setup...
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// 


// ejs and views folder setup
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));

// serving static files -------------------
app.use(express.static(path.join(__dirname,"./public")));

// database connection
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(() => {
    console.log("Database connected successfully ........!");
}).catch((err) => {
    console.log("Error in database connecting :", err);
});

// 
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

// create new listing 

app.get("/listing/new", (req, res) => {
    res.render("listing/new.ejs");
});
app.post("/listing", async (req, res) => {
    // console.log(req.body);
    let { title, description, img, price, location, country } = req.body;

    let result = await Listing.insertOne({
        title: title,
        description: description,
        img: img,
        price: price,
        location: location,
        country: country
    });
    console.log("Listing Successful :", result);
    res.redirect("/listing");

});

// view route

app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(list);
    res.render("listing/show.ejs", { listing });
});


// Update route........
app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
});
app.patch("/listing/:id", async (req, res) => {
    let list = req.body;
    let { id } = req.params;
    await Listing.findOneAndReplace({ _id: id }, list.listing, { returnDocument: 'after' })
        .then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log("Listing updation error :", err);
        })
    let route = `/listing/${id}`;
    res.redirect(route);
});

// Destroy route.....

app.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then((result) => {
        console.log("Deleted Listing : ", result);
    }).catch((err) => {
        console.log("Error while deleting listing : ", err);
    })
    res.redirect("/listing");
});


