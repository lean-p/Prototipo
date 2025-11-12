const { DataTypes } = require('sequelize');
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


    Seguimiento.associate = function(models) {

        

        Seguimiento.belongsTo(models.Usuario, {
            foreignKey: 'userID_FK',
            as: 'usuario'
        });
        Seguimiento.belongsTo(models.Transportista, {
            foreignKey: 'idTransportista_FK',
            as: 'transportista'
        });
       Seguimiento.belongsTo(models.Documento, {
          foreignKey: 'idDocumento_FK',
          as: 'documento'
        });
        Seguimiento.hasMany(models.Evento, {
            foreignKey: 'idSeguimiento_FK', 
            as: 'eventos'
        });
    };

    return Seguimiento; 
};

