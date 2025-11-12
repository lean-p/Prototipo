const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DimVendedor = sequelize.define('DimVendedor', {
    idVendedor: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    vendedor: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'dimVendedor',
    timestamps: false
  });
  return DimVendedor;
};