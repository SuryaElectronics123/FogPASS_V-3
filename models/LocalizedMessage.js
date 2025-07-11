const { DataTypes, Model } = require('sequelize');
const sequelize = require('./index');
class LocalizedMessage extends Model { }

LocalizedMessage.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.TEXT, // supports long-form content
            allowNull: false,
        },
        language: {
            type: DataTypes.STRING(5), // e.g., 'en', 'hi', 'te'
            allowNull: false,
            defaultValue: 'en',
        },
    },
    {
        sequelize,
        modelName: 'LocalizedMessage',
        tableName: 'LocalizedMessages',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['key', 'language'],
            },
        ],
    }
);
LocalizedMessage.sync();

module.exports = LocalizedMessage;