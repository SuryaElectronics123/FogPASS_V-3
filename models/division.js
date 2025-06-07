const { DataTypes, Model } = require('sequelize');

const sequelize = require('.');
class Divisions extends Model { }

Divisions.init({
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
    sequelize,
    modelName: 'Divisions'
});
Divisions.sync();

module.exports = Divisions;