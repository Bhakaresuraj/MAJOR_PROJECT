const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const Review = require("./models/reviews.js");
// requiring modules....
const listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");
//  requiring wrapAsync function-------------
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// listingSchema for schema validation 
const { listingSchema, reviewSchema } = require("./Schema.js");
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


// using flash for messages ......



// Adding sessions to the project ........
const sessions = require("express-session");
const sessiosOpt = {
    secret: "Mysecretecode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
app.use(sessions(sessiosOpt));

// database connection
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(() => {
    console.log("Database connected successfully ........!");
}).catch((err) => {
    console.log("Error in database connecting :", err);
});



//  root route
app.get("/", (req, res) => {
    res.send("working");
});

const flash = require("connect-flash");
app.use(flash());

app.use((req, res, next) => {
    res.locals.listingSuccess = req.flash("listingSuccess");
    res.locals.error = req.flash("error");
    next();
})
//  main page routes 
app.use("/listing", listing);
app.use("/listing/:id/reviews", reviews);


// for route not found error--------
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// custom error handler
app.use((err, req, res, next) => {
    console.log(err);
    let { statusCode = 500, message = "Something went wrong......" } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
})




//  listing the request.........
let port = 8080;
app.listen(port, () => {
    console.log("Server is runninng");
});


