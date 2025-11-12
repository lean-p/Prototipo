import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ContextMenu from './ContextMenu';
import Notificacion from './notificacion';

// Este componente es el "caparazón" de tu aplicación
export default function Layout({ currentUser, onLogout, setCurrentUser}) {

  const [title, setTitle] = useState('Dashboard');
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* 1. El Menú Lateral (ContextMenu) */}
      <ContextMenu currentUser={currentUser} onLogout={onLogout} />

      {/* 2. El Panel Principal (derecha) */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-poppins text-gray-800">{title}</h1>
          <header className="flex justify-end items-center p-4 bg-white border-b">
            <div className="flex items-center gap-4">
              <Notificacion />
            </div>
          </header>

          {/* 3. 🚨 ¡LA CLAVE! 🚨 */}
          {/* Aquí es donde React Router renderizará la página
              (ya sea la grilla, el dashboard de grafana, o el detalle) */}
          <main className="flex-1 p-6">
            <Outlet context={{ setTitle, setCurrentUser }}/>
          </main>
        </div>
      </div>
    </div>
  );
}