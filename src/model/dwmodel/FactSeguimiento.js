const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FactSeguimiento = sequelize.define('FactSeguimiento', {
    idSeguimiento: { // Cambiado para evitar confusión con el ID original
      type: DataTypes.BIGINT,
      primaryKey: true
    },
    // Claves foráneas (se definen mejor en asociaciones)
    // userID: DataTypes.BIGINT,
    // idTransportista_FK: DataTypes.BIGINT, // OJO con el nombre inconsistente
    // idDetalle: DataTypes.BIGINT,
    // idEstado: DataTypes.BIGINT,
    // idUbicacion: DataTypes.BIGINT,
    // idFecha: DataTypes.BIGINT,
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
    // Métricas
    // Ejemplo:
    // diasTransito: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // }
  }, {
    tableName: 'fact_Seguimiento',
    timestamps: true // Puede ser útil saber cuándo se cargó/actualizó el hecho
  });

  // Define las asociaciones de FactSeguimiento aquí o en index.js
  FactSeguimiento.associate = (models) => {
    FactSeguimiento.belongsTo(models.DimUsuario, { foreignKey: 'userID', as: 'usuario' });
    FactSeguimiento.belongsTo(models.DimTransportista, { foreignKey: 'idTransportista', as: 'transportista' }); // OJO: FK name mismatch
    FactSeguimiento.belongsTo(models.DimDetalle, { foreignKey: 'idDetalle', as: 'detalle' });
    FactSeguimiento.belongsTo(models.DimEstado, { foreignKey: 'idEstado', as: 'estado' });
    FactSeguimiento.belongsTo(models.DimUbicacion, { foreignKey: 'idUbicacion', as: 'ubicacion' });
    FactSeguimiento.belongsTo(models.DimUbicacion, { foreignKey: 'idOrigen', as: 'origen' });
    FactSeguimiento.belongsTo(models.DimFecha, { foreignKey: 'idFecha', as: 'fecha' }); // OJO: FK type mismatch DATETIME vs BIGINT
    FactSeguimiento.belongsTo(models.DimFecha, { foreignKey: 'idFechaInicial', as: 'fechaInicial' });
  };

  return FactSeguimiento;
};