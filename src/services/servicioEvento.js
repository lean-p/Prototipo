const consultarTracking = require('../utils/consultarTracking');
const {Evento, Seguimiento} = require('../model/index');
const servicioTransportista = require('../services/servicioTransportista');
const {op} = require('sequelize');

exports.obtenerEventoPorID = async(idEvento) => {

    const evento = await Evento.findByPk(idEvento);

    if (!evento) {
        return null;
    }
    
    return evento;

}

exports.crearEventoFinalizado = async (idSeguimiento_FK, fechaHora, codigoPais, estado, origen, destino, descripcion, ubicacion, esFinalizado) => {

    const eventoPorParamentro = {
            
            idSeguimiento_FK: idSeguimiento_FK,
            fechaHora: fechaHora,
            codigoPais: codigoPais,
            estado: estado,
            origen: origen,
            destino: destino,
            descripcion: descripcion,
            ubicacion: ubicacion,
            esFinalizado: esFinalizado
        
        };

        const eventoCreado = await Evento.create(eventoPorParamentro);

        const eventoDetalle = await this.obtenerEventoPorID(eventoCreado.idEvento);

        return eventoDetalle

}



exports.crearEvento = async (idSeguimiento, nro_tracking, idTransportista) => {

    

    const transportista = await servicioTransportista.obternerTransportistaPorID(idTransportista);
        
    if (!transportista) {

        console.log("ALERT: No se pudo obtener el transportista");
    }

    const tracking = await consultarTracking.consultarTracking(nro_tracking, transportista.codigo);

    try {

        const evento = {
            
            idSeguimiento_FK: idSeguimiento,
            fechaHora: tracking.fechaHora,
            codigoPais: tracking.codigoPais,
            estado: tracking.estado,
            origen: tracking.origen,
            destino: tracking.destino,
            descripcion: tracking.descripcion,
            ubicacion: tracking.ubicacion,
            esFinalizado: tracking.esFinalizado

        };

        const eventoCreado = await Evento.create(evento);

        const eventoDetalle = await this.obtenerEventoPorID(eventoCreado.idEvento);

        return eventoDetalle

    } catch {

        console.error("Error al crear el evento en la base de datos:", error); 

        throw new Error('No se pudo registrar el evento. Inténtelo más tarde.');

    }  

}

exports.obtenerEventosDeSeguimiento = async (idSeguimiento) => {

    console.log(`Buscando eventos (método robusto) para el ID: ${idSeguimiento}`);

    try {

        const seguimiento = await Seguimiento.findOne({
            where: { idSeguimiento: idSeguimiento }
        });

        if (!seguimiento) {
            return [];
        }
        const eventosOrdenados = await Evento.findAll({
            where: { idSeguimiento_FK: idSeguimiento },
            order: [
                ['fechaHora', 'DESC'] 
            ]
        });

        const seguimientoData = seguimiento.toJSON();

        seguimientoData.eventos = eventosOrdenados; 

        return [seguimientoData];

    } catch (error) {
        console.error("Error en obtenerEventosDeSeguimiento:", error);
        throw error;
    }

}