const mongoose = require("mongoose");
const newData = require("./data.js");
let Listing = require("../models/listing.js")
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

const initDB = async () => {

    await Listing.deleteMany({});
    newData.data = newData.data.map((obj) => ({ ...obj,owner: "6a05b88b46a5edeb2414a18e" }))
    await Listing.insertMany(newData.data);
    console.log("Data is initilize");
}
initDB();


