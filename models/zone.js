const { DataTypes, Model } = require('sequelize');

const sequelize = require('.');
class Zones extends Model { }

Zones.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    }
}, {
    sequelize,
    modelName: 'Zones'
});

Zones.sync();

module.exports = Zones;