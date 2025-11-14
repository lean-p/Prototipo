/*Este componente es un ETL que corre cada hora, para llevar las actualizaciones
de la base transaccional hacia la de datawarehouse
*/
const {EtlMetadata, FactSeguimiento, DimUsuario, DimDivisa, DimTransportista, DimEstado, DimVia, DimVendedor, DimPosicionArancelaria, DimDetalle, DimDespacho} = require('../model/dwmodel/index');
const {Seguimiento, Transportista, Usuario, Documento} = require('../model/index');
const servicioEvento = require('../services/servicioEvento');
const etlFunciones = require('./etlFunciones');
const {Op} = require('sequelize');
const cron = require('node-cron');


async function procesarSeguimiento (seguimiento) {

    //Primero se obtienen los datos del seguimiento y se cargan las dimensiones.
    //Si la dimension no existe en su propia table, entonces lo crea
    const usuario = seguimiento.dataValues.usuario.dataValues;
    console.log(usuario)
    const [dimUsuario, fueCreado] = await DimUsuario.findOrCreate({
                where: { 
                    userId: usuario.userID
                },
                defaults: {
                    userID: usuario.userID,
                    email: usuario.email,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido                    
                }
            });
    if (fueCreado) {
                console.log(`Nuevo usuario creado en DimUsuario con ID (DW): ${dimUsuario.userID}`);
            } else {
                console.log(`Usuario encontrado en DimUsuario con ID (DW): ${dimUsuario.userID}`);
            }
            const idDimUsuario = dimUsuario.userID;

    const resp = await servicioEvento.obtenerEventosDeSeguimiento(seguimiento.dataValues.idSeguimiento);

    const eventos = resp[0].eventos;
    
    const primerEvento = eventos[eventos.length - 1];
    
    const fechaInicial = primerEvento.fechaHora;      

    const fechaDelSeguimiento = new Date(seguimiento.dataValues.fechaInicio);

    const idDimFecha = await etlFunciones.obtenerOCrearDimFecha(fechaDelSeguimiento);
    const idDimFechaIncial = await etlFunciones.obtenerOCrearDimFecha(fechaInicial);

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

    const detalle = seguimiento.dataValues.idDocumento_FK
    let idDimDetalle = null;
    //Si el seguimiento tiene un documento cargado, tambien lo procesa en la dimension detalle
    if (detalle != null) {

      const doc = seguimiento.dataValues.documento.dataValues;
      console.log(doc)
      idDimDetalle = doc.idDocumento;
      const via = doc.via;
      
      // Se crean o cargan las dimesiones relaciones al detalle
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
          //Se carga en la table dimDetalle
          const [registroD, creadoD] = await DimDetalle.upsert({
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
      //Se carga en la tabla de hechos
      const [registro, creado] = await FactSeguimiento.upsert({

        idSeguimiento: seguimiento.dataValues.idSeguimiento,
        userID: idDimUsuario,
        idTransportista: idDimTransportista,
        idDetalle: idDimDetalle || null,
        nro_tracking: seguimiento.dataValues.nro_tracking,
        descripcion: seguimiento.dataValues.descripcion, 
        idEstado: idDimEstado, 
        idUbicacion: idDimUbicacion,
        idOrigen: idDimOrigen, 
        idFecha: idDimFecha,
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
      //Se obtiene la fecha y hor del ultimo etl procesado
      const ultimaFecha = metadata.ultimaEjecucionExitosa;
      const fechaInicioActual = new Date();
      //Se obtienen todos los seguimientos mas nuevos que la ultimaFecha
      const seguimientos = await Seguimiento.findAll({
      where: {
          updatedAt: {
          [Op.gt]: ultimaFecha
          },
      },
      include: [
          {
              model: Usuario,
              as: 'usuario', 
              required: true 
          },
          {
              model: Transportista,
              as: 'transportista',
              required: true
          },
          {
              model: Documento,
              as: 'documento',
              required: false
          }
        ] 
      
    });

    if (seguimientos.length === 0) {
            console.log('No hay seguimientos modificados para procesar.');
            metadata.ultimaEjecucionExitosa = fechaInicioActual; 
            await metadata.save();
            return;
        }

    try {

      for (const seguimiento of seguimientos) {

        await procesarSeguimiento(seguimiento);

      };

      console.log('¡Todos los seguimientos se procesaron en el ETL!');

      metadata.ultimaEjecucionExitosa = fechaInicioActual;
      await metadata.save();


    } catch (error) {

      console.error("Falló el proceso de ETL:", error);

    }
    
}

//Se programa el cron que ejecuta cada hora
const cronEtl = () => {
  console.log('🕒 Programando la tarea de etl...');
  cron.schedule('*/ * * * *', ejecutarEtl, {
    timezone: "America/Argentina/Buenos_Aires"
  });
};

module.exports = { cronEtl };


