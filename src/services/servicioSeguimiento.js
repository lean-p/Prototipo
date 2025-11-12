const servicioEvento = require('../services/servicioEvento');
const Tracking = require('../utils/consultarTracking');
const {Seguimiento, Transportista, Usuario, Evento, Documento, Alerta, sequelize} = require('../model/index');
const {Op} = require('sequelize');

exports.obtenerSeguimientoPorID = async (idSeguimiento) => {

    const seguimiento = await Seguimiento.findByPk(idSeguimiento, {
        include: [
            { model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido'] },
            { model: Transportista, as: 'transportista', attributes: ['nombre', 'codigo'] },
            { 
                model: Evento,
                as: 'eventos',
            }
        ],
        attributes: { exclude: ['userID_FK', 'idTransportista_FK'] } 
    });

    if (!seguimiento) {
        throw new Error("Seguimiento no encontrado.");
    }
    return seguimiento;

};


exports.registrarSeguimiento = async (datos) => {
    const { nro_tracking, transportista, userID_FK} = datos;
    
    const idTransportista = await Transportista.findOne({ 
        where: { nombre: transportista },
        attributes: ['idTransportista']
    });

    const user = await Usuario.findOne({
        where: {userID: userID_FK},
        attributes: ['userID']
    });

    if (!idTransportista) {
        throw new Error(`El transportista '${transportista}' no está registrado.`);
    }
    
    const trackingExistente = await Seguimiento.findOne({

        where: {
            nro_tracking: nro_tracking,
            idTransportista_FK: idTransportista.idTransportista
        }

    });

    if (trackingExistente) {

        console.warn('ALERT: Numero de tracking ya registrado');
        throw new Error (`El tracking '${nro_tracking}' ya se encuentra registrado.`);
    }


    const evento = await Tracking.consultarTracking(nro_tracking, transportista);    


    if (!evento) {

        console.error('ALERT: Numero de tracking no encontrado');
        throw new Error (`El tracking '${nro_tracking}' no existe.`);

    }

    try {

        const nuevoSeguimiento = {
            userID_FK: userID_FK,
            idTransportista_FK: idTransportista.dataValues.idTransportista,
            nro_tracking: nro_tracking,
            descripcion: evento.descripcion,
            estadoActual: evento.estado,
            ubicacionActual: evento.ubicacion,
            fechaInicio: evento.fechaHora,
            notificacionInactividadEnviada: false
        };
        

        const seguimientoCreado =  await Seguimiento.create(nuevoSeguimiento);

        console.log(`Seguimiento creado con el id ${seguimientoCreado.idSeguimiento}`)

        // Mapeo de eventos en DHL
        if (transportista === 'DHL'){

            try  {
                const eventosApi = evento.eventos
                
                console.log(`Procesando ${eventosApi.length} eventos...`);

                for (const eventoApi of eventosApi) {
                    
                    
                    await servicioEvento.crearEventoFinalizado(
                        seguimientoCreado.idSeguimiento,
                        eventoApi.timestamp,
                        eventoApi.location.address.countryCode,
                        eventoApi.statusCode,
                        evento.origen,
                        evento.destino,
                        eventoApi.description,
                        eventoApi.location.address.addressLocality,
                        (eventoApi.statusCode === 'delivered')
                    
                    );

                }
                console.log('¡Todos los eventos han sido guardados exitosamente!');

            } catch (error) {

                console.error("Falló la creación de un evento:", error);
                
            }

            return seguimientoCreado
            // Mapeo de eventos en Fedex
        } else if (transportista === 'FedEx') {

            try  {
                const eventosApi = evento.eventos
                
                console.log(`Procesando ${eventosApi.length} eventos...`);

                for (const eventoApi of eventosApi) {
                    
                    
                    await servicioEvento.crearEventoFinalizado(
                        seguimientoCreado.idSeguimiento,
                        eventoApi.date,
                        eventoApi.scanLocation.countryCode,
                        eventoApi.derivedStatus,
                        evento.origen,
                        evento.destino,
                        eventoApi.eventDescription,
                        eventoApi.scanLocation.city + ' - ' + eventoApi.scanLocation.countryName,
                        (eventoApi.derivedStatus === 'DL')
                    
                    );

                }
                console.log('¡Todos los eventos han sido guardados exitosamente!');

            } catch (error) {

                console.error("Falló la creación de un evento:", error);
                
            }

            return seguimientoCreado

        }
    } catch (error) {


        console.error("Error al crear el seguimiento en la base de datos:", error); 

        throw new Error(`No se pudo registrar el seguimiento. Inténtelo más tarde. ${error.message}`);

    };
}

exports.actualizarSeguimiento = async (idSeguimiento, nuevoEvento) => {


     await Seguimiento.update(

                {
                    estadoActual: nuevoEvento.estado,
                    descripcion: nuevoEvento.descripcion,
                    unicacion: nuevoEvento.ubicacion,
                },
                {
                    where: {
                        idSeguimiento: idSeguimiento
                    }
                }
        );
    return this.obtenerSeguimientoPorID(idSeguimiento);
}


exports.obtenerTodosLosSeguimientos = async (userID_FK) => {
    
    const seguimientos = await Seguimiento.findAll({
        where: {
            userID_FK: userID_FK 
        },
        include: [
            { 
                model: Transportista, as: 'transportista', attributes: ['nombre', 'codigo'] 
            },
            { model: Documento, as: 'documento', required: false }

        ],
        order: [['createdAt', 'DESC']]
    });
    return seguimientos; 
};

 exports.obtenerSeguimientosPaginados = async(userID, page, limit) => {
        
    console.log(`[Servicio] Obteniendo seguimientos PAGINADOS (pág ${page}) de UserID: ${userID}`);
        
        const offset = (page - 1) * limit;

        try {
            const { count, rows } = await Seguimiento.findAndCountAll({
                where: { userID_FK: userID },
                include: [
                    { 
                        model: Transportista, as: 'transportista', attributes: ['nombre', 'codigo'] 
                    },
                    { model: Documento, as: 'documento', required: false }
                ], 
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: offset
            });

            const totalPages = Math.ceil(count / limit);

            return {
                total: count,           
                totalPages: totalPages, 
                seguimientos: rows      
            };

        } catch (error) {
            console.error("Error en el servicio de paginación:", error);
            throw new Error("Error al consultar seguimientos paginados.");
        }
    }


exports.obtenerDetallesDeSeguimiento = async (idSeguimiento) => {

    if (!idSeguimiento) {

        console.error("ALERT: Es necesario el id del seguimiento");
        throw new Error ('No se obtuvo el id del seguimiento');

    }

    try{
        console.log(`Buscando seguimiento con ID: ${idSeguimiento}`);
        const detalle = await servicioEvento.obtenerEventosDeSeguimiento(idSeguimiento);
    
        return detalle

    } catch (error) {

        console.error("No se pudo obtener los eventos del seguimiento:", error); 

        throw new Error(`No se pudo obtener los eventos del seguimiento. ${error.message}`);

    }
}

exports.obtenerTodosLosSeguimientosActivos = async () => {

            console.log('Buscando todos los seguimientos activos en la base de datos...');
            
            const seguimientos = await Seguimiento.findAll({
                where: {
                estadoActual: {
                    [Op.not]: 'delivered'
                }
                }
            });

        return seguimientos;
    }

exports.eliminarSeguimiento = async (idSeguimiento, userID) => {

    //Se genera una transaccion para hacer el borrado de los campos en la base
    const t = await sequelize.transaction();

    try {
            const seguimiento = await Seguimiento.findOne({ 
                where: { 
                    idSeguimiento: idSeguimiento, 
                    userID_FK: userID
                },
                transaction: t
            });

            if (!seguimiento) {
                throw new Error("Permiso denegado");
            }
            const eventos = await Evento.findAll({
                where: { idSeguimiento_FK: idSeguimiento },
                attributes: ['idEvento'],
                transaction: t
            });

            if (eventos.length > 0) {
                const eventoIDs = eventos.map(e => e.idEvento);
                //Primero se borran las alertas relacionadas a los eventos del seguimiento
                await Alerta.destroy({
                    where: { idEvento_FK: { [Op.in]: eventoIDs } },
                    transaction: t
                });
                // Se borran los eventos realcionados al seguimiento
                await Evento.destroy({
                    where: { idSeguimiento_FK: idSeguimiento },
                    transaction: t
                });
            }
            const idDocumentoABorrar = seguimiento.idDocumento_FK;
            // Se borra el seguimiento
            await seguimiento.destroy({ transaction: t }); 

            //Si el seguimiento tiene un documento cargado, tambien se borra
            if (idDocumentoABorrar) {
                await Documento.destroy({
                    where: { idDocumento: seguimiento.idDocumento_FK },
                    transaction: t
                });
            }
            await t.commit();
            
            return { message: "Borrado completo" };

        } catch (error) {
            await t.rollback();
            throw error; 
        }  
}