const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DimUsuario = sequelize.define('DimUsuario', {
    userID: { // Mantenemos el nombre original
      type: DataTypes.BIGINT,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true // Puede ser null según tu SQL
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'dimUsuario',
    timestamps: false
  });
  return DimUsuario;
};