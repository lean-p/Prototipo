const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DimFecha = sequelize.define('DimFecha', {
    idFecha: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    dia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'dimFecha',
    timestamps: false
  });
  return DimFecha;
};