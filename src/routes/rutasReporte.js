const express = require('express');
const router = express.Router();
const controlReporte = require('../controllers/controladorReporte');
const { verificarToken } = require('../middleware/auth');

router.get('/reporte', verificarToken, controlReporte.crear);

module.exports = router;