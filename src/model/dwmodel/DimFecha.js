const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DimFecha = sequelize.define('DimFecha', {
    idFecha: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
      // Considera usar la fecha como PK si es única por día:
      // type: DataTypes.DATEONLY, primaryKey: true
    },
    fecha: { // Considera renombrar a fechaCompleta o similar
      type: DataTypes.DATEONLY, // O DATEONLY si no necesitas la hora
      allowNull: true // Asumiendo que puede ser null si usas idFecha como PK
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
    // Añade más atributos aquí: nombreMes, diaSemana, etc.
  }, {
    tableName: 'dimFecha',
    timestamps: false
  });
  return DimFecha;
};