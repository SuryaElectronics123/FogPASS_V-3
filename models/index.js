const { default: mongoose } = require("mongoose");
const { ConnectionConfiguration } = require('tedious');

// mongoose.connect('mongodb://localhost:27017').then((res) => {
//     module.exports = res;
// }, (err) => {

// });


const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
    dialect: 'mssql',
    host:'190.92.174.111',
    dialectOptions: {
        server: '190.92.174.111',
        authentication: {
            type: 'default',
            options: {
                userName: 'skandaso_fogpass',
                password: 'fogpass@123',
                serverName:'190.92.174.111',
                database:'skandaso_fogpass'
            
            }
        }
    }
});

module.exports = sequelize;
