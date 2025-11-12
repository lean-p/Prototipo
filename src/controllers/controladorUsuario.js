const servicioUsuario = require('../services/servicioUsuario');
const validarClave = require('../utils/validadorDeClave');
const consultarTracking = require('../utils/consultarTracking');

exports.registrar = async (req, res) => {

    const {email, password, nombre, apellido} = req.body;

    if (!email || !password || !nombre) {
            
        console.warn(`WARNING - 400: Intento de registro fallido: Campos incompletos. IP: ${req.ip}`);
            
        return res.status(400).json({

            mensaje: "Los campos Email, Password y Nombre son obligatorios."

         });   
    }
    const validarClave = (password) => {
    // Regla 1: Longitud mínima de 8 caracteres
        if (password.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres.");
        }
    // Regla 2: Debe contener al menos una mayúscula
        if (!/[A-Z]/.test(password)) {
         throw new Error("La contraseña debe contener al menos una letra mayúscula.");
        }
    // Regla 3: Debe contener al menos un número
        if (!/[0-9]/.test(password)) {
            throw new Error("La contraseña debe contener al menos un número.");
        }
    
    // Si pasa todas las reglas, no devuelve nada (implica éxito)
    };
    try {

        validarClave(password)

    } catch (errorValidacion) {

        return res.status(400).json({

            mensaje: errorValidacion.message

        });
    }

    try {

        const usuario = await servicioUsuario.registrarUsuario(email, password, nombre, apellido);

        return res.status(201).json({

            mensaje: "Usuario registrado con exito",
            userID: usuario.email

        });

    } catch (error) {

        return res.status(409).json({

            mensaje: error.message

        });
    }
};

exports.autenticar = async (req, res) => {

    const {email, password} = req.body;

    try {

        const usuarioAutenticado = await servicioUsuario.autenticarUsuario(email, password);

        res.cookie('auth_token', usuarioAutenticado.token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 3600 * 1000 
        });

        return res.status(200).json({

                mensaje: "Usuario autenticado",
                token: usuarioAutenticado.token,
                usuario: {
                    user: usuarioAutenticado.email,
                    userID: usuarioAutenticado.userID,
                    nombre: usuarioAutenticado.nombre,
                    apellido: usuarioAutenticado.apellido
                }
                

        });

    } catch (error) {

        return res.status(400).json({

            mensaje: error.message

        });
    }
};

exports.modificar = async (req, res) =>{

    userID = req.user.userID;
    datos = req.body

    try {

        const usuarioActualizado = await servicioUsuario.modificarUsuario(userID, datos)

        return res.status(200).json({

                mensaje: "Usuario actualizado"
        
        });

    } catch (error) {

        console.error("Error en actualizar usuario:", error);
        
        return res.status(400).json({

            mensaje: error.message

        });

    }
}

exports.cerrarSesion = (req, res) => {
    try {
        res.cookie('auth_token', '', {
            httpOnly: true,
            path: '/', // ¡Debe coincidir con el path de la cookie original!
            expires: new Date(0) // ¡Expira inmediatamente!
        });

        res.status(200).json({ message: "Sesión cerrada exitosamente" });

    } catch (error) {
        console.error("Error en cerrarSesion:", error);
        res.status(500).json({ error: "Error interno al cerrar sesión" });
    }
};

/*exports.consultarTracking = async (req, res) => {

    const {nro_tracking, transportista} = req.body;

    try {

        const tracking = await consultarTracking.consultarTracking(nro_tracking, transportista);

        return res.status(200).json(tracking)

    } catch (error) {

        return error
    }
} */