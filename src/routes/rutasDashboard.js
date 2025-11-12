const express = require('express');
const router = express.Router();
const { verificarSesion } = require('../middleware/verificarSesion');
const controladorDashboard = require('../controllers/controladorDashboard')

router.get('/seguimientos-por-estado', verificarSesion, controladorDashboard.obtenerCantidadDeSeguimientosPorEstado);
router.get('/seguimientos-por-ciudad', verificarSesion, controladorDashboard.obtenerCantidadDeSeguimientosPorCiudad);
router.get('/seguimientos-por-vendedor', verificarSesion, controladorDashboard.obtenerSeguimientosPorVendedor);
router.get('/costo-por-transportista', verificarSesion, controladorDashboard.obtenerCostoDeFletePorTransportista);
router.get('/cumplimiento-de-plazos', verificarSesion, controladorDashboard.obtenerCumplimientoDePlazos);
router.get('/tendencia-de-envios', verificarSesion, controladorDashboard.obtenerTendenciaDeDemoraPorEnvio);

module.exports = router;