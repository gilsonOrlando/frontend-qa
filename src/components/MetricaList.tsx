import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

interface ListaVerificacion {
    _id: string;
    nombre: string;
}

interface Metrica {
    _id: string;
    nombre: string;
    listaVerificacion: ListaVerificacion; // Incluye el nombre de la lista de verificación
}

const MetricaList: React.FC = () => {
    const [metricas, setMetricas] = useState<Metrica[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchMetricas = async () => {
            try {
                const response = await api.get('/metricas');
                const metricasData: Metrica[] = response.data;

                // Obtén los IDs de las listas de verificación
                const listaVerificacionIds = metricasData.map(metrica => metrica.listaVerificacion._id);

                // Obtén las listas de verificación
                const listasResponse = await api.post('/listasVerificacion/batch', { ids: listaVerificacionIds });
                const listasDeVerificacion = listasResponse.data;

                // Mapear las listas de verificación a un diccionario para referencia rápida
                const listasMap = listasDeVerificacion.reduce((acc: { [key: string]: ListaVerificacion }, lista: ListaVerificacion) => {
                    acc[lista._id] = lista;
                    return acc;
                }, {});

                // Asocia los nombres de las listas de verificación a las métricas
                const metricasConNombres = metricasData.map(metrica => ({
                    ...metrica,
                    listaVerificacion: listasMap[metrica.listaVerificacion._id] // Incluye el nombre de la lista de verificación
                }));

                setMetricas(metricasConNombres);
            } catch (error) {
                console.error('Error al obtener métricas o listas de verificación:', error);
            }
        };

        fetchMetricas();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/metricas/${id}`);
            setMetricas(metricas.filter(metrica => metrica._id !== id));
        } catch (error) {
            console.error('Error al eliminar métrica:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = metricas.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-4xl bg-white p-6 shadow-md rounded-lg mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-950">Métricas</h2>
                    <Link to="/crear_metrica" className="px-4 py-2 bg-blue-950 text-white rounded">Crear Métrica</Link>
                </div>
                <ul>
                    {currentItems.map((metrica) => (
                        <li key={metrica._id} className="mb-4">
                            <h3 className="text-xl font-semibold text-black">{metrica.nombre}</h3>
                            <p className='text-black'>{`Lista de Verificación: ${metrica.listaVerificacion.nombre}`}</p>
                            <div className="flex space-x-4 mt-2">
                                <Link to={`/editar_metrica/${metrica._id}`} className="px-4 py-2 bg-yellow-500 text-white rounded">Editar</Link>
                                <button onClick={() => handleDelete(metrica._id)} className="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-center mt-6">
                    {Array(Math.ceil(metricas.length / itemsPerPage)).fill(null).map((_, index) => (
                        <button key={index} onClick={() => paginate(index + 1)} className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-950 text-white' : 'bg-gray-300 text-black'}`}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MetricaList;
