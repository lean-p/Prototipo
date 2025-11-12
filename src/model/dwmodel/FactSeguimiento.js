const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FactSeguimiento = sequelize.define('FactSeguimiento', {
    idSeguimiento: {
      type: DataTypes.BIGINT,
      primaryKey: true
    },
    nro_tracking: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Número de tracking principal del courier (nro_transporte)'
    },
    descripcion: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Referencia interna/Descripción del cliente'
    },
  }, {
    tableName: 'fact_Seguimiento',
    timestamps: true
  });

  FactSeguimiento.associate = (models) => {
    FactSeguimiento.belongsTo(models.DimUsuario, { foreignKey: 'userID', as: 'usuario' });
    FactSeguimiento.belongsTo(models.DimTransportista, { foreignKey: 'idTransportista', as: 'transportista' });
    FactSeguimiento.belongsTo(models.DimDetalle, { foreignKey: 'idDetalle', as: 'detalle' });
    FactSeguimiento.belongsTo(models.DimEstado, { foreignKey: 'idEstado', as: 'estado' });
    FactSeguimiento.belongsTo(models.DimUbicacion, { foreignKey: 'idUbicacion', as: 'ubicacion' });
    FactSeguimiento.belongsTo(models.DimUbicacion, { foreignKey: 'idOrigen', as: 'origen' });
    FactSeguimiento.belongsTo(models.DimFecha, { foreignKey: 'idFecha', as: 'fecha' });
    FactSeguimiento.belongsTo(models.DimFecha, { foreignKey: 'idFechaInicial', as: 'fechaInicial' });
  };

  return FactSeguimiento;
};