const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {

    const Transportista = sequelize.define('Transportista', {
    
        idTransportista: {
            type: DataTypes.BIGINT,
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

    tableName: 'Transportista',
    timestamps: false,
    freezeTableName: true
    });

    Transportista.associate = function(models) {
        Transportista.hasMany(models.Seguimiento, {
            foreignKey: 'idTransportista_FK',
            as: 'seguimientos'
            }
        );
    };

    return Transportista;
};
