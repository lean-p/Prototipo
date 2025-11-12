const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
//const Usuario = require('../model/Usuario');
const {Usuario} = require('../model/index');
const {op} = require('sequelize');

exports.registrarUsuario = async (email, password, nombre, apellido = 'Sin Apellido') => {
    
    const usuarioExistente = await Usuario.findOne({
        where: { email: email}
    });

    if (usuarioExistente) {
        console.error("ALERT: Usuario existente");
        throw new Error(`El usuario '${email}' ya se encuentra registrado.` );
    }
    
       try {
        const hashPassword = await bcrypt.hash(password, saltRounds);

        const nuevoUsuario = {
            email,
            nombre,
            apellido,
            hashPassword: hashPassword,
        };

        console.log("Intentando crear usuario con estos datos:", nuevoUsuario);

        const usuarioCreado = await Usuario.create(nuevoUsuario);

        return {
            userID: usuarioCreado.userID,
            email: usuarioCreado.email,
            nombre: usuarioCreado.nombre,
            apellido: usuarioCreado.apellido
        };
    } catch (error) {

        console.error("Error al crear usuario en la base de datos:", error); 

        throw new Error('No se pudo registrar el usuario. Inténtelo más tarde.');
    }

};

const JWT_SECRET = process.env.JWT_SECRET;

exports.autenticarUsuario = async (email, password) => {

    const usuario = await Usuario.findOne({
        where: { email: email},
         attributes: [
            'userID', 
            'nombre', 
            'apellido', 
            'email', 
            'hashPassword' // Necesario para bcrypt.compare()
        ]
    });

    if (!usuario) {

        console.error("ALERT: Usuario o contraseña incorrecto");
        throw new Error ('Usuario o contraseña incorrecto');
    }

    const claveValida = await bcrypt.compare(password, usuario.hashPassword);
    
    if (!claveValida) {

        console.error("ALERT: Usuario o contraseña incorrecto");
        throw new Error ('Usuario o contraseña incorrecto');
    }
    const payload = {
        userID: usuario.userID, // 👈 EL ID ES LO MÁS IMPORTANTE PARA LA SESIÓN
        email: usuario.email
        // Puedes incluir el rol, etc.
    };
    console.log(payload);
    // 2. GENERAR Y FIRMAR el token
    const token = jwt.sign(
        payload, 
        JWT_SECRET, // Usa tu clave secreta
        { expiresIn: '1h' } // El token expira en 1 hora (o el tiempo que desees)
    );

    // --- RETORNO FINAL ---

    // Devolvemos el TOKEN y los datos públicos del usuario
    return {
        token: token,
        userID: usuario.userID,
        email: usuario.dataValues.email,
        nombre: usuario.dataValues.nombre,
        apellido: usuario.dataValues.apellido
    };
};

exports.modificarUsuario = async(userID, datos) => {

    if (datos.clave) {

            const claveHasheada = await bcrypt.hash(password, saltRounds);
            datos.clave = claveHasheada; 
    }

    const [filasActualizadas] = await Usuario.update(datos, {
            where: { userID: userID }
        });
    
    if (filasActualizadas === 0) {
            throw new Error("Usuario no encontrado o datos idénticos");
        }

        return true;
}

