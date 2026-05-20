const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default ;
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }

});
console.log("TYPE:", typeof passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User; 