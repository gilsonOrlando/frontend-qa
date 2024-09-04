import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

interface Metrica {
    _id: string;
    nombre: string;
}

const SelectMetricas: React.FC = () => {
    const { id: initialMetricaId, id2: proyectoId } = useParams<{ id: string; id2: string }>();
    const navigate = useNavigate();
    const [metricas, setMetricas] = useState<Metrica[]>([]);
    const [selectedMetricas, setSelectedMetricas] = useState<string[]>([]);

    useEffect(() => {
        const fetchMetricas = async () => {
            try {
                // Pasar los IDs de métricas a excluir en la consulta
                const response = await api.get<Metrica[]>(`/metricas/excluir?excludeIds=${initialMetricaId}`);
                setMetricas(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error al obtener las métricas:', error);
            }
        };

        fetchMetricas();
    }, [initialMetricaId]);

    const handleChange = (metricaId: string) => {
        setSelectedMetricas(prevState =>
            prevState.includes(metricaId)
                ? prevState.filter(id => id !== metricaId)
                : [...prevState, metricaId]
        );
    };

    const handleSubmit = () => {
        navigate(`/metricaresponse/${initialMetricaId}/${proyectoId}/2`, {
            state: { additionalMetricas: selectedMetricas }
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Selecciona Métricas Adicionales</h1>
            {metricas.map(metrica => (
                <div key={metrica._id} className="mb-2 text-black">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedMetricas.includes(metrica._id)}
                            onChange={() => handleChange(metrica._id)}
                            className="mr-2"
                        />
                        {metrica.nombre}
                    </label>
                </div>
            ))}
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 mt-4"
            >
                Continuar
            </button>
        </div>
    );
};

export default SelectMetricas;
