import React from 'react';

interface SelectorSubcaracteristicaProps {
    subcaracteristicas: Array<{ _id: string; nombre: string }>;
    selectedSubcaracteristica: string;
    onSubcaracteristicaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectorSubcaracteristica: React.FC<SelectorSubcaracteristicaProps> = ({
    subcaracteristicas,
    selectedSubcaracteristica,
    onSubcaracteristicaChange
}) => {
    return (
        <div className="mb-4">
            <label className="block text-blue-950 font-semibold mb-2">Subcaracterística</label>
            <select
                value={selectedSubcaracteristica}
                onChange={onSubcaracteristicaChange}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
            >
                <option value="">Seleccione una subcaracterística</option>
                {subcaracteristicas.map((subcaracteristica) => (
                    <option key={subcaracteristica._id} value={subcaracteristica._id}>
                        {subcaracteristica.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectorSubcaracteristica;
