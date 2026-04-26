
const express = require("express");
const app = express();
const path = require("path");
const flash = require("connect-flash")
// const path =require("path");
app.set("views", path.join(__dirname, "/views"));

// app.use(path.join(__dirname))
const session = require('express-session')
const sessionOpt = {
    secret: "mysupersecreatestring",
    resave: false,
    saveUninitialized: true
}

app.use(session(sessionOpt))
app.use(flash());

// Session in the express 
// app.get("/session", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }

//     res.send(`request count is ${req.session.count}`);
// })

app.use((req, res, next) => {
    res.locals.succmessage = req.flash("success");
    res.locals.errmessage = req.flash("error");
    next();
});


app.get("/register", (req, res) => {
    let { name = "anonynous" } = req.query;
    req.session.name = name;
    // console.log(req.session);
    if (name !== "anonynous") {
        req.flash("success", `New user added....!`);
    } else {
        req.flash("error", ` user Not  added....!`);
    }
    res.redirect("/home");
})

app.get("/home", (req, res) => {
    // console.log(req.session.name);
    // console.log(req.flash("Info"));
    //  once you access the flash msg it will automatically gets deleted from flash so you will not access it second time .

    res.render("page.ejs", { name: req.session.name });

})


// const users = require("./routes/user");
// const posts = require("./routes/post");
// const cookies = require("./routes/cookies");
// const cookieParser = require("cookie-parser");
// app.use(cookieParser("secretcode"));

// app.use("/users", users);
// app.use("/posts", posts);
// app.use("/cookies", cookies);

// // Cookies and signed cookies 

// app.get("/", (req, res) => {
//     let { name = "Dipak" } = req.cookies;
//     let { greet } = req.signedCookies;
//     console.log(greet);
//     res.send(`Hey ${name} , ${greet} !`);

// })

app.listen(3000, () => {
    let cwd = path.join(__dirname, "");
    console.log(cwd);
    console.log("Server is running on 3000 ..... ....");
});


