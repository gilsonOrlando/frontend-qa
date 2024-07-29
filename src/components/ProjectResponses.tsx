import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

interface Respuesta {
    _id: string; // ID de la respuesta
    nombre: string; // Solo el nombre de la respuesta
}

const ProjectResponses: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                        <button
                            onClick={() => navigate(`/calculos/${respuesta._id}`)}
                            className="ml-4 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Ver Cálculos
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectResponses;
