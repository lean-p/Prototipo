const jwt = require('jsonwebtoken');

exports.verificarSesion = (req, res, next) => {

    const token = req.cookies.auth_token;

    const SECRET_KEY = process.env.JWT_SECRET; 

    if (!token) {
        console.error("[VerificarSesion] ¡ERROR! No se encontró la cookie 'auth_token'.");
        return res.status(401).send("Acceso denegado. No hay sesión (cookie no encontrada).");
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (ex) {
        res.status(400).send("Token de sesión inválido.");
    }
};