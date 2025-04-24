// const { default: mongoose, Schema, SchemaType } = require("mongoose");

// // interface Station {
// //     code: String;
// //     name: String;
// //     lat: Number;
// //     lon: Number;
// // }

// let RoutesSchem = new Schema({
//     trainName: String,
//     trainCode: String,
//     stations: []
// });

// const Routes = mongoose.model('Route', RoutesSchem);

// module.exports = Routes;


const { DataTypes } = require('sequelize');

const sequelize = require('.');

const Station = sequelize.define('Station', {
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lat: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    lon: {
        type: DataTypes.NUMBER,
        allowNull: false
    }
}, {

})
const Routes = sequelize.define('Routes', {
    // Model attributes are defined here
    trainName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trainCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stations: {
        type: DataTypes.TEXT,
        allowNull: false,
        get: function () {
            return JSON.parse(this.getDataValue("stations") ? this.getDataValue("stations") : "[]");
        },
        set: function (value) {
            return this.setDataValue("stations", JSON.stringify(value));
        }
    }, biDirStations: {
        type: DataTypes.TEXT,
        allowNull: false,
        get: function () {
            return JSON.parse(this.getDataValue("biDirStations") ? this.getDataValue("biDirStations") : "[]");
        },
        set: function (value) {
            return this.setDataValue("biDirStations", JSON.stringify(value));
        }
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    }
}, {
    // Other model options go here
});

Routes.sync();

module.exports = Routes;