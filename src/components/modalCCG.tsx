import React from 'react';
import solucionesCCG from '../docs/solucionesCCG';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMetric: string | null;
}

const SolucionesModal: React.FC<ModalProps> = ({ isOpen, onClose, selectedMetric }) => {
  if (!isOpen) return null;

  // Filtrar las soluciones relacionadas con la métrica seleccionada
  const solucionesFiltradas = selectedMetric
    ? solucionesCCG.filter(solucion => solucion.metrica === selectedMetric)
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full"> {/* Aumenté el ancho */}
        <h2 className="text-2xl font-bold mb-6 text-center">INCUMPLIMIENTO DE REGLAS</h2>

        <div className="max-h-96 overflow-y-auto space-y-6"> {/* Más altura y separación entre reglas */}
          {solucionesFiltradas.length > 0 ? (
            solucionesFiltradas.map((solucion, index) => (
              <div key={index} className="border-b pb-4">
                <h3 className="font-semibold text-lg text-gray-800">{solucion.regla}</h3>
                <p className="text-gray-700"><strong>Recomendación:</strong> {solucion.recomendacion}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No hay recomendaciones para esta métrica.</p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button 
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
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
