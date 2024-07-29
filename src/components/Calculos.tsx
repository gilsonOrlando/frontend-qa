import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

interface Calculo {
    nombre: string;
    promedio: number;
}

const Calculos: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [calculos, setCalculos] = useState<Calculo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCalculos = async () => {
            try {
                const response = await api.get(`/calculos/promedios/${id}`);
                setCalculos(response.data);
            } catch (error) {
                console.error('Error al obtener cálculos:', error);
                setError('Error al obtener cálculos');
            } finally {
                setLoading(false);
            }
        };

        fetchCalculos();
    }, [id]);

    if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">Cálculos del Proyecto</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-3 px-4 text-left text-gray-600">Nombre</th>
                        <th className="py-3 px-4 text-left text-gray-600">Promedio</th>
                    </tr>
                </thead>
                <tbody>
                    {calculos.length > 0 ? (
                        calculos.map((calculo, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-3 px-4 text-gray-800">{calculo.nombre}</td>
                                <td className="py-3 px-4 text-gray-800">{calculo.promedio.toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} className="py-3 px-4 text-gray-500 text-center">No hay cálculos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Calculos;
