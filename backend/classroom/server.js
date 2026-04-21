const express = require("express");
const app = express();


const session = require('express-session')

app.use(session({
    secret :"mysupersecreatestring"
}))

app.get("/test",(req,res)=>{
    res.send("test successful !"); 
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
    console.log("Server is running ....");
});


