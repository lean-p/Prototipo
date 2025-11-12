const { DataTypes } = require('sequelize');


module.exports = (sequelize) =>{

    const Evento = sequelize.define('Evento', {

    idEvento: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idSeguimiento_FK: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    fechaHora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    codigoPais: {
        type: DataTypes.STRING(3),
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    origen: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    destino: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    ubicacion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    esFinalizado: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
    }, {
        tableName: 'Evento',
        timestamps: true,
        freezeTableName: true
    });

    Evento.associate = function(models) {
        Evento.belongsTo(models.Seguimiento, {
            foreignKey: 'idSeguimiento_FK',
            as: 'seguimiento'
        });
        Evento.hasOne(models.Alerta, {
            foreignKey: 'idEvento_FK',
            as: 'alerta'
        });
    };
    return Evento;
}