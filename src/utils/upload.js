const multer = require('multer');

// Usamos 'memoryStorage' para guardar el archivo en la RAM
// para procesar el archivo con OCR
const storage = multer.memoryStorage();

//Configuración del Middleware de Multer
const upload = multer({
    storage: storage,
    limits: {
        // Límite de tamaño de archivo: 50 MB
        fileSize: 50 * 1024 * 1024 
    }
});

module.exports = {
    upload
};