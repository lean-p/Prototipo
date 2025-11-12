// src/controllers/controladorDocumento.js
const servicioDocumento = require('../services/servicioDocumento');
const {Documento, Seguimiento} = require('../model/index'); // Importamos el nuevo modelo
const servicioSeguimiento = require('../services/servicioSeguimiento'); // Para traer el seguimiento actualizado


exports.procesarDocumentoAduana = async (req, res) => {
    
    let datosExtraidos; // La definimos aquí para que el 'catch' la vea
    const idSeguimientoAActualizar = req.params.id; // El ID del seguimiento
    
    try {
        // 1. Obtener el ID del seguimiento
        const { id } = req.params;

        if (!idSeguimientoAActualizar) {
            throw new Error("El ID del seguimiento no llegó en los parámetros (req.params.id).");
        }
        
        // 2. Obtener el archivo (Multer lo pone en req.file)
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo.' });
        }

        // 3. Llamar al "motor" (nuestro servicio OCR)
        datosExtraidos = await servicioDocumento.analizarDocumentoDeAduana(req.file.buffer);
        
        console.log('Datos de OCR extraídos para guardar:', datosExtraidos);

        // 4. 🚨 ¡AÑADIR LA FOREIGN KEY! 🚨
        datosExtraidos.idSeguimiento_FK = parseInt(id, 10);

        // 5. Guardar los datos en la NUEVA tabla 'Documento'
        const nuevoDocumento = await Documento.create(datosExtraidos);
        console.log(`[CONTROLADOR] Paso 3.1: ¡ÉXITO! Documento Creado con ID: ${nuevoDocumento.idDocumento}`);
        // 6. Devolver el seguimiento COMPLETO (con el nuevo doc) al frontend
        // (Usamos la función que ya tenías para tu vista de "Detalle")
        console.log(`[CONTROLADOR] Paso 4: Enlazando... Actualizando Seguimiento ID: ${idSeguimientoAActualizar} con Documento ID: ${nuevoDocumento.idDocumento}`);

        const [filasAfectadas] = await Seguimiento.update(
            { idDocumento_FK: nuevoDocumento.idDocumento }, // El dato a actualizar
            { where: { idSeguimiento: idSeguimientoAActualizar } } // Dónde
        );

        if (filasAfectadas === 0) {
             throw new Error(`¡El enlace falló! No se encontró ningún Seguimiento con el ID: ${idSeguimientoAActualizar}`);
        }
        console.log("[CONTROLADOR] Paso 4.1: ¡Enlace exitoso!");

        // 5. DEVOLVER RESPUESTA (la que tu frontend espera)
        console.log('[CONTROLADOR] Paso 5: Buscando seguimiento actualizado para devolver...');

        const seguimientoActualizado = await servicioSeguimiento.obtenerDetallesDeSeguimiento(id);

        res.status(200).json({ 
            message: 'Documento procesado y guardado.',
            // Devolvemos el mismo formato que usa tu frontend
            detalles: seguimientoActualizado 
        });

    } catch (error) {
        console.error('Error procesando el documento:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};