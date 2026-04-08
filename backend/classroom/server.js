const express = require("express");
const app = express();
const users =require("./routes/user");
const posts =require("./routes/post");

app.use("/users",users);
app.use("/posts",posts);

app.get("/", (req, res) => {
    res.send("THis is root route");
})

app.listen(3000, () => {
    console.log("Server is running ....");
});


