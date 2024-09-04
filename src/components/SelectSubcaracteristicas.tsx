import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

interface Subcaracteristica {
  _id: string;
  nombre: string;
}

const SelectSubcaracteristicas: React.FC = () => {
    const { id: initialSubcaracteristicaId, id2: proyectoId } = useParams<{ id: string; id2: string }>();
    const navigate = useNavigate();
    const [subcaracteristicas, setSubcaracteristicas] = useState<Subcaracteristica[]>([]);
    const [selectedSubcaracteristicas, setSelectedSubcaracteristicas] = useState<string[]>([]);

    useEffect(() => {
        const fetchSubcaracteristicas = async () => {
            try {
                // Pasar los IDs de subcaracterísticas a excluir en la consulta
                const response = await api.get<Subcaracteristica[]>(`/subcaracteristicas/excluir?excludeIds=${initialSubcaracteristicaId}`);
                setSubcaracteristicas(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error al obtener las subcaracterísticas:', error);
            }
        };

        fetchSubcaracteristicas();
    }, [initialSubcaracteristicaId]);

    const handleChange = (subcaracteristicaId: string) => {
        setSelectedSubcaracteristicas(prevState =>
            prevState.includes(subcaracteristicaId)
                ? prevState.filter(id => id !== subcaracteristicaId)
                : [...prevState, subcaracteristicaId]
        );
    };

    const handleSubmit = () => {
        navigate(`/subcategoryresponse/${initialSubcaracteristicaId}/${proyectoId}/2`, {
            state: { additionalSubcaracteristicas: selectedSubcaracteristicas } // Pasar subcaracterísticas seleccionadas
        });
    };
    

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Selecciona Subcaracterísticas Adicionales</h1>
            {subcaracteristicas.map(subcaracteristica => (
                <div key={subcaracteristica._id} className="mb-2 text-black">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedSubcaracteristicas.includes(subcaracteristica._id)}
                            onChange={() => handleChange(subcaracteristica._id)}
                            className="mr-2"
                        />
                        {subcaracteristica.nombre}
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

export default SelectSubcaracteristicas;
