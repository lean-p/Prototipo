const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DimUbicacion = sequelize.define('DimUbicacion', {
    idUbicacion: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true 
    },
    region: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'dimUbicacion',
    timestamps: false
  });
  return DimUbicacion;
};