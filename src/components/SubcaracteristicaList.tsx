import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

interface Metrica {
    _id: string;
    nombre: string;
}

interface Subcaracteristica {
    _id: string;
    nombre: string;
    metricas: Metrica[];
}

const SubcaracteristicaList: React.FC = () => {
    const [subcaracteristicas, setSubcaracteristicas] = useState<Subcaracteristica[]>([]);

    useEffect(() => {
        const fetchSubcaracteristicas = async () => {
            try {
                const response = await api.get('/subcaracteristicas');
                setSubcaracteristicas(response.data);
            } catch (error) {
                console.error('Error al obtener subcaracterísticas:', error);
            }
        };

        fetchSubcaracteristicas();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/subcaracteristicas/${id}`);
            setSubcaracteristicas(subcaracteristicas.filter(sc => sc._id !== id));
        } catch (error) {
            console.error('Error al eliminar subcaracterística:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-4xl bg-white p-6 shadow-md rounded-lg mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-950">Subcaracterísticas</h2>
                    <Link to="/crear_subcaracteristica" className="px-4 py-2 bg-blue-950 text-white rounded">Crear Subcaracterística</Link>
                </div>
                <ul>
                    {subcaracteristicas.map((subcaracteristica) => (
                        <li key={subcaracteristica._id} className="mb-4">
                            <h3 className="text-xl font-semibold text-black">{subcaracteristica.nombre}</h3>
                            <p className='text-black'>Métricas: {subcaracteristica.metricas.map(p => p.nombre).join(', ')}</p>
                            <div className="flex space-x-4 mt-2">
                                <Link to={`/editar_subcaracteristica/${subcaracteristica._id}`} className="px-4 py-2 bg-yellow-500 text-white rounded">Editar</Link>
                                <button onClick={() => handleDelete(subcaracteristica._id)} className="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SubcaracteristicaList;
