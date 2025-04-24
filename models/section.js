const { DataTypes } = require('sequelize');

const sequelize = require('.');
const Sections = sequelize.define('Sections', {
    // Model attributes are defined here
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    divisionId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    signals: {
        type: DataTypes.TEXT,
        get: function () {
            return JSON.parse(this.getDataValue("signals") ? this.getDataValue("signals") : "[]");
        },
        set: function (value) {
            return this.setDataValue("signals", JSON.stringify(value ? value : '[]'));
        }
    }
}, {
    // Other model options go here
});

Sections.sync();

module.exports = Sections;