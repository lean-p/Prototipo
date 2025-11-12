// src/middleware/upload.js

const multer = require('multer');

// 1. Configuración de Almacenamiento
// Usamos 'memoryStorage' para guardar el archivo en la RAM (en req.file.buffer)
// Esto es mucho más rápido y limpio que guardarlo en el disco,
// ya que solo queremos pasarlo al motor de OCR y luego descartarlo.
const storage = multer.memoryStorage();

// 2. Configuración del Middleware de Multer
const upload = multer({
    storage: storage,
    limits: {
        // Límite de tamaño de archivo: 50 MB (expresado en bytes)
        fileSize: 50 * 1024 * 1024 
    }
});

// 3. Exportamos el middleware configurado
// Lo exportamos como un objeto para poder importarlo con { upload }
module.exports = {
    upload
};