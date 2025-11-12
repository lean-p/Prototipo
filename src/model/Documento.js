const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Documento = sequelize.define('Documento', {
        idDocumento: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        despacho: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        via: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        vendedor: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        origen: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        posicionArancelaria: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        divisa: {
            type: DataTypes.STRING(3),
            allowNull: false
        },
        oficializacion: {
            type: DataTypes.DATE,
            allowNull: false
        },
        fobTotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        costoFlete: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true
        },
        costoSeguro: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        derechoDeImportacion: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        tasaDeEstadistica: {
            type: DataTypes.DECIMAL(8, 4),
            allowNull: true
        },
        iva: {
            type: DataTypes.DECIMAL(8, 4),
            allowNull: true
        },
        ivaAdicInscr: {
            type: DataTypes.DECIMAL(8, 4),
            allowNull: true
        },
        impGanancias: {
            type: DataTypes.DECIMAL(8, 4),
            allowNull: true
        },
        arancelSIM: {
            type: DataTypes.DECIMAL(8, 4),
            allowNull: true
        },
        ingresosBrutos: {
            type: DataTypes.DECIMAL(8, 4),
            allowNull: true
        }       
    }, {
        timestamps: true,
        tableName: 'Documento',
        freezeTableName: true
    });
    Documento.associate = function(models) {
        Documento.hasOne(models.Seguimiento, {
            foreignKey: 'idDocumento_FK', 
            as: 'seguimiento'
        });
    };

    return Documento;
};