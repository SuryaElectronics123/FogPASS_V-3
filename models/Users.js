const { DataTypes } = require('sequelize');

const sequelize = require('.');
const User = sequelize.define('User', {
    // Model attributes are defined here
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    password: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
    role: {
        type: DataTypes.STRING
    }
}, {
    // Other model options go here
});

User.sync({ force: true });

module.exports = User;