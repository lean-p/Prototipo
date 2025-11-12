const {EtlMetadata, FactSeguimiento, DimUsuario, DimDivisa, DimTransportista, DimEstado, DimVia, DimVendedor, DimPosicionArancelaria, DimDetalle, DimDespacho} = require('../model/dwmodel/index');
const {Seguimiento, Transportista, Usuario, Documento} = require('../model/index');
const servicioEvento = require('../services/servicioEvento');
const etlFunciones = require('./etlFunciones');
const {Op} = require('sequelize');
const cron = require('node-cron');


async function procesarSeguimiento (seguimiento) {


    const usuario = seguimiento.dataValues.usuario.dataValues;
    console.log(usuario)
    const [dimUsuario, fueCreado] = await DimUsuario.findOrCreate({
                where: { 
                    // Busca por el ID original del usuario transaccional
                    // Asegúrate de tener una columna 'idUsuarioOriginal' en DimUsuario
                    userId: usuario.userID // O como se llame la PK en tu modelo Usuario transaccional
                },
                defaults: {
                    // Datos a usar si el usuario NO existe y necesita ser creado
                    userID: usuario.userID,
                    email: usuario.email,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido                    
                    // Asegúrate que los nombres de las propiedades coincidan
                }
            });
    if (fueCreado) {
                console.log(`Nuevo usuario creado en DimUsuario con ID (DW): ${dimUsuario.userID}`);
            } else {
                console.log(`Usuario encontrado en DimUsuario con ID (DW): ${dimUsuario.userID}`);
            }

            // 3. Obtienes la clave primaria de DimUsuario (la que necesitas para la tabla de hechos)
            const idDimUsuario = dimUsuario.userID;

    const resp = await servicioEvento.obtenerEventosDeSeguimiento(seguimiento.dataValues.idSeguimiento);

    const eventos = resp[0].eventos;
    
    const primerEvento = eventos[eventos.length - 1];
    
    const fechaInicial = primerEvento.fechaHora;      

    const fechaDelSeguimiento = new Date(seguimiento.dataValues.fechaInicio);

    const idDimFecha = await etlFunciones.obtenerOCrearDimFecha(fechaDelSeguimiento);
    const idDimFechaIncial = await etlFunciones.obtenerOCrearDimFecha(fechaInicial);

/*    const fechaCompleta = fechaDelSeguimiento.toISOString().split('T')[0];

    const anio = fechaDelSeguimiento.getFullYear();
    const mes = fechaDelSeguimiento.getMonth() + 1; // Recuerda sumar 1
    const dia = fechaDelSeguimiento.getDate();

    const [dimFecha, fueCreadaFecha] = await DimFecha.findOrCreate({
        where: { 
            // Busca por la fecha completa
            fecha: fechaCompleta // Asegúrate que tu columna se llame 'fecha' en DimFecha
        },
        defaults: {
            // Datos a usar si la fecha NO existe
            fecha: fechaCompleta,
            anio: anio,
            mes: mes,
            dia: dia
            // ... otros atributos como nombreMes, diaSemana, etc.
        }
    });

    if (fueCreadaFecha) {
        console.log(`Nueva fecha creada en DimFecha: ${fechaCompleta}`);
    }

    // 4. Obtienes la clave primaria de DimFecha para la tabla de hechos
    const idDimFecha = dimFecha.idFecha;*/

    const transportista = seguimiento.dataValues.transportista.dataValues;

    const [dimTransportista, fueCreadoTransportista] = await DimTransportista.findOrCreate({
      where: {
        idTransportista: transportista.idTransportista
      },
      defaults: {

        idTransportista: transportista.idTransportista,
        nombre: transportista.nombre

      }
    });

    if (fueCreadoTransportista) {
        console.log(`Nueva transportista creado en DimTransportista: ${transportista.nombre}`);
    }

    
    const idDimTransportista = dimTransportista.idTransportista;
    
    const estado = seguimiento.dataValues.estadoActual;
    const estadoMinuscula = estado.toLowerCase();
    const estadoFormateado = estadoMinuscula.charAt(0).toUpperCase() + estadoMinuscula.slice(1);

    const [dimEstado, fueCreadoEstado] = await DimEstado.findOrCreate({
      where: {
        estado: estadoFormateado
      },
      defaults: {
        nombre: estadoFormateado
      }
    });
    if (fueCreadoEstado) {
        console.log(`Nueva estado creado en DimEstado: ${estadoFormateado}`);
    }

    
    const idDimEstado = dimEstado.idEstado;

    const ubicacionActual = seguimiento.dataValues.ubicacionActual;
    const origen = primerEvento.origen;

    const idDimUbicacion = await etlFunciones.obtenerOCrearDimUbicacion(ubicacionActual);
    const idDimOrigen = await etlFunciones.obtenerOCrearDimUbicacion(origen);

/*    const [dimUbicacion, fueCreadaUbicacion] = await DimUbicacion.findOrCreate({

      where: {
        nombre: ubicacion
      },
      defaults: {
        nombre: ubicacion
      }
    });
    if (fueCreadaUbicacion) {
        console.log(`Nueva estado creado en DimEstado: ${ubicacion}`);
    };
 
    const idDimUbicacion = dimUbicacion.idUbicacion;*/
    const detalle = seguimiento.dataValues.idDocumento_FK
    let idDimDetalle = null;
    if (detalle != null) {

      const doc = seguimiento.dataValues.documento.dataValues;
      console.log(doc)
      idDimDetalle = doc.idDocumento;
      const via = doc.via;
      

      const [dimVia, fueCreadoVia] = await DimVia.findOrCreate({
        where: {
          via: via
        },
        defaults: {
          via: via
        }
      });
      if (fueCreadoVia) {
          console.log(`Nueva estado creado en DimVia: ${via}`);
      }

      
      const idVia = dimVia.idVia;

      const vendedor = doc.vendedor;

      const [dimVendedor, fueCreadoVendedor] = await DimVendedor.findOrCreate({
        where: {
          vendedor: vendedor
        },
        defaults: {
          vendedor: vendedor
        }
      });
      if (fueCreadoVendedor) {
          console.log(`Nueva estado creado en DimVendedor: ${vendedor}`);
      }

      const idVendedor = dimVendedor.idVendedor;

      const divisa = doc.divisa;

      const [dimDivisa, fueCreadoDivisa] = await DimDivisa.findOrCreate({
        where: {
          divisa: divisa
        },
        defaults: {
          divisa: divisa
        }
      });
      if (fueCreadoDivisa) {
          console.log(`Nueva estado creado en DimDivisa: ${divisa}`);
      }

      const idDivisa = dimDivisa.idDivisa;

      const posicionArancelaria = doc.posicionArancelaria;

      const [dimPosicionArancelaria, fueCreadoPosicionArancelaria] = await DimPosicionArancelaria.findOrCreate({
        where: {
          posicionArancelaria: posicionArancelaria
        },
        defaults: {
          posicionArancelaria: posicionArancelaria
        }
      });
      if (fueCreadoPosicionArancelaria) {
          console.log(`Nueva estado creado en DimPosiscionArancelaria: ${posicionArancelaria}`);
      }

      const idPosicionArancelaria = dimPosicionArancelaria.idPosicionArancelaria;

      const despacho = doc.despacho;

      const [dimDespacho, fueCreadoDespacho] = await DimDespacho.findOrCreate({
        where: {
          despacho: despacho
        },
        defaults: {
          despacho: despacho
        }
      });
      if (fueCreadoDespacho) {
          console.log(`Nueva estado creado en DimDespacho: ${despacho}`);
      }

      const idDespacho = dimDespacho.idDespacho;

      const oficializacion = doc.oficializacion;

      const idOficializacion = await etlFunciones.obtenerOCrearDimFecha(oficializacion);
      
      const ubicacionD = doc.origen;
      
      const idUbicacionD = await etlFunciones.obtenerOCrearDimUbicacion(ubicacionD);


      try{

          const [registroD, creadoD] = await DimDetalle.upsert({
            // Pasas TODOS los campos, incluyendo el identificador único
              idDetalle: idDimDetalle,
              idVendedor: idVendedor,
              idDespacho: idDespacho,
              idUbicacion: idUbicacionD,
              idOficializacion: idOficializacion,
              fobTotal: doc.fobTotal,
              costoFlete: doc.costoFlete,
              costoSeguro: doc.costoSeguro,
              idPosicionArancelaria: idPosicionArancelaria,
              derechoDeImportacion: doc.derechoDeImportacion,
              tasaDeEstadia: doc.tasaDeEstadia,
              iva: doc.iva,
              ivaAdicInscr: doc.ivaAdicInscr,
              impGanancias: doc.impGanancias,
              arancelSIM: doc.arancelSIM,
              ingresosBrutos: doc.ingresosBrutos,
              idDivisa: idDivisa,
              idVia: idVia
            }
            );

            if (creadoD) {
                console.log(`Nuevo hecho insertado para documento: ${idDimDetalle}`);
            } else {
                console.log(`Hecho actualizado para documento: ${idDimDetalle}`);
            }

        } catch (error){

          console.error(`Error haciendo upsert para documento ${idDimDetalle}:`, error);

        }


    }

    try{

      const [registro, creado] = await FactSeguimiento.upsert({
        // Pasas TODOS los campos, incluyendo el identificador único
        idSeguimiento: seguimiento.dataValues.idSeguimiento,
        userID: idDimUsuario,
        idTransportista: idDimTransportista,
        idDetalle: idDimDetalle || null, // Si es opcional
        nro_tracking: seguimiento.dataValues.nro_tracking,
        descripcion: seguimiento.dataValues.descripcion, // Dimensión degenerada
        idEstado: idDimEstado, // Asumiendo que obtienes el ID del estado final
        idUbicacion: idDimUbicacion,
        idOrigen: idDimOrigen, // Asumiendo que obtienes el ID de la ubicación final
        idFecha: idDimFecha, // Asegúrate que esta sea la FK a DimFecha
        idFechaInicial: idDimFechaIncial      

        }

        );

        if (creado) {
            console.log(`Nuevo hecho insertado para seguimiento original ID: ${seguimiento.idSeguimiento}`);
        } else {
            console.log(`Hecho actualizado para seguimiento original ID: ${seguimiento.idSeguimiento}`);
        }

    } catch (error){

      console.error(`Error haciendo upsert para seguimiento ${seguimiento.idSeguimiento}:`, error);

    }
}

