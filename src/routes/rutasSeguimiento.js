const express = require('express');
const router = express.Router();
const controlSeguimiento = require('../controllers/controladorSeguimiento');
const controlDocumento = require('../controllers/controladorDocumento');
const { upload } = require('../utils/upload')

const { verificarToken } = require('../middleware/auth');
const { verificarSesion } = require('../middleware/verificarSesion');

router.post('/registerTrack', verificarToken, controlSeguimiento.registrar);

router.get('/listTracks', verificarSesion, controlSeguimiento.listarSeguimientosPaginados);

router.get('/:id', verificarToken, controlSeguimiento.detalleSeguimiento);

router.delete('/:id', verificarToken, controlSeguimiento.eliminar);

router.post('/:id/upload-documento', verificarToken, upload.single('documento'), controlDocumento.procesarDocumentoAduana);

module.exports = router;