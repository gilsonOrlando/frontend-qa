import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

interface Respuesta {
    _id: string;
    nombre: string;
    intentos: number;
    tipo: string;
    subcaracteristicaId?: string;
    metricaId?: string;
    respuestas: {
        pautaId?: string;
        listaVerificacion?: string;
        valor?: number;
        comentario?: string;
    }[];
    proyectoId: string;
}

const ProjectResponses: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<{ id: string; tipo: string } | null>(null);
    const [showAdditionalQuestion, setShowAdditionalQuestion] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/respuestas/${id}`);
                setRespuestas(response.data);
            } catch (error) {
                console.error('Error al obtener las respuestas:', error);
                setError('Error al obtener las respuestas');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleReattempt = (itemId: string, tipo: string) => {
        setShowAdditionalQuestion(true);
        // Guardar el ID del ítem actual y su tipo en el estado
        setSelectedItem({ id: itemId, tipo });
    };

    const handleAdditionalQuestionResponse = (response: string) => {
        setShowAdditionalQuestion(false);
    
        if (response === 'sí') {
            if (selectedItem?.tipo === 'singleSubcaracteristica') {
                navigate(`/select-subcaracteristicas/${selectedItem.id}/${id}`);
            } else if (selectedItem?.tipo === 'singleMetrica') {
                navigate(`/select-metricas/${selectedItem.id}/${id}`);
            }
        } else {
            if (selectedItem?.tipo === 'singleSubcaracteristica') {
                navigate(`/subcategoryresponse/${selectedItem.id}/${id}/2`, {
                    state: { additionalSubcaracteristicas: [] } // Estado inicial vacío
                });
            } else if (selectedItem?.tipo === 'singleMetrica') {
                navigate(`/metricaresponse/${selectedItem.id}/${id}/2`);
            }
        }
    };
    

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">Respuestas del Proyecto</h1>
            <ul className="bg-white shadow-lg rounded-lg p-6">
                {respuestas.map((respuesta) => (
                    <li
                        key={respuesta._id}
                        className="flex justify-between items-center mb-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-md shadow-sm transition duration-200"
                    >
                        <span className="text-lg font-medium text-gray-800">{respuesta.nombre}</span>
                        <div className="flex space-x-4">
                            {(respuesta.intentos < 2 && (respuesta.tipo === 'singleSubcaracteristica' || respuesta.tipo === 'singleMetrica')) && (
                                <button
                                    onClick={() => handleReattempt(respuesta.subcaracteristicaId || respuesta.metricaId || '', respuesta.tipo)}
                                    className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Realizar la prueba de nuevo
                                </button>
                            )}
                            <button
                                onClick={() => navigate(`/calculos/${respuesta._id}`)}
                                className="px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Ver Cálculos
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {showAdditionalQuestion && (
                <div className="mt-6">
                    <p className="text-lg font-semibold mb-2">¿Deseas agregar otra {selectedItem?.tipo === 'subcaracteristica' ? 'subcaracterística' : 'métrica'}?</p>
                    <button
                        onClick={() => handleAdditionalQuestionResponse('sí')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
                    >
                        Sí
                    </button>
                    <button
                        onClick={() => handleAdditionalQuestionResponse('no')}
                        className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 ml-4"
                    >
                        No
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectResponses;
