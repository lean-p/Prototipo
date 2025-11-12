exports.validarClave = (password) => {

        if (password.length < 8) {
            throw new Error ('La clave debe tener al menos 8 caracteres')
        }

        if (!/[A-Z]/.password) {
            throw new Error ('La clave debe contener al menos una letra mayuscula');
        }
        
        if (!/[a-z]/.password) {
            throw new Error ('La clave debe contener al menos una letra minuscula');
        }
        if (!/[0-9]/.password) {
            throw new Error ('La clave debe contener al menos un numero');
        }

    };