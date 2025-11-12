const express = require('express');
const router = express.Router();
const controlAlerta = require('../controllers/controladorAlerta');
const { verificarToken } = require('../middleware/auth');

router.get('/', verificarToken, controlAlerta.alertar);

router.put('/:id/leido', verificarToken, controlAlerta.leido);

module.exports = router;