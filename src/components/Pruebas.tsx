import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import portada from '../assets/controldecalidad.jpg';

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
                <button
                    onClick={() => navigate('/lista_proyectos')}
                    className="px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-800 transition-all"
                    style={{ alignSelf: 'flex-start' }}
                >
                     Ir a Proyectos
                </button>
                <hr className="border-t-4 border-gray-300 my-6" />
                <h2 className="text-2xl font-bold text-blue-950 mb-6 text-center">PRUEBA BASADO EN LA EXPERIENCIA</h2>

                <img
                    src={portada}
                    alt="Control de Calidad"
                    className="mx-auto mb-6 rounded-lg shadow-md w-full max-w-3xl h-auto max-h-40 object-cover"
                />
                <p className="text-justify text-gray-700 text-sm mt-4 italic">
                    Utiliza listas de comprobación o verificación (condiciones) basadas en pautas de mantenibilidad, con la participación colaborativa del tester y el desarrollador, o la integración de ambos roles.
                    El enfoque se fundamenta en técnicas de prueba de caja (código objeto de prueba), donde cada lista está asociada a una subcaracterística de mantenibilidad, asegurando una cobertura (búsqueda) sistemática de los defectos típicos.
                </p>
                <div className="mb-4"></div>
                <div className="flex">
                    {/* Fase 1: Opciones */}
                    <div className="w-1/2 pr-4">
                        <h3 className="text-xl font-semibold text-blue-950 mb-4">Fase 1: Planificación de la prueba</h3>
                        <div className="mb-4">
                            <label className="block text-blue-950 font-semibold mb-2">Lista de verificación</label>
                            <select
                                value={selectedOption}
                                onChange={handleOptionChange}
                                className="w-3/4 p-1 text-sm border-gray-300 rounded bg-white text-black"
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
                                    className="w-3/4 p-1 text-sm border-gray-300 rounded bg-white text-black"
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
                                    className="w-3/4 p-1 text-sm border-gray-300 rounded bg-white text-black"
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
                    <div className="w-1/2 pl-4 flex flex-col justify-start items-center">
                        <h3 className="text-xl font-semibold text-blue-950 mb-4">Fase 2: Ejecución de la prueba</h3>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled()}
                            className={`w-auto mb-4 px-2 py-1 rounded ${isSubmitDisabled() ? 'bg-blue-500' : 'bg-blue-950'} text-white`}
                        >
                            Iniciar la prueba
                        </button>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    </div>
                </div>
                <hr className="border-t-4 border-gray-300 my-6" />


                <button
                    onClick={handleViewResponses}
                    className="w-auto mb-4 px-2 py-1 bg-green-600 text-white rounded"
                >
                    Informes de pruebas
                </button>
            </div>
        </div>
    );
};

export default Pruebas;
