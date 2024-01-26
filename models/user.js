const mongoose = require("mongoose");
const config = require('config')
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {type: String, minLength: 3, maxLength: 50, required: true},
    email: {type: String,  minLength: 5, maxLength: 200, unique: true, required: true},
    password: {type: String, minLength: 5, maxLength: 1024, required: true},
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function()  {
    const token = jwt.sign( { _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
    return token;   
}

const User = mongoose.model("User", userSchema)

exports.User = User;
exports.userSchema = userSchema;