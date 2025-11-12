const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EtlMetadata = sequelize.define('EtlMetadata', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombreProceso: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    ultimaEjecucionExitosa: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'etlMetadata',
    timestamps: false
  });

  return EtlMetadata;
};