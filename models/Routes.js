const { default: mongoose, Schema, SchemaType } = require("mongoose");

// interface Station {
//     code: String;
//     name: String;
//     lat: Number;
//     lon: Number;
// }

let RoutesSchem = new Schema({
    trainName: String,
    trainCode: String,
    stations: []
});

const Routes = mongoose.model('Route', RoutesSchem);

module.exports = Routes;