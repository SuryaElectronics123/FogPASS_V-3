const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '.temp\\database.sqlite'
});

module.exports = sequelize;