import React, { useState, useRef } from 'react';
import { MoreVertical, UploadCloud, Trash2 } from 'lucide-react'; // Importamos iconos

export default function MenuAcciones({ currentUser, seguimiento, onUploadSuccess, onDeleteSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const fileInputRef = useRef(null);

  // --- Lógica de Habilitación (Tu idea del botón grisado) ---
  // ⚠️ ¡IMPORTANTE! Cambia 'arribado' por el string exacto de tu DB
  const estadoRequerido = 'delivered'; 
  const estaHabilitado = seguimiento.estadoActual === estadoRequerido;

  // --- Función de Subida ---
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSubiendo(true);
    setIsOpen(false); // Cierra el menú
    const token = currentUser?.token; 

    const formData = new FormData();
    formData.append('documento', file);

    try {
        const response = await fetch(`http://localhost:3000/api/tracks/${seguimiento.idSeguimiento}/upload-documento`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Falló la subida');
        }

        alert('Documento procesado y guardado.');
        if (onUploadSuccess) onUploadSuccess(); // Llama al "refresco"

    } catch (err) {
        alert(`Error: ${err.message}`);
    } finally {
        setSubiendo(false);
        if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  // --- Función de Borrado ---
  const handleDelete = async () => {
    setIsOpen(false); // Cierra el menú
    
    // ¡Confirmación SIEMPRE!
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el seguimiento "${seguimiento.nro_tracking}"? Esta acción no se puede deshacer.`)) {
        return;
    }

    const token = currentUser?.token;

    try {
        const response = await fetch(`http://localhost:3000/api/tracks/${seguimiento.idSeguimiento}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Falló el borrado');
        }

        alert('Seguimiento eliminado.');
        if (onDeleteSuccess) onDeleteSuccess(); // Llama al "refresco"

    } catch (err) {
        alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="relative">
      {/* El input de archivo real, oculto */}
      <input 
          type="file" 
          accept=".pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} 
      />

      {/* Botón de 3 puntitos */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-200">
        <MoreVertical size={20} />
      </button>

      {/* El Menú Desplegable */}
      {isOpen && (
        <div 
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
            onMouseLeave={() => setIsOpen(false)} // Opcional: se cierra al quitar el mouse
        >
          {/* 1. Opción Subir Documento */}
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={!estaHabilitado || subiendo}
            className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                estaHabilitado 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-gray-400 cursor-not-allowed'
            }`}
            title={!estaHabilitado ? `Solo habilitado en estado: "${estadoRequerido}"` : 'Subir Doc. Aduana'}
          >
            <UploadCloud size={16} className="mr-3" />
            {subiendo ? 'Procesando...' : 'Subir Documento'}
          </button>

          {/* 2. Opción Eliminar */}
          <button
            onClick={handleDelete}
            className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 mt-2"
          >
            <Trash2 size={16} className="mr-3" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}