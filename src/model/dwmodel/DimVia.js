const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DimVia = sequelize.define('DimVia', {
    idVia: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    via: { // Considera renombrar a nombreVia
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'dimVia',
    timestamps: false
  });
  return DimVia;
};