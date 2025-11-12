const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DimEstado = sequelize.define('DimEstado', {
    idEstado: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    estado: { // Considera renombrar a nombreEstado
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'dimEstado',
    timestamps: false
  });
  return DimEstado;
};