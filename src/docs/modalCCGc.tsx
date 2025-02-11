import React from 'react';
import complejidadCognitiva from './solucionesCCG.tsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SolucionesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Recomendaciones</h2>
        
        <div className="max-h-80 overflow-y-auto">
          {complejidadCognitiva.map((solucion, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-lg">{solucion.regla}</h3>
              <p className="text-gray-700">{solucion.recomendacion}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolucionesModal;
