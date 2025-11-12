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
      allowNull: true // Puede ser null según tu SQL
    },
    region: {
      type: DataTypes.STRING(100),
      allowNull: true // Puede ser null según tu SQL
    }
    // Considera añadir país, ciudad, etc.
  }, {
    tableName: 'dimUbicacion',
    timestamps: false
  });
  return DimUbicacion;
};