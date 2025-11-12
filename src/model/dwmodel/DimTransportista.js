const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DimTransportista = sequelize.define('DimTransportista', {
    idTransportista: {
      type: DataTypes.BIGINT,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nombre del Courier (ej. FedEx, DHL)'
    }
  }, {
    tableName: 'dimTransportista', // Nombre exacto de la tabla
    timestamps: false // Común en DW no usar createdAt/updatedAt
  });
  return DimTransportista;
};