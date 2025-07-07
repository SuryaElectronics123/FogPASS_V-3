const { DataTypes, Model } = require('sequelize');
const sequelize = require('./index'); // Ensure this exports the Sequelize instance
const Sections = require('./section'); // Ensure this exports the initialized Sections model

class Cautions extends Model {}

Cautions.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    fromKMNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toKMNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Sections', // This should match the table name, not the model variable
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Cautions',
    tableName: 'Cautions',
    timestamps: false,
  }
);

// Define associations
Cautions.belongsTo(Sections, { foreignKey: 'sectionId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Sections.hasMany(Cautions, { foreignKey: 'sectionId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Sync the model
Cautions.sync();

module.exports = Cautions;
