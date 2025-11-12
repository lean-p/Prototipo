//const Evento = require('../model/Evento');
const consultarTracking = require('../utils/consultarTracking');
const {Evento, Seguimiento} = require('../model/index');
const servicioTransportista = require('../services/servicioTransportista');
const {op} = require('sequelize');

exports.obtenerEventoPorID = async(idEvento) => {

    const evento = await Evento.findByPk(idEvento);

    if (!evento) {
        // Devuelve null o lanza un error si el ID no existe
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

/*   console.log(`Buscando eventos para el ID: ${idSeguimiento}`)
   const eventosOrdenados =  await Seguimiento.findAll({

        where: { idSeguimiento: idSeguimiento },
        include: [{
            model: Evento,
            as: 'eventos', // O el alias que hayas definido
            order: [
            ['fechaHora', 'DESC'] // ¡Clave! Ordena los eventos de más viejos a más nuevos.
            ]
        }]
    });
    
    return eventosOrdenados*/
    console.log(`Buscando eventos (método robusto) para el ID: ${idSeguimiento}`);

    try {
        // PASO 1: Obtener el seguimiento principal.
        // Usamos findOne porque solo buscamos uno.
        const seguimiento = await Seguimiento.findOne({
            where: { idSeguimiento: idSeguimiento }
            // Nota: Quitamos el 'include' de 'Evento' de aquí.
        });

        if (!seguimiento) {
            return []; // No se encontró, devolvemos array vacío
        }

        // PASO 2: Obtener los eventos por separado.
        // ¡Este 'order' simple SIEMPRE funciona!
        const eventosOrdenados = await Evento.findAll({
            where: { idSeguimiento_FK: idSeguimiento }, // (Asegúrate que esta sea tu Foreign Key)
            order: [
                ['fechaHora', 'DESC'] // El orden ahora SÍ se respeta
            ]
        });

        // PASO 3: Combinar los resultados en la misma estructura que tu frontend espera.
        
        // Usamos .toJSON() para obtener un objeto simple que podamos modificar
        const seguimientoData = seguimiento.toJSON();
        
        // Adjuntamos el array de eventos ya ordenados
        seguimientoData.eventos = eventosOrdenados; 

        // Devolvemos el objeto completo dentro de un array,
        // que es la estructura que tu frontend espera: res.json({ detalles: [ ... ] })
        return [seguimientoData];

    } catch (error) {
        console.error("Error en obtenerEventosDeSeguimiento (robusto):", error);
        throw error; // Propagamos el error
    }

}