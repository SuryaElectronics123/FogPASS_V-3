const { default: mongoose, Schema } = require("mongoose");

const dbConnection = require('.');

const User = mongoose.model('User', new Schema({
    userName: String,
    password: String,
    role: String
}));

module.exports = User;