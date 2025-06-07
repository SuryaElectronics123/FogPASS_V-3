const { DataTypes, Model } = require('sequelize');
const sequelize = require('.');
const Zones = require('./zone');
const Divisions = require('./division');
class User extends Model { }

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    },
    scope: {
        type: DataTypes.STRING
    },
    zoneId: {
        type: DataTypes.STRING,
        references: { model: Zones, key: 'id' }
    },
    divisionId: {
        type: DataTypes.STRING,
        references: { model: Divisions, key: 'id' }
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    }
}, {
    sequelize,
    modelName: 'User'
});
User.hasOne(Zones, { foreignKey: 'id', sourceKey: 'zoneId' });
Divisions.hasOne(User, { foreignKey: 'divisionId', sourceKey: 'id' });
Zones.belongsTo(User, { foreignKey: 'id', targetKey: 'zoneId' });
User.belongsTo(Divisions, { foreignKey: 'divisionId', targetKey: 'id' });

module.exports = User;