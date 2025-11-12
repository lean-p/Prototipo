const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DimDetalle = sequelize.define('DimDetalle', {
    idDetalle: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    // Claves foráneas (se definen mejor en asociaciones)
    // idVendedor: DataTypes.BIGINT,
    // idUbicacion: DataTypes.BIGINT,
    // idFecha: DataTypes.BIGINT,
    // idPosicionArancelaria: DataTypes.BIGINT,
    // idDivisa: DataTypes.BIGINT,
    // idVia: DataTypes.BIGINT,
    fobTotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: 'Valor Total FOB'
    },
    costoFlete: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Costo de Flete'
    },
    costoSeguro: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Costo de Seguro'
    },
    derechoDeImportacion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Impuestos/Derechos de Importación'
    },
    tasaDeEstadistica: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: true,
      comment: 'Tasa o porcentaje de estadía'
    },
    iva: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: true
    },
    ivaAdicInscr: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: true
    },
    impGanancias: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: true
    },
    arancelSIM: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: true
    },
    ingresosBrutos: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: true
    }       
  }, {
    tableName: 'dimDetalle',
    timestamps: false
  });

  // Define las asociaciones de DimDetalle aquí o en index.js
  DimDetalle.associate = (models) => {
    DimDetalle.belongsTo(models.DimVendedor, { foreignKey: 'idVendedor', as: 'vendedor' });
    DimDetalle.belongsTo(models.DimDespacho, { foreignKey: 'idDespacho', as: 'despacho' });
    DimDetalle.belongsTo(models.DimUbicacion, { foreignKey: 'idUbicacion', as: 'ubicacion' });
    DimDetalle.belongsTo(models.DimFecha, { foreignKey: 'idOficializacion', as: 'oficializacion' });
    DimDetalle.belongsTo(models.DimPosicionArancelaria, { foreignKey: 'idPosicionArancelaria', as: 'posicionArancelaria' });
    DimDetalle.belongsTo(models.DimDivisa, { foreignKey: 'idDivisa', as: 'divisa' });
    DimDetalle.belongsTo(models.DimVia, { foreignKey: 'idVia', as: 'via' });
  };

  return DimDetalle;
};