// App.jsx - Versión "Refactorizada"

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. Importamos todos los componentes de página ---
import Layout from './pages/Layout';                     // El "caparazón" (con ContextMenu, Notificacion, Outlet)
import Dashboard from './pages/Dashboard';               // El NUEVO dashboard (mostrará Grafana)
import VistaSeguimientos from './pages/VistaSeguimientos'; // Tu grilla (el Dashboard.jsx "renombrado")
import RegistrarSeguimiento from './pages/RegistrarSeguimiento';
import SeguimientoDetalle from './pages/SeguimientoDetalle';
import Usuario from './pages/Usuario';
import Login from './pages/Login';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // (Tu lógica de handleLoginSuccess y handleLogout se mantiene igual)
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = async () => {
        try {
            // 1. Le decimos al backend que mate la cookie 'auth_token'
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include', 
            });

            if (!response.ok) {
                console.error("Error del backend al cerrar sesión");
            }
            
        } catch (error) {
            console.error("Error de red al cerrar sesión:", error);
        } finally {
            setCurrentUser(null);
        }
    };


  return (
    <BrowserRouter>
      <Routes>

        {/* --- RUTA PÚBLICA --- */}
        {/* Si el usuario YA está logueado, /login lo redirige al dashboard */}
        <Route 
          path="/login" 
          element={!currentUser ? <Login onLogin={handleLoginSuccess} /> : <Navigate to="/" />} 
        />

        {/* --- RUTAS PROTEGIDAS (¡Aquí está el refactor!) --- */}
        <Route 
          path="/" 
          element={
            currentUser ? 
            <Layout currentUser={currentUser} onLogout={handleLogout} setCurrentUser={setCurrentUser} /> : 
            <Navigate to="/login" replace />
          }
        >
          {/* La ruta "raíz" (/) ahora muestra el Dashboard de Grafana */}
          <Route 
            index // 'index' significa que es la ruta por defecto (path="/")
            element={<Dashboard currentUser={currentUser} />} 
          />
          <Route 
            element={<Usuario currentUser={currentUser} />}
            path='usuario'
          />          
          {/* La ruta /seguimientos ahora muestra la Grilla */}
          <Route 
            path="seguimientos" 
            element={<VistaSeguimientos currentUser={currentUser} />} 
          />
          
          {/* Tus otras rutas anidadas */}
          <Route 
            path="seguimiento/:id" 
            element={<SeguimientoDetalle currentUser={currentUser} />} 
          />
          <Route 
            path="registrar" 
            element={<RegistrarSeguimiento currentUser={currentUser} />} 
          />
          {/* ... (cualquier otra ruta que vaya dentro del layout) */}
        </Route>

        {/* Fallback: cualquier otra ruta redirige al login o a la raíz */}
        <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} />} />

      </Routes>
    </BrowserRouter>
  );
}