import React from 'react';

interface SelectorDeOpcionesProps {
    selectedOption: string;
    onOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectorDeOpciones: React.FC<SelectorDeOpcionesProps> = ({ selectedOption, onOptionChange }) => {
    return (
        <div className="mb-4">
            <label className="block text-blue-950 font-semibold mb-2">Nivel de Pruebas</label>
            <select
                value={selectedOption}
                onChange={onOptionChange}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
            >
                <option value="">Seleccione una opción</option>
                <option value="allSubcaracteristicas">A través de todas las subcaracterísticas</option>
                <option value="singleSubcaracteristica">Escoger una subcaracterística</option>
                <option value="allMetricas">A través de todas las métricas</option>
                <option value="singleMetrica">Escoger una métrica</option>
            </select>
        </div>
    );
};

export default SelectorDeOpciones;
