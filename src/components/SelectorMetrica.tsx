import React from 'react';

interface SelectorMetricaProps {
    metricas: Array<{ _id: string; nombre: string }>;
    selectedMetrica: string;
    onMetricaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectorMetrica: React.FC<SelectorMetricaProps> = ({
    metricas,
    selectedMetrica,
    onMetricaChange
}) => {
    return (
        <div className="mb-4">
            <label className="block text-blue-950 font-semibold mb-2">Métrica</label>
            <select
                value={selectedMetrica}
                onChange={onMetricaChange}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
            >
                <option value="">Seleccione una métrica</option>
                {metricas.map((metrica) => (
                    <option key={metrica._id} value={metrica._id}>
                        {metrica.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectorMetrica;