const ejecutarEtl = async () =>{

      const metadata = await EtlMetadata.findOne({ where: { nombreProceso: 'ETL_Seguimientos' } });
      const ultimaFecha = metadata.ultimaEjecucionExitosa;
      const fechaInicioActual = new Date();
      const seguimientos = await Seguimiento.findAll({
      where: {
          updatedAt: {
          [Op.gt]: ultimaFecha // gt = Greater Than (mayor que)
          },
      },
      include: [
          {
              model: Usuario,
              as: 'usuario', // Usa el alias definido en la asociación Seguimiento.belongsTo(Usuario)
              required: true // Opcional: Asegura que solo traiga seguimientos que SÍ tengan un usuario asociado (INNER JOIN)
                            // Si lo omites o pones false, hará un LEFT JOIN.
          },
          {
              model: Transportista,
              as: 'transportista', // Usa el alias definido en la asociación Seguimiento.belongsTo(Transportista)
              required: true // Opcional: INNER JOIN vs LEFT JOIN
          },
          {
              model: Documento,
              as: 'documento', // Usa el alias definido en la asociación Seguimiento.belongsTo(Transportista)
              required: false // Opcional: INNER JOIN vs LEFT JOIN
          }
        ] 
      
    });

    if (seguimientos.length === 0) {
            console.log('No hay seguimientos modificados para procesar.');
            // ... (actualiza metadata y termina) ...
            metadata.ultimaEjecucionExitosa = fechaInicioActual; 
            await metadata.save(); // Guarda la nueva fecha
            return;
        }

    try {

      for (const seguimiento of seguimientos) {

        await procesarSeguimiento(seguimiento);

      };

      console.log('¡Todos los seguimientos se procesaron en el ETL!');

      metadata.ultimaEjecucionExitosa = fechaInicioActual; // Actualiza la propiedad en el objeto
      await metadata.save();


    } catch (error) {

      console.error("Falló el proceso de ETL:", error);

    }
    
}

//'0 * * * *'
const cronEtl = () => {
  console.log('🕒 Programando la tarea de etl...');
  cron.schedule('0 * * * *', ejecutarEtl, {
    timezone: "America/Argentina/Buenos_Aires"
  });
};

module.exports = { cronEtl };


