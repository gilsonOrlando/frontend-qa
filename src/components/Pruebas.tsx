import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

interface Subcaracteristica {
    _id: string;
    nombre: string;
}

interface Metrica {
    _id: string;
    nombre: string;
}

const Pruebas: React.FC = () => {
    const [subcaracteristicas, setSubcaracteristicas] = useState<Subcaracteristica[]>([]);
    const [metricas, setMetricas] = useState<Metrica[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [selectedSubcaracteristica, setSelectedSubcaracteristica] = useState<string>('');
    const [selectedMetrica, setSelectedMetrica] = useState<string>('');
    const [error, setError] = useState<string | null>(null); // Para mostrar errores
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subcaracteristicasResponse, metricasResponse] = await Promise.all([
                    api.get('/subcaracteristicas'),
                    api.get('/metricas')
                ]);
                setSubcaracteristicas(subcaracteristicasResponse.data);
                setMetricas(metricasResponse.data);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value);
        setSelectedSubcaracteristica('');
        setSelectedMetrica('');
        setError(null); // Limpiar error al cambiar la opción
    };

    const checkExistence = async (type: 'subcaracteristica' | 'metrica', idToCheck: string) => {
        try {
            const endpoint = type === 'subcaracteristica' ? '/respuestas/subcaracteristica' : '/respuestas/metrica';
            const response = await api.post(endpoint, { proyectoId: id, [type + 'Id']: idToCheck });
            return response.data.existe;
        } catch (error) {
            console.error('Error al verificar existencia:', error);
            return false;
        }
    };

    const handleSubmit = async () => {
        if (selectedOption === 'singleSubcaracteristica') {
            const exists = await checkExistence('subcaracteristica', selectedSubcaracteristica);
            if (exists) {
                setError('Ya existe una respuesta para esta subcaracterística');
                return;
            }
            navigate(`/subcategoryresponse/${selectedSubcaracteristica}/${id}/1`);
        } else if (selectedOption === 'singleMetrica') {
            const exists = await checkExistence('metrica', selectedMetrica);
            if (exists) {
                setError('Ya existe una respuesta para esta métrica');
                return;
            }
            navigate(`/metricaresponse/${selectedMetrica}/${id}/1`);
        } else if (selectedOption === 'allSubcaracteristicas') {
            navigate(`/subcategoriesresponses/${id}`);
        } else if (selectedOption === 'allMetricas') {
            navigate(`/metricsresponse/${id}`);
        } else {
            console.log('Seleccione una opción válida');
        }
    };

    const handleViewResponses = () => {
        navigate(`/projectresponses/${id}`);
    };

    const isSubmitDisabled = () => {
        // Verificar si no se ha seleccionado ninguna opción
        if (!selectedOption) return true;

        // Verificar si se seleccionó singleSubcaracteristica pero no se ha seleccionado ninguna subcaracterística
        if (selectedOption === 'singleSubcaracteristica' && !selectedSubcaracteristica) {
            return true;
        }

        // Verificar si se seleccionó singleMetrica pero no se ha seleccionado ninguna métrica
        if (selectedOption === 'singleMetrica' && !selectedMetrica) {
            return true;
        }

        // En cualquier otro caso, no deshabilitar el botón
        return false;
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-4xl bg-white p-6 shadow-md rounded-lg mt-6">
                <h2 className="text-2xl font-bold text-blue-950 mb-6 text-center">Seleccione el nivel para realizar sus pruebas</h2>
                <div className="flex">
                    {/* Fase 1: Opciones */}
                    <div className="w-1/2 pr-4">
                        <h3 className="text-xl font-semibold text-blue-950 mb-4">Fase 1: Planificación</h3>
                        <div className="mb-4">
                            <label className="block text-blue-950 font-semibold mb-2">Nivel de Pruebas</label>
                            <select
                                value={selectedOption}
                                onChange={handleOptionChange}
                                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="allSubcaracteristicas">A través de todas las subcaracterísticas</option>
                                <option value="singleSubcaracteristica">Escoger una subcaracterística</option>
                                <option value="allMetricas">A través de todas las métricas</option>
                                <option value="singleMetrica">Escoger una métrica</option>
                            </select>
                        </div>
                        {selectedOption === 'singleSubcaracteristica' && (
                            <div className="mb-4">
                                <label className="block text-blue-950 font-semibold mb-2">Subcaracterística</label>
                                <select
                                    value={selectedSubcaracteristica}
                                    onChange={(e) => setSelectedSubcaracteristica(e.target.value)}
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
                        )}
                        {selectedOption === 'singleMetrica' && (
                            <div className="mb-4">
                                <label className="block text-blue-950 font-semibold mb-2">Métrica</label>
                                <select
                                    value={selectedMetrica}
                                    onChange={(e) => setSelectedMetrica(e.target.value)}
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
                        )}
                    </div>

                    {/* Línea vertical divisoria */}
                    <div className="border-l border-gray-300 mx-4"></div>

                    {/* Fase 3: Botones */}
                    <div className="w-1/2 pl-4 flex flex-col justify-center">
                        <h3 className="text-xl font-semibold text-blue-950 mb-4">Fase 3: Ejecución</h3>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled()}
                            className={`w-full mb-4 px-4 py-2 rounded ${isSubmitDisabled() ? 'bg-blue-300' : 'bg-blue-950'} text-white`}
                        >
                            Realizar Pruebas
                        </button>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <button
                            onClick={handleViewResponses}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded"
                        >
                            Ver Respuestas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pruebas;
