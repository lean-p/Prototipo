//const Seguimiento = require('../model/Seguimiento');
//const Transportista = require('../model/Transportista');
//const Usuario = require('../model/Usuario');
const servicioEvento = require('../services/servicioEvento');
const Tracking = require('../utils/consultarTracking');
const {Seguimiento, Transportista, Usuario, Evento, Documento, Alerta, sequelize} = require('../model/index');
const {Op} = require('sequelize');

exports.obtenerSeguimientoPorID = async (idSeguimiento) => {

    const seguimiento = await Seguimiento.findByPk(idSeguimiento, {
        // 🚨 CLAVE: Usamos 'include' para traer los datos relacionados
        include: [
            // Incluye Usuario y Transportista (ya definidos)
            { model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido'] },
            { model: Transportista, as: 'transportista', attributes: ['nombre', 'codigo'] },
            
            // 🚨 NUEVO: Incluir la lista de Eventos asociados
            { 
                model: Evento,
                as: 'eventos', // Usamos el alias 'eventos' definido en Seguimiento.hasMany()
            }
        ],
        attributes: { exclude: ['userID_FK', 'idTransportista_FK'] } 
    });

    if (!seguimiento) {
        throw new Error("Seguimiento no encontrado.");
    }
    
    // 2. Resultado: El objeto 'seguimiento' ahora incluye 'seguimiento.usuario.nombre' y 'seguimiento.transportista.nombre'
    return seguimiento;

};

//exports.registrarSeguimiento = async (nro_tracking, transportista, userID) => {
exports.registrarSeguimiento = async (datos) => {
    const { nro_tracking, transportista, userID_FK} = datos;
    
    const idTransportista = await Transportista.findOne({ 
        where: { nombre: transportista },
        attributes: ['idTransportista'] // Solo traemos el ID
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
            idTransportista_FK: idTransportista.idTransportista // ✅ Buscamos por el ID numérico
        }

    });

    if (trackingExistente) {

        console.warn('ALERT: Numero de tracking ya registrado');
        throw new Error (`El tracking '${nro_tracking}' ya se encuentra registrado.`);
//        return this.obtenerSeguimientoPorID(trackingExistente.idSeguimiento);
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

//        if (nuevoSeguimiento.estadoActual === 'delivered') {

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
          

    // 3. Devolver el objeto completo (reutilizando el método de lectura)
    // Esto asegura que la respuesta al frontend esté formateada con los nombres (no solo los IDs)
    return this.obtenerSeguimientoPorID(idSeguimiento);
}

/*exports.registrarNuevoEvento = async (idSeguimiento, nro_tracking, idTransportista) => {

    try {

        servicioEvento.crearEvento(idSeguimiento, nro_tracking, idTransportista);

    } catch (error) {
        
        return error

    }
}

exports.nuevoScan = async (idSeguimiento, nro_tracking, idTransportista) => {

   const evento = await this.registrarNuevoEvento(idSeguimiento, nro_tracking, idTransportista)

   if (!evento) {

    console.error("ALERT: No se registro un nuevo evento"); 
    throw new Error ('Evento no registrado');

   }

   const estadoActual = await this.obtenerSeguimientoPorID(idSeguimiento);

   if (!estadoActual) {

    console.error("ALERT: No se pudó obtener el seguimiento");
    throw new Error ('No se obtuvo el seguimiento');

   }

   if (estadoActual.estadoActual != evento.estado || 
        estadoActual.descripcion != evento.descripcion || 
        estadoActual.fechaInicio != evento.fechaHora) {

            this.actualizarSeguimiento(idSeguimiento, evento);

        }
}*/

exports.obtenerTodosLosSeguimientos = async (userID_FK) => {
    
    const seguimientos = await Seguimiento.findAll({
        where: {
            userID_FK: userID_FK // 🚨 Filtra por el usuario autenticado
        },
        include: [
            // Incluimos el transportista para mostrar su nombre
            { 
                model: Transportista, as: 'transportista', attributes: ['nombre', 'codigo'] 
            },
            { model: Documento, as: 'documento', required: false }
            // Incluimos los eventos (solo el estado actual, ordenamos por fecha)
        ],
        // Opcional: Ordenar los seguimientos principales por fecha de creación
        order: [['createdAt', 'DESC']]
    });

    // Sequelize devuelve un array de objetos, listo para el frontend
    return seguimientos; 
};

 exports.obtenerSeguimientosPaginados = async(userID, page, limit) => {
        
    console.log(`[Servicio] Obteniendo seguimientos PAGINADOS (pág ${page}) de UserID: ${userID}`);
        
        const offset = (page - 1) * limit;

        try {
            // Usamos 'findAndCountAll' que es perfecto para esto
            const { count, rows } = await Seguimiento.findAndCountAll({
                where: { userID_FK: userID },
                include: [
                    // Incluimos el transportista para mostrar su nombre
                    { 
                        model: Transportista, as: 'transportista', attributes: ['nombre', 'codigo'] 
                    },
                    { model: Documento, as: 'documento', required: false }
                    // Incluimos los eventos (solo el estado actual, ordenamos por fecha)
                ], 
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: offset
            });

            const totalPages = Math.ceil(count / limit);

            // Devolvemos el "contrato" completo
            return {
                total: count,           // ej. 14
                totalPages: totalPages, // ej. 2
                seguimientos: rows      // ej. los 10 items de esta página
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
                estadoActual: { // Asegúrate que el nombre del campo sea el correcto
                    [Op.not]: 'delivered'
                }
                }
            });

        return seguimientos;
    }

