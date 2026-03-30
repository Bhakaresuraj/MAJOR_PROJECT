const express = require("express");
const app = express();
const mongoose = require("mongoose");
let Listing = require("./models/listing.js") 
// connecting database
let Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(Mongo_Url);
}
main().then(() => {
    console.log("Connected to database....");
}).catch((err) => {
    console.log("Database connecting Error :", err);
});




let port = 8080;
app.listen(port, () => {
    console.log("Server is runninng");
});

//  root route
app.get("/", (req, res) => {
    res.send("working");
});

// listing model route

app.get("/listing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My Home",
        description: "Villege town ...",
        img: " https://thumbs.dreamstime.com/b/yosemite-sunset-panorama-7657094.jpg?w=1400",
        price: "18",
        location: "A/P Malwadi ,Shirur ,Pune",
        country: "India"
    });

    await sampleListing.save();
    console.log("sample was saved");
    res.send("Listing successfull......!");


})
