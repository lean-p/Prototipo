const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DimPosicionArancelaria = sequelize.define('DimPosicionArancelaria', {
    idPosicionArancelaria: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    posicionArancelaria: {
      type: DataTypes.STRING(100),
      allowNull: true // Asumiendo que puede ser null
    }
  }, {
    tableName: 'dimPosicionArancelaria',
    timestamps: false
  });
  return DimPosicionArancelaria;
};