const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    const Alerta = sequelize.define('Alerta', {

    idAlerta: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userID_FK: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    idEvento_FK: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    leido: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    texto: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
    },{
        tableName: 'Alerta', 
        timestamps: true,    
        freezeTableName: true
    });

    Alerta.associate = function(models) {
        Alerta.belongsTo(models.Evento, {
            foreignKey: 'idEvento_FK',
            as: 'evento'
        });
        Alerta.belongsTo(models.Usuario, {
            foreignKey: 'userID_FK',
            as: 'usuario'
        });
    };
    
    return Alerta;

}