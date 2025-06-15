

const { Model, DataTypes } = require('sequelize');
const sequelize = require('.');
const Trip = require('./trips');

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

TripSignalDetails.afterCreate(async (tripSignalDetail) => {
    const trip = await Trip.findByPk(tripSignalDetail.tripId);
    trip.increment('crossedSignals');
    if (trip.crossedSignals == 1) {
        trip.update({ status: 'IN_PROGRESS' });
    }
});

TripSignalDetails.sync();

module.exports = TripSignalDetails;
