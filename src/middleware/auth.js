// src/middleware/auth.js

const jwt = require('jsonwebtoken');

// Usamos la misma clave secreta que definiste en el login
const SECRET_KEY = process.env.JWT_SECRET; 

exports.verificarToken = (req, res, next) => {
    // 1. Obtener el token (normalmente del header 'Authorization')
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Se requiere autenticación.' });
    }
    
    // El token viene como 'Bearer <token>'. Quitamos 'Bearer '
    const token = authHeader.replace('Bearer ', '');
    console.log(req.userID);
    const decoded = jwt.verify(token, SECRET_KEY);

    try {
        // 2. Verificar y decodificar el token
        const decoded = jwt.verify(token, SECRET_KEY);

        req.userID = decoded.userID || decoded.id || decoded.userId; 

        // 4. Chequeo de seguridad: Si no se encontró el ID en ninguna clave, detener.
        if (!req.userID) {
            console.error("Fallo de JWT: Token válido, pero no se encontró la clave de usuario (userID, id o userId) en el payload.");
            return res.status(401).json({ mensaje: 'Token inválido o expirado. Reinicia la sesión.' });
        }
        
        next(); // Continuar al controlador
    } catch (err) {
        // Fallo en la verificación (token alterado o expirado)
        return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
};