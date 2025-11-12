const servicioReporte = require('../services/servicioReporte');
const fs = require('fs');

exports.crear = async (req, res) => {

    userID_FK = req.userID;

    try {

        const { rutaArchivo, nombreArchivo} = await servicioReporte.generarReporte(userID_FK);

        // Usa res.download() para enviar el archivo
        res.download(rutaArchivo, nombreArchivo, (err) => {
        if (err) {
            console.error('Error al enviar el archivo:', err);
            if (!res.headersSent) {
            res.status(500).send('No se pudo descargar el archivo.');
            }
        } else {
            console.log(`Archivo '${nombreArchivo}' enviado para descarga.`);
        }

        //Se elimina el archivo temporal despues de intentar enviarlo
        fs.unlink(rutaArchivo, (unlinkErr) => {
            if (unlinkErr) {
            console.error('Error al eliminar el archivo temporal:', unlinkErr);
            } else {
            console.log(`Archivo temporal '${rutaArchivo}' eliminado.`);
            }
        });
        });
    } catch (error){

        console.error('Error general al generar el reporte CSV:', error);
        if (!res.headersSent) {
            res.status(500).send('Error interno al generar el reporte.');
        }
    }
}