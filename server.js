// server.js
require('dotenv').config({ path: 'config.env' }); // ¡LÍNEA 1!
const express = require('express');
const cors = require('cors');
const db = require('./src/model/index');
const { programarTarea } = require('./src/utils/cronSeguimientos');
const { cronEtl } = require('./src/utils/cronETL');
const cookieParser = require('cookie-parser');
const { verificarSesion } = require('./src/middleware/verificarSesion');

// --- Importación de Rutas ---
const rutasUsuario = require('./src/routes/rutasUsuario');
const rutasSeguimiento = require('./src/routes/rutasSeguimiento');
const rutasAlertas = require('./src/routes/rutasAlertas');
const rutasReportes = require('./src/routes/rutasReporte');
const rutasDashboard = require('./src/routes/rutasDashboard'); 

// --- Inicialización de App y Server ---
const app = express();


// --- Middlewares Esenciales ---
// (Estos se ejecutan en cada petición)
app.use(cors({
    origin: 'http://localhost:5173', // Tu puerto de React
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/info', rutasReportes);
app.use('/api/auth', rutasUsuario);
app.use('/api/tracks', rutasSeguimiento);
app.use('/api/alertas', rutasAlertas);
app.use('/api/dashboard', rutasDashboard);

const PORT = process.env.PORT || 3000;

db.sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión a la DB establecida correctamente.');
        // ¡Usamos 'server.listen' para que WebSockets funcione!
        app.listen(PORT, () => {
            console.log(`🚀 Servidor de API corriendo en http://localhost:${PORT}`);
            programarTarea();
            cronEtl();
        });
    })
    .catch(err => {
        console.error('❌ No se pudo conectar a la DB:', err);
    });