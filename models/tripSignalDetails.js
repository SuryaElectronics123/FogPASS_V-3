

const { Model, DataTypes } = require('sequelize');
const sequelize = require('.');

class TripSignalDetails extends Model { }

TripSignalDetails.init({
    tripId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Trips', key: 'id' } // Ensures a relationship with Trips model
    },
    signalName: {
        type: DataTypes.STRING,
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
    crossWithSpeed: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    crossTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    }
}, {
    sequelize,
    modelName: 'TripSignalDetails'
});


module.exports = TripSignalDetails;
