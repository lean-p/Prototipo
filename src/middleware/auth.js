const jwt = require('jsonwebtoken');

// Usamos la misma clave secreta que en el login
const SECRET_KEY = process.env.JWT_SECRET; 

exports.verificarToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Se requiere autenticación.' });
    }
    
    // Se remueve Bearer para obtener solo el token
    const token = authHeader.replace('Bearer ', '');
    console.log(req.userID);
    const decoded = jwt.verify(token, SECRET_KEY);

    try {
        // Decodificacion del token
        const decoded = jwt.verify(token, SECRET_KEY);

        req.userID = decoded.userID || decoded.id || decoded.userId; 

        if (!req.userID) {
            console.error("Fallo de JWT: Token válido, pero no se encontró la clave de usuario (userID, id o userId) en el payload.");
            return res.status(401).json({ mensaje: 'Token inválido o expirado. Reinicia la sesión.' });
        }
        
        next();
    } catch (err) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
};