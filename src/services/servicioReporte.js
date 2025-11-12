const Seguimiento = require('./servicioSeguimiento');
const path = require('path');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


exports.generarReporte = async (userId) =>{

    const seguimientos = await  Seguimiento.obtenerTodosLosSeguimientos(userId);

    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().slice(0, 10).replaceAll('-', '');
    const nombreArchivo = `seguimiento_${userId}_${fechaFormateada}.csv`;
    const dirTemporal = path.join(__dirname, '..', 'temp'); 
    
    // Verifica si la carpeta existe, si no, la crea
    if (!fs.existsSync(dirTemporal)){
        console.log(`Creando directorio temporal en: ${dirTemporal}`);
        fs.mkdirSync(dirTemporal, { recursive: true });
    }

    const rutaArchivo = path.join(dirTemporal, nombreArchivo);


    const datosMapeados = seguimientos.map(seguimiento => {

        const fecha = new Date(seguimiento.fechaInicio);

        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
        const anio = fecha.getFullYear();
        const fechaFormateadaCSV = `${dia}/${mes}/${anio}`;
        
        const baseRow = {
            fechaInicio: fechaFormateadaCSV,
            nro_tracking: seguimiento.nro_tracking,
            transportista: seguimiento.transportista.nombre,
            estadoActual: seguimiento.estadoActual,
            ubicacionActual: seguimiento.ubicacionActual,
            descripcion: seguimiento.descripcion
        };

        const docRow = {
            oficializacion: '',
            despacho: '',
            via: '',
            vendedor: '',
            origen: '',
            posicionArancelaria: '',
            divisa: '',
            fobTotal: 0,
            costoFlete: 0,
            costoSeguro: 0,
            derechoDeImportacion: 0,
            tasaDeEstadia: 0,
            iva: 0,
            ivaAdicInscr: 0,
            impGanacias: 0,
            arancelSIM: 0,
            ingresosBrutos: 0
        };

        if (seguimiento.documento) {
            const doc = seguimiento.documento;
            
            docRow.oficializacion = doc.oficializacion ? new Date(doc.oficializacion).toLocaleDateString('es-AR') : '';
            docRow.despacho = doc.despacho;
            docRow.via = doc.via;
            docRow.vendedor = doc.vendedor;
            docRow.origen = doc.origen;
            docRow.posicionArancelaria = doc.posicionArancelaria;
            docRow.divisa = doc.divisa;
            docRow.fobTotal = doc.fobTotal;
            docRow.costoFlete = doc.costoFlete;
            docRow.costoSeguro = doc.costoSeguro;
            docRow.derechoDeImportacion = doc.derechoDeImportacion;
            docRow.tasaDeEstadia = doc.tasaDeEstadia;
            docRow.iva = doc.iva;
            docRow.ivaAdicInscr = doc.ivaAdicInscr;
            docRow.impGanacias = doc.impGanacias;
            docRow.arancelSIM = doc.arancelSIM;
            docRow.ingresosBrutos = doc.ingresosBrutos;
        }

        return  { ...baseRow, ...docRow };    
    });

    const csv = createCsvWriter ({
        path: rutaArchivo,
        header: [
            {id: 'fechaInicio', title: 'Fecha'},
            {id: 'nro_tracking', title: 'Tracking'},
            {id: 'transportista', title: 'Transportista'},
            {id: 'estadoActual', title: 'Ultimo estado'},
            {id: 'ubicacionActual', title: 'Ultima ubicacion'},
            {id: 'descripcion', title: 'Descripcion'},
            
            //Headers que se agregan con la carga de un documento
            {id: 'oficializacion', title: 'Fecha Oficializacion'},
            {id: 'despacho', title: 'Despacho'},
            {id: 'via', title: 'Via'},
            {id: 'vendedor', title: 'Vendedor'},
            {id: 'origen', title: 'Origen'},
            {id: 'posicionArancelaria', title: 'Pos. Arancelaria'},
            {id: 'divisa', title: 'Divisa'},
            {id: 'fobTotal', title: 'FOB'},
            {id: 'costoFlete', title: 'Flete'},
            {id: 'costoSeguro', title: 'Seguro'},
            {id: 'derechoDeImportacion', title: 'Derechos Imp.'},
            {id: 'tasaDeEstadia', title: 'Tasa Est.'},
            {id: 'iva', title: 'IVA'},
            {id: 'impuestosInternos', title: 'Imp. Internos'},
            {id: 'ivaAdicInscr', title: 'IVA Adicional'},
            {id: 'impGanacias', title: 'Ganancias'},
            {id: 'arancelSIM', title: 'Arancel SIM'},
            {id: 'ingresosBrutos', title: 'IIBB'}
        ]
    });

    try{

        await csv.writeRecords(datosMapeados);
        console.log(`¡Archivo CSV '${nombreArchivo}' exportado exitosamente!`);
        return {rutaArchivo, nombreArchivo};

    } catch (error){

        console.error('Error al exportar a CSV:', error);
        throw error;
    }
}