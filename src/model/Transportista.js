const { DataTypes } = require('sequelize');

//const sequelize = require('../config/db.config');

module.exports = (sequelize) => {

    const Transportista = sequelize.define('Transportista', {
    
        idTransportista: {
            type: DataTypes.BIGINT, // Coincide con BIGINT en MySQL
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        codigo: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    }, {
    // Opciones del modelo:
    tableName: 'Transportista',
    timestamps: false,
    freezeTableName: true
    });

    Transportista.associate = function(models) {
        Transportista.hasMany(models.Seguimiento, {
            foreignKey: 'idTransportista_FK', // La clave foránea que está en la tabla Seguimiento
            as: 'seguimientos'
            }
        );
    };

    return Transportista;
};

//module.exports = Transportista;
