const express = require('express');
const router = express.Router();
const controlUsuario = require('../controllers/controladorUsuario');
const verificarSesion = require('../middleware/verificarSesion')

router.post('/register', controlUsuario.registrar);

router.post('/login', controlUsuario.autenticar);

router.patch('/perfil', verificarSesion.verificarSesion, controlUsuario.modificar);

router.post('/logout', verificarSesion.verificarSesion, controlUsuario.cerrarSesion)

module.exports = router;