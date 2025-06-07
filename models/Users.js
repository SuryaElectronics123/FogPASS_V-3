const { DataTypes } = require('sequelize');
const sequelize = require('.');
const User = sequelize.define('User', {
    // Model attributes are defined here
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
    role: {
        type: DataTypes.STRING
    },
    scope: {
        type: DataTypes.STRING
    },
    zoneId: {
        type: DataTypes.STRING,
        references: {
            model: 'Zones',
            key: 'id'
        }
    },
    divisionId: {
        type: DataTypes.STRING,
        references: {
            model: 'Divisions',
            key: 'id'
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
User.sync();

module.exports = User;