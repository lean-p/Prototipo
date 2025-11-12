const servicioDocumento = require('../services/servicioDocumento');
const {Documento, Seguimiento} = require('../model/index');
const servicioSeguimiento = require('../services/servicioSeguimiento');


exports.procesarDocumentoAduana = async (req, res) => {
    
    let datosExtraidos;
    const idSeguimientoAActualizar = req.params.id; 
    
    try {
        
        const { id } = req.params;

        if (!idSeguimientoAActualizar) {
            throw new Error("El ID del seguimiento no llegó en los parámetros (req.params.id).");
        }
        
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo.' });
        }

        // Llamada a la funcion de OCR
        datosExtraidos = await servicioDocumento.analizarDocumentoDeAduana(req.file.buffer);
        
        console.log('Datos de OCR extraídos para guardar:', datosExtraidos);

        // Se agrega el id del seguimiento
        datosExtraidos.idSeguimiento_FK = parseInt(id, 10);

        const nuevoDocumento = await Documento.create(datosExtraidos);
        console.log(`[CONTROLADOR] Paso 3.1: ¡ÉXITO! Documento Creado con ID: ${nuevoDocumento.idDocumento}`);
        console.log(`[CONTROLADOR] Paso 4: Enlazando... Actualizando Seguimiento ID: ${idSeguimientoAActualizar} con Documento ID: ${nuevoDocumento.idDocumento}`);

        const [filasAfectadas] = await Seguimiento.update(
            { idDocumento_FK: nuevoDocumento.idDocumento }, // El dato a actualizar
            { where: { idSeguimiento: idSeguimientoAActualizar } } 
        );

        if (filasAfectadas === 0) {
             throw new Error(`¡El enlace falló! No se encontró ningún Seguimiento con el ID: ${idSeguimientoAActualizar}`);
        }
        console.log("[CONTROLADOR] Paso 4.1: ¡Enlace exitoso!");
        console.log('[CONTROLADOR] Paso 5: Buscando seguimiento actualizado para devolver...');

        const seguimientoActualizado = await servicioSeguimiento.obtenerDetallesDeSeguimiento(id);

        res.status(200).json({ 
            message: 'Documento procesado y guardado.',
            detalles: seguimientoActualizado 
        });

    } catch (error) {
        console.error('Error procesando el documento:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};