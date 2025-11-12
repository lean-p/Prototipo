const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Usuario} = require('../model/index');
const {op} = require('sequelize');

const saltRounds = 10;

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
            'hashPassword'
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
        userID: usuario.userID,
        email: usuario.email
    };
    console.log(payload);

    const token = jwt.sign(
        payload, 
        JWT_SECRET, 
        { expiresIn: '1h' } 
    );

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

