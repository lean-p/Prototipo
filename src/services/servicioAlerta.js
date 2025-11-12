const {Alerta} = require('../model/index');
const Evento = require('../services/servicioEvento');
const {op} = require('sequelize');

exports.generarAlerta = async (idEvento, texto) =>{

    evento = Evento.obtenerEventoPorID(idEvento)
    

    const nuevaAlerta = {

        userID_FK: evento.userID_FK,
        idEvento_FK: idEvento,
        fecha: new Date(),
        ledio: false,
        alertaCondicion: texto,

    };

    try{

        const alertaCreada = Alerta.create(nuevaAlerta);

        return alertaCreada

    } catch(error) {
        console.log('ALERT - No se pudo generar la alerta')
        throw new Error("No se pude generar la alerta", error);
    }   
}

exports.actualizarAlerta = async (idAlerta, eventoNuevo) => {

    const alerta = await Alerta.findByPk(idAlerta);

    if (!alerta) {
        throw new Error('Alerta no encontrada');
    }
    
    const alertaActualizada = await alerta.update(eventoNuevo);

    return alertaActualizada;

}

exports.listarAlertasPorUsuario = async (userID_FK) => {

    const alertas = await Alerta.findAll({
        where: {
            userID_FK: userID_FK
        },
        order: [['createdAt', 'DESC']]
    });

    return alertas
}

    

