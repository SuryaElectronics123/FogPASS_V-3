const { default: mongoose } = require("mongoose");
const { ConnectionConfiguration } = require('tedious');

// mongoose.connect('mongodb://localhost:27017').then((res) => {
//     module.exports = res;
// }, (err) => {

// });


const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
    dialect: 'mssql',
    host:'103.83.81.80',
    dialectOptions: {
        server: '103.83.81.80',
        authentication: {
            type: 'default',
            options: {
                userName: 'skandaso_fogpass',
                password: 'fogpass@123',
                serverName:'103.83.81.80',
                database:'skandaso_fogpass'
            
            }
        }
    }
});

module.exports = sequelize;
