const { DataTypes } = require('sequelize');

const sequelize = require('.');
const Zones = sequelize.define('Zones', {
    // Model attributes are defined here
    name: {
        type: DataTypes.STRING,
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

Zones.sync();

module.exports = Zones;