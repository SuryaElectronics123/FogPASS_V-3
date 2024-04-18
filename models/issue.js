// const { default: mongoose, Schema, SchemaType } = require("mongoose");

// let IssuesSchema = new Schema({
//     issueType: Schema.Types.String,
//     description: Schema.Types.String,
//     raisedBy: Schema.Types.ObjectId,
//     status: Schema.Types.String,
//     createdTime: Schema.Types.Date,
//     lastUpdatedTime: Schema.Types.Date,
//     adminDescription: Schema.Types.String
// });

// const Issues = mongoose.model('Issue', IssuesSchema);

// module.exports = Issues;


const { DataTypes } = require('sequelize');

const sequelize = require('.');
const Issues = sequelize.define('Issue', {
    // Model attributes are defined here
    issueType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    raisedBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adminDescription: {
        type: DataTypes.STRING,
        allowNull: true
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    }
}, {
    // Other model options go here
});

Issues.sync();

module.exports = Issues;