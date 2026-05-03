const express = require("express");
const app = express();
const mongoose = require("mongoose");

// requiring modules routes ....
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter =require("./routes/user.js");

//  requiring wrapAsync function-------------
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// listingSchema for schema validation 
// const { listingSchema, reviewSchema } = require("./Schema.js");
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
const flash = require("connect-flash");
// requiring passport for authentication.....(2d)
const passport = require("passport");
const LocalStrategy = require("passport-local");
// checking for loged in or not ..........
const isLogedIn=require("./middleware.js");

// Adding sessions to the project ........
const sessions = require("express-session");
const User = require("./models/user.js");
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

// using sessions middleware ...
app.use(sessions(sessiosOpt));
// using flash middleware
app.use(flash());

// initilize passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.listingSuccess = req.flash("listingSuccess");
    res.locals.error = req.flash("error");
    next();
})

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "suraj@gmail.com",
        username: "DeltaStudent"
    });
    let registeredUser = await User.register(fakeUser, "bhakare");
    console.log("registeredUser :", registeredUser);
    res.send(registeredUser);
})

//  main page routes 
app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/",userRouter);


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
});

//  listing the request.........
let port = 8080;
app.listen(port, () => {
    console.log("Server is runninng");
});


