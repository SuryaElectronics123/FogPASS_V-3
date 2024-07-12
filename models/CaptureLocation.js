const { DataTypes } = require('sequelize');

const sequelize = require('.');
const CaptureLocation = sequelize.define('CaptureLocation', {
    // Model attributes are defined here
    order: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lat: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    lon: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, captureId: {
        type: DataTypes.UUID,
        allowNull: false
    },
}, {
    // Other model options go here
});

CaptureLocation.sync();

module.exports = CaptureLocation;