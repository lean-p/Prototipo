import { useState } from "react";
import { useNavigate } from 'react-router-dom';


export default function ContextMenu({ currentUser, onLogout}) {
  const [activeItem, setActiveItem] = useState("Mis Seguimientos");
  const navigate = useNavigate();
  const menuItems = [
    {
      id: "cuenta",
      label: "Mi Cuenta", 
      icon: "👤",
      path: "usuario"
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      path: "dashboard"
    },
    {
      id: "seguimientos",
      label: "Seguimientos",
      icon: "📦",
      path: "seguimientos"
    }
  ];

  const handleItemClick = (item) => {
    setActiveItem(item.label);
    navigate(item.path);
  };

  const nombreCompleto = currentUser.usuario
        ? `${currentUser.usuario.nombre || ''} ${currentUser.usuario.apellido || ''}`.trim()
        : 'Cargando Usuario';
  const emailUsuario = currentUser.usuario ? currentUser.usuario.user : 'No autenticado';

  return (
    <div className="min-h-screen bg-white shadow-xl border-r border-gray-200 p-6 flex flex-col">
      {/* Header de la barra lateral - Con imagen/logo */}
      <div className="mb-8">
        <div className="flex flex-col items-center gap-3 mb-4">
          {/* Imagen/logo placeholder - puedes reemplazar con tu logo */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">📦</span>
          </div>
          {/* Quitamos el título de sistema de cargas */}
        </div>
        <div className="w-16 h-1 bg-blue-500 rounded-full mx-auto"></div>
      </div>

      {/* Items del menú */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeItem === item.label
                ? "bg-blue-50 border border-blue-200 text-blue-700 shadow-sm"
                : "text-white hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
            {activeItem === item.label && (
              <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer en la parte inferior */}
      <div className="pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">{nombreCompleto}</p>
          <p className="text-xs text-gray-500 mt-1">{emailUsuario}</p>
          <button 
            onClick={onLogout}
            className="mt-4 w-full text-sm text-white hover:text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
            >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}