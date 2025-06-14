const { Model, DataTypes } = require('sequelize');
const sequelize = require('.');
const TripSignalDetails = require('./tripSignalDetails');

class Trips extends Model { }

Trips.init({
    locopilot: {
        type: DataTypes.STRING,
        allowNull: false
    },
    routeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(0, 0, 0, 0, 0, 0, 0)
    }, routeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    zoneId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    divisionId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    totalSignals: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    crossedSignals: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Trips'
});
Trips.sync().then(() => {
    console.log('Trips table created successfully');
    TripSignalDetails.sync();
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
module.exports = Trips;
