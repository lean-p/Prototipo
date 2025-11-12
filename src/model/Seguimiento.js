const { DataTypes } = require('sequelize');
//const sequelize = require('../config/db.config');
// 🚨 Este archivo debe exportar una FUNCIÓN que recibe la instancia de Sequelize 🚨
module.exports = (sequelize) => { 
    const Seguimiento = sequelize.define('Seguimiento', {
        
        idSeguimiento: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userID_FK: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        idTransportista_FK: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        idDocumento_FK: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        nro_tracking: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        estadoActual: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        ubicacionActual: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        fechaInicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        notificacionInactividadEnviada: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },  {
        tableName: 'Seguimiento',
        timestamps: true,
        freezeTableName: true
    });

    // 🚨 DEFINICIÓN DE LAS ASOCIACIONES 🚨
    Seguimiento.associate = function(models) {

        
        // 1. Relación con USUARIO (El que está fallando)
        Seguimiento.belongsTo(models.Usuario, {
            foreignKey: 'userID_FK',
            as: 'usuario'
        });
        
        // 2. Relación con TRANSPORTISTA (El otro modelo crítico)
        Seguimiento.belongsTo(models.Transportista, {
            foreignKey: 'idTransportista_FK',
            as: 'transportista'
        });
        
        // 3. Relación con DOCUMENTO
       Seguimiento.belongsTo(models.Documento, {
          foreignKey: 'idDocumento_FK',
          as: 'documento'
        });
        
        // 4. Relación con EVENTO
        Seguimiento.hasMany(models.Evento, {
            foreignKey: 'idSeguimiento_FK', 
            as: 'eventos'
        });
    };

    return Seguimiento; // Devolver el modelo
};

//module.exports = Seguimiento;