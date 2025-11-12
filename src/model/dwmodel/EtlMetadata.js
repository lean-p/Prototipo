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
      allowNull: false // UNIQUE constraint implies NOT NULL in most DBs, but good to be explicit
    },
    ultimaEjecucionExitosa: {
      type: DataTypes.DATE, // Sequelize maps DATETIME to DATE
      allowNull: true // Default is true, explicit here for clarity
    }
  }, {
    tableName: 'etlMetadata', // Nombre exacto de la tabla
    timestamps: false // No necesitamos createdAt/updatedAt para esta tabla
  });

  return EtlMetadata;
};