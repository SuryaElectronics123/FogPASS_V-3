// const { default: mongoose, Schema } = require("mongoose");

// const dbConnection = require('.');

// const User = mongoose.model('User', new Schema({
//     userName: String,
//     password: String,
//     role: String
// }));

// module.exports = User;

const { DataTypes } = require('sequelize');

const sequelize = require('.');
const User = sequelize.define('User', {
    // Model attributes are defined here
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
    role: {
        type: DataTypes.STRING
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    }
}, {
    // Other model options go here
});

User.sync();

module.exports = User;