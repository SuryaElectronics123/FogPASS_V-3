const { DataTypes } = require('sequelize');

const sequelize = require('.');
const Divisions = sequelize.define('Divisions', {
    // Model attributes are defined here
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zoneId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    }
}, {
    // Other model options go here
});

Divisions.sync();

module.exports = Divisions;