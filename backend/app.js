const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")

//  requiring wrapAsync function-------------
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");


// listingSchema for schema validation 
const { listingSchema } = require("./Schema.js");
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

// method-override package imported and used...
const methodOverride = require("method-override");
app.use(methodOverride("_method"));


// Ejs mate setup...
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// ejs and views folder setup
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));

// serving static files -------------------
app.use(express.static(path.join(__dirname, "./public")));

// database connection
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(() => {
    console.log("Database connected successfully ........!");
}).catch((err) => {
    console.log("Error in database connecting :", err);
});

//  listing the request.........
let port = 8080;
app.listen(port, () => {
    console.log("Server is runninng");
});

//  root route
app.get("/", (req, res) => {
    res.send("working");
});


// listing model index route
app.get("/listing", wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    // console.log(result);
    res.render("listing/index.ejs", { allListings });

}));

// create new listing 

app.get("/listing/new", (req, res) => {
    res.render("listing/new.ejs");
});
app.post("/listing", validateListing, wrapAsync(async (req, res, next) => {

    // console.log(req.body.listing);
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Please Send Valid data ...!");
    // }

    let listing = req.body.listing;
    let result = await Listing.insertOne(listing);
    console.log("Listing Successful :", result);
    res.redirect("/listing");
}));



// view route
app.get("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(list);
    res.render("listing/show.ejs", { listing });
}));


// Update route........
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
}));
app.patch("/listing/:id", validateListing, wrapAsync(async (req, res) => {
    let list = req.body;
    let { id } = req.params;
    let result = await Listing.findOneAndReplace({ _id: id }, list.listing, { returnDocument: 'after' });
    console.log("Successfully edited  :", result);
    let route = `/listing/${id}`;
    res.redirect(route);
}));

// Destroy route.....

app.delete("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then((result) => {
        console.log("Deleted Listing : ", result);
    }).catch((err) => {
        console.log("Error while deleting listing : ", err);
    })
    res.redirect("/listing");
}));

// for route not found error--------
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// custom error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong......" } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
})