exports.eliminarSeguimiento = async (idSeguimiento, userID) => {


    const t = await sequelize.transaction();

    try {
            // --- PASO DE SEGURIDAD ---
            // Buscamos el seguimiento Y verificamos que le pertenezca al usuario.
            const seguimiento = await Seguimiento.findOne({ 
                where: { 
                    idSeguimiento: idSeguimiento, 
                    userID_FK: userID // ¡Validación de propiedad!
                },
                transaction: t
            });

            // Si no se encuentra, o no le pertenece, lanzamos un error
            if (!seguimiento) {
                throw new Error("Permiso denegado");
            }
            
            // --- INICIA EL BORRADO EN CASCADA (TU LÓGICA) ---

            // 3. Buscar todos los Eventos "hijos"
            const eventos = await Evento.findAll({
                where: { idSeguimiento_FK: idSeguimiento },
                attributes: ['idEvento'], // Solo necesitamos sus IDs
                transaction: t
            });

            if (eventos.length > 0) {
                const eventoIDs = eventos.map(e => e.idEvento);

                // 4. Borrar Alertas (los "nietos")
                await Alerta.destroy({
                    where: { idEvento_FK: { [Op.in]: eventoIDs } }, // WHERE idEvento IN (1, 2, 3, ...)
                    transaction: t
                });
                
                // 5. Borrar Eventos (los "hijos")
                await Evento.destroy({
                    where: { idSeguimiento_FK: idSeguimiento },
                    transaction: t
                });
            }
            const idDocumentoABorrar = seguimiento.idDocumento_FK;
            // 6. Borrar Seguimiento (el "padre")
            await seguimiento.destroy({ transaction: t }); // Ya lo teníamos cargado

            if (idDocumentoABorrar) {
                await Documento.destroy({
                    where: { idDocumento: seguimiento.idDocumento_FK },
                    transaction: t
                });
            }

            // 7. ¡ÉXITO! Si todo salió bien, "confirmamos" los cambios.
            await t.commit();
            
            return { message: "Borrado completo" };

        } catch (error) {
            // 8. ¡FALLO! Si algo falló (el paso 4, 5, etc.),
            //    "deshacemos" todos los cambios.
            await t.rollback();
            
            // Pasamos el error al Controlador para que lo maneje
            throw error; 
        }  
}