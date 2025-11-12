const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DimDespacho = sequelize.define('DimDespacho', {
    idDespacho: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    despacho: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'dimDespacho',
    timestamps: false
  });
  return DimDespacho;
};