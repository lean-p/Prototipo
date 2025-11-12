/* === ARCHIVO CORREGIDO: src/routes/rutasDashboard.js === */

const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');
const { verificarSesion } = require('../middleware/verificarSesion');

const GRAFANA_HOST = 'http://127.0.0.1:8080';

// 🔥 MIDDLEWARE para inyectar autenticación
const injectAuthHeaders = (req, res, next) => {
    console.log('=== 🔐 INYECTANDO AUTH HEADERS ===');
    console.log('URL:', req.url);
    console.log('Usuario:', req.user?.email);
    
    const userEmail = req.user?.email;
    
    if (userEmail) {
        // Headers que Grafana espera para auth proxy
        req.headers['x-webauth-user'] = userEmail;
        req.headers['x-grafana-user'] = userEmail;
        req.headers['remote-user'] = userEmail;
        
        console.log('Headers de auth inyectados para:', userEmail);
    }
    
    next();
};

// 🔥 PROXY PRINCIPAL para paneles
const grafanaPanelProxy = createProxyMiddleware({
    target: GRAFANA_HOST,
    changeOrigin: true,
    logLevel: 'debug',
    
    onProxyReq: (proxyReq, req, res) => {
        console.log('=== 🚀 onProxyReq EJECUTADO ===');
        console.log('Proxy URL:', req.url);
        console.log('Headers enviados a Grafana:', {
            'x-webauth-user': proxyReq.getHeader('x-webauth-user'),
            'x-grafana-user': proxyReq.getHeader('x-grafana-user')
        });
    },
    
    onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ [Proxy Response] Status: ${proxyRes.statusCode} for ${req.url}`);
    },
    
    onError: (err, req, res) => {
        console.error('❌ [Proxy Error]:', err);
        res.status(500).send('Proxy error');
    }
});

// 🔥 RUTA ESPECÍFICA para paneles
router.get('/panel/:panelId', verificarSesion, injectAuthHeaders, (req, res, next) => {
    console.log('=== 🎯 PROCESANDO PANEL ===');
    
    // Reescribir la URL para el panel específico
    const panelId = req.params.panelId;
    req.url = `/d-solo/addwncq/seguimientos-dashboards?orgId=1&from=now-6h&to=now&timezone=browser&panelId=${panelId}&__feature.dashboardSceneSolo=true`;
    
    console.log(`URL reescrita: ${req.url}`);
    
    // Pasar al proxy
    grafanaPanelProxy(req, res, next);
});

// 🔥 PROXY para RECURSOS de Grafana (CSS, JS, imágenes)
const grafanaAssetsProxy = createProxyMiddleware({
    target: GRAFANA_HOST,
    changeOrigin: true,
    logLevel: 'silent'
});

// 🔥 RUTAS para recursos (SIN autenticación para assets públicos)
router.use('/public', grafanaAssetsProxy);
router.use('/img', grafanaAssetsProxy);
router.use('/build', grafanaAssetsProxy);
router.use('/avatar', grafanaAssetsProxy);

module.exports = router;



