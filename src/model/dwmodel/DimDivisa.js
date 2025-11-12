const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DimDivisa = sequelize.define('DimDivisa', {
    idDivisa: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    divisa: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'dimDivisa',
    timestamps: false
  });
  return DimDivisa;
};