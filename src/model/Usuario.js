const { DataTypes } = require('sequelize');
module.exports = (sequelize) => { 
    const Usuario = sequelize.define('Usuario', {
        
        userID: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        hashPassword: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'Usuario',
        timestamps: true,
        freezeTableName: true
    });

    Usuario.associate = function(models) {
        Usuario.hasMany(models.Seguimiento, {
            foreignKey: 'userID_FK',
            as: 'seguimientos'
        });
        Usuario.hasMany(models.Alerta, {
            foreignKey: 'userID_FK',
            as: 'alertas'
        });
    };

    return Usuario;
};