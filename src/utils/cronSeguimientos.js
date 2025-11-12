const {Evento, Alerta, Seguimiento, Transportista} = require('../model/index');
const servicioEvento = require ('../services/servicioEvento');
const servicioSeguimiento = require('../services/servicioSeguimiento');
const Tracking = require('../utils/consultarTracking');

const { Op } = require('sequelize');
const cron = require('node-cron');


const verificarSeguimiento = async () => {

    console.log('Programando la tarea ');
    console.log(`[${new Date().toLocaleString('es-AR')}] Ejecutando cron para verificar seguimientos activos...`);

    //Se obtienen todos los seguimientos que aun no fueron entregados/finalizados
    const seguimientos = await servicioSeguimiento.obtenerTodosLosSeguimientosActivos();
    

    for (const seguimiento of seguimientos) {

        const idSeguimiento = seguimiento.idSeguimiento
        const estado = seguimiento.estadoActual.toLowerCase();
        const idTransportista = seguimiento.idTransportista_FK;
        const transportista = await Transportista.findByPk(idTransportista);

        if (estado != 'delivered'){

            console.log(`Buscando actualizacion para el seguimiento: ${idSeguimiento}`);
            let respuesta;
            try {
                console.log(`Consultando tracking numero: ${seguimiento.nro_tracking}`);
                respuesta = await Tracking.consultarTracking(seguimiento.nro_tracking, transportista.codigo);
                          
            } catch (error) {

                console.error(`No se pudo consultar el tracking: ${seguimiento.nro_tracking}`, error.message);
                continue;
            };

            const eventosConsultados = respuesta.eventos;
            console.log('Eventos consultados');
            console.log(eventosConsultados);
            const respuestaSeguimiento = await servicioEvento.obtenerEventosDeSeguimiento(idSeguimiento);
            console.log('Respuesta de seguimiento');
            console.log(respuestaSeguimiento);
            const eventos = respuestaSeguimiento[0].eventos;

            function normalizarDescripcion(desc) {
                if (typeof desc !== 'string') return '';
                return desc.toLowerCase().trim().replace(/\s+/g, ' ');
}

            const eventosValidos =  eventos.filter(e => e.fechaHora && typeof e.fechaHora.toISOString === 'function');

            //Se crea una huella de comparacion para cada evento, compuesto por Fecha + Descripcion

            const huellasExistentes = new Set(
                eventosValidos.map(e => {
                    const fechaUTC = e.fechaHora.toISOString();
                    const descNorm = normalizarDescripcion(e.descripcion);
                    return fechaUTC + descNorm;
                })
            );
            const eventosNuevos = eventosConsultados.filter(eventoApi => {
                const fechaUTC = new Date(eventoApi.timestamp).toISOString();
                const descNorm = normalizarDescripcion(eventoApi.description);
                
                const huellaApi = fechaUTC + descNorm;
                
                // Si la huella NO está en el Set, es un evento nuevo.
                return !huellasExistentes.has(huellaApi);
            });
            console.log(eventosNuevos)
            if (eventosNuevos.length > 0) {
                console.log(`✅ Se encontraron ${eventosNuevos.length} eventos nuevos para el tracking ${seguimiento.nro_tracking}`);
                // Por cada evento nuevo se carga en la base de datos
                for (const eventoNuevo of eventosNuevos) {

                const eventoACargar = {

                    idSeguimiento_FK: idSeguimiento,
                    fechaHora: eventoNuevo.timestamp,
                    codigoPais: eventoNuevo.location.address.countryCode,
                    estado: eventoNuevo.statusCode,
                    origen: respuesta.origen,
                    destino: respuesta.destino,
                    descripcion: eventoNuevo.description,
                    ubicacion: respuesta.ubicacion,
                    esFinalizado: respuesta.esFinalizado

                }

                
                const eventoCargado= await Evento.create(eventoACargar);

                console.log(`Se creo el evento "${eventoCargado.idEvento}".`)
                // Se genera una alerta por cada evento nuevo
                await Alerta.create({
              
                    userID_FK: seguimiento.userID_FK,
                    idEvento_FK: eventoCargado.idEvento,
                    fecha: new Date(),
                    leido: false,
                    texto: `Tu envío ${seguimiento.nro_tracking} tiene una nueva actualización: "${eventoNuevo.description}".`
                });
                //Se actualiza el seguimiento
                await servicioSeguimiento.actualizarSeguimiento(idSeguimiento, eventoCargado);
            }
            } else {
                //Curso de eventos demorados
                if (seguimiento.notificacionInactividadEnviada === false) {

                    const ultimoEvento = await Evento.findOne({
                        where: { idSeguimiento_FK: seguimiento.idSeguimiento },
                        order: [['fechaHora', 'DESC']]
                    });

                    if (ultimoEvento) {
                        //Se calcula la fecha de la ultima actualizacion de un seguimiento
                        const ultimaFecha = ultimoEvento.fechaHora;
                        const fechaActual = new Date();
                        const diferenciaMs = fechaActual.getTime() - ultimaFecha.getTime();
                        const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);
                        //Si es mayor a 2 dias, se alerta por inactividad en el seguimiento
                        if (diferenciaDias > 2) {

                            console.log(`ALERTA DE INACTIVIDAD para ${seguimiento.nro_tracking}`);

                            await Alerta.create({
                                idUsuario_FK: seguimiento.userID_FK,
                                fecha: new Date(),
                                leido: false,
                                texto: `Tu envío ${seguimiento.nro_tracking} no tiene actualizaciones hace más de 2 días. Te recomendamos contactar al courier.`
                            });

                            await Seguimiento.update({ notificacionInactividadEnviada: true });

                        };
                    }
                };
            }            
        }

        console.log("No hay seguimientos activos para procesar")
    }
}


//Se programa el cron en las horas 9,12,15,18,21
const programarTarea = () => {
  console.log('🕒 Programando la tarea de verificación...');
  cron.schedule('0 9,12,15,18,21 * * *', verificarSeguimiento, {
    timezone: "America/Argentina/Buenos_Aires"
  });
};

module.exports = { programarTarea };