const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mmongoose.Schema;
const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


const User = mongoose.model("User", userSchema);
module.exports = User; 