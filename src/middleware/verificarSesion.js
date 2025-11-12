const jwt = require('jsonwebtoken');

exports.verificarSesion = (req, res, next) => {
    


    // 1. ¿Instalaste 'cookie-parser' y lo usaste en app.js?
    // Si 'req.cookies' es undefined, es porque falta 'cookie-parser'


    // 2. Busca el token en 'req.cookies'
    const token = req.cookies.auth_token;

    const SECRET_KEY = process.env.JWT_SECRET; 

    if (!token) {
        console.error("[VerificarSesion] ¡ERROR! No se encontró la cookie 'auth_token'.");
        // Esto es lo que ve el <iframe>
        return res.status(401).send("Acceso denegado. No hay sesión (cookie no encontrada).");
    }



    try {
        // 3. Verifica el token de la cookie
        const decoded = jwt.verify(token, SECRET_KEY);
        


        // 4. Pone los datos del usuario en 'req.user'
        req.user = decoded; 
        

        next();

    } catch (ex) {

        res.status(400).send("Token de sesión inválido.");
    }
};